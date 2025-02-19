const request = require("supertest");
const { baseUrl } = require("./setup");
const User = require("../models/User");
const Workout = require("../models/Workout");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); 

let testToken;

describe("Workout Routes", () => {
  beforeAll(async () => {
    const uniqueUsername = `testuser_${Date.now()}`; // Ensure a unique username
    const testUser = await User.create({
      username: uniqueUsername,
      email: `${uniqueUsername}@example.com`,
      passwordHash: "hashedpassword123",
    });
  
    testToken =
      "Bearer " +
      jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  });
  

  beforeEach(async () => {
    await Workout.deleteMany(); // Clean up the workouts collection
  });

  it("should create a new workout", async () => {
    const response = await request(baseUrl)
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

  it("should return all workouts for the user", async () => {
    const testUserId = new mongoose.Types.ObjectId();

    await Workout.create({
      userId: testUserId,
      exercises: [{ name: "Squat", sets: 3, reps: 8, weight: 100 }],
    });

    const response = await request(baseUrl)
      .get(`/api/workouts/${testUserId}`)
      .set("Authorization", testToken);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
