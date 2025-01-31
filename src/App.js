import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LogBook from './components/LogBook';
import Profile from './components/Profile';
import Footer from './components/Footer';
import ChartByExercise from './components/ChartByExercise';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logbook" element={<LogBook />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/exercise/:name" element={<ChartByExercise />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
