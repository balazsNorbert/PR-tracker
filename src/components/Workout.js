import React, { useState } from "react";

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
    if(!date || !exercise || sets.length === 0) {
      alert("Please enter date, exercise name, and at least one set!");
      return;
    }
    const validDate = new Date(date);
    if (isNaN(validDate)) {
      alert("Invalid date!");
      return;
    }
    const existingWorkout = existingExercises.find((ex) => {
      const exDate = new Date(ex.date);
      return ex.name === exercise && !isNaN(exDate) && exDate.toISOString().slice(0, 10) === validDate.toISOString().slice(0, 10);
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
        exercise:{
          name: exercise,
          sets,
        }
      });
    }

    setDate(new Date().toISOString().slice(0, 10));
    setExercise('');
    setSets([]);
    setCurrentSet({
      reps: '',
      weight: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl bg-white shadow-xl p-4 md:p-6">
      <h2 className="text-2xl lg:text-3xl font-semibold text-center text-gray-800 mb-6">Add a New Exercise</h2>
      <div className="flex flex-col">
        <label htmlFor="date" className="text-lg lg:text-xl font-medium text-gray-600">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-lg lg:text-xl font-medium text-gray-600">Exercise</label>
        <input
          type="text"
          value={exercise}
          onChange={handleExerciseChange}
          placeholder="e.g. Bench press"
          className="mt-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded-lg p-2 mt-2 shadow-md">
            {suggestions.map((suggestion) => (
              <li key={suggestion.name} className="cursor-pointer p-2 hover:bg-gray-100 transition" onClick={() => {setExercise(suggestion.name);setSuggestions([]);}}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3 className="text-lg lg:text-xl font-medium text-gray-600">Add Set</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 w-full">
          <input
            type="number"
            name="weight"
            value={currentSet.weight}
            onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
            placeholder="Weight"
            className="w-full md:w-auto p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
          />
          <select className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <input
          type="number"
          name="reps"
          value={currentSet.reps}
          onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
          placeholder="Reps"
          className="md:w-24 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        />
      </div>
      <button
        type="button"
        onClick={handleAddSet}
        className="mt-3 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
      >
        Add Set
      </button>
      <ul className="mt-3">
        {sets.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center justify-between text-lg p-2 border-b border-gray-300">
            <li>{set.weight} {set.unit} - {set.reps} reps</li>
            <button type="button" onClick={handleDeleteSet} className="text-red-500 hover:text-red-700 transition">
              <span className="material-icons">delete</span>
            </button>
          </div>
        ))}
      </ul>
      <button type="submit" className="py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300">
        Save Exercise
      </button>
    </form>

  );
};

export default Workout;