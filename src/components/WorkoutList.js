import React, { useState } from 'react';
import Workout from './Workout';
import WeeklyView from './WeeklyView';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);

  const addWorkout = (newWorkout) => {
    setWorkouts((prevWorkouts) => {
      console.log("Previous workouts:", prevWorkouts);
      console.log("New workout being added:", newWorkout);
      const workoutIndex = prevWorkouts.findIndex(
        (w) => w.date === newWorkout.date && w.exercise.name === newWorkout.exercise.name
      );
      if (workoutIndex > -1) {
        const updatedWorkouts = prevWorkouts.map((workout, index) => {
          if (index === workoutIndex) {
            return {
              ...workout,
              exercise: {
                ...workout.exercise,
                sets: [...newWorkout.exercise.sets],
              },
            };
          }
          return workout;
        });
        return updatedWorkouts;
      }
      return [...prevWorkouts, newWorkout];
    });
  };

  const deleteSet = (date, workoutIndex, setIndex) => {
    setWorkouts((prevWorkouts) => {
      return prevWorkouts.map((workout, index) => {
        if (index === workoutIndex && workout.date === date) {
          const updatedSets = workout.exercise.sets.filter((_, index) => index !== setIndex);
          if (updatedSets.length === 0) {
            return null;
          }
          return {
            ...workout,
            exercise: { ...workout.exercise, sets: updatedSets },
          };
        }
        return workout;
      }).filter(Boolean);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto">
        <Workout onAddWorkout={addWorkout} existingExercises={workouts.map((w) => w.exercise)}/>
      </div>
      <h2 className="font-bold text-2xl lg:text-3xl text-center mt-5">This week's workouts</h2>
      <WeeklyView workouts={workouts} onDeleteSet={deleteSet}/>
    </div>
  )
}

export default WorkoutList;