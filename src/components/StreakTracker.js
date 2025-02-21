import { useState, useEffect } from 'react';
import axios from 'axios';

const StreakTracker = ({ userId, workouts }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [streak, setStreak] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);

  const calculateCompletedWorkouts = (workouts) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
    });
    const uniqueWorkoutDays = new Set(weeklyWorkouts.map(workout => workout.date.split("T")[0]));
    return uniqueWorkoutDays.size;
  }

  useEffect(() => {
    const completedWorkoutsThisWeek = calculateCompletedWorkouts(workouts);

    const fetchStreak = async () => {
      try {
        const response = await axios.get(`${apiURL}/users/${userId}/streak`);
        setStreak( response.data.streak );
        setWeeklyGoal(response.data.weeklyGoal);
        setCompletedWorkouts(completedWorkoutsThisWeek);
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };
    fetchStreak();
  }, [userId, apiURL, workouts]);

  const updateWeeklyGoal = async (userId, newGoal) => {
    const completedWorkoutsThisWeek = calculateCompletedWorkouts(workouts);
    try {
      const response = await axios.patch(`${apiURL}/users/${userId}/weekly-goal`, {
        weeklyGoal: newGoal,
        completedWorkoutsThisWeek: completedWorkoutsThisWeek
      });
      setWeeklyGoal(response.data.weeklyGoal);
      if (response.data.streakUpdated) {
        setStreak(response.data.streak);
      }
    } catch (error) {
      console.error('Error updating weekly goal: ', error);
    }
  }

  const getStreakLevel = (streak) => {
    if (streak >= 500) return { label: "Legendary", color: "red-600" };
    if (streak >= 200) return { label: "Elite", color: "purple-600" };
    if (streak >= 100) return { label: "Advanced", color: "blue-600" };
    if (streak >= 50) return { label: "Intermediate", color: "green-600" };
    if (streak >= 25) return { label: "Consistent", color: "yellow-600" };
    if (streak >= 10) return { label: "Dedicated", color: "orange-600" };
    if (streak >= 5) return { label: "Beginner", color: "gray-600" };
    return { label: "Newbie", color: "bg-gray-400" };
  };

  const { label, color } = getStreakLevel(streak);

  return (
    <div className="flex flex-col gap-4 bg-teal-700 dark:bg-gray-700 text-white w-full shadow-xl rounded-xl p-6">
    <div className="flex justify-between items-center gap-1">
      {streak > 0 ? (
        <p className="text-sm font-bold text-orange-500">
          <span className="text-lg">{streak}-week</span> 🔥 streak!
        </p>
      ) : (
        <p className="text-sm font-bold text-red-600">
          No streak yet! 😞
        </p>
      )}

      <div className={`flex items-center gap-3 ${color} text-white text-sm rounded-xl p-2`}>
        <p className="font-semibold">{label}</p>
        <span className={`material-icons text-2xl`}>
          token
        </span>
      </div>
    </div>
    <div className="flex justify-between gap-6 items-center">
      <div className="flex justify-between items-center w-full gap-3">
        <label className="text-sm font-semibold">Workout Frequency:</label>
        <select
          value={weeklyGoal}
          onChange={(e) => updateWeeklyGoal(userId, e.target.value)}
          className="font-bold p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-900
          text-teal-600 dark:text-white dark:focus:ring-teal-400 transition duration-300"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      </div>
    </div>
    <div className="p-3 bg-white rounded-lg shadow-md dark:bg-gray-900">
      <p className="text-sm md:text-lg font-semibold text-teal-600 dark:text-white">
        <span className="text-lg md:text-xl">{completedWorkouts}/{weeklyGoal}</span> workouts this week
      </p>
    </div>
</div>

  )
}

export default StreakTracker;