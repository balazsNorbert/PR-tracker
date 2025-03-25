import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, CartesianGrid,XAxis, YAxis, ReferenceLine, Tooltip,
  Legend, Label
} from 'recharts';
import { useDarkMode } from '../contexts/DarkModeContext';
import MuscleGroupPieChart from './MuscleGroupPieChart';

const ChartByExercise = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const {name} = useParams();
  const [exerciseData, setExerciseData] = useState([]);
  const [maxWeight, setMaxWeight] = useState(0);
  const [maxReps, setMaxReps] = useState(0);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiURL}/exercise?name=${name}`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array");
        }
        const chartData = data.flatMap(entry => {
          if (!entry.exercise || !Array.isArray(entry.exercise.sets)) {
            console.error("Invalid entry format:", entry);
            return [];
          }
          return entry.exercise.sets.map(set => ({
            date: new Date(entry.date).toISOString().slice(0, 10),
            weight: set.weight,
            reps: set.reps,
            unit: set.unit,
          }));
        });
        console.log("ChartData", chartData);
        const maxWeight = chartData.reduce((max, entry) => {
          return Math.max(max, entry.weight);
        }, 0)
        setMaxWeight(maxWeight);
        const maxReps = chartData.reduce((max, entry) => {
          return Math.max(max, entry.reps);
        }, 0)
        setMaxReps(maxReps);
        setExerciseData(chartData);
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    fetchData();
  }, [name, apiURL]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, weight, reps, unit } = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md text-sm">
          <p className="text-black"><span className="font-semibold">Date</span>: {date}</p>
          <p className="text-blue-700"><span className="font-semibold">Weight</span>: {weight} {unit}</p>
          <p className="text-green-700"><span className="font-semibold">Reps</span>: {reps}</p>
        </div>
      );
    }
    return null;
  };

  const gridStrokeColor = darkMode ? "lightGray" : "gray";

  return (
    <div className="flex justify-center flex-col gap-10 items-center mx-3 md:mx-10 my-10 text-xs min-h-screen">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center">Exercise {name} progress</h1>
      <ResponsiveContainer width="100%" className="bg-gray-200 dark:bg-gray-700 py-3 pr-5 md:pr-10 md:py-5 rounded-xl min-h-[300px] md:min-h-[400px] xl:min-h-[500px]">
        <LineChart width={600} height={300} data={exerciseData}>
          <CartesianGrid  strokeDasharray="3 3" stroke={gridStrokeColor}/>
          <Line type="monotone" dataKey="weight" stroke="#1d4ed8" animationDuration={1000}/>
          <Line domain={[0, maxReps]} type="monotone" dataKey="reps" stroke="#15803d" animationDuration={1000}/>
          <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          angle={-25} textAnchor="end" tick={{ fill: darkMode ? 'white' : 'black' }}/>
          <YAxis dataKey="weight" tick={{ fill: darkMode ? 'white' : 'black' }}/>
          <ReferenceLine y={maxWeight} stroke="Red" label={<Label value="Max weight" className="font-bold text-sm md:text-lg xl:text-xl fill-red-700 dark:fill-red-600"/>}/>
          <Tooltip content={CustomTooltip}/>
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: "10px", fontSize: "14px", fontWeight: "600" }}
            iconSize={16}
          />
        </LineChart>
      </ResponsiveContainer>
      <MuscleGroupPieChart/>
    </div>
  )
};

export default ChartByExercise;