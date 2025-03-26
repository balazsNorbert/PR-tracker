import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from '../axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/authSlice';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Login = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!isSubscribed) {
      dispatch(logout());
    }
  }, [dispatch, isSubscribed]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiURL}/auth/login`, {
        username,
        password
      });

      if (response.data.token) {
        dispatch(login({ token: response.data.token }))
        setIsSubscribed(response.data.isSubscribed);
        if(response.data.isSubscribed === false) {
          const stripe = await stripePromise;
          const checkoutResponse = await axios.post(`${apiURL}/pricing/create-checkout-session`, {
            customerId: response.data.customerId,
          });
          const session = checkoutResponse.data;
          const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          if (error) {
            setError("Something went wrong with the payment process.");
          }
        } else {
          navigate('/profile');
        }
      }} catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong, please try again!');
        }
      }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex justify-center mx-5 my-14 items-center h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl bg-white dark:bg-teal-700 shadow-lg w-96 p-4 md:p-6">
          <h1 className="text-2xl lg:text-3xl font-semibold text-center text-gray-800 dark:text-white mb-2">Login</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm lg:text-lg font-medium text-gray-600 dark:text-white">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="dark:bg-gray-700 text-black dark:text-white p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:ring-teal-400 transition duration-300"
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
              className="dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition duration-300"
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
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="text-lg lg:text-xl mt-2 py-3 bg-teal-700 dark:bg-teal-900 font-semibold rounded-lg shadow-md hover:bg-teal-800 dark:hover:bg-teal-600 transition duration-300"
          >
            Login
          </button>

          <div className="text-center">
            <p className="text-sm lg:text-lg text-gray-600 dark:text-white">Don't have an account? <Link to="/register" className="text-teal-500 hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-400">Register</Link></p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;