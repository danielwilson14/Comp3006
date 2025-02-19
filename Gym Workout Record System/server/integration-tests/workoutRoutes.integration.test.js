const request = require("supertest");
const mongoose = require("mongoose");
const { app, startServer, stopServer } = require("../index");
const Workout = require("../models/Workout");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

jest.setTimeout(30000);

let serverInstance;
let testToken;
let testUserId;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  const testUser = await User.create({
    username: "testuser_workout",
    email: "testuser_workout@test.com",
    passwordHash: "hashedpassword123",
  });

  testUserId = testUser._id;

  testToken = `Bearer ${jwt.sign({ id: testUserId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })}`;

  serverInstance = await startServer();
});

afterAll(async () => {
  await mongoose.connection.close();
  await stopServer();
});

beforeEach(async () => {
  await Workout.deleteMany();
});

describe("Workout Routes - Integration Tests", () => {
  it("should create a new workout", async () => {
    const response = await request(app)
      .post("/api/workouts")
      .set("Authorization", testToken)
      .send({
        exercises: [
          { name: "Deadlift", sets: 3, reps: 5, weight: 150 },
          { name: "Pull-Ups", sets: 3, reps: 10, weight: 0 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  it("should fetch all workouts for the authenticated user", async () => {
    await Workout.create({
      userId: testUserId,
      exercises: [{ name: "Bench Press", sets: 3, reps: 8, weight: 100 }],
    });

    const response = await request(app)
      .get(`/api/workouts/${testUserId}`)
      .set("Authorization", testToken);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should return 400 for creating a workout with missing fields", async () => {
    const response = await request(app)
      .post("/api/workouts")
      .set("Authorization", testToken)
      .send({
        exercises: [],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 404 for deleting a non-existent workout", async () => {
    const response = await request(app)
      .delete(`/api/workouts/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", testToken);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
