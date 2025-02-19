const request = require("supertest");
const { baseUrl } = require("./setup");
const User = require("../models/User");

describe("User Routes", () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clean up the User collection before each test
    const userCount = await User.countDocuments();
    console.log(`User count after deleteMany: ${userCount}`); // Debug to verify cleanup
  });
  

  it("should register a new user", async () => {
    const response = await request(baseUrl)
      .post("/api/users/register")
      .send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User registered successfully!");
  });

  it("should not register a user with duplicate email", async () => {
    // Create a user
    await User.create({
      username: "existinguser",
      email: "duplicate@example.com",
      passwordHash: "hashedPassword123",
    });

    const response = await request(baseUrl)
      .post("/api/users/register")
      .send({
        username: "newuser",
        email: "duplicate@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
