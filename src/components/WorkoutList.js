import React, { useState, useEffect } from 'react';
import Workout from './Workout';
import WeeklyView from './WeeklyView';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [maxWeightByExercise, setMaxWeightByExercise] = useState({});
  const [maxRepsByExercise, setMaxRepsByExercise] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/workouts")
      .then(response => {
        setWorkouts(response.data);
        let previousMaxWeightByExercise = {};
        let previousMaxRepsByExercise = {};
        response.data.forEach(workout => {
          workout.exercise.forEach(ex => {
            if(!previousMaxWeightByExercise[ex.name]) {
              previousMaxWeightByExercise[ex.name] = 0;
            }
            if(!previousMaxRepsByExercise[ex.name]) {
              previousMaxRepsByExercise[ex.name] = {};
            }
            ex.sets.forEach(set => {
              if(set.weight > previousMaxWeightByExercise[ex.name]) {
                previousMaxWeightByExercise[ex.name] = set.weight;
              }
              if(!previousMaxRepsByExercise[ex.name][set.weight] || set.reps > previousMaxRepsByExercise[ex.name][set.weight]) {
                previousMaxRepsByExercise[ex.name][set.weight] = set.reps;
              }
            });
          });
        });
        setMaxWeightByExercise(previousMaxWeightByExercise);
        setMaxRepsByExercise(previousMaxRepsByExercise);
      })
      .catch(error => {
        console.error("Error fetching workouts:", error);
      });
  }, []);

  const checkForNewPR = (newWorkout) => {
    const newMaxWeightByExercise = {...maxWeightByExercise};
    const newMaxRepsByExercise = {...maxRepsByExercise};

    newWorkout.exercise.forEach(ex => {
      if(!newMaxWeightByExercise[ex.name]) {
        newMaxWeightByExercise[ex.name] = 0;
      }
      if(!newMaxRepsByExercise[ex.name]) {
        newMaxRepsByExercise[ex.name] = 0;
      }
      ex.sets.forEach(set => {
        if(set.weight > newMaxWeightByExercise[ex.name]) {
          newMaxWeightByExercise[ex.name] = set.weight;
          toast.success(`New PR for ${ex.name}: ${set.weight} ${set.unit}!`, { autoClose: 4000 });
        }
        if(!newMaxRepsByExercise[ex.name][set.weight] || set.reps > newMaxRepsByExercise[ex.name][set.weight]) {
          newMaxRepsByExercise[ex.name][set.weight] = set.reps;
          toast.success(`New Reps PR for ${ex.name} at ${set.weight} ${set.unit} - ${set.reps} reps!`, { autoClose: 4000 });
        }
    });
    });
    setMaxWeightByExercise(newMaxWeightByExercise);
    setMaxRepsByExercise(newMaxRepsByExercise);
  };

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
          checkForNewPR(response.data);
        })
        .catch(error => {
          console.error("Error updating workout:", error);
        });
    } else {
      axios.post('http://localhost:5000/api/workouts', newWorkout)
        .then(response => {
          console.log("Response from backend:", response.data);
          setWorkouts((prevWorkouts) => [...prevWorkouts, response.data]);
          checkForNewPR(response.data);
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
    <div className="flex flex-col h-full gap-5">
      <div className="mx-auto">
        <Workout onAddWorkout={addWorkout} existingExercises={workouts.flatMap((w) => w.exercise)}/>
      </div>
      <h2 className="font-bold text-2xl lg:text-3xl text-center mt-10 text-white">This week's workouts</h2>
      <WeeklyView workouts={workouts} handleDeleteSet={handleDeleteSet}/>
    </div>
  )
}

export default WorkoutList;