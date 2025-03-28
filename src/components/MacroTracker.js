import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import axios from "axios";
import { useSelector } from 'react-redux';

const COLORS = ["#FF8042", "#007BFF", "#FFC107", "#28A745"];

const MacroTracker = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showInfo, setShowInfo] = useState(false);
  const [macros, setMacros] = useState({calories: 0, protein: 0, carbs: 0, fat: 0});
  const [goals, setGoals] = useState({ calories: 2520, protein: 150, carbs: 300, fat: 80 });
  const [inputValues, setInputValues] = useState({ calories: '', protein: '', carbs: '', fat: '' });
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.userId : null;

  const addMacros = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (inputValues.calories === '') {
      inputValues.calories = 4 * inputValues.protein + 4 * inputValues.carbs + 9 * inputValues.fat;
    }
    const updatedMacros = {
      userId: userId,
      date: formattedDate,
      calories: inputValues.calories || 0,
      protein: inputValues.protein || 0,
      carbs: inputValues.carbs || 0,
      fat: inputValues.fat || 0,
    };
    try {
      const {data} = await axios.post(`${apiURL}/nutrition-tracker`, { ...updatedMacros });
      setMacros(data);
    } catch (error) {
      console.error("Error saving macros:", error);
    }
    setInputValues({ calories: '', protein: '', carbs: '', fat: '' });
  };

  const clearMacros = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const clearedMacros = {
      userId: userId,
      date: formattedDate,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    try {
      await axios.put(`${apiURL}/nutrition-tracker/${userId}/${formattedDate}`, { ...clearedMacros });
      setMacros(clearedMacros);
    } catch (error) {
      console.error("Error clearing macros:", error);
    }
  };

  const fetchMacros = useCallback(async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    try {
      const { data } = await axios.get(`${apiURL}/nutrition-tracker/${userId}/${formattedDate}`);
      setMacros(data || { calories: 0, protein: 0, carbs: 0, fat: 0 });
    } catch (error) {
      console.error("Error fetching macros:", error);
    }
  },[selectedDate, apiURL, userId]);

  useEffect(() => {
    fetchMacros();
  },[fetchMacros]);

  const macroData = [
    { name: "Protein", value: macros.protein, goal: goals.protein },
    { name: "Carbs", value: macros.carbs, goal: goals.carbs },
    { name: "Fat", value: macros.fat, goal: goals.fat },
    { name: "Calories", value: macros.calories, goal: goals.calories },
  ];

  return (
    <div className="flex flex-col items-center gap-8 md:gap-14 min-h-screen w-full my-10 mx-auto p-5 md:px-10">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold">Nutrition Tracker</h1>
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="flex flex-1 flex-col gap-6 w-full bg-white text-gray-600 p-4 md:p-6 rounded-3xl shadow-xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="Date" className="font-bold text-lg">Date</label>
          <input
            id="Date"
            type="date"
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full text-center text-sm md:text-base text-black dark:text-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600
            rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
          />
        </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">Add Macros</h2>
              <div
                className="cursor-pointer text-blue-500 relative"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              >
                <span className="material-icons">info</span>
                {showInfo && (
                  <div className="absolute top-0 left-0 mt-6 bg-gray-800 text-white p-4 rounded-lg shadow-xl w-64 z-10">
                    <p className="text-base font-semibold">
                      <span className="font-extrabold text-yellow-300 text-lg">Note:</span> The calorie count will be automatically calculated if you don't provide it.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {Object.keys(inputValues).map((key) => (
              <div key={key} className="flex justify-between items-center w-full">
                <label className="mr-2 font-semibold text-base">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="number"
                  value={inputValues[key]}
                  onChange={(e) => setInputValues({ ...inputValues, [key]: Number(e.target.value) })}
                  placeholder="0"
                  className="text-sm md:text-base dark:text-white dark:bg-gray-700 py-2 px-2 md:px-0 border border-gray-300 dark:border-gray-600
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 w-40 text-black text-right"
                />
              </div>
            ))}
            <button onClick={addMacros} className="flex items-center justify-center gap-2 mt-3 py-3 bg-teal-800 dark:bg-teal-900 font-semibold rounded-lg shadow-md hover:bg-teal-900 dark:hover:bg-teal-600 transition duration-300 text-white">
              <span className="material-icons">
                add
              </span>
              Add
            </button>
            <button
              onClick={clearMacros}
              className="flex items-center justify-center gap-2 mt-3 py-3 bg-red-700 font-semibold rounded-lg shadow-md hover:bg-red-800 dark:hover:bg-red-500 transition duration-300 text-white"
            >
              <span className="material-icons">delete</span>
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg">Set Your Goals</h2>
            {Object.keys(goals).map((key) => (
              <div key={key} className="flex justify-between items-center w-full">
                <label className="mr-2 font-semibold text-base">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="number"
                  value={goals[key]}
                  onChange={(e) => setGoals({ ...goals, [key]: Number(e.target.value) })}
                  className="w-40 text-right text-sm md:text-base text-black dark:text-white dark:bg-gray-700 py-2 px-2 md:px-0 border border-gray-300 dark:border-gray-600
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gird-cols-1 lg:grid-cols-2 gap-6">
        {macroData.map((macro, index) => {
          const realValuePercent = (macro.value / macro.goal) * 100;
          const valuePercent = realValuePercent > 100 ? 100 : realValuePercent;
          const remainingPercent = 100 - valuePercent;
          return (
            <div key={index} className="text-center">
              <h3 className="font-semibold text-xl">{macro.name}</h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={[{ value: valuePercent },{ value: remainingPercent }]}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  <Cell fill={COLORS[index]} stroke="#fff" strokeWidth={2} />
                  <Cell fill="#EEE" />
                  <Label
                    value={`${realValuePercent.toFixed(1)}%`}
                    position="center"
                    fontSize={24}
                    fontWeight="bold"
                    fill="#333"
                  />
                </Pie>
              </PieChart>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default MacroTracker;