import React, { useEffect, useState } from 'react';

const WorkoutStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutStats = async () => {
      const userId = localStorage.getItem('userId'); 
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`http://localhost:5000/api/workouts/stats/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workout stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch workout stats');
      }
    };

    fetchWorkoutStats();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!stats) {
    return <p>Loading workout stats...</p>;
  }

  return (
    <div>
      <h1>Workout Stats</h1>
      <div>
        <p><strong>Total Workouts:</strong> {stats.totalWorkouts}</p>
        <p><strong>Total Sets:</strong> {stats.totalSets}</p>
        <p><strong>Total Reps:</strong> {stats.totalReps}</p>
        <p><strong>Total Weight Lifted:</strong> {stats.totalWeight} kg</p>
        <p><strong>Most Performed Exercise:</strong> {stats.mostPerformedExercise}</p>
      </div>
    </div>
  );
};

console.log('Exporting WorkoutStats Component');
export default WorkoutStats;
