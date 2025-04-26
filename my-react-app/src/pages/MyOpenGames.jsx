import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useGameContext, GameProvider } from "../context/GameContext";
import { Link } from "react-router-dom";

function MyOpenGames() {
  const [openGames, setOpenGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { myOpenGames } = useGameContext();

  useEffect(() => {
    const fetchMyOpenGames = async () => {
      try {
        setLoading(true);
        const response = await myOpenGames();

        if (response.data && response.data.games) {
          console.log("Open games:", response.data.games);
          setOpenGames(response.data.games);
        } else {
          setOpenGames([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching open games:", err);
        setError(
          `Failed to fetch open games: ${
            err.response?.data?.message || err.message
          }`
        );
        setLoading(false);
      }
    };

    fetchMyOpenGames();
  }, []);

  const handleJoinGame = async (gameId) => {};

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {/* Modified header section with count below the heading */}
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold mb-3">My Open Games</h1>
          <span className="badge bg-info fs-5 py-2 px-3">
            Total Open Games: {openGames.length}
          </span>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            {openGames.length === 0 ? (
              <div className="alert alert-info p-4 fs-5 text-center">
                You don't have any open games. Create a new game to get started!
              </div>
            ) : (
              <div className="game-list">
                {openGames.map((game, index) => (
                  <div key={game._id} className="card mb-3">
                    <div className="card-body d-flex justify-content-between align-items-center p-4">
                      <div>
                        <div className="fw-bold fs-5 mb-2">
                          Game #{index + 1} - Created by: {game.user}
                        </div>
                        <div className="mb-2">
                          <span className="badge bg-secondary me-2">
                            Status: {game.status}
                          </span>
                        </div>
                        <div>
                          <strong>Players:</strong> {game.user}
                          {game.opponent ? (
                            <span className="text-success">
                              {" "}
                              vs {game.opponent}
                            </span>
                          ) : (
                            <span className="text-warning">
                              {" "}
                              (Waiting for opponent)
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            Created: {new Date(game.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {game.status === "open" && !game.opponent && (
                          <Link to={`/game/multiplayer/${game._id}`}>
                            <button className="btn btn-primary me-2">
                              Join Game
                            </button>
                          </Link>
                        )}
                        <button className="btn btn-outline-secondary">
                          Game ID: {game._id.substring(0, 6)}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function MyOpenGamesPage() {
  return (
    <GameProvider>
      <MyOpenGames />
    </GameProvider>
  );
}
