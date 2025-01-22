import React from 'react';
import { useState } from 'react';
import Workout from './Workout';
import WorkoutList from './WorkoutList';

const LogBook = () => {
  const [workouts, setWorkouts] = useState([]);

  const handleAddWorkout = ({ date, exercise }) => {
    const existingDay = workouts.find((day) => day.date === date);

    if (existingDay) {
      const updatedWorkouts = workouts.map((day) =>
        day.date === date
          ? {
              ...day,
              exercises: [...day.exercises, exercise],
            }
          : day
      );
      setWorkouts(updatedWorkouts);
    } else {
      setWorkouts([...workouts, { date, exercises: [exercise] }]);
    }
  };
  return (
    <div className="flex flex-col gap-4 items-start h-screen">
      <div className="m-10">
        <h1 className="text-5xl font-bold">Your Training Logbook!</h1>
        <p className="text-3xl">Track your workouts here.</p>
        <Workout onAddWorkout={handleAddWorkout} />
        <WorkoutList workouts={workouts} />
      </div>
    </div>
  )
}

export default LogBook;