import React, { useState } from "react";

const Workout = ({ onAddWorkout }) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [exercise, setExercise] = useState('');
  const [currentSet, setCurrentSet] = useState({
    reps: '',
    weight: '',
  });
  const [sets, setSets] = useState([]);

  const handleAddSet = () => {
    if(!currentSet.reps || !currentSet.weight) {
      alert("Please enter reps and weight!");
      return;
    }

    setSets([...sets, currentSet]);
    setCurrentSet({
      reps: '',
      weight: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!date || !exercise || sets.length === 0) {
      alert("Please enter date, exercise name, and at least one set!");
      return;
    }
    onAddWorkout({
      date,
      exercise:{
        name: exercise,
        sets
      },
      sets,
    });

    setDate(new Date().toISOString().slice(0, 10));
    setExercise('');
    setSets([]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border bg-gray-100">
      <div className="mb-4">
        <label htmlFor="date" className="block font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Exercise</label>
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Add an exercise name"
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Add set</h3>
        <div className="flex gap-4 mb-2">
          <input
            type="number"
            name="reps"
            value={currentSet.reps}
            onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
            placeholder="Reps"
            className="w-1/2 border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            name="weight"
            value={currentSet.weight}
            onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
            placeholder="Weight (kg)"
            className="w-1/2 border rounded-lg px-3 py-2"
          />
      </div>
      <button
        type="button"
        onClick={handleAddSet}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Set
      </button>
      </div>
      <ul className="mb-4">
        {sets.map((set, index) => (
          <li key={index} className="text-gray-700">
            {set.reps} reps, {set.weight} kg
          </li>
        ))}
      </ul>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save exercise
      </button>
    </form>
  );
};

export default Workout;