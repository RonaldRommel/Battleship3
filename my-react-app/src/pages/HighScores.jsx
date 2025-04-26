import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../App.css";
import { useAuthContext, AuthProvider } from "../context/AuthContext";
import axios from "axios";
function Highscore() {
  const [highScores, setHighScores] = useState([]);
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    const fetchHighScores = async () => {
      try {
        const response = await axios.get("/api/game/highscores");
        if (response.data && response.data.highscores) {
          setHighScores(response.data.highscores);
        }
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
    };

    fetchHighScores();
  }, []);

  const sortedScores = highScores.sort((a, b) => b.score - a.score);

  return (
    <>
      <Navbar />
      {isAuthenticated && (
        <div className="container">
          <h1>HighScores</h1>
          <p>These are the top scores</p>
          <table className="highscore-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score, index) => (
                <tr
                  key={index}
                  style={{
                    fontWeight: score.id === user.id ? "bold" : "normal",
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{score.username}</td>
                  <td>{score.wins}</td>
                  <td>{score.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isAuthenticated && (
        <div className="container">
          <h1>HighScores</h1>
          <p>These are the top scores</p>
          <table className="highscore-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score.username}</td>
                  <td>{score.wins}</td>
                  <td>{score.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function HighscorePage() {
  return (
    <AuthProvider>
      <Highscore />
    </AuthProvider>
  );
}
