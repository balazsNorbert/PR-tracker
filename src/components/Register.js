import React, { useState } from 'react';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try{
      const response = await axios.post(`${apiURL}/auth/register`, {
        username,
        password,
        email,
      });

      if (response.data.message === "User registered successfully") {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong, please try again!');
      }
    }
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Workout Tracker | Track your progress and reach your goals!</title>
      </head>
      <div className="flex justify-center items-center mx-5 my-14 h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-teal-700 shadow-lg w-72 md:w-96 p-4 md:p-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-2">Register</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="dark:bg-gray-700 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600
              rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="dark:bg-gray-700 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600
              rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
              required
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="dark:bg-gray-700 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600
              rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 lg:top-12 text-gray-500 dark:text-gray-300 hover:text-teal-500 transition duration-300"
            >
              {showPassword ? (
                <span className="material-icons">
                  visibility_off
                </span>
              ) : (
                <span className="material-icons">
                  visibility
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label htmlFor="confirmPassword" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="dark:bg-gray-700 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 lg:top-12 text-gray-500 dark:text-gray-300 hover:text-teal-500 transition duration-300"
            >
              {showConfirmPassword ? (
                <span className="material-icons">
                  visibility_off
                </span>
              ) : (
                <span className="material-icons">
                  visibility
                </span>
              )}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="text-lg lg:text-xl mt-2 py-3 bg-teal-700 dark:bg-teal-900 font-semibold rounded-lg shadow-md hover:bg-teal-800 dark:hover:bg-teal-600 transition duration-300"
          >
            Sign up for free trial
          </button>

          <div className="text-center">
            <p className="text-sm lg:text-lg text-gray-600 dark:text-white">Already have an account? <Link to="/login" className="text-teal-500 hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-400">Login</Link></p>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register;