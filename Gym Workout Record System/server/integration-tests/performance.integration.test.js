const request = require("supertest");
const bcrypt = require("bcrypt");
const { app, startServer, stopServer } = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");

jest.setTimeout(30000);

let serverInstance;

beforeAll(async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.TEST_MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }
  serverInstance = await startServer();
});

afterAll(async () => {
  await mongoose.connection.close();
  await stopServer();
});

describe("Performance/Load Tests - Integration Tests", () => {
  it("should handle multiple concurrent user registrations", async () => {
    const userPromises = [];
    for (let i = 0; i < 10; i++) {
      userPromises.push(
        request(app)
          .post("/api/users/register")
          .send({
            username: `user${i}`,
            email: `user${i}@test.com`,
            password: "password123",
          })
      );
    }

    const responses = await Promise.all(userPromises);

    responses.forEach((response) => {
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User registered successfully!");
    });
  });

  it("should handle multiple concurrent logins", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await User.create({
      username: "concurrentUser",
      email: "concurrent@test.com",
      passwordHash,
    });

    const loginPromises = [];
    for (let i = 0; i < 10; i++) {
      loginPromises.push(
        request(app)
          .post("/api/users/login")
          .send({
            email: "concurrent@test.com",
            password: "password123",
          })
      );
    }

    const responses = await Promise.all(loginPromises);

    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });
});
