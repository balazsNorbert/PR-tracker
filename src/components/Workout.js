import React, { useState } from "react";
import { useSelector } from 'react-redux';

const Workout = ({ onAddWorkout, existingExercises }) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [exercise, setExercise] = useState('');
  const [currentSet, setCurrentSet] = useState({
    reps: '',
    weight: '',
  });
  const [sets, setSets] = useState([]);
  const [unit, setUnit] = useState('kg');
  const [suggestions, setSuggestions] = useState([]);
  const [muscleGroup, setMuscleGroup] = useState('');
  const [isOneRepMaxVisible, setIsOneRepMaxVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const handleExerciseChange = (e) => {
    const value = e.target.value;
    setExercise(value);
    if(!value.trim()){
      setSuggestions([]);
      return;
    }
    const matchedExercises = existingExercises.filter((ex) =>
      ex.name && ex.name.toLowerCase().includes(value.toLowerCase())
    );
    const uniqueExercises = [];
    const seen = new Set();
    matchedExercises.forEach(exercise => {
      if (!seen.has(exercise.name)) {
        seen.add(exercise.name);
        uniqueExercises.push(exercise);
      }
    });
    setSuggestions(uniqueExercises);
  }
  const handleAddSet = () => {
    if(!currentSet.reps || !currentSet.weight) {
      alert("Please enter reps and weight!");
      return;
    }

    setSets([...sets, { ...currentSet, unit }]);
    setCurrentSet({
      reps: '',
      weight: '',
    });
  };

  const handleDeleteSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exercise || !muscleGroup || sets.length === 0) {
      alert("Please exercise name, muscle group, and at least one set!");
      return;
    }
    const validDate = new Date(date);
    if (isNaN(validDate)) {
      alert("Invalid date!");
      return;
    }
    const existingWorkout = existingExercises.find((ex) => {
      const exDate = new Date(ex.date);
      return ( ex.name === exercise &&
        ex.muscleGroup === muscleGroup &&
       !isNaN(exDate) &&
       exDate.toISOString().slice(0, 10) === validDate.toISOString().slice(0, 10)
      );
    });

    if (existingWorkout) {
      const updatedWorkout = {
        ...existingWorkout,
        sets: [...existingWorkout.sets, ...sets],
      }
      onAddWorkout({
        date,
        exercise: updatedWorkout,
      });
    } else {
      onAddWorkout({
        date,
        exercise: {
          name: exercise,
          muscleGroup,
          sets,
        }
      });
    }

    setDate(new Date().toISOString().slice(0, 10));
    setExercise('');
    setMuscleGroup('');
    setSets([]);
    setCurrentSet({
      reps: '',
      weight: '',
    });
  };

  const toggleOneRepMax = () => {
    setIsOneRepMaxVisible(!isOneRepMaxVisible);
  };

  const calculateOneRepMax = () => {
    if (weight && reps) {
      const RM = parseFloat(weight) * (1 + 0.0333 * parseInt(reps));
      setOneRepMax(RM.toFixed(0));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-4 rounded-3xl bg-white dark:bg-teal-700 shadow-xl p-4 md:p-6 mt-5 lg:mt-10">
      <h2 className="text-xl md:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-1 md:mb-4">Add a New Exercise</h2>
      {!user && (
          <h3 className="text-lg lg:text-xl text-red-600 dark:text-red-500 font-semibold text-center">
            ⚠️ You need to log in to save your workouts!
          </h3>
        )
      }
      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-base md:text-xl font-medium text-gray-600 dark:text-white">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-sm md:text-base text-black dark:text-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600
          rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="exercise" className="text-base md:text-xl font-medium text-gray-600 dark:text-white">Exercise</label>
        <input
          id="exercise"
          type="text"
          value={exercise}
          onChange={handleExerciseChange}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              e.preventDefault();
              if(suggestions.length > 0) {
                setSuggestions([]);
              }
            }
          }}
          placeholder="e.g. Bench press"
          className="text-sm md:text-base text-black dark:text-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600
          rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
        />
        {suggestions.length > 0 && (
          <ul className="bg-white dark:bg-gray-600 border rounded-lg py-2 shadow-md text-black dark:text-white">
            {suggestions.map((suggestion) => (
              <li key={suggestion.name} className="cursor-pointer py-2 px-3 w-full hover:bg-gray-100 dark:hover:bg-gray-500 transition" onClick={() => {setExercise(suggestion.name);setSuggestions([]);}}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-2">
      <label htmlFor="muscleGroup" className="text-base md:text-xl font-medium text-gray-600 dark:text-white">Muscle Group</label>
      <select
        id="muscleGroup"
        value={muscleGroup}
        onChange={(e) => setMuscleGroup(e.target.value)}
        className="text-black text-sm md:text-base dark:text-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600
        rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
      >
        <option value="">Select Muscle Group</option>
        <option value="chest">Chest</option>
        <option value="back">Back</option>
        <option value="shoulders">Shoulders</option>
        <option value="arms">Arms</option>
        <option value="biceps">Biceps</option>
        <option value="triceps">Triceps</option>
        <option value="forearms">Forearms</option>
        <option value="legs">Legs</option>
        <option value="quads">Quads</option>
        <option value="hamstrings">Hamstrings</option>
        <option value="calves">Calves</option>
        <option value="glutes">Glutes</option>
        <option value="abs">Abs</option>
        <option value="traps">Traps</option>
        <option value="push">Push</option>
        <option value="pull">Pull</option>
      </select>
    </div>
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center gap-2">
        <label className="text-base md:text-xl font-medium text-gray-600  dark:text-white">Add Set</label>
        <button
          type="button"
          onClick={toggleOneRepMax}
          className="text-sm md:text-base text-teal-600 dark:text-white  hover:underline"
        >
          Calculate 1RM
        </button>
      </div>
      {isOneRepMaxVisible && (
        <div className="relative flex flex-col gap-4 p-4 border dark:border-gray-600 rounded-md w-full bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col gap-2 mt-5">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              className="w-full text-black text-sm md:text-base dark:text-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600
              rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
            />
            <input
              type="number"
              min="2"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Reps"
              className="w-full text-black text-sm md:text-base dark:text-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600
              rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
            />
          </div>
          <button
            type="button"
            onClick={calculateOneRepMax}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg"
          >
            Calculate
          </button>

          {oneRepMax && (
            <div className="text-xl font-semibold text-teal-600 dark:text-white">
              Your 1 Rep Max is: {oneRepMax} kg
            </div>
          )}
          <button
            type="button"
            onClick={toggleOneRepMax}
            className="absolute top-2 right-2 text-teal-500 hover:text-teal-400"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 w-full">
          <input
            type="number"
            name="weight"
            value={currentSet.weight}
            onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
            placeholder="Weight"
            className="text-sm md:text-base text-black dark:text-white dark:bg-gray-700 w-full md:w-auto p-3 border border-gray-300 dark:border-gray-600
            rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
          />
          <select className="text-sm md:text-base text-black dark:text-white dark:bg-gray-700 px-3 py-2 border border-gray-300 dark:border-gray-600
          rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <input
          type="number"
          min="1"
          name="reps"
          value={currentSet.reps}
          onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
          placeholder="Reps"
          className="text-sm md:text-base dark:bg-gray-700 md:w-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2
          focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
        />
      </div>
      <button
        type="button"
        onClick={handleAddSet}
        className="flex items-center justify-center gap-2 mt-3 py-3 bg-teal-800 dark:bg-teal-900 font-semibold rounded-lg shadow-md hover:bg-teal-900 dark:hover:bg-teal-600 transition duration-300"
      >
        <span className="material-icons">
          add
        </span>
        Add Set
      </button>
      <ul>
        {sets.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center justify-between text-lg p-2 border-b border-gray-300 text-black dark:text-white">
            <li>{set.weight} {set.unit} - {set.reps} reps</li>
            <button type="button" onClick={() => handleDeleteSet(setIndex)} className="text-red-600 hover:text-red-700 transition duration-300">
              <span className="material-icons">delete</span>
            </button>
          </div>
        ))}
      </ul>
      <button type="submit" className="py-3 bg-teal-800 dark:bg-teal-900 font-semibold rounded-lg shadow-md hover:bg-teal-900 dark:hover:bg-teal-600 transition duration-300">
        Save Exercise
      </button>
    </div>
    </form>

  );
};

export default Workout;