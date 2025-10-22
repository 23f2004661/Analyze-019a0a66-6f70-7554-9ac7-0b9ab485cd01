// Mock implementation of Pandas.js for demonstration purposes
// In a real-world scenario, you would use a library like PapaParse for CSV and potentially a WebAssembly-based Pandas port.
const Pandas = {
    read_csv: async function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const csvContent = event.target.result;
                    const lines = csvContent.split('\n');
                    const headers = lines[0].split(',');
                    const data = [];

                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim() === '') continue;
                        const values = lines[i].split(',');
                        const row = {};
                        for (let j = 0; j < headers.length; j++) {
                            // Attempt to convert to number if possible, otherwise keep as string
                            const numValue = parseFloat(values[j]);
                            row[headers[j].trim()] = isNaN(numValue) ? values[j].trim() : numValue;
                        }
                        data.push(row);
                    }
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = (event) => {
                reject(new Error("File reading error: " + event.target.error));
            };
            reader.readAsText(file);
        });
    }
};

// Global variable to store the loaded data
let dataframe = null;

document.getElementById('loadDataBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsDiv = document.getElementById('results');
    const loadingMessage = document.getElementById('loadingMessage');

    if (!file) {
        alert("Please select a CSV file first.");
        return;
    }

    loadingMessage.style.display = 'block';
    resultsDiv.innerHTML = '<p>Loading data...</p>';
    analyzeBtn.disabled = true;

    try {
        dataframe = await Pandas.read_csv(file);
        loadingMessage.style.display = 'none';
        resultsDiv.innerHTML = '<p>Data loaded successfully. Click "Analyze Data" to see results.</p>';
        analyzeBtn.disabled = false;
    } catch (error) {
        loadingMessage.style.display = 'none';
        resultsDiv.innerHTML = `<p style="color: red;">Error loading data: ${error.message}</p>`;
        console.error("Error loading data:", error);
    }
});

document.getElementById('analyzeBtn').addEventListener('click', () => {
    if (!dataframe) {
        alert("Please load data first.");
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Analyzing data...</p>';

    // Simulate the logic from execute.py
    // This is a client-side JavaScript emulation.
    try {
        // --- Row Count ---
        const row_count = dataframe.length;

        // --- Regions Count ---
        const regions = new Set(dataframe.map(row => row.region));
        const regions_count = regions.size;

        // --- Top N Products by Revenue (N=3) ---
        const n = 3;
        const productsRevenue = {};
        dataframe.forEach(row => {
            const product = row.product;
            const revenue = (row.units || 0) * (row.price || 0);
            if (productsRevenue[product]) {
                productsRevenue[product] += revenue;
            } else {
                productsRevenue[product] = revenue;
            }
        });

        const sortedProducts = Object.entries(productsRevenue)
            .sort(([, a], [, b]) => b - a)
            .slice(0, n)
            .map(([product, revenue]) => ({ product: product, revenue: revenue }));

        // --- Rolling 7-Day Revenue by Region ---
        // This part is more complex to simulate accurately with pure JS without date manipulation libraries.
        // For demonstration, we'll create a simplified structure.
        // In a real implementation, you'd need to parse dates and perform calculations.

        // Group data by region and date
        const dailyRevenueByRegion = {};
        dataframe.forEach(row => {
            const date = row.date; // Assuming 'date' column exists and is parseable
            const region = row.region;
            const revenue = (row.units || 0) * (row.price || 0);

            if (!dailyRevenueByRegion[region]) {
                dailyRevenueByRegion[region] = {};
            }
            if (!dailyRevenueByRegion[region][date]) {
                dailyRevenueByRegion[region][date] = 0;
            }
            dailyRevenueByRegion[region][date] += revenue;
        });

        const rollingData = {};
        for (const region in dailyRevenueByRegion) {
            const dates = Object.keys(dailyRevenueByRegion[region]).sort(); // Sort dates
            for (let i = 0; i < dates.length; i++) {
                const currentDate = dates[i];
                let sum = 0;
                let count = 0;
                for (let j = Math.max(0, i - 6); j <= i; j++) {
                    sum += dailyRevenueByRegion[region][dates[j]] || 0;
                    count++;
                }
                const rolling_7d_avg = count > 0 ? sum / count : 0;

                if (!rollingData[region]) {
                    rollingData[region] = [];
                }
                rollingData[region].push({ date: currentDate, rolling_7d_revenue: rolling_7d_avg });
            }
        }

        // Format rolling data similarly to Python output for display
        const rolling_7d_revenue_by_region_formatted = {};
        for (const region in rollingData) {
            rollingData[region].forEach(item => {
                rolling_7d_revenue_by_region_formatted[`${item.date}`] = item.rolling_7d_revenue;
            });
        }
        
        // Get the last rolling value for each region (similar to .tail(1) in Python)
        const lastRollingValues = {};
        for(const region in rollingData) {
            if(rollingData[region].length > 0) {
                const lastEntry = rollingData[region][rollingData[region].length - 1];
                lastRollingValues[region] = {
                    date: lastEntry.date,
                    rolling_7d_revenue: lastEntry.rolling_7d_revenue
                };
            }
        }


        const result = {
            "row_count": row_count,
            "regions": regions_count,
            "top_n_products_by_revenue": sortedProducts,
            "rolling_7d_revenue_by_region": lastRollingValues // Simplified display
        };

        resultsDiv.innerHTML = ''; // Clear previous message
        for (const key in result) {
            const value = result[key];
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            const keySpan = document.createElement('span');
            keySpan.className = 'result-key';
            keySpan.textContent = `${key}: `;
            resultItem.appendChild(keySpan);

            if (typeof value === 'object' && value !== null) {
                const nestedList = document.createElement('ul');
                nestedList.style.paddingLeft = '20px';
                nestedList.style.marginTop = '5px';
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = JSON.stringify(item);
                        nestedList.appendChild(listItem);
                    });
                } else { // Object
                     for (const subKey in value) {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<span class="result-key">${subKey}:</span> ${JSON.stringify(value[subKey])}`;
                        nestedList.appendChild(listItem);
                    }
                }
                resultItem.appendChild(nestedList);
            } else {
                resultItem.textContent += value;
            }
            resultsDiv.appendChild(resultItem);
        }

    } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Error analyzing data: ${error.message}</p>`;
        console.error("Error analyzing data:", error);
    }
});