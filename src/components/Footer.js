import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-3 relative mt-auto w-full bg-gray-900 text-center p-4">
      <p className="italic font-serif">"Success is the sum of small efforts, repeated day in and day out."</p>
      <div className="flex items-center gap-2">
        <a
          href="https://www.tiktok.com/@workout_tracker_official"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-300 hover:-translate-y-1"
        >
          <img
            src="/svg/tiktok.svg"
            alt="TikTok icon"
            className="h-8 w-8"
          />
        </a>
        <p className="font-bold text-xl">TikTok</p>
      </div>
      <p className="text-sm">&copy; {new Date().getFullYear()} Workout Tracker. All rights reserved.</p>
    </footer>
  )
}

export default Footer;