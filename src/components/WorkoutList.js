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


  const deleteSet = (date, workoutIndex, setIndex) => {
    console.log("Delete request being sent:", date, workoutIndex, setIndex);
    const encodedDate = encodeURIComponent(date);
    axios.delete(`http://localhost:5000/api/workouts/${encodedDate}/${workoutIndex}/${setIndex}`)
      .then((response) => {
        console.log("Delete response from backend:", response.data);
        setWorkouts(prevWorkouts => {
          const updatedWorkouts = [...prevWorkouts];
          const workout = updatedWorkouts.find(w => w.date === date);
          if (workout) {
            const exercise = workout.exercise[workoutIndex];
            exercise.sets.splice(setIndex, 1);
            if (exercise.sets.length === 0) {
              workout.exercise.splice(workoutIndex, 1);
            }
          }
          return updatedWorkouts;
        });
      })
      .catch((error) => {
        console.error("Error deleting set:", error);
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