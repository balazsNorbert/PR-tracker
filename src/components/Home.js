import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col gap-8 items-center h-screen justify-center mx-10">
      <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-center ">Welcome to your Training Logbook!</h1>
      <p className="text-xl md:text-2xl xl:text-3xl font-semibold text-center">Track your progress and stay motivated to reach your fitness goals.</p>
      <div className="bg-white dark:bg-teal-700 text-black dark:text-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-center">Why Track Your Workouts?</h2>
        <ul className="space-y-3 text-base md:text-xl">
          <li>✅ <strong>Track Your Progress</strong> - Monitor your weights, reps, and exercises to see how far you've come.</li>
          <li>✅ <strong>Stay Motivated</strong> - Seeing your progress over time keeps you engaged and motivated.</li>
          <li>✅ <strong>Optimize Your Training</strong> - Analyze your data and make smarter workout decisions.</li>
          <li>✅ <strong>Avoid Plateaus</strong> - Identify when progress slows down and make adjustments to keep improving.</li>
        </ul>
      </div>
      <button className="bg-gray-700 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-500 font-semibold text-xl xl:text-2xl py-3 px-6 rounded-lg transition duration-300">
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