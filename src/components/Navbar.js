import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-gray-700  shadow-xl flex justify-between items-center px-5 lg:px-10 z-10">
      <div className="h-14 lg:h-20 flex items-center overflow-hidden">
        <Link to="/">
          <img src="/images/workout-tracker-logo-white.webp" alt="Workout Tracker logo" className="hover:scale-110 h-28 lg:h-40 object-contain" />
        </Link>
      </div>
      <button className="block lg:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
        {isOpen ? (
        <span className="material-icons">
          close
        </span>
        ) : (
        <span className="material-icons">
          menu
        </span>
        )}
      </button>
      <ul className={`${isOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row absolute top-14
      right-0 pr-5 lg:pr-0 pb-5 lg:pb-0 lg:relative lg:top-0 gap-6 lg:gap-10 text-xl xl:text-2xl text-right
      bg-gray-700 lg:bg-transparent w-full lg:w-fit z-10`}>
        <li className="hover:text-teal-500">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
        </li>
        <li className="hover:text-teal-500">
          <Link to="/logbook" onClick={handleLinkClick}>LogBook</Link>
        </li>
        <li className="hover:text-teal-500">
          <Link to="/nutrition-tracker" onClick={handleLinkClick}>Nutrition tracker</Link>
        </li>
        <li className="hover:text-teal-500">
          <Link to="/tips" onClick={handleLinkClick}>Tips</Link>
        </li>
        <li className="hover:text-teal-500">
          <Link to="/profile" onClick={handleLinkClick}>Profile</Link>
        </li>
        <li className="flex gap-1 items-center ml-auto">
          {!user ? (
            <>
              <Link className="hover:text-teal-500" to="/login" onClick={handleLinkClick}>Login</Link>
              /
              <Link className="hover:text-teal-500" to="/register" onClick={handleLinkClick}>Register</Link>
            </>
          )
          :(
            <button className="hover:text-teal-500" onClick={() => {handleLogout();handleLinkClick();}}>Logout</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;