const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');  // <-- Add this line to import mongoose
const User = require('../models/User');
const Workout = require('../models/Workout');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register route
router.post("/register", async (req, res, next) => {
  console.log("Register endpoint hit");
  const { username, email, password } = req.body;
  try {
    console.log("Registering user:", { username, email });

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already exists!" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash });
    await newUser.save();
    console.log("User saved:", newUser);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    if (error instanceof mongoose.Error) {  // This will work now
      console.error("Database connection error:", error.message);
      return next(new Error("Database connection error")); // Propagate the error
    }
    console.error("Registration error:", error.message);
    next(error); // Propagate unexpected errors
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Logging in user with email:', email); // Debug log

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    // Generate a token and return it
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token); // Debug log

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:userId', authMiddleware, async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.params.userId;

  try {
    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;

    if (password) {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.passwordHash = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Delete user profile
router.delete('/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete associated workouts
    await Workout.deleteMany({ userId });

    res.status(200).json({ message: 'User profile and associated workouts deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/users/:userId:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
