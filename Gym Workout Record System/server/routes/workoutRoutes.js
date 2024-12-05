const express = require('express');
const Workout = require('../models/Workout');
const router = express.Router();

// Get all workouts for a user
router.get('/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new workout
router.post('/', async (req, res) => {
  const { userId, exercises } = req.body;
  try {
    const newWorkout = new Workout({ userId, exercises });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
