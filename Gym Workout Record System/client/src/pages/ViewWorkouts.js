import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketContext } from "../WebSocketProvider.js";

const ViewWorkouts = () => {
  const { websocket } = useContext(WebSocketContext); 
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [editedWorkout, setEditedWorkout] = useState({});
  const navigate = useNavigate();

  const handleAddWorkout = () => {
    navigate("/add-workout");
  };

  const handleEditWorkout = (workout) => {
    setCurrentWorkout(workout);
    setEditedWorkout(workout);
    setShowModal(true);
  };

  const handleSaveWorkout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/workouts/${currentWorkout._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedWorkout),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update workout");
      }

      const updatedWorkout = await response.json();
      setWorkouts((prev) =>
        prev.map((w) => (w._id === updatedWorkout._id ? updatedWorkout : w))
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating workout:", error);
      setError("Failed to update workout");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setCurrentWorkout(null);
  };

  const handleDeleteWorkout = async (workoutId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/workouts/${workoutId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      setWorkouts((prev) => prev.filter((workout) => workout._id !== workoutId));
    } catch (error) {
      console.error("Error deleting workout:", error);
      setError("Failed to delete workout");
    }
  };

  useEffect(() => {
    console.log("ViewWorkouts useEffect running... websocket =", websocket);
    const fetchWorkouts = async () => {
      const userId = localStorage.getItem("userId");
      console.log("Retrieved userId from localStorage:", userId);

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:5000/api/workouts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        console.log("Fetched workouts data from API:", data); 
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to fetch workouts");
      }
    };

    fetchWorkouts();

  if (websocket) {
    console.log("Websocket is truthy, attaching onmessage now...");
    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);
    
        if (message.type === "NEW_WORKOUT") {
          setWorkouts((prev) => [...prev, message.workout]);
        } else if (message.type === "UPDATED_WORKOUT") {
          console.log("Going to update workout in state:", message.workout._id);
          setWorkouts((prev) =>
            prev.map((w) =>
              w._id === message.workout._id ? message.workout : w
            )
          );
        } else if (message.type === "DELETED_WORKOUT") {
          console.log("Going to remove workout:", message.workoutId);
          setWorkouts((prev) =>
            prev.filter((w) => w._id !== message.workoutId)
          );
        }
        
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      console.log("Cleaning up onmessage on unmount");
      websocket.onmessage = null;
    };
  } else {
    console.log("No websocket found (websocket is null/undefined)");
  }
}, [websocket]);

const groupedWorkouts = workouts.reduce((acc, workout) => {
  const date = workout.date
    ? new Date(workout.date).toLocaleDateString()
    : "Unknown Date";
  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(workout);
  return acc;
}, {});
console.log("Grouped workouts by date:", groupedWorkouts); 


  return (
    <div>
      {console.log("Workouts state before rendering:", workouts)}
      <h1>View Workouts</h1>
      <button onClick={handleAddWorkout}>Add Workout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {Object.keys(groupedWorkouts).length > 0 ? (
        Object.entries(groupedWorkouts).map(([date, workoutsOnDate]) => (
          <div key={date}>
            <h2>{date}</h2>
            <ul>
              {workoutsOnDate.map((workout) =>
                workout.exercises.map((exercise) => (
                  <li key={exercise._id}>
                    {exercise.name}: {exercise.sets} sets x {exercise.reps} reps @ {exercise.weight}kg
                    <button onClick={() => handleEditWorkout(workout)}>Edit</button>
                    <button
                      style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                      onClick={() => handleDeleteWorkout(workout._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      ) : (
        <p>No workouts found.</p>
      )}

      {/* Modal for editing workout */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <h2>Edit Workout</h2>
          {editedWorkout.exercises.map((exercise, index) => (
            <div key={exercise._id || index}>
              <h3>Exercise {index + 1}</h3>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) =>
                  setEditedWorkout((prev) => {
                    const newExercises = [...prev.exercises];
                    newExercises[index].name = e.target.value;
                    return { ...prev, exercises: newExercises };
                  })
                }
                placeholder="Exercise name"
              />
              <input
                type="number"
                value={exercise.sets}
                onChange={(e) =>
                  setEditedWorkout((prev) => {
                    const newExercises = [...prev.exercises];
                    newExercises[index].sets = e.target.value;
                    return { ...prev, exercises: newExercises };
                  })
                }
                placeholder="Sets"
              />
              <input
                type="number"
                value={exercise.reps}
                onChange={(e) =>
                  setEditedWorkout((prev) => {
                    const newExercises = [...prev.exercises];
                    newExercises[index].reps = e.target.value;
                    return { ...prev, exercises: newExercises };
                  })
                }
                placeholder="Reps"
              />
              <input
                type="number"
                value={exercise.weight}
                onChange={(e) =>
                  setEditedWorkout((prev) => {
                    const newExercises = [...prev.exercises];
                    newExercises[index].weight = e.target.value;
                    return { ...prev, exercises: newExercises };
                  })
                }
                placeholder="Weight (kg)"
              />
            </div>
          ))}
          <button onClick={handleSaveWorkout}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewWorkouts;
