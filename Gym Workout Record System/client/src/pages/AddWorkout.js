import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketContext } from "../WebSocketProvider.js";

const AddWorkout = () => {
  const { sendMessage } = useContext(WebSocketContext);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to log in to add a workout.");
      return;
    }

    const workoutData = {
      exercises: [
        {
          name: exerciseName,
          sets: parseInt(sets, 10),
          reps: parseInt(reps, 10),
          weight: parseFloat(weight),
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        const addedWorkout = await response.json();
        console.log("sendMessage called with:", addedWorkout);
        sendMessage({ type: "NEW_WORKOUT", data: addedWorkout });
        navigate("/view-workouts"); 
      } else {
        const result = await response.json();
        setError(result.error || "Failed to add workout.");
      }
    } catch (err) {
      console.error("Error adding workout:", err);
      setError("An error occurred while adding the workout.");
    }
  };
  return (
    <div>
      <h2>Add Workout</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exerciseName">Exercise Name:</label>
          <input
            id="exerciseName"
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="sets">Sets:</label>
          <input
            id="sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="reps">Reps:</label>
          <input
            id="reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="weight">Weight:</label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Workout</button>
      </form>
    </div>
  );
};

export default AddWorkout;
