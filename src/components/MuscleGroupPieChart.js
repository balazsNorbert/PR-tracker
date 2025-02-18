import React, {useEffect, useState, useMemo} from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF7", "#FF6699", "#34D399", "#F43F5E",
  "#6366F1", "#F59E0B", "#10B981", "#E11D48", "#7C3AED", "#EC4899", "#14B8A6", "#9333EA"
];

const MuscleGroupPieChart = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [muscleGroupPRs, setMuscleGroupPRs] = useState({});
  const [selectedRange, setSelectedRange] = useState('1 month');
  const [worstMuscleGroups, setWorstMuscleGroups] = useState([]);
  const [bestMuscleGroups, setBestMuscleGroups] = useState([]);

  const calculatePRNumbers = (workouts, dateRange = '1 month') => {
    const now = new Date();
    let dateLimit;

    switch(dateRange) {
      case '1 month':
        dateLimit = new Date();
        dateLimit.setMonth(now.getMonth() - 1);
        break;
      case '3 months':
        dateLimit = new Date();
        dateLimit.setMonth(now.getMonth() - 3);
        break;
      case '6 months':
        dateLimit = new Date();
        dateLimit.setMonth(now.getMonth() - 6);
        break;
      case '1 year':
        dateLimit = new Date();
        dateLimit.setMonth(now.getMonth() - 12);
        break;
      default:
        dateLimit = new Date();
    }
    const newMuscleGroupPRs = {};

    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      if(workoutDate >= dateLimit) {
        workout.exercise.forEach(exercise => {
          const muscleGroup = exercise.muscleGroup;
          if(!newMuscleGroupPRs[muscleGroup]) {
            newMuscleGroupPRs[muscleGroup] = 0;
          }
          exercise.sets.forEach(set => {
            if(set.record) {
              newMuscleGroupPRs[muscleGroup] += 1;
            }
          });
        });
      }
    });
    return newMuscleGroupPRs;
  };

  const chartData = useMemo(() =>Object.entries(muscleGroupPRs).map(([muscleGroup, prCount]) => ({
    name: muscleGroup,
    value: prCount,
  })),[muscleGroupPRs]);

  const filteredData = chartData.filter(entry => entry.value > 0);
  console.log("BestMuscleGroups: ", bestMuscleGroups);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${apiURL}/workouts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const prCounts = calculatePRNumbers(response.data, selectedRange);
      setMuscleGroupPRs(prCounts);
    })
    .catch(error => {
      console.error("Error fetching workouts:", error);
    });
  }, [apiURL, selectedRange]);

  useEffect(() => {
    if(filteredData.length > 0) {
      const maxPR = Math.max(...filteredData.map(item => item.value));
      const minPR = Math.min(...filteredData.map(item => item.value));
      const bestGroups = filteredData.filter(item => item.value === maxPR).map(item => item.name);
      const worstGroups = filteredData.filter(item => item.value === minPR).map(item => item.name);
      setBestMuscleGroups(bestGroups);
      setWorstMuscleGroups(worstGroups);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  const handleTimeRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  const getOuterRadius = () => {
    const width = window.innerWidth;
    if (width < 500) return 100;
    if (width < 768) return 130;
    if (width < 1024) return 160;
    if(width < 1280) return 180;
    return 200;
  };

  const customTooltip = ({ payload }) => {
    if (payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="custom-tooltip bg-white p-2 rounded-xl text-black">
          <h3 className="font-bold text-sm md:text-lg">Last {selectedRange}</h3>
          <hr></hr>
          <p><span className="font-semibold text-xs md:text-base">{value} PR</span> in {name} exercises</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mx-5 md:mx-10">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center mb-8">Muscle Group PR Distribution</h1>
      <div className="flex items-center gap-1">
        <label className="font-bold text-lg md:text-xl xl:text-2xl">Select Time Range: </label>
        <select onChange={handleTimeRangeChange} value={selectedRange} className="text-black dark:text-white dark:bg-gray-700 p-2 border-2 border-gray-300 dark:border-gray-600
        rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 text-base md:text-lg">
          <option value="1 month">1 Month</option>
          <option value="3 months">3 Months</option>
          <option value="6 months">6 Months</option>
          <option value="1 year">1 Year</option>
        </select>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-5 mt-10">
        <div className="w-full sm:w-1/2 p-6 bg-white dark:bg-gray-700 text-center text-black dark:text-white rounded-lg shadow-lg border-t-8 border-green-500">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Best Muscle Group</h2>
          <h3 className="text-lg md:text-xl font-semibold text-green-500">{bestMuscleGroups.join(", ")}</h3>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-200 mt-2">
            You've made the most progress in these muscle groups. Keep up the great work!
          </p>
        </div>
        <div className="w-full sm:w-1/2 p-6 bg-white dark:bg-gray-700 text-center text-black dark:text-white rounded-lg shadow-lg border-t-8 border-red-500">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Weakest Muscle Group</h2>
          <h3 className="text-lg md:text-xl font-semibold text-red-500">{worstMuscleGroups.join(", ")}</h3>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-200 mt-2">
            These muscle groups might need more attention. Consider switching up your exercises to keep progressing.
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" className="min-h-[400px] md:min-h-[600px]">
        <PieChart className="text-sm md:text-base lg:text-lg">
          <Pie
            data={filteredData}
            dataKey="value"
            nameKey="name"
            outerRadius={getOuterRadius}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip content={customTooltip}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MuscleGroupPieChart;