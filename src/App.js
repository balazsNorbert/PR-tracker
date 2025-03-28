import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LogBook from './components/LogBook';
import MacroTracker from './components/MacroTracker';
import Profile from './components/Profile';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ChartByExercise from './components/ChartByExercise';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DarkModeProvider } from './contexts/DarkModeContext';
import TokenChecker from './components/TokenChecker';
import ScrollToTop from './components/ScrollToTop';
import Success from './components/Success';
import Cancel from './components/Cancel';

function App() {
  return (
    <DarkModeProvider>
      <div className="bg-gradient-to-r from-teal-600 dark:from-teal-800 to-teal-900 dark:to-teal-950 text-white relative">
        <Router>
            <ScrollToTop />
            <TokenChecker />
            <ToastContainer />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logbook" element={<LogBook />} />
              <Route path="/nutrition-tracker" element={<MacroTracker />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/exercise/:name" element={<ChartByExercise />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Routes>
            <Footer />
        </Router>
      </div>
    </DarkModeProvider>
  );
}

export default App;
