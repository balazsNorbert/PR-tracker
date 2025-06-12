import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="flex flex-col max-w-sm md:max-w-md gap-10 items-center pt-14 pb-20 mx-auto">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl lg:text-4xl font-bold">Pricing</h2>
        <span className="material-icons text-4xl md:text-5xl">
          paid
        </span>
      </div>
      <div className="flex flex-col gap-4 items-center bg-white rounded-xl shadow-2xl relative">
        <div className="flex flex-col items-center gap-4 px-6 pt-6 w-full relative">
          <div className="relative">
            <span className="absolute -top-2 -right-3 bg-yellow-300 text-xs px-2 py-1 rounded-full font-bold text-gray-800">Best Value</span>
            <p className="text-4xl md:text-5xl font-bold text-teal-800">$3.99<span className="font-semibold text-lg">/month</span></p>
          </div>
          <p className="text-center text-gray-600 italic">Enjoy complete workout & nutrition tracking.</p>
          <p className="text-xl text-teal-800 font-semibold w-fit mx-auto"><span className="text-2xl">14</span>-day free trial!</p>
          <p className="flex items-center gap-2 text-sm md:text-base text-green-500 font-semibold text-center">
            <span className="material-icons text-xl md:text-2xl text-teal-700">
              credit_card_off
            </span>
            No Credit Card required!
          </p>
        </div>
        <div className="w-full">
          <svg className="w-full" viewBox="0 0 500 50" preserveAspectRatio="none">
            <path d="M0,0 Q250,50 500,0 V50 H0 Z" fill="#374151"></path>
          </svg>
        </div>
        <Link to='/register' className="absolute -bottom-5 bg-teal-700 hover:bg-teal-800 text-xl lg:text-2xl py-2 px-8 rounded-lg
          font-semibold transition-all duration-300 transform hover:scale-105 shadow-md">
          Start Free Trial
        </Link>
        <div className="bg-gradient-to-tr from-gray-600 to-gray-900 p-8 pb-12 rounded-b-xl w-full">
          <ul className="flex flex-col gap-2 md:gap-3 text-white text-base md:text-lg">
            <li>✅ Easily add and track your workouts</li>
            <li>✅ Get notified when you hit a new personal record</li>
            <li>✅ Easily track your nutrition macros</li>
            <li>✅ Monitor training frequency and progress</li>
            <li>✅ Set and achieve your fitness goals</li>
          </ul>
        </div>
      </div>
      <p className="text-xs md:text-sm text-gray-300 mt-1">
        🔒 Secure payment via <span className="font-semibold text-white">Stripe</span>
      </p>
    </div>
  );
}

export default Pricing;