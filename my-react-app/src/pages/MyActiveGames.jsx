import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyActiveGames() {
  const [activeGames, setActiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyActiveGames = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get("http://localhost:3000/api/game/myactive", {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.allGames) {
          setActiveGames(response.data.allGames);
        } else {
          setActiveGames([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching active games:", err);
        setError(`Failed to fetch active games: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchMyActiveGames();
  }, []);

  // Function to determine if the current user is the creator or opponent
  const isCreator = (game) => {
    const token = localStorage.getItem('token');
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return game.userID === payload.id;
    } catch (e) {
      console.error("Error decoding token:", e);
      return false;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold mb-3">My Active Games</h1>
          <span className="badge bg-success fs-5 py-2 px-3">
            Active Games: {activeGames.length}
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
            {activeGames.length === 0 ? (
              <div className="alert alert-info p-4 fs-5 text-center">
                You don't have any active games. Join or create a game to get started!
              </div>
            ) : (
              <div className="game-list">
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
                            <strong>Creator:</strong> {game.user}
                          </div>
                          <div className="mb-2">
                            <strong>Opponent:</strong> {game.opponent}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Your Role:</strong> {isCreator(game) ? 'Creator' : 'Opponent'}
                          </div>
                          <div>
                            <strong>Started:</strong> {new Date(game.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="badge bg-secondary me-2">Game ID: {game._id.substring(0, 6)}</span>
                        </div>
                        <Link 
                          to={`/game/${game._id}`} 
                          className="btn btn-primary"
                        >
                          Play Game
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
// import Navbar from "../components/Navbar";

// export default function MyActiveGames() {
//   return (
//     <>
//       <Navbar />
//       <div>MyActiveGames</div>
//     </>
//   );
// }
