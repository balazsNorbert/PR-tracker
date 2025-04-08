import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from '../axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StreakTracker from './StreakTracker';
import WeightTracker from './WeightTracker';
import Idea from './Idea';

const Profile = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [goals, setGoals] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [workouts, setWorkouts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [subscriptionCanceled, setSubscriptionCanceled] = useState(false);
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

  const existingExercises=workouts.flatMap((w) => w.exercise);

  useEffect(() => {
    if(user) {
      fetchGoals(user.userId);
    }
  }, [fetchGoals, user]);

  const handleExerciseChange = (e) => {
    const value = e.target.value;
    setExerciseName(value);
    if(!value.trim()){
      setSuggestions([]);
      return;
    }
    const matchedExercises = existingExercises.filter((ex) =>
      ex.name && ex.name.toLowerCase().includes(value.toLowerCase())
    );
    const uniqueExercises = [];
    const seen = new Set();
    matchedExercises.forEach(exercise => {
      if (!seen.has(exercise.name)) {
        seen.add(exercise.name);
        uniqueExercises.push(exercise);
      }
    });
    setSuggestions(uniqueExercises);
  }

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

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post(`${apiURL}/pricing/cancel-subscription`, {
        stripeCustomerId: user.stripeCustomerId,
      });
      setSubscriptionCanceled(true);
      alert(response.data.message);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex justify-center items-center">
          <div className="flex flex-col text-center gap-6 items-start dark:bg-teal-700 bg-white w-full xs:w-auto xs:rounded-3xl shadow-xl p-4 xs:p-6 xs:mx-5 md:mx-10 md:p-8 mt-10 mb-20">
            {user ? (
            <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-800 dark:text-gray-900">
              Welcome back, <span className="text-teal-700 dark:text-white">{user.username}!</span>
            </h1>
            ) : (
              <>
                <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-800 dark:text-gray-900 mx-auto">
                  Welcome!
                </h1>
                <p className="text-lg lg:text-xl text-red-600 dark:text-red-500 font-semibold text-center">
                ⚠️ You need to log in to see your profile!
                </p>
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
            {user && (
              <>
                <StreakTracker userId={user.userId} workouts={workouts}/>
                <WeightTracker userId={user.userId} />
              </>
            )}
            <div className="bg-teal-700 dark:bg-gray-700 w-full rounded-lg p-4">
              <h3 className="text-xl font-semibold">Add new goal</h3>
              <div className="w-full flex flex-col items-center gap-4 mt-5">
                <input
                  type="text"
                  value={exerciseName}
                  onChange={handleExerciseChange}
                  onKeyDown={(e) => {
                    if(e.key === "Enter") {
                      e.preventDefault();
                      if(suggestions.length > 0) {
                        setSuggestions([]);
                      }
                    }
                  }}
                  placeholder="Exercise Name"
                  className="dark:bg-gray-900 text-black dark:text-white p-3 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-400 transition duration-300 w-full"
                />
                {suggestions.length > 0 && (
                  <ul className="bg-white dark:bg-gray-800 border border-teal-400 rounded-lg py-2 shadow-md text-black dark:text-white w-full">
                    {suggestions.map((suggestion) => (
                      <li key={suggestion.name} className="cursor-pointer flex py-2 px-3 w-full hover:bg-gray-200 dark:hover:bg-gray-500 transition" onClick={() => {setExerciseName(suggestion.name);setSuggestions([]);}}>
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-between gap-4 w-full">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    placeholder="Weight"
                    className="dark:bg-gray-900 text-black dark:text-white p-3 rounded-lg focus:outline-none
                    focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300 flex-grow min-w-0"
                  />
                  <select className="text-black dark:text-white dark:bg-gray-900 px-3 py-2
                  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-400 transition duration-300 w-18" value={unit} onChange={(e) => setUnit(e.target.value)}>
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
                    className="dark:bg-gray-900 text-black dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-400 transition duration-300 w-full md:w-auto flex-grow"
                  />
                  <button
                    onClick={handleAddGoal}
                    className="flex items-center gap-2 text-sm ml-auto md:text-lg bg-green-600 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-800 py-3 pl-2 pr-3 rounded-lg transition duration-300 shadow-md">
                    <span className="material-icons">
                      add
                    </span>
                    Goal
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full bg-teal-700 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Your Active Goals</h3>
              <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
                {goals.filter(goal => !goal.achieved).length > 0 ? (
                  goals.map(goal => {
                    const progress = calculateProgress(goal, workouts)
                    return (
                      !goal.achieved ? (
                      <li key={goal._id} className="flex justify-between md:gap-5 p-4 rounded-lg shadow-md bg-teal-500/70 dark:bg-gray-500/80 transition duration-300 relative">
                        {progress === 100 && !goal.achieved && (
                          <div className="absolute top-1 right-1 animate-pulse">
                            🎯
                          </div>
                        )}
                        <div className="flex flex-col items-start gap-1 w-full">
                          {goal.set && (
                            <h4 className="text-sm md:text-base xl:text-lg font-semibold">
                              <span className="text-base md:text-lg xl:text-xl">{goal.exerciseName}:</span> {goal.set.weight} kg x {goal.set.reps} reps
                            </h4>
                          )}
                          <div className="text-xs md:text-sm text-white mx-auto font-medium mt-1">
                            {Math.round(progress)}% completed
                          </div>
                          <div className="w-full bg-gray-300 rounded-full border border-white shadow-xl h-3 overflow-hidden">
                            <div className="bg-teal-600 h-3 rounded-full progress-bar" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => changeGoalStatus(goal._id)}
                            className={`flex items-center gap-2 text-green-700 dark:text-green-500 ${progress === 100 && !goal.achieved ? '' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={progress !== 100 || goal.achieved}
                          >
                            <span className="material-icons text-2xl md:text-3xl">
                              done
                            </span>
                          </button>
                          <button
                            onClick={() => deleteGoal(goal._id)}
                            className="text-red-700 hover:text-red-800 transition duration-300"
                          >
                            <span className="material-icons mt-2 text-2xl md:text-3xl">
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
                  <p className="italic mt-2">No active goals. Add one above! 🚀</p>
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-5 w-full bg-teal-700 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Achieved Goals</h3>
              <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
                {goals.filter(goal => goal.achieved).length > 0 ? (
                  goals.filter(goal => goal.achieved)
                  .slice()
                  .reverse()
                  .map(goal => (
                    <li
                      key={goal._id}
                      className="flex justify-between items-center p-4 rounded-lg shadow-md bg-teal-600 dark:bg-gray-900 transition duration-300"
                    >
                      <div className="flex flex-col">
                        {goal.set && (
                          <h4 className="text-sm md:text-base xl:text-lg font-semibold">
                            <span className="text-base md:text-lg xl:text-xl">{goal.exerciseName}</span>: {goal.set.weight} kg x {goal.set.reps} reps
                          </h4>
                        )}
                      </div>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="text-red-600 hover:text-red-700 transition duration-300"
                      >
                        <span className="material-icons mt-2">
                          delete
                        </span>
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="italic">You haven't achieved any goals yet. Keep going! 💪</p>
                )}
              </ul>
            </div>
          {user && (
            <div className="flex flex-col gap-4 w-full">
              <Idea />
              <div className="w-full relative">
                {!subscriptionCanceled ? (
                  <button onClick={handleCancelSubscription} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-lg w-full">
                    Cancel Subscription
                  </button>
                ) : (
                  <div className="flex flex-col">
                    <button className="bg-gray-500 px-4 py-2 rounded-lg" disabled>
                      Subscription canceled
                    </button>
                    <div className="mt-4 bg-gray-100 text-gray-700 p-3 rounded-md inline-block border border-gray-300">
                      <span className="text-sm">You can resubscribe once your current subscription expires.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
      </div>
    </>
  );
};

export default Profile;