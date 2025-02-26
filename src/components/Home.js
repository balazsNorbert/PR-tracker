import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center mx-5 md:mx-10">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center mt-10">Welcome to your Workout Tracker!</h1>
      <p className="text-lg md:text-xl xl:text-2xl font-semibold text-center">Track your progress and stay motivated to reach your fitness goals</p>
      <div className="bg-white dark:bg-teal-700 text-black dark:text-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-8 text-center">Why Track Your Workouts?</h2>
        <ul className="flex flex-col gap-4 text-base md:text-lg">
          <li>✅ <strong>Track Your Progress</strong> - Monitor your weights, reps, and exercises to see how far you've come.</li>
          <li>✅ <strong>Stay Motivated</strong> - Seeing your progress over time keeps you engaged and motivated.</li>
          <li>✅ <strong>Optimize Your Training</strong> - Analyze your data and make smarter workout decisions.</li>
          <li>✅ <strong>Avoid Plateaus</strong> - Identify when progress slows down and make adjustments to keep improving.</li>
        </ul>
      </div>
      <button className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-500 dark:hover:bg-teal-500 font-semibold text-xl xl:text-2xl
      py-3 px-6 rounded-lg transition duration-300 mb-20">
        <Link to="/logbook" className="flex gap-2 items-center">
          Go To LogBook
          <span className="material-icons">
            arrow_forward
          </span>
        </Link>
      </button>
    </div>
  );
}

export default Home;