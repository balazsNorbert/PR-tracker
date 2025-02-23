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
    if (streak >= 250) return { label: "Gym rat", color: "bg-lime-600"};
    if (streak >= 125) return { label: "Legendary", color: "bg-red-600" };
    if (streak >= 50) return { label: "Advanced", color: "bg-blue-600" };
    if (streak >= 20) return { label: "Intermediate", color: "bg-green-600" };
    if (streak >= 12) return { label: "Consistent", color: "bg-yellow-600" };
    if (streak >= 8) return { label: "Dedicated", color: "bg-orange-600" };
    if (streak >= 4) return { label: "Beginner", color: "bg-gray-600" };
    return { label: "Newbie", color: "bg-gray-400" };
  };

  const { label, color } = getStreakLevel(streak);

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-tr from-teal-600 to-teal-800 dark:bg-gradient-to-tr dark:from-gray-600 dark:to-gray-800 text-white w-full shadow-xl rounded-xl p-6">
      {streak > 0 ? (
        <h3 className="text-lg md:text-xl font-bold text-orange-500">
          <span className="text-xl md:text-2xl">{streak} week 🔥</span> streak!
        </h3>
      ) : (
        <h3 className="text-lg md:text-xl font-bold text-red-600">
          No streak yet! 😞
        </h3>
      )}
      <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg p-3 rounded-xl gap-1">
        <h4 className="font-bold text-lg  text-teal-600 dark:text-white">
          Your rank
          </h4>
        <div className={`flex justify-center items-center gap-3 ${color} text-white text-lg md:text-xl rounded-xl p-2`}>
          <p className="font-semibold">{label}</p>
          <span className={`material-icons text-2xl`}>
            token
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 bg-white rounded-lg shadow-lg text-gray-700 dark:text-white dark:bg-gray-800 p-3">
        <h4 className="font-bold text-xl">
          Workout frequency
        </h4>
        <select
          value={weeklyGoal}
          onChange={(e) => updateWeeklyGoal(userId, e.target.value)}
          className="font-bold text-base md:text-lg p-3 rounded-lg border dark:border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-900
        dark:focus:ring-teal-400 transition duration-300"
        >
          <option value="1">1 workout / week</option>
          <option value="2">2 workouts / week</option>
          <option value="3">3 workouts / week</option>
          <option value="4">4 workouts / week</option>
          <option value="5">5 workouts / week</option>
          <option value="6">6 workouts / week</option>
          <option value="7">7 workouts / week</option>
        </select>
        <p className="border dark:border-none shadow-lg dark:bg-gray-900 rounded-lg text-base md:text-lg p-2 font-semibold transition duration-300">
          <span className="text-lg md:text-xl">{completedWorkouts} / {weeklyGoal} </span>
          workouts done this week
        </p>
        <p className="text-lg md:text-xl">
          {completedWorkouts >= weeklyGoal ? (
            " Good job! 💪"
          ) : (
            " Keep going! 🚀"
          )}
        </p>
      </div>
    </div>
  )
}

export default StreakTracker;