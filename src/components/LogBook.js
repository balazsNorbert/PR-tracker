import React from 'react';
import WorkoutList from './WorkoutList';

const LogBook = () => {
  return (
    <div className="flex justify-center items-start h-full w-full mt-10">
      <div className="flex flex-col gap-4 m-5 md:m-10 w-full">
        <h1 className="text-2xl md:text-3xl 2xl:text-5xl font-bold mx-auto text-center">Your Training Logbook!</h1>
        <p className="text-lg lg:text-2xl 2xl:text-3xl mx-auto">Track your workouts here.</p>
        <WorkoutList/>
      </div>
    </div>
  )
}

export default LogBook;