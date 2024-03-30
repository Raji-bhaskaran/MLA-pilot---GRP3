import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NavbarComponent = ({ onLogout, colorAccessibility }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const NavButton = ({ onClick, route, children }) => (
    <button
      onClick={onClick}
      className={
        pathname === route
          ? `${
              colorAccessibility ? "bg-[#330813]" : "bg-red-pink-dark"
            } text-white w-full px-4 py-2`
          : `${
              colorAccessibility
                ? "bg-[#880125]  hover:bg-[#330813]"
                : "bg-red-pink  hover:bg-red-pink-dark"
            } text-white w-full px-4 py-2`
      }
    >
      {children}
    </button>
  );

  const onNavigate = (route) => {
    console.log("Navigating to:", route);
    navigate(route);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="flex w-full justify-around">
      <NavButton onClick={() => onNavigate("/dashboard")} route="/dashboard">
        Dashboard
      </NavButton>
      <NavButton
        onClick={() => onNavigate("/trackExercise")}
        route="/trackExercise"
      >
        Track New Exercise
      </NavButton>
      <NavButton onClick={() => onNavigate("/statistics")} route="/statistics">
        Statistics
      </NavButton>
      <NavButton onClick={() => onNavigate("/journal")} route="/journal">
        Weekly Journal
      </NavButton>
      <NavButton onClick={handleLogout} route="/">
        Logout
      </NavButton>
    </div>
  );
};

export default NavbarComponent;
