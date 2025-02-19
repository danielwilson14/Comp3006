const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

jest.setTimeout(30000);

let serverInstance;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  serverInstance = await startServer();
});

afterAll(async () => {
  await mongoose.connection.close();
  await stopServer();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe("User Routes - Integration Tests", () => {
  it("should register a new user and return a success message", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "integrationTestUser",
        email: "integration@test.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully!");

    const user = await User.findOne({ email: "integration@test.com" });
    expect(user).not.toBeNull();
    expect(user.username).toBe("integrationTestUser");
  });

  it("should return a token for valid login", async () => {
    await User.create({
      username: "testuser",
      email: "login@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
    });

    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "login@test.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 for invalid login", async () => {
    await User.create({
      username: "testuser",
      email: "login@test.com",
      passwordHash: await bcrypt.hash("password123", 10),
    });

    const response = await request(app)
      .post("/api/users/login")
      .send({
        email: "login@test.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
