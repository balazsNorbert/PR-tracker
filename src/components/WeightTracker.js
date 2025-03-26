import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const WeightTracker = ({ userId }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [weightData, setWeightData] = useState([]);

  useEffect(() => {
    const featchWeightData = async () => {
      try {
        const response = await axios.get(`${apiURL}/weights/${userId}`);
        setWeightData(response.data);
      } catch (error) {
        console.error("Error fetching weight data:", error);
      }
    };
    featchWeightData();
  },[userId, apiURL]);

  const handleSaveWeight = async() => {
    if(!weight) return;
    const newEntry = { userId, weight, unit };

    try {
        const res = await axios.post(`${apiURL}/weights/add`, newEntry);
        setWeightData([...weightData, res.data.newWeight]);
    } catch (error) {
        console.error("Error saving weight data:", error.response.data);
    }

    setWeight("");
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, weight, unit } = payload[0].payload;
      const formattedDate = new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return (
        <div className="bg-gray-700 w-56 p-3 border border-gray-300 text-white rounded-lg shadow-md text-sm text-left">
          <p><span className="font-semibold">Date</span>: {formattedDate}</p>
          <p><span className="font-semibold">Weight</span>: {weight} {unit}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-teal-700 dark:bg-gray-700 w-full rounded-lg p-4">
      <h3 className="font-bold text-xl">Body Weight Tracker</h3>
      <div className="w-full flex gap-2">
          <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              className="text-black dark:text-white p-3 rounded-lg border dark:border-none shadow-lg
              focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-gray-900 dark:focus:ring-teal-400 transition duration-300 w-full"
          />
          <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="text-black dark:text-white p-3 rounded-lg border dark:border-none shadow-lg
              focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-gray-900 dark:focus:ring-teal-400 transition duration-300"
          >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
          </select>
          <button
              onClick={handleSaveWeight}
              className="dark:bg-gray-900 text-white bg-green-600 px-4 py-3 rounded-lg font-semibold shadow-lg"
          >
              Save
          </button>
      </div>
      <div className="w-full h-48 bg-white dark:bg-gray-900 rounded-lg p-2 shadow-lg">
          {weightData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" className="relative right-5">
                  <LineChart data={weightData}>
                      <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      angle={-25} textAnchor="end" tick={{ fontSize: 10 }}/>
                      <YAxis tick={{ fontSize: 10 }}  domain={['dataMin', 'dataMax']}/>
                      <CartesianGrid  strokeDasharray="2 3"/>
                      <Tooltip content={CustomTooltip} />
                      <Line type="monotone" dataKey="weight" stroke="#14b8a6" strokeWidth={2} />
                  </LineChart>
              </ResponsiveContainer>
          ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">No weight data yet</p>
          )}
      </div>
      <p className="text-base md:text-lg italic">
          {weightData.length > 0 ? "Keep tracking your weight! 📊" : "Start tracking today! 🚀"}
      </p>
    </div>
  );
};

export default WeightTracker;