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
    const matchedExercises = existingExercises.filter((ex) =>
      ex.name && ex.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matchedExercises);
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
    const existingWorkout = existingExercises.find((ex) => ex.name === exercise);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl bg-gray-200 w-fit p-3 md:p-5">
      <div>
        <h3 className="font-semibold text-xl mb-2">Add a new exercise</h3>
        <label htmlFor="date" className="block font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Exercise</label>
        <input
          type="text"
          value={exercise}
          onChange={handleExerciseChange}
          placeholder="e.g. Bench press"
          className="w-full border rounded-lg px-3 py-2"
        />
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded-lg p-2 mt-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.name} className="cursor-pointer" onClick={() => {setExercise(suggestion.name);setSuggestions([]);}}>
                {suggestion.name}
                <hr></hr>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="font-medium mb-2">Add set</h3>
        <div className="flex flex-col w-full md:flex-row gap-4 mb-2">
          <div className="flex gap-2 w-full md:w-fit">
            <input
              type="number"
              name="weight"
              value={currentSet.weight}
              onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
              placeholder="Weight"
              className="border rounded-lg px-3 py-2"
            />
            <select className="pl-2 rounded-lg" value={unit} onChange={(e) => setUnit(e.target.value)}>
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
            className="w-full md:w-fit border rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="button"
          onClick={handleAddSet}
          className="bg-blue-500 text-white px-3 py-2 rounded w-fit"
        >
          Add Set
        </button>
      </div>
      <ul>
        {sets.map((set, setIndex) => (
          <div key={setIndex} className="flex items-center justify-between text-xl">
            <li>
              {set.weight} {set.unit} - {set.reps} reps
            </li>
            <button type="button" onClick={handleDeleteSet} className=" text-teal-800">
              <span className="material-icons">delete</span>
            </button>
          </div>
        ))}
      </ul>
      <button type="submit" className="bg-green-500 text-white w-fit px-3 py-2 rounded">
        Save exercise
      </button>
    </form>
  );
};

export default Workout;