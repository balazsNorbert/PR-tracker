import React from 'react';

const Footer = () => {
  return (
    <footer className="flex flex-col gap-3 relative mt-auto w-full bg-gray-900 text-center p-4">
      <p className="italic font-serif">"Success is the sum of small efforts, repeated day in and day out."</p>
      <p className="text-sm">&copy; {new Date().getFullYear()} Workout Tracker. All rights reserved.</p>
    </footer>
  )
}

export default Footer;