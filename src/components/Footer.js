import React from 'react';

const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full bg-gray-900 text-white text-center p-4">
      <p className="text-sm">&copy; {new Date().getFullYear()} PR Tracker. All rights reserved.</p>
    </footer>
  )
}

export default Footer;