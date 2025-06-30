import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LogBook from './components/LogBook';
import MacroTracker from './components/MacroTracker';
import Tips from './components/Tips';
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
import AdminDashboard from './components/AdminDashboard';
import HowToAvoidPlateaus from './components/Tips/HowToAvoidPlateaus';
import WhyTrackNutrition from './components/Tips/WhyTrackNutrition';
import WhyTrackWorkouts from './components/Tips/WhyTrackWorkouts';
import HowToStayConsistentWorkingOut from './components/Tips/HowToStayConsistentWorkingOut';
import HowToWarmUpBeforeWorkout from './components/Tips/HowToWarmUpBeforeWorkout';
import HowMuchProteinYouNeed from './components/Tips/HowMuchProteinYouNeed';

const TipsLayout = () => <Outlet />;

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
              <Route path="/tips" element={<TipsLayout />}>
                <Route index element={<Tips />} />
                <Route path="how-to-avoid-workout-plateaus" element={<HowToAvoidPlateaus />} />
                <Route path="why-track-your-nutrition" element={<WhyTrackNutrition />} />
                <Route path="why-track-your-workouts" element={<WhyTrackWorkouts />} />
                <Route path="how-to-stay-consistent-working-out" element={<HowToStayConsistentWorkingOut />} />
                <Route path="how-to-warm-up-before-workout" element={<HowToWarmUpBeforeWorkout />} />
                <Route path="how-much-protein-you-need" element={<HowMuchProteinYouNeed />} />
              </Route>
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/exercise/:name" element={<ChartByExercise />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <Footer />
        </Router>
      </div>
    </DarkModeProvider>
  );
}

export default App;
