const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket support

const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

// WebSocket logic
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

app.set("wss", wss);
app.set("broadcast", broadcast);

wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      const mongoURI = process.env.MONGO_URI;  // Use MONGO_URI from .env for production/development
      await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("MongoDB connected successfully!");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if the DB connection fails
  }
};

// Helper functions for testing
let serverInstance;

// Start the server
function startServer(port = 5001) {
  return new Promise(async (resolve) => {
    if (!serverInstance) {
      await connectMongoDB(); // Connect to MongoDB first
      serverInstance = server.listen(port, () => {
        const assignedPort = serverInstance.address()?.port; // Get the assigned port
        console.log(`Server is running on http://localhost:${assignedPort}`);
        resolve(serverInstance); // Resolve the server instance
      });
    } else {
      console.log("Server is already running.");
      resolve(serverInstance);
    }
  });
}

// Stop the server
function stopServer() {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => {
        console.log("Server stopped");
        serverInstance = null; // Clear the instance
        resolve();
      });
    } else {
      resolve(); // Resolve immediately if the server is not running
    }
  });
}

// Export for testing
module.exports = { app, startServer, stopServer };

// 404 Error Handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// General Error Handler
app.use((err, _req, res) => {
  console.error(err.stack);

  if (err.name === "MongoNetworkError") {
    return res.status(500).json({ error: "Database connection error" });
  }

  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  startServer(PORT);
}
