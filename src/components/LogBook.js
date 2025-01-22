import React from 'react';
import WorkoutList from './WorkoutList';

const LogBook = () => {
  return (
    <div className="flex justify-center items-start h-full w-full">
      <div className="flex flex-col gap-4 m-10 w-full">
        <h1 className="text-5xl font-bold">Your Training Logbook!</h1>
        <p className="text-3xl">Track your workouts here.</p>
        <WorkoutList/>
      </div>
    </div>
  )
}

export default LogBook;