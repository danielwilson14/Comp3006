const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });
const mongoose = require("mongoose");
const { app, startServer, stopServer } = require("../index");

jest.setTimeout(30000); // 30 seconds timeout

let server;
const baseUrl = `http://localhost:5001`; // Hardcoded port for tests

console.log("TEST_MONGO_URI:", process.env.TEST_MONGO_URI);

beforeAll(async () => {
  console.log("Connecting to:", process.env.TEST_MONGO_URI);

  // Start the server on the fixed port
  if (!server) {
    server = await startServer(5001); // Start only if not already running
    console.log(`Base URL for tests: ${baseUrl}`);
  }

  // Connect to the test database
  if (!mongoose.connection.readyState) {
    try {
      await mongoose.connect(process.env.TEST_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to test database");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  }
});

afterAll(async () => {
  console.log("Closing database connection...");
  await mongoose.connection.close(); // Properly close the database connection
  await stopServer(); // Use stopServer from index.js to close the server
  console.log("Test server stopped");
});


beforeEach(async () => {
  console.log("Cleaning up database...");
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany(); // Clean all collections
  }
});


afterEach(async () => {
    console.log("Ensuring database is clean after test...");
});

module.exports = { baseUrl }; // Export baseUrl for use in test files
