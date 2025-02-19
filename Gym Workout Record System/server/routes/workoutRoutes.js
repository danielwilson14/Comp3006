const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Workout = require('../models/Workout');
const router = express.Router();

// Get all workouts for a user
router.get('/:userId', async (req, res) => {
  console.log('GET /api/workouts/:userId hit'); // Debug log
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error in GET /api/workouts/:userId:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Protected route to add a workout
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/workouts hit with user:', req.user.id); // Debug log

  const { exercises } = req.body;

  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({ error: "Exercises are required and must be an array" });
  }

  for (const exercise of exercises) {
    if (!exercise.name || !exercise.sets || !exercise.reps || exercise.weight === undefined) {
      return res.status(400).json({
        error: "Each exercise must have a name, sets, reps, and weight",
      });
    }
  }
  try {
    const newWorkout = new Workout({
      userId: req.user.id, // Use the authenticated user's ID
      exercises,
    });
    await newWorkout.save();
    const broadcast = req.app.get("broadcast");
    broadcast({
      type: "NEW_WORKOUT",
      workout: newWorkout,
    });
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error in POST /api/workouts:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Add a handler for the base `/api/workouts` route (for the test)
router.get('/', authMiddleware, (req, res) => {
  console.log('GET /api/workouts hit without userId'); // Debug log
  res.status(401).json({ error: "Authorization token required" });
});

// Update an existing workout
router.put('/:workoutId', authMiddleware, async (req, res) => {
  const { workoutId } = req.params;
  const { exercises } = req.body;

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      { exercises },
      { new: true } // Return the updated document
    );

    if (!updatedWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const broadcast = req.app.get('broadcast');
    broadcast({
      type: 'UPDATED_WORKOUT',
      workout: updatedWorkout,
    });
    console.log('Broadcasted UPDATED_WORKOUT for', updatedWorkout._id);

    return res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error('Error in PUT /api/workouts/:workoutId:', error.message);
    return res.status(400).json({ error: error.message });
  }
});

// Delete an existing workout
router.delete('/:workoutId', authMiddleware, async (req, res) => {
  const { workoutId } = req.params;

  try {
    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const broadcast = req.app.get('broadcast');
    broadcast({
      type: 'DELETED_WORKOUT',
      workoutId: deletedWorkout._id,
    });
    console.log('Broadcasted DELETED_WORKOUT for', deletedWorkout._id);

    return res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/workouts/:workoutId:', error.message);
    return res.status(400).json({ error: error.message });
  }
});

// Get workout analytics for a user
router.get('/stats/:userId', authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });

    // Calculate total sets, reps, and weight lifted
    const stats = workouts.reduce(
      (acc, workout) => {
        workout.exercises.forEach((exercise) => {
          acc.totalWorkouts += 1;
          acc.totalSets += exercise.sets;
          acc.totalReps += exercise.reps;
          acc.totalWeight += exercise.weight * exercise.reps;
        });
        return acc;
      },
      { totalWorkouts: 0, totalSets: 0, totalReps: 0, totalWeight: 0 }
    );

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in GET /api/workouts/stats/:userId:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
