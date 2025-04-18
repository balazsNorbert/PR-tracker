import React from 'react';
import WorkoutList from './WorkoutList';
import CountDownTimer from './CountDownTimer';
import PlateCalculator from './PlateCalculator';
import { Helmet } from 'react-helmet';

const LogBook = () => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex justify-center items-start h-full w-full mt-10 relative">
        <div className="flex flex-col gap-4 m-5 md:m-10 w-full">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold mx-auto text-center">Your Training Logbook!</h1>
          <p className="text-lg lg:text-2xl mx-auto">Track your workouts here.</p>
          <WorkoutList/>
        </div>
        <div className="fixed bottom-32 md:bottom-28 right-5 z-10">
          <CountDownTimer />
        </div>
        <div className="fixed bottom-32 md:bottom-28 left-5 z-10">
          <PlateCalculator />
        </div>
      </div>
    </>
  )
}

export default LogBook;