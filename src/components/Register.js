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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      alert('Passwords do not match!');
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
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong, please try again!');
    }
  };

  return (
    <div className="flex justify-center items-center m-5 h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl bg-white dark:bg-teal-700 shadow-lg w-96 p-4 md:p-6">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">Register</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Your Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="dark:bg-gray-700 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-gray-600
            rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Your Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="dark:bg-gray-700 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-gray-600
            rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
            required
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="password" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Your Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="dark:bg-gray-700 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-gray-600
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
            className="dark:bg-gray-700 text-black dark:text-white p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
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

        <button
          type="submit"
          className="text-lg lg:text-xl mt-6 py-3 bg-teal-500 font-semibold rounded-lg shadow-md hover:bg-teal-600 dark:hover:bg-teal-400 transition duration-300"
        >
          Sign up for free trial
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm lg:text-lg text-gray-600 dark:text-white">Already have an account? <Link to="/login" className="text-teal-500 hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-400">Login</Link></p>
        </div>
      </form>
    </div>
  )
}

export default Register;