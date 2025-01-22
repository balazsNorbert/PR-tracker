import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-700 flex justify-between items-center text-white text-2xl py-4 px-10">
      <h1 className="text-2xl font-bold">PR Tracker</h1>
      <ul className="flex gap-10">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/logbook">LogBook</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;