import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>You are now logged in!</p>
      <div>
        <Link to="/add-workout">
          <button>Add Workout</button>
        </Link>
        <Link to="/view-workouts">
          <button>View Workouts</button>
        </Link>
        <Link to="/workout-stats">
          <button>View Workout Stats</button>
        </Link>
        <Link to="/update-profile">
          <button>Update Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
