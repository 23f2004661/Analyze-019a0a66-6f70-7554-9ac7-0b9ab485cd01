# Data Analysis Application

This is a simple, client-side web application that allows users to upload a CSV file containing sales data and perform basic analysis. The application processes the data directly in the browser using JavaScript, calculating metrics such as row count, number of unique regions, top products by revenue, and rolling average revenue.

This project is designed to be deployed on GitHub Pages, with the analysis logic running entirely in the frontend.

## Features

*   **CSV Upload**: Upload your sales data from a CSV file.
*   **Data Analysis**:
    *   Calculate the total number of records.
    *   Count the number of distinct regions.
    *   Identify the top 3 products based on total revenue.
    *   Display a simplified rolling 7-day average revenue per region (based on the latest available data).
*   **Client-Side Execution**: All data processing happens in your browser.

## Setup Instructions

Since this is a frontend-only application designed for GitHub Pages, there are no complex setup instructions.

1.  **Obtain Data**: Ensure you have your data in a CSV format. If you have an Excel file (`.xlsx`), you will need to convert it to CSV first. You can use online converters like [ConvertCSV](https://www.convertcsv.com/excel-to-csv.htm) or spreadsheet software.
2.  **Clone or Download Repository**: Get the project files.
3.  **Deploy to GitHub Pages**:
    *   Create a new GitHub repository or use an existing one.
    *   Upload the `index.html`, `script.js`, `README.md`, and `LICENSE` files to the repository.
    *   Configure your GitHub repository to deploy from the `main` or `gh-pages` branch to GitHub Pages. The provided `.github/workflows/ci.yml` (though not directly generated here as it's a CI file) is intended to automate the build and deployment process.

## Usage Guide

1.  **Open the Application**: Navigate to the deployed URL on GitHub Pages.
2.  **Upload Data**:
    *   Click the "Select CSV file" button and choose your `data.csv` file.
    *   Click the "Load Data" button. You should see a success message once the data is loaded.
3.  **Analyze Data**:
    *   Once the data is loaded, the "Analyze Data" button will become active.
    *   Click "Analyze Data" to perform the calculations.
4.  **View Results**: The analysis results will be displayed below the "Analyze Data" button.

## Code Explanation

### `index.html`

*   **Structure**: Provides the basic HTML structure for the application, including a title, basic styling, and sections for data upload and displaying results.
*   **File Input**: An `<input type="file" id="fileInput" accept=".csv">` allows users to select a CSV file.
*   **Buttons**:
    *   `Load Data`: Triggers the CSV parsing and data loading logic.
    *   `Analyze Data`: Initiates the data processing and calculation phase.
*   **Display Areas**:
    *   `#loadingMessage`: Shows progress during data loading.
    *   `#results`: An area to display the output of the data analysis.
*   **JavaScript Link**: Includes the `script.js` file, which contains all the application logic.

### `script.js`

*   **`Pandas` Object (Mock)**:
    *   This is a *mock* implementation of a `read_csv` function. In a real browser environment without Node.js or Python, you would typically use a library like `PapaParse` to handle CSV parsing.
    *   The `read_csv` function reads the selected file, splits it into lines, then into comma-separated values, and attempts to parse numbers where possible. It returns a Promise that resolves with an array of JavaScript objects, simulating a DataFrame structure.
*   **`dataframe` Variable**: A global variable that stores the parsed data from the CSV file.
*   **Event Listeners**:
    *   **`loadDataBtn` Click**:
        *   Retrieves the selected file from the input.
        *   Calls the `Pandas.read_csv` function to parse the file.
        *   Updates the UI to show loading messages.
        *   Stores the parsed data in the `dataframe` variable.
        *   Enables the "Analyze Data" button upon successful loading.
    *   **`analyzeBtn` Click**:
        *   Checks if data has been loaded.
        *   Emulates the calculations performed by the original `execute.py` script using JavaScript.
            *   **Row Count**: `dataframe.length`
            *   **Regions Count**: Uses a `Set` to find unique regions.
            *   **Top N Products**: Iterates through the data, calculates revenue per product, sorts them, and takes the top N.
            *   **Rolling 7-Day Revenue**: This is a simplified client-side implementation that groups by region and date, then calculates a rolling average for the last available 7 days. Note that accurate date sorting and handling might require a dedicated date library in a more robust application.
        *   Formats the results into a readable JSON-like structure.
        *   Displays the formatted results in the `#results` div.
*   **Error Handling**: Includes `try...catch` blocks to gracefully handle potential errors during file loading and data analysis.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.