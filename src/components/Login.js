import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });

      if(response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate('/profile');
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error){
      console.error('Login error:', error);
      alert('Something went wrong, please try again!');
    }
  };

  return (
    <div className="flex justify-center m-5 items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl bg-white dark:bg-teal-700 shadow-lg w-96 p-4 md:p-6">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">Login</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Your Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="dark:bg-gray-700 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:ring-teal-400 transition duration-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Your Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="dark:bg-gray-700 p-3 border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
          />
        </div>

        <button
          type="submit"
          className="text-lg lg:text-xl mt-6 py-3 bg-teal-500 font-semibold rounded-lg shadow-md hover:bg-teal-600 dark:hover:bg-teal-400 transition duration-300"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm lg:text-lg text-gray-600 dark:text-white">Don't have an account? <Link to="/register" className="text-teal-500 hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-400">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;