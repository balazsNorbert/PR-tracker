import React from 'react';
import WorkoutList from './WorkoutList';
import CountDownTimer from './CountDownTimer';
import PlateCalculator from './PlateCalculator';
import { useEffect, useState } from 'react';

const LogBook = () => {
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const nearBottom = scrollPos >= document.body.offsetHeight - 100;
      setIsNearBottom(nearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <head>
        <meta name="robots" content="index, follow" />
        <title>Workout Logbook | Track Your Workout Progress</title>
        <meta name="description" content="Keep a detailed record of your workouts, monitor your progress, and stay motivated. Use our Workout Logbook to track exercises and achieve your fitness goals." />
        <link rel="canonical" href="https://workoutracker.com/logbook" />
      </head>
      <div className="flex justify-center items-start h-full w-full mt-10 relative">
        <div className="flex flex-col gap-4 m-5 md:m-10 w-full">
          <h1 className="text-xl md:text-2xl xl:text-3xl font-bold mx-auto text-center">Your Training Logbook - Track Workouts & Progress</h1>
          <h2 className="text-base md:text-lg xl:text-xl mx-auto text-center">Easily log your workouts, monitor your progress, and optimize your training</h2>
          <WorkoutList/>
        </div>
        <div className={`fixed right-5 z-10 transition-all duration-300 ${isNearBottom ? "bottom-36" : "bottom-5"}`}>
          <CountDownTimer />
        </div>
        <div className={`fixed left-5 z-10 transition-all duration-300 ${isNearBottom ? "bottom-36" : "bottom-5"}`}>
          <PlateCalculator />
        </div>
      </div>
    </>
  )
}

export default LogBook;