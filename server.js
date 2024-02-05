// Importing required modules
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser'); // Import body-parser module
const convert = require('./convert');

// Creating an express application
const app = express();

// Defining the port on which the server will run
const port = process.env.PORT || 3000;

// Defining the output directory for the files
const OUTPUT_DIRECTORY = path.join(__dirname, 'data', 'rig');

/**
 * Function to send JSON response
 * @param {Object} res - Express response object
 * @param {Object} data - Data to be sent in the response
 * @param {number} [status=200] - HTTP status code
 * @param {string} [message='Request successful'] - Message to be sent in the response
 */
function sendJsonResponse(res, data, status = 200, message = 'Request successful') {
    const response = {
        status: 'success',
        code: status,
        message: message,
        data: data
    };
    res.json(response);
}

// Implement body-parser middleware to parse JSON data in the request body
app.use(bodyParser.json());

// POST endpoint to receive data
app.post('/api', async (req, res) => {
    const data = req.body; // Get JSON data from the request body

    try {
        // Validate the required fields in the received data (add your validation logic here)
        if (!data.Type || !data.PartNumber || !data.Brand || !data.Model || !data.Rank || !data.Benchmark || !data.Samples || !data.URL) {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Bad Request',
                error: 'Missing required fields in the request body.'
            });
            return;
        }

        // Generate a unique filename or use some identifier from the data
        const fileName = `${data.Type}_${data.PartNumber}.json`;

        // Save the data to a file in the output directory
        const filePath = path.join(OUTPUT_DIRECTORY, fileName);
        await fs.writeFile(filePath, JSON.stringify(data));

        // Send a JSON response indicating success
        sendJsonResponse(res, { fileName }, 201, 'Data successfully saved.');
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({
            status: 'error',
            code: 500,
            message: `Internal Server Error: ${error.message}`,
            error: error.toString()
        });
    }
});

// GET endpoint to fetch a file based on the filename provided in the URL
app.get('/api/:fileName', async (req, res) => {
    const {fileName} = req.params;
    const normalizedFileName = fileName.toLowerCase(); // Normalize to lowercase
    const filePath = path.join(OUTPUT_DIRECTORY, normalizedFileName);

    try {
        // Check if the normalized file exists before attempting to read and parse it
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        if (!fileExists) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'File Not Found',
                error: `The file ${fileName} does not exist.`
            });
            return;
        }

        // Continue with reading and parsing the file
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        sendJsonResponse(res, jsonData);
    } catch (error) {
        console.error(`Error reading/parsing JSON file ${filePath}:`, error);
        res.status(500).json({
            status: 'error',
            code: 500,
            message: `Internal Server Error: ${error.message}`,
            error: error.toString()
        });
    }
});

// Implement CORS handling for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

// Implement logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Starting the server
app.listen(port, () => {
    console.log(`Mock API server is running at http://localhost:${port}`);
});

// Array of CSV URLs to be processed on script execution
const csvUrls = [
    'https://www.userbenchmark.com/resources/download/csv/CPU_UserBenchmarks.csv',
    'https://www.userbenchmark.com/resources/download/csv/GPU_UserBenchmarks.csv',
    'https://www.userbenchmark.com/resources/download/csv/SSD_UserBenchmarks.csv',
    'https://www.userbenchmark.com/resources/download/csv/HDD_UserBenchmarks.csv',
    'https://www.userbenchmark.com/resources/download/csv/RAM_UserBenchmarks.csv',
    'https://www.userbenchmark.com/resources/download/csv/USB_UserBenchmarks.csv'
];

// Processing the CSV URLs
convert.processCsvUrls(csvUrls);
