const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
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

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Workout route is working!' });
});


// Protected route to add a workout
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/workouts with auth hit');
  const { exercises } = req.body;

  try {
    const newWorkout = new Workout({ userId: req.user.id, exercises });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error in POST /api/workouts:', error.message);
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
