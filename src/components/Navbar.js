import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 bg-gray-700 flex justify-between items-center text-white py-4 px-5 md:px-10">
      <h1 className="text-2xl md:text-3xl font-bold">PR Tracker</h1>
      <button className="block md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
        {isOpen ? (
        <span class="material-icons">
          close
        </span>
        ) : (
        <span class="material-icons">
          menu
        </span>
        )}
      </button>
      <ul className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute top-14
      right-0 pr-5 md:pr-0 pb-5 md:pb-0 md:relative md:top-0 gap-6 lg:gap-10 text-xl lg:text-2xl text-right
      bg-gray-700 md:bg-transparent w-full md:w-fit z-10`}>
        <li className="hover:text-teal-500">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-teal-500">
          <Link to="/logbook">LogBook</Link>
        </li>
        <li className="hover:text-teal-500">
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;