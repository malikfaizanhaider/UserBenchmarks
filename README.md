# User Benchmarks

The `UserBenchmarks` API is a mock server implemented in Node.js using the Express framework. This API serves as a simulated backend for fetching and processing benchmark data related to various computer components. The primary purpose of this API is to handle requests for specific benchmark files, read the corresponding JSON data from the server's local storage, and respond with the parsed JSON content.

### Key Features:

1. **Endpoint for Fetching Benchmark Data:**
    - The API exposes a GET endpoint at `/api/:fileName`, where `:fileName` represents the name of the benchmark file to be fetched.
    - The endpoint normalizes the file name to lowercase and retrieves the corresponding JSON data from the local storage.
    - If the file does not exist, it returns a 404 Not Found response with an appropriate error message.
2. **JSON Response Handling:**
    - The API provides a utility function `sendJsonResponse` to send consistent JSON responses with status, code, message, and data fields.
    - Successful responses include a 'success' status, a customizable HTTP status code, a success message, and the requested data in JSON format.
3. **CORS (Cross-Origin Resource Sharing) Support:**
    - The API implements CORS handling to allow cross-origin requests by including relevant headers in the response.
    - This ensures that the API can be accessed from different origins, making it versatile for client-side applications.
4. **Logging Middleware:**
    - Middleware is implemented to log each incoming request, including the method and URL, with a timestamp.
    - This helps in monitoring and debugging by providing a detailed log of API interactions.
5. **Script for Processing CSV URLs:**
    - The API includes an array of CSV URLs related to user benchmarks for CPUs, GPUs, SSDs, HDDs, RAM, and USBs.
    - The CSV URLs are processed using an external module (`convert.js`), which presumably converts and stores the data in JSON format in the specified output directory.

### Usage:

1. Start the server by running the `server.js` script.
2. Access benchmark data by making GET requests to the `/api/:fileName` endpoint with the desired file name.
    

### Example:

- To fetch CPU benchmark data: `GET http://localhost:3000/api/cpu_userbenchmarks.json`
    

### Notes:

- The server runs on the specified port (default: 3000) and logs requests for monitoring and debugging purposes.
- The script processes CSV URLs related to user benchmarks during server startup.
    

This `UserBenchmarks` API is a useful tool for testing and development environments where access to a real UserBenchmark API may not be available or desirable.

EndFragment
