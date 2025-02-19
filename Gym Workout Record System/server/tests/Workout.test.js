const mongoose = require('mongoose');
const Workout = require('../models/Workout');

describe('Workout Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Workout.deleteMany();
  });

  it('should save a workout with valid data', async () => {
    const workout = new Workout({
      userId: 'user123',
      exercises: [{ name: 'Squat', sets: 3, reps: 10, weight: 100 }],
    });

    const savedWorkout = await workout.save();
    expect(savedWorkout._id).toBeDefined();
    expect(savedWorkout.exercises[0].name).toBe('Squat');
  });

  it('should require userId field', async () => {
    const workout = new Workout({
      exercises: [{ name: 'Squat', sets: 3, reps: 10, weight: 100 }],
    });

    await expect(workout.save()).rejects.toThrow();
  });
});
