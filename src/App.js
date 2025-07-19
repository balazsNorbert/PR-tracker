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
import WhatToEatBeforeWorkout from './components/Tips/WhatToEatBeforeWorkout';
import WhatToEatAfterWorkout from './components/Tips/WhatToEatAfterWorkout';
import WhyYouAreNotBuildingMuscle from './components/Tips/WhyYouAreNotBuildingMuscle';
import HowLongShouldYourWorkoutsBe from './components/Tips/HowLongShouldYourWorkoutsBe';
import HowManyDaysAWeekShouldYouWorkout from './components/Tips/HowManyDaysAWeekShouldYouWorkout';
import ShouldYouWorkoutEveryDay from './components/Tips/ShouldYouWorkoutEveryDay';
import HowLongShouldYouRestBetweenSets from './components/Tips/HowLongShouldYouRestBetweenSets';
import ShouldYouDoCardioBeforeOrAfterWeights from './components/Tips/ShouldYouDoCardioBeforeOrAfterWeights';
import WhatIsProgressiveOverload from './components/Tips/WhatIsProgressiveOverload';
import BestTimeToWorkout from './components/Tips/BestTimeToWorkout';
import ShouldYouTrainToFailureEverySet from './components/Tips/ShouldYouTrainToFailureEverySet';
import LoseFatAndGainMuscle from './components/Tips/LoseFatAndGainMuscle';
import BestWorkoutSplitForBeginners from './components/Tips/BestWorkoutSplitForBeginners';
import BestWorkoutSplit from './components/Tips/BestWorkoutSplit';
import HowHeavyShouldYouLift from './components/Tips/HowHeavyShouldYouLift';
import TrainMuscleTwiceAWeek from './components/Tips/TrainMuscleTwiceAWeek';
import MuscleSorenessAndGrowth from './components/Tips/MuscleSorenessAndGrowth';
import HowManyExercisesPerMuscle from './components/Tips/HowManyExercisesPerMuscle';
import StrengthVsHypertrophy from './components/Tips/StrengthVsHypertrophy';
import CompoundVsIsolation from './components/Tips/CompoundVsIsolation';
import FreeWeightsVsMachines from './components/Tips/FreeWeightsVsMachines';

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
                <Route path="what-to-eat-before-workout" element={<WhatToEatBeforeWorkout />} />
                <Route path="what-to-eat-after-workout" element={<WhatToEatAfterWorkout />} />
                <Route path="why-you-are-not-building-muscle" element={<WhyYouAreNotBuildingMuscle />} />
                <Route path="how-long-should-your-workouts-be" element={<HowLongShouldYourWorkoutsBe />} />
                <Route path="how-many-days-a-week-should-you-workout" element={<HowManyDaysAWeekShouldYouWorkout />} />
                <Route path="should-you-workout-every-day" element={<ShouldYouWorkoutEveryDay />} />
                <Route path="how-long-should-you-rest-between-sets" element={<HowLongShouldYouRestBetweenSets />} />
                <Route path="should-you-do-cardio-before-or-after-weights" element={<ShouldYouDoCardioBeforeOrAfterWeights />} />
                <Route path="what-is-progressive-overload" element={<WhatIsProgressiveOverload />} />
                <Route path="best-time-to-workout" element={<BestTimeToWorkout />} />
                <Route path="should-you-train-to-failure-every-set" element={<ShouldYouTrainToFailureEverySet />} />
                <Route path="can-you-lose-fat-and-gain-muscle" element={<LoseFatAndGainMuscle />} />
                <Route path="best-workout-split-for-beginners" element={<BestWorkoutSplitForBeginners />} />
                <Route path="best-workout-split" element={<BestWorkoutSplit />} />
                <Route path="how-heavy-should-you-lift" element={<HowHeavyShouldYouLift />} />
                <Route path="train-muscle-twice-a-week" element={<TrainMuscleTwiceAWeek />} />
                <Route path="muscle-soreness-and-growth" element={<MuscleSorenessAndGrowth />} />
                <Route path="how-many-exercises-per-muscle" element={<HowManyExercisesPerMuscle />} />
                <Route path="strength-vs-hypertrophy" element={<StrengthVsHypertrophy />} />
                <Route path="compound-vs-isolation-exercises" element={<CompoundVsIsolation />} />
                <Route path="free-weights-vs-machines" element={<FreeWeightsVsMachines />} />
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
