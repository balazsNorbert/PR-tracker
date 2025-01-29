import React, { useState, useEffect } from 'react';
import Workout from './Workout';
import WeeklyView from './WeeklyView';
import axios from 'axios';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/workouts")
      .then(response => {
        setWorkouts(response.data);
      })
      .catch(error => {
        console.error("Error fetching workouts:", error);
      });
  }, []);

  const addWorkout = (newWorkout) => {
    if (!Array.isArray(newWorkout.exercise)) {
      newWorkout.exercise = [newWorkout.exercise];
    }
    const existingWorkout = workouts.find(workout =>
      new Date(workout.date).toISOString().slice(0, 10) === newWorkout.date
    );
    if (existingWorkout) {
      const updatedExercises = existingWorkout.exercise.map(existingExercise => {
        const newExercise = newWorkout.exercise.find(ex => ex.name === existingExercise.name);
        if (newExercise) {
          const newSets = newExercise.sets.filter(set =>
            !existingExercise.sets.some(existingSet =>
              existingSet.set === set.set && existingSet.reps === set.reps)
          );
          return {
            ...existingExercise,
            sets: [...existingExercise.sets, ...newSets],
          };
        }
        return existingExercise;
      });
      const exercisesToAdd = newWorkout.exercise.filter(ex =>
        !existingWorkout.exercise.some(existingEx => existingEx.name === ex.name)
      );
      const updatedWorkout = {
        ...existingWorkout,
        exercise: [...updatedExercises, ...exercisesToAdd],
      };
      axios.put(`http://localhost:5000/api/workouts/${existingWorkout._id}`, updatedWorkout)
        .then(response => {
          console.log("Updated workout in backend:", response.data);
          setWorkouts(prevWorkouts =>
            prevWorkouts.map(w => w._id === existingWorkout._id ? response.data : w)
          );
        })
        .catch(error => {
          console.error("Error updating workout:", error);
        });
    } else {
      axios.post('http://localhost:5000/api/workouts', newWorkout)
        .then(response => {
          console.log("Response from backend:", response.data);
          setWorkouts((prevWorkouts) => [...prevWorkouts, response.data]);
        })
        .catch(error => {
          console.error("Error adding workout:", error);
        });
    }
  };

  const handleDeleteSet = (date, workoutIndex, exerciseIndex, setIndex) => {
    const workoutsOnDate = workouts.filter(workout =>
      new Date(workout.date).toISOString().slice(0, 10) === date
    );
    if (workoutsOnDate.length === 0) return;

    const workout = workoutsOnDate[workoutIndex];
    const exercise = workout.exercise[exerciseIndex];
    if (!exercise) {
      console.error("Exercise not found for this workout");
      return;
    }
    const set = exercise.sets[setIndex];
    if (!set) {
      console.error("Set not found for this exercise");
      return;
    }

    axios.delete(`http://localhost:5000/api/workouts/${workout._id}`, {
      data: { exerciseIndex, setIndex },
    })
      .then(response => {
        console.log("Updated workout after delete:", response.data);
        setWorkouts(prevWorkouts =>
          prevWorkouts.map(w => w._id === workout._id ? response.data : w)
        );
      })
      .catch(error => {
        console.error("Error deleting set:", error);
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto">
        <Workout onAddWorkout={addWorkout} existingExercises={workouts.flatMap((w) => w.exercise)}/>
      </div>
      <h2 className="font-bold text-2xl lg:text-3xl text-center mt-5">This week's workouts</h2>
      <WeeklyView workouts={workouts} handleDeleteSet={handleDeleteSet}/>
    </div>
  )
}

export default WorkoutList;