import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyCompletedGames() {
  const [completedGames, setCompletedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Extract user ID from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setCurrentUserId(payload.id);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }

    const fetchMyCompletedGames = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get("http://localhost:3000/api/game/mycompleted", {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.games) {
          setCompletedGames(response.data.games);
        } else {
          setCompletedGames([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching completed games:", err);
        setError(`Failed to fetch completed games: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchMyCompletedGames();
  }, []);

  // Determine if current user won the game
  const didUserWin = (game) => {
    if (!currentUserId) return "Unknown";
    
    // Check if user is the winner
    if (game.winner === currentUserId) {
      return true;
    } else if (game.winner && game.winner !== currentUserId) {
      return false;
    } else {
      return "Draw"; // In case there's no winner (draw)
    }
  };

  // Get opponent name based on whether user is creator or opponent
  const getOpponentName = (game) => {
    if (!currentUserId) return "Unknown";
    
    if (game.userID === currentUserId) {
      return game.opponent;
    } else {
      return game.user;
    }
  };

  // Format the game result as a readable string
  const formatGameResult = (game) => {
    const result = didUserWin(game);
    if (result === true) {
      return "Victory";
    } else if (result === false) {
      return "Defeat";
    } else if (result === "Draw") {
      return "Draw";
    } else {
      return "Unknown";
    }
  };

  // Get appropriate badge color based on game result
  const getResultBadgeClass = (game) => {
    const result = didUserWin(game);
    if (result === true) {
      return "bg-success";
    } else if (result === false) {
      return "bg-danger";
    } else {
      return "bg-secondary";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold mb-3">My Completed Games</h1>
          <span className="badge bg-info fs-5 py-2 px-3">
            Completed Games: {completedGames.length}
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
            {completedGames.length === 0 ? (
              <div className="alert alert-info p-4 fs-5 text-center">
                You don't have any completed games yet. Play some games to see your history here!
              </div>
            ) : (
              <div className="game-list">
                {completedGames.map((game, index) => (
                  <div key={game._id} className="card mb-3">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Game #{index + 1}</h5>
                        <span className={`badge ${getResultBadgeClass(game)}`}>
                          {formatGameResult(game)}
                        </span>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Opponent:</strong> {getOpponentName(game)}
                          </div>
                          <div className="mb-2">
                            <strong>Your Role:</strong> {game.userID === currentUserId ? 'Creator' : 'Opponent'}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Started:</strong> {new Date(game.createdAt).toLocaleString()}
                          </div>
                          <div>
                            <strong>Ended:</strong> {new Date(game.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="badge bg-secondary me-2">Game ID: {game._id.substring(0, 6)}</span>
                        </div>
                        <Link 
                          to={`/game/${game._id}`} 
                          className="btn btn-outline-primary"
                        >
                          View Game
                        </Link>
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









// import React from "react";

// export default function MyCompletedGames() {
//   return <div>My Completed Games</div>;
// }
