// Importing required modules
const csvtojson = require('csvtojson');
const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

// Output directory for JSON files (relative to the project)
const OUTPUT_DIRECTORY = path.join(__dirname, 'data', 'rig');

/**
 * Converts CSV data to JSON and writes it to a file.
 * @param {string} csvData - The CSV data to convert.
 * @param {string} jsonFilePath - The path to the JSON file to write to.
 */
async function convertCsvToJson(csvData, jsonFilePath) {
    try {
        // Convert CSV data to JSON
        const jsonArray = await csvtojson().fromString(csvData);
        const jsonString = JSON.stringify(jsonArray, null, 2);

        // Write JSON data to file
        await fs.writeFile(jsonFilePath, jsonString);
        console.log(`Conversion successful. JSON data written to ${jsonFilePath}`);
    } catch (err) {
        console.error(`Error converting CSV to JSON for file ${jsonFilePath}:`, err.message);
    }
}

/**
 * Fetches CSV data from a URL, converts it to JSON, and writes it to a file.
 * @param {string} csvUrl - The URL of the CSV data to process.
 */
async function processData(csvUrl) {
    try {
        console.log(`🔄 Processing CSV data from ${csvUrl}`);

        // Ensure the 'data/rig' directory exists
        await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });

        // Get file names
        const csvFileName = path.basename(csvUrl);
        const jsonFileName = path.basename(csvFileName, '.csv') + '.json';
        const jsonFilePath = path.join(OUTPUT_DIRECTORY, jsonFileName);

        // Fetch CSV data
        const response = await axios.get(csvUrl);

        // Convert CSV data to JSON and write to file
        await convertCsvToJson(response.data, jsonFilePath);

        console.log(`Processing complete for ${csvUrl} ✔️`);
    } catch (error) {
        if (error.response) {
            console.error(`HTTP error ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
            console.error('No response received. Check your network connection.');
        } else {
            console.error(`Error in request: ${error.message}`);
        }
    }
}

/**
 * Processes multiple CSV URLs.
 * @param {Array<string>} csvUrls - The CSV URLs to process.
 */
async function processCsvUrls(csvUrls) {
    for (const csvUrl of csvUrls) {
        await processData(csvUrl);
    }
}

// Export the processCsvUrls function
module.exports = {
    processCsvUrls,
};
