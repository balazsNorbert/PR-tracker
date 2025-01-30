import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LogBook from './components/LogBook';
import Profile from './components/Profile';
import ChartByExercise from './components/ChartByExercise';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logbook" element={<LogBook />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/exercise/:name" element={<ChartByExercise />} />
      </Routes>
    </Router>
  );
}

export default App;
