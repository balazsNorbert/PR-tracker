import React, { useState } from 'react';
import Workout from './Workout';
import WeeklyView from './WeeklyView';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);

  const addWorkout = (workout) => {
    setWorkouts([...workouts, workout]);
  };

  return (
    <div className="flex flex-col gap-5">
      <Workout onAddWorkout={addWorkout} />
      <h2 className="font-bold text-2xl text-center">This week's workouts</h2>
      <WeeklyView workouts={workouts} />
    </div>
  )
}

export default WorkoutList;