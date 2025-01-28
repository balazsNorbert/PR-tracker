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
    console.log("New workout being sent:", newWorkout);
    axios.post('http://localhost:5000/api/workouts', newWorkout)
      .then(response => {
        console.log("Response from backend:", response.data);
        setWorkouts((prevWorkouts) => [...prevWorkouts, response.data]);
      })
      .catch(error => {
        console.error("Error adding workout:", error);
      });
  };

  const handleDeleteSet = (date, workoutIndex, exerciseIndex, setIndex) => {
    const workoutsOnDate = workouts.filter(workout =>
      new Date(workout.date).toISOString().slice(0, 10) === date
    );
    if (workoutsOnDate.length === 0) return;

    const workout = workoutsOnDate[workoutIndex];
    const exercise = workout.exercise[exerciseIndex];
    console.log("ExerciseIndex:", exerciseIndex, "SetIndex:", setIndex);
    console.log("Exercises:", workout.exercise);
    console.log("workout:", workoutsOnDate);
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
        <Workout onAddWorkout={addWorkout} existingExercises={workouts.map((w) => w.exercise)}/>
      </div>
      <h2 className="font-bold text-2xl lg:text-3xl text-center mt-5">This week's workouts</h2>
      <WeeklyView workouts={workouts} handleDeleteSet={handleDeleteSet}/>
    </div>
  )
}

export default WorkoutList;