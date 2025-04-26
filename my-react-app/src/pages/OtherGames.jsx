import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function OtherGames() {
  
  const [games] = useState([
    {
      _id: "game123456",
      user: "Player1",
      opponent: "Player2",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: "game789012",
      user: "Player3",
      opponent: "Player4",
      completed: true,
      winner: "Player3",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      endedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const activeGames = games.filter(game => !game.completed);
  const completedGames = games.filter(game => game.completed);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold mb-3">Other Games</h1>
          <div className="d-flex justify-content-center gap-3">
            <span className="badge bg-success fs-5 py-2 px-3">
              Active Games: {activeGames.length}
            </span>
            <span className="badge bg-secondary fs-5 py-2 px-3">
              Completed Games: {completedGames.length}
            </span>
          </div>
        </div>

        <div className="game-list">
          
          {activeGames.length > 0 && (
            <>
              <h3 className="mt-4 mb-3">Active Games</h3>
              {activeGames.map((game, index) => (
                <div key={game._id} className="card mb-3">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Game #{index + 1}</h5>
                      <span className="badge bg-success">Active</span>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <strong>Player 1:</strong> {game.user}
                        </div>
                        <div className="mb-2">
                          <strong>Player 2:</strong> {game.opponent}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-2">
                          <strong>Started:</strong>{" "}
                          {new Date(game.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-secondary me-2">
                          Game ID: {game._id.slice(-6)}
                        </span>
                      </div>
                      <Link
                        to={`/game/view/${game._id}`}
                        className="btn btn-primary"
                      >
                        Spectate Game
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          
          {completedGames.length > 0 && (
            <>
              <h3 className="mt-5 mb-3">Completed Games</h3>
              {completedGames.map((game, index) => (
                <div key={game._id} className="card mb-3">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Game #{index + 1}</h5>
                      <span className="badge bg-secondary">Completed</span>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="mb-2">
                          <strong>Player 1:</strong> {game.user}
                        </div>
                        <div className="mb-2">
                          <strong>Player 2:</strong> {game.opponent}
                        </div>
                        {game.winner && (
                          <div className="mb-2">
                            <strong>Winner:</strong> <span className="text-success">{game.winner}</span>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <div className="mb-2">
                          <strong>Started:</strong>{" "}
                          {new Date(game.createdAt).toLocaleString()}
                        </div>
                        {game.endedAt && (
                          <div>
                            <strong>Ended:</strong>{" "}
                            {new Date(game.endedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-secondary me-2">
                          Game ID: {game._id.slice(-6)}
                        </span>
                      </div>
                      <Link
                        to={`/game/view/${game._id}`}
                        className="btn btn-primary"
                      >
                        View Game
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          
          {games.length === 0 && (
            <div className="alert alert-info p-4 fs-5 text-center">
              There are no other games available to view at the moment.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
