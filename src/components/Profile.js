import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from '../axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StreakTracker from './StreakTracker';

const Profile = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [goals, setGoals] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [workouts, setWorkouts] = useState([]);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const user = useSelector((state) => state.auth.user);

  const fetchGoals = useCallback(async (userId) => {
    try {
      const goalsResponse = await axios.get(`${apiURL}/goals/${userId}`);
      const workoutsResponse = await axios.get(`${apiURL}/workouts`);
      setGoals(goalsResponse.data);
      setWorkouts(workoutsResponse.data);
    } catch (error) {
      console.log("Error adding goal:", error);
    }
  }, [apiURL]);

  useEffect(() => {
    if(user) {
      fetchGoals(user.userId);
    }
  }, [fetchGoals, user]);

  const calculateCurrentMax = (workouts, exerciseName) => {
    let maxWeight = 0;
    let maxReps = 0;

    workouts.forEach(workout => {
      workout.exercise.forEach(exercise => {
        if (exercise.name === exerciseName) {
          exercise.sets.forEach(set => {
            if (set.weight > maxWeight) {
              maxWeight = set.weight;
              maxReps = set.reps;
            } else if (set.weight === maxWeight && set.reps > maxReps) {
              maxReps = set.reps;
            }
          });
        }
      });
    });
    return { maxWeight, maxReps };
  };

  const handleAddGoal = async () => {
    if (exerciseName && weight && reps) {
      const { maxWeight: currentMaxWeight, maxReps: currentMaxReps } = calculateCurrentMax(workouts, exerciseName);
      try {
        const response = await axios.post(`${apiURL}/goals`, {
          userId: user.userId,
          exerciseName,
          set: {
            weight,
            unit,
            reps
          },
          baseline: {
            currentMaxWeight: currentMaxWeight,
            currentMaxReps: currentMaxReps
          }
        });
        setGoals([...goals, response.data]);
        setExerciseName('');
        setWeight('');
        setUnit('kg');
        setReps('');
      } catch (error) {
        console.log('Error adding goal:', error);
      }
    } else {
      alert ('Please fill in all fields');
    }
  };

  const changeGoalStatus = async (goalId) => {
    try {
      const response = await axios.patch(`${apiURL}/goals/${goalId}`);
      const updatedGoals = goals.map(goal =>
        goal._id === goalId ? {...goal, achieved: true} : goal
      );
      setGoals(updatedGoals);
      toast.success(`Another goal achieved: ${response.data.exerciseName}: ${response.data.set.weight} ${response.data.set.unit} ${response.data.set.reps} reps`)
    } catch (error) {
      console.log("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await axios.delete(`${apiURL}/goals/${goalId}`);
      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const calculateProgress = (goal, workouts) => {
    const filteredWorkouts = workouts
      .filter (workout => new Date(workout.date) > new Date(goal.createdAt));
    const relevantWorkouts = filteredWorkouts
      .flatMap(workout => workout.exercise)
      .flatMap(ex => ex.sets);
    if (relevantWorkouts.length === 0) {
      return 0;
    }

    const bestCurrentSet = relevantWorkouts.reduce((best, current) =>
      (current.weight > best.weight || (current.weight === best.weight && current.reps > best.reps)) ? current : best
    );
    const baselineWeight = goal.baseline.currentMaxWeight;
    const targetWeight = goal.set.weight;
    const targetReps = goal.set.reps;

    let weightProgress = 0;
    let finalProgress = 0;
    if(targetWeight > bestCurrentSet.weight) {
      weightProgress = (((bestCurrentSet.weight - baselineWeight) * 100 )/ (targetWeight - baselineWeight));
      weightProgress = Math.max(0, Math.min(100, weightProgress));
      finalProgress = weightProgress;
    }
    else {
      if(targetWeight === bestCurrentSet.weight){
        let repsProgress = 0;
        if (targetReps > bestCurrentSet.reps) {
          repsProgress = (bestCurrentSet.reps * 100) / targetReps;
          repsProgress = Math.max(0, Math.min(100, repsProgress));
          finalProgress = 90 + (repsProgress / 10);
        } else {
          repsProgress = bestCurrentSet.reps >= targetReps ? 100 : 0;
          finalProgress = repsProgress;
        }
      } else {
        weightProgress = bestCurrentSet.weight >= targetWeight ? 100 : 0;
        finalProgress = weightProgress;
      }
    }
    return finalProgress;
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col text-center gap-6 items-start dark:bg-teal-700 bg-white w-full xs:w-auto xs:rounded-3xl shadow-xl p-4 xs:p-6 xs:mx-5 md:mx-10 md:p-8 mt-10 mb-20">
          {user ? (
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-800 dark:text-gray-900">
            Welcome back, <span className="text-teal-600 dark:text-white">{user.username}!</span>
          </h2>
          ) : (
            <>
              <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-800 dark:text-gray-900 mx-auto">
                Welcome!
              </h2>
              <h3 className="text-lg lg:text-xl text-red-600 font-semibold text-center">
              ⚠️ You need to log in to see your profile!
              </h3>
            </>
          )}
          <div className="flex justify-between gap-3 w-full">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-sm md:text-lg dark:bg-white dark:text-black bg-gray-600 px-2 md:px-4 py-2 rounded-lg transition duration-300"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
              <span className="material-icons text-white dark:text-yellow-400">
                light_mode
              </span>
            </button>
            <button
              className="text-sm md:text-lg dark:bg-white dark:text-black bg-gray-600 px-2 md:px-4 py-2 rounded-lg transition duration-300"
            >
             <Link to="/logbook" className="flex items-center gap-2">
                Your logbook
                <span className="material-icons text-white dark:text-gray-600">
                  arrow_forward
                </span>
             </Link>
            </button>
          </div>
          {user && <StreakTracker userId={user.userId} workouts={workouts}/>}
          <h3 className="text-2xl 2xl:text-3xl font-semibold text-teal-600 dark:text-white">Goals</h3>
          <div className="w-full flex flex-col items-center gap-4">
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Exercise Name"
            className="dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 w-full"
          />
          <div className="flex justify-between gap-4 w-full">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              placeholder="Weight"
              className="dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 border p-3 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 flex-grow min-w-0"
            />
            <select className="text-black dark:text-white dark:bg-gray-700 px-3 py-2 border border-gray-300 dark:border-gray-600
            rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 w-18" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
          <div className="flex justify-between gap-4 w-full">
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value))}
              placeholder="Reps"
              className="dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 w-full md:w-auto flex-grow"
            />
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-2 text-sm ml-auto md:text-lg bg-green-500 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-800 py-3 pl-2 pr-3 rounded-lg transition duration-300 shadow-md">
              <span className="material-icons">
                add
              </span>
              Goal
            </button>
          </div>
        </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-3 text-orange-600 dark:text-orange-500">Your Active Goals</h3>
            <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
              {goals.filter(goal => !goal.achieved).length > 0 ? (
                goals.map(goal => {
                  const progress = calculateProgress(goal, workouts)
                  return (
                    !goal.achieved ? (
                    <li key={goal._id} className="flex justify-between p-4 rounded-lg shadow-md bg-orange-500 dark:bg-orange-600 transition duration-300 relative">
                      {progress === 100 && !goal.achieved && (
                        <div className="absolute top-2 right-2 text-green-400 font-bold text-center animate-pulse">
                          Achieved! 🎯
                        </div>
                      )}
                      <div className="flex flex-col items-start gap-1 w-full">
                        {goal.set && (
                          <h4 className="text-sm md:text-base xl:text-lg font-semibold">
                            <span className="text-base md:text-lg xl:text-xl">{goal.exerciseName}</span>: {goal.set.weight} kg - {goal.set.reps} reps
                          </h4>
                        )}
                        <div className="text-sm text-white mx-auto font-medium mt-1">
                          {Math.round(progress)}% completed
                        </div>
                        <div className="w-full bg-gray-300 rounded-full border border-white shadow-xl h-3 overflow-hidden">
                          <div className="bg-teal-600 h-3 rounded-full progress-bar" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ">
                        <button
                          onClick={() => changeGoalStatus(goal._id)}
                          className={`flex items-center gap-2 text-green-400 hover:text-green-600 dark:hover:text-green-500 ${progress === 100 && !goal.achieved ? '' : 'opacity-50 cursor-not-allowed'}`}
                          disabled={progress !== 100 || goal.achieved}
                        >
                          <span className="material-icons text-3xl">
                            done
                          </span>
                        </button>
                        <button
                          onClick={() => deleteGoal(goal._id)}
                          className="text-red-600 dark:text-red-800 hover:text-red-800 dark:hover:text-red-900 transition duration-300"
                        >
                          <span className="material-icons mt-2">
                            delete
                          </span>
                        </button>
                      </div>
                    </li>
                  ) : (
                    <div key={goal._id}></div>
                  )
                );
              })
              ) : (
                <p className="text-gray-500 dark:text-white">No active goals. Add one above! 🚀</p>
              )}
            </ul>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-500">Achieved Goals</h3>
            <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
              {goals.filter(goal => goal.achieved).length > 0 ? (
                goals.filter(goal => goal.achieved)
                .slice()
                .reverse()
                .map(goal => (
                  <li
                    key={goal._id}
                    className="flex justify-between items-center p-4 rounded-lg shadow-md bg-green-500 dark:bg-green-600 transition duration-300"
                  >
                    <div className="flex flex-col">
                      {goal.set && (
                        <h4 className="text-sm md:text-base xl:text-lg font-semibold">
                          <span className="text-base md:text-lg xl:text-xl">{goal.exerciseName}</span>: {goal.set.weight} kg - {goal.set.reps} reps
                        </h4>
                      )}
                    </div>
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className="text-red-600 hover:text-red-800 transition duration-300"
                    >
                      <span className="material-icons">
                        delete
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 dark:text-white">You haven't achieved any goals yet. Keep going! 💪</p>
              )}
            </ul>
          </div>
        </div>
    </div>
  );
};

export default Profile;