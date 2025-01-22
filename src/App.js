import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logbook" element={<LogBook />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
const Home = () => <div>Welcome to your Training Logbook!</div>;
const LogBook = () => <div>Your Training Log</div>;
const Profile = () => <div>Your Profile</div>;

export default App;
