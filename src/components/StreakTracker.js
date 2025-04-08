import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import WorkoutCalendar from './WorkoutCalendar';

const StreakTracker = ({ userId, workouts }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [streak, setStreak] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [streakAchievedWeeks, setStreakAchievedWeeks] = useState(0);

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

  const calculateWorkoutDaysAndStreak = useCallback((workouts) => {
    const workoutDaysSet = new Set();
    const streakWeeksMap = new Map();

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      const startOfWeek = new Date(workoutDate);
      startOfWeek.setDate(workoutDate.getDate() - workoutDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weekIdentifier = startOfWeek.toISOString().split("T")[0];

      if (!streakWeeksMap.has(weekIdentifier)) {
        streakWeeksMap.set(weekIdentifier, { startDate: startOfWeek, endDate: endOfWeek, workouts: [] });
      } streakWeeksMap.get(weekIdentifier).workouts.push(workoutDate);
      workoutDaysSet.add(workoutDate.toDateString());
    });

    const streakAchievedWeeks = [];
    streakWeeksMap.forEach((week, weekIdentifier) => {
      const completedWorkoutsInWeek = week.workouts.length;
      if (completedWorkoutsInWeek >= weeklyGoal) {
        streakAchievedWeeks.push({
          ...week,
          completedWorkoutsInWeek,
          weekIdentifier,
        });
      }
    });
    setWorkoutDays(Array.from(workoutDaysSet));
    setStreakAchievedWeeks(streakAchievedWeeks);
  }, [weeklyGoal]);

  useEffect(() => {
    const completedWorkoutsThisWeek = calculateCompletedWorkouts(workouts);

    const fetchStreak = async () => {
      try {
        const response = await axios.get(`${apiURL}/users/${userId}/streak`);
        setStreak( response.data.streak );
        setWeeklyGoal(response.data.weeklyGoal);
        setCompletedWorkouts(completedWorkoutsThisWeek);
        calculateWorkoutDaysAndStreak(workouts);
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };
    fetchStreak();
  }, [userId, apiURL, workouts, calculateWorkoutDaysAndStreak]);

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
    if (streak >= 250) return { label: "Titan", color: "text-cyan-800", icon: "diamond" };
    if (streak >= 175) return { label: "Legend", color: "text-amber-800", icon: "volcano", nextRank: "Titan", nextStreak: "250 weeks", nextIcon: "diamond", nextColor: "text-cyan-800" };
    if (streak >= 125) return { label: "Unstoppable", color: "text-purple-700", icon: "rocket_launch", nextRank: "Legend", nextStreak: "175 weeks", nextIcon: "volcano", nextColor: "text-amber-800" };
    if (streak >= 75) return { label: "Elite", color: "text-red-700", icon: "military_tech", nextRank: "Unstoppable", nextStreak: "125 weeks", nextIcon: "rocket_launch", nextColor: "text-purple-700" };
    if (streak >= 50) return { label: "Warrior", color: "text-blue-700", icon: "fitness_center", nextRank: "Elite", nextStreak: "75 weeks", nextIcon: "military_tech", nextColor: "text-red-700" };
    if (streak >= 20) return { label: "Challenger", color: "text-green-700", icon: "whatshot", nextRank: "Warrior", nextStreak: "50 weeks", nextIcon: "fitness_center", nextColor: "text-blue-700" };
    if (streak >= 12) return { label: "Disciplined", color: "text-yellow-600", icon: "emoji_events", nextRank: "Challenger", nextStreak: "20 weeks", nextIcon: "whatshot", nextColor: "text-green-700" };
    if (streak >= 8) return { label: "Committed", color: "text-orange-600", icon: "fitness_center", nextRank: "Disciplined", nextStreak: "12 weeks", nextIcon: "emoji_events", nextColor: "text-yellow-600" };
    if (streak >= 4) return { label: "Rising Star", color: "text-cyan-500", icon: "star", nextRank: "Committed", nextStreak: "8 weeks", nextIcon: "fitness_center", nextColor: "text-orange-600"};
    return { label: "Newbie", color: "text-gray-500", icon: "eco", nextRank: "Rising Star", nextStreak: "4 weeks", nextIcon: "star", nextColor: "text-cyan-500"};
  };

  const { label, color, icon, nextRank, nextIcon, nextColor, nextStreak } = getStreakLevel(streak);

  return (
    <div className="flex flex-col gap-4 w-full">
      {streak > 0 ? (
        <h2 className="text-lg md:text-xl font-bold text-orange-500">
          <span className="text-xl md:text-2xl">{streak} week 🔥</span> streak!
        </h2>
      ) : (
        <h2 className="text-lg md:text-xl font-bold text-red-700 dark:text-red-500">
          No streak yet! 😞
        </h2>
      )}
      <div className="flex flex-col gap-4 bg-teal-700 dark:bg-gray-700 w-full shadow-xl rounded-lg p-6"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h3 className="font-bold text-xl">
          Your rank
        </h3>
        <div className="flex justify-center items-center gap-3 bg-white text-white text-lg md:text-xl rounded-xl p-2 relative">
          <p className={`font-semibold ${color}`}>{label}</p>
          <span className={`material-icons text-2xl ${color}`}>
            {icon}
          </span>
          {hovered && (
            <div className="absolute top-14 flex flex-col gap-1 bg-gray-800 text-white text-lg md:text-xl rounded-lg p-3 shadow-lg">
              <p className="font-semibold text-base md:text-lg">Next rank at {nextStreak} :</p>
              <div className="flex justify-center items-center gap-2">
                <p className={`text-base font-semibold ${nextColor}`}>{nextRank}</p>
                <span className={`material-icons text-2xl ${nextColor}`}>
                  {nextIcon}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 bg-teal-700 dark:bg-gray-700 w-full rounded-lg p-4">
        <h3 className="font-bold text-xl">
          Workout frequency
        </h3>
        <div className="max-w-full shadow-xl">
          <WorkoutCalendar workoutDays={workoutDays} streakAchievedWeeks={streakAchievedWeeks}/>
        </div>
        <select
          value={weeklyGoal}
          onChange={(e) => updateWeeklyGoal(userId, e.target.value)}
          className="font-semibold text-base md:text-lg text-black dark:text-white p-4 rounded-2xl border dark:border-none shadow-lg
          focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-gray-900
        dark:focus:ring-teal-400 transition duration-300 w-full"
        >
          <option value="1">1 workout / week</option>
          <option value="2">2 workouts / week</option>
          <option value="3">3 workouts / week</option>
          <option value="4">4 workouts / week</option>
          <option value="5">5 workouts / week</option>
          <option value="6">6 workouts / week</option>
          <option value="7">7 workouts / week</option>
        </select>
        <div className="w-full bg-white dark:bg-gray-900 transition duration-300 rounded-xl p-4 shadow-md">
          <p className="text-base md:text-lg font-semibold text-black dark:text-white mb-2">
            <span className="font-bold">{completedWorkouts} / {weeklyGoal}</span> workouts done this week
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((completedWorkouts / weeklyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-lg md:text-xl italic">
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