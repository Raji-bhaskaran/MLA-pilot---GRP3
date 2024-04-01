import React from "react";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "./components/navbar";
import TrackExercise from "./components/trackExercise";
import Statistics from "./components/statistics";
import Footer from "./components/footer";
import Login from "./components/login";
import Signup from "./components/signup";
import Journal from "./components/journal";
import Dashboard from "./components/dashboard";
import logo from "./img/CFG_logo.png";
import { FormControlLabel, Switch } from "@material-ui/core";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [fontSize, setFontSize] = useState("text-base");
  const [colorAccessibility, setColorAccessibility] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser("");
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const toggleFontSize = () => {
    setFontSize(fontSize === "text-base" ? "text-[32px]" : "text-base");
  };

  const handleColorAccessibilityChange = (event) => {
    setColorAccessibility(event.target.checked);
  };

  return (
    <div className={`bg-grey min-h-svh ${fontSize}`}>
      <div
        className={`text-center ${
          fontSize === "text-[32px]" ? "max-w-screen-lg" : "max-w-screen-md"
        } m-auto p-5`}
      >
        <Router>
          <div className="flex justify-around my-10 items-center">
            <h1
              className={`${
                colorAccessibility ? "text-[#880125]" : "text-red-pink"
              }`}
            >
              MLA Fitness App
            </h1>
            <img src={logo} alt="CFG Fitness App Logo" className="w-20" />
          </div>
          <div className="mb-6">
            <p className="m-0">Accessibility</p>
            <FormControlLabel
              control={
                <Switch
                  onChange={toggleFontSize}
                  checked={fontSize === "text-[32px]"}
                />
              }
              label="Font"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={colorAccessibility}
                  onChange={handleColorAccessibilityChange}
                />
              }
              label="Colour"
            />
          </div>

          {isLoggedIn && (
            <NavbarComponent
              onLogout={handleLogout}
              colorAccessibility={colorAccessibility}
            />
          )}

          <div className="bg-grey-700 rounded-b-2xl drop-shadow-md">
            <Routes>
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" />
                  ) : (
                    <Login
                      onLogin={handleLogin}
                      colorAccessibility={colorAccessibility}
                    />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" />
                  ) : (
                    <Signup
                      onSignup={(username) => {
                        setIsLoggedIn(true);
                        setCurrentUser(username);
                      }}
                      colorAccessibility={colorAccessibility}
                    />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isLoggedIn ? (
                    <Dashboard
                      currentUser={currentUser}
                      chartSize={fontSize === "text-[32px]" ? "big" : "regular"}
                      colorAccessibility={colorAccessibility}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/trackExercise"
                element={
                  isLoggedIn ? (
                    <TrackExercise
                      currentUser={currentUser}
                      colorAccessibility={colorAccessibility}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/statistics"
                element={
                  isLoggedIn ? (
                    <Statistics currentUser={currentUser} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/journal"
                element={
                  isLoggedIn ? (
                    <Journal
                      currentUser={currentUser}
                      colorAccessibility={colorAccessibility}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </div>
  );
}

export default App;
