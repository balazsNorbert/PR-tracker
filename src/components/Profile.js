import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import axios from '../axios';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState('');
  const { darkMode, toggleDarkMode } = useDarkMode();

  const fetchGoals = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${apiURL}/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.log("Error adding goal:", error);
    }
  }, [apiURL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        fetchGoals(decodedToken.userId);
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [fetchGoals]);

  const handleAddGoal = async () => {
    if (goalText.trim()) {
      try {
        const response = await axios.post(`${apiURL}/goals`, {
          userId: user.userId,
          text: goalText,
        });
        setGoals([...goals, response.data]);
        setGoalText('');
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    } else {
      alert('Please enter a goal');
    }
  };

  const changeGoalStatus = async (goalId) => {
    try{
      const response = await axios.patch(`${apiURL}/goals/${goalId}`);
      const updatedGoals = goals.map(goal =>
        goal._id === goalId ? {...goal, achieved: true} : goal
      );
      setGoals(updatedGoals);
      toast.success(`Goal achieved: ${response.data.text}`)
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

  return (
    <div className="h-screen flex justify-center items-center">
      {user ? (
        <div className="flex flex-col text-center gap-6 items-start dark:bg-teal-700 bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-800 dark:text-gray-900">
            Welcome back, <span className="text-teal-600 dark:text-white">{user.username}!</span>
          </h2>
          <div className="flex gap-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-sm dark:bg-white dark:text-black bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              <span className="material-icons text-white dark:text-yellow-400">
                light_mode
              </span>
            </button>
            <button
              className="text-sm dark:bg-white dark:text-black bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
            >
             <Link to="/logbook" className="flex items-center gap-2">
                Your logbook
                <span className="material-icons text-white dark:text-gray-600">
                  arrow_forward
                </span>
             </Link>
            </button>
          </div>
          <h3 className="text-2xl 2xl:text-3xl font-semibold text-teal-600 dark:text-white">Achievements</h3>
          <div className="w-full flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Add a new goal..."
              className="dark:bg-gray-700 text-black dark:text-white dark:border-gray-600 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition
              duration-300 w-full md:w-auto flex-grow"
            />
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-2 text-lg bg-green-500 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-800 px-4 py-3
              rounded-lg transition duration-300 shadow-md">
              <span className="material-icons">
                add
              </span>
              Goal
            </button>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-3 text-orange-600 dark:text-orange-500">Your Active Goals</h3>
            <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
              {goals.filter(goal => !goal.achieved).length > 0 ? (
                goals.filter(goal => !goal.achieved).map(goal => (
                    <li
                      key={goal._id}
                      className="flex justify-between items-center p-4 rounded-lg shadow-md bg-orange-500 dark:bg-orange-600 transition duration-300 relative"
                    >
                      <span className="text-sm md:text-base xl:text-lg">{goal.text}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => changeGoalStatus(goal._id)}
                          className="flex items-center gap-2 text-green-400 hover:text-green-600 dark:hover:text-green-500"
                        >
                          <span class="material-icons text-3xl">
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
                ))
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
                      <span className="text-sm md:text-base xl:text-lg">{goal.text}</span>
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
      ) : (
        <p className="text-2xl lg:text-3xl 2xl:text-4xl text-center">Log in to see your profile...</p>
      )}
    </div>
  );
};

export default Profile;