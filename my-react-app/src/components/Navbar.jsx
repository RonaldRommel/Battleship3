import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import { useAuthContext, AuthProvider } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, isAuthenticated, handleLogout } = useAuthContext();
  const handleCreateGame = async () => {
    try {
      const newGame = await axios.post("/api/game/newgame", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game. Please try again.");
    }
  };
  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Battleship
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/rules">
                Rules
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/scores">
                Scores
              </NavLink>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/game"
                    onClick={handleCreateGame}
                  >
                    Create Game
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user && user.firstName}
                  </a>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/signup">
                        <button onClick={handleLogout}>Logout</button>
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default function NavbarPage() {
  return (
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
}
