const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app, startServer, stopServer } = require("../index"); // Import app and helpers

let serverInstance;
const validToken = jwt.sign({ id: "testUserId" }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});

beforeAll(async () => {
  serverInstance = await startServer(); // Start server before tests
});

afterAll(async () => {
  await stopServer(); // Stop server after tests
});

describe("Auth Middleware - Integration Tests", () => {
  it("should return 401 for accessing a protected route without a token", async () => {
    const response = await request(app).get("/api/workouts");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Authorization token required");
  });

  it("should return 403 for accessing a protected route with an invalid token", async () => {
    const response = await request(app)
      .get("/api/workouts")
      .set("Authorization", "Bearer invalidToken");
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "Invalid or expired token");
  });

  it("should allow access to a protected route with a valid token", async () => {
    const response = await request(app)
      .get("/api/workouts/testUserId")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
