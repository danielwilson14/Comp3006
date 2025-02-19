require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.test") });
const mongoose = require("mongoose");
const { startServer, stopServer } = require("../index");

let appInstance;

beforeAll(async () => {
  console.log("TEST_MONGO_URI in setup.js:", process.env.TEST_MONGO_URI);
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.TEST_MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Keep connection timeout short for tests
    });
    console.log("Successfully connected to MongoDB.");

    // Start the test server (start only once)
    console.log("Starting the test server...");
    appInstance = await startServer();
    console.log("Test server started.");
  } catch (error) {
    console.error("Error during setup:", error.message);
    console.error(error.stack);
    process.exit(1); // Exit if setup fails
  }
});

afterAll(async () => {
  try {
    console.log("Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");

    console.log("Stopping the test server...");
    await stopServer(); // Stop the server only once
    console.log("Test server stopped.");
  } catch (error) {
    console.error("Error during cleanup:", error.message);
  }
});
