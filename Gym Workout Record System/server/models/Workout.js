const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
    },
  ],
  date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Workout', workoutSchema);
