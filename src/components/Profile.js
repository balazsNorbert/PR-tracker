import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import axios from '../axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
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
  }, []);

  const fetchGoals = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.log("Error adding goal:", error);
    }
  }

  const handleAddGoal = async () => {
    if (goalText.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/api/goals', {
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
      const response = await axios.patch(`http://localhost:5000/api/goals/${goalId}`);
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
      await axios.delete(`http://localhost:5000/api/goals/${goalId}`);
      setGoals(goals.filter(goal => goal._id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      {user ? (
        <div className="flex flex-col text-center gap-6 items-start bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-800">
            Welcome back, <span className="text-teal-600">{user.username}!</span>
          </h2>
          <h3 className="text-2xl 2xl:text-3xl font-semibold text-teal-600">Achievements</h3>
          <div className="w-full flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Add a new goal..."
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition
              duration-300 w-full md:w-auto flex-grow"
            />
            <button
              onClick={handleAddGoal}
              className="flex items-center gap-2 text-lg bg-green-500 hover:bg-green-600 text-white px-4 py-3
              rounded-lg transition duration-300 shadow-md">
              <span className="material-icons">
                add
              </span>
              Goal
            </button>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-3 text-orange-600">Your Active Goals</h3>
            <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
              {goals.filter(goal => !goal.achieved).length > 0 ? (
                goals.filter(goal => !goal.achieved).map(goal => (
                    <li
                      key={goal._id}
                      className="flex justify-between items-center p-4 rounded-lg shadow-md bg-orange-500 text-white transition duration-300 relative"
                    >
                      <span className="text-sm md:text-base xl:text-lg">{goal.text}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => changeGoalStatus(goal._id)}
                          className="flex items-center gap-2 text-green-400 hover:text-green-600"
                        >
                          <span class="material-icons text-3xl">
                            done
                          </span>
                        </button>
                        <button
                        onClick={() => deleteGoal(goal._id)}
                        className="text-red-600 hover:text-red-800 transition duration-300"
                        >
                          <span className="material-icons mt-1">
                          delete
                          </span>
                        </button>
                      </div>
                    </li>
                ))
              ) : (
                <p className="text-gray-500">No active goals. Add one above! 🚀</p>
              )}
            </ul>
          </div>
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-3 text-green-600">Achieved Goals</h3>
            <ul className="flex flex-col gap-3 w-full max-h-64 overflow-y-auto">
              {goals.filter(goal => goal.achieved).length > 0 ? (
                goals.filter(goal => goal.achieved)
                .slice()
                .reverse()
                .map(goal => (
                  <li
                    key={goal._id}
                    className="flex justify-between items-center p-4 rounded-lg shadow-md bg-green-500 text-white transition duration-300"
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
                <p className="text-gray-500">You haven't achieved any goals yet. Keep going! 💪</p>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-2xl lg:text-3xl 2xl:text-4xl text-center text-gray-600">Log in to see your profile...</p>
      )}
    </div>
  );
};

export default Profile;