import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/navbar';
import TrackExercise from './components/trackExercise';
import TrackHealth from './components/trackHealth';
import Statistics from './components/statistics';
import Footer from './components/footer';
import Login from './components/login';
import Signup from './components/signup';
import Journal from './components/journal';
import logo from './img/CFG_logo.png'; // Update the path to your logo file

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  return (
    <div className='bg-grey min-h-svh'>
      <div className='text-center max-w-screen-md m-auto p-5'>
        <Router>
          <div className="flex justify-around my-10 items-center">
            <h1 className='text-red-pink'>MLA Fitness App</h1>
            <img src={logo} alt="CFG Fitness App Logo" className='w-20' />
          </div>

          {isLoggedIn && <NavbarComponent onLogout={handleLogout} />}

          <div className="bg-grey-700 rounded-b-2xl drop-shadow-md">
            <Routes>
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
              <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup onSignup={(username) => {
                setIsLoggedIn(true);
                setCurrentUser(username);
              }} />} />
              <Route path="/trackExercise" element={isLoggedIn ? <TrackExercise currentUser={currentUser} /> : <Navigate to="/login" />} />
              <Route path="/trackHealth" element={isLoggedIn ? <TrackHealth currentUser={currentUser} /> : <Navigate to="/login" />} />
              <Route path="/statistics" element={isLoggedIn ? <Statistics currentUser={currentUser} /> : <Navigate to="/login" />} />
              <Route path="/journal" element={isLoggedIn ? <Journal currentUser={currentUser} /> : <Navigate to="/login" />} />
              <Route path="/" element={isLoggedIn ? <Navigate to="/trackExercise" /> : <Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
