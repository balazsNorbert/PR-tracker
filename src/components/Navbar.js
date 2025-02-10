import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

   if(token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setUser(decodedToken);
    } catch (error) {
      console.error("Invalid token", error);
      setUser(null);
    }
   } else {
    setUser(null);
   }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 bg-gray-700 flex justify-between items-center py-4 px-5 md:px-10 z-10">
      <h1 className="text-2xl md:text-3xl font-bold hover:text-teal-500"><Link to="/">Workoutracker</Link></h1>
      <button className="block md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
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
        {!user ? (
          <div className="flex gap-1 items-center ml-auto">
            <li className="hover:text-teal-500"><Link to="/login">Login</Link></li>
            /
            <li className="hover:text-teal-500"><Link to="/register">Register</Link></li>
          </div>
        )
        :(
          <li className="hover:text-teal-500"><button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;