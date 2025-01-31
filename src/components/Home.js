import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col gap-8 items-center h-screen justify-center text-white mx-10">
      <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-center ">Welcome to your Training Logbook!</h1>
      <p className="text-2xl md:text-3xl xl:text-4xl font-semibold text-center">Track your progress and stay motivated to reach your fitness goals.</p>
      <button className="bg-gray-700 hover:bg-teal-500 font-semibold text-xl xl:text-2xl py-3 px-6 rounded-lg transition duration-300"><Link to="/logbook">Go To LogBook</Link></button>
      <div className="flex flex-col gap-3 italic text-center font-medium text-xl md:2xl xl:text-3xl">
        <p>
          "Success is the sum of small efforts, repeated day in and day out."
        </p>
        <p>
          "The body achieves what the mind believes."
        </p>
      </div>
      <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-2xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Track Your Workouts?</h2>
        <ul className="space-y-3 text-lg">
          <li>✅ <strong>Track Your Progress</strong> - Monitor your weights, reps, and exercises to see how far you've come.</li>
          <li>✅ <strong>Stay Motivated</strong> - Seeing your progress over time keeps you engaged and motivated.</li>
          <li>✅ <strong>Optimize Your Training</strong> - Analyze your data and make smarter workout decisions.</li>
          <li>✅ <strong>Avoid Plateaus</strong> - Identify when progress slows down and make adjustments to keep improving.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;