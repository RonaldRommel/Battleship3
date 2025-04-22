import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function MyOpenGames() {
  const [openGames, setOpenGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOpenGames = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get("http://localhost:3000/api/game/myopen", {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.games) {
          setOpenGames(response.data.games);
        } else {
          setOpenGames([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching open games:", err);
        setError(`Failed to fetch open games: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };

    fetchMyOpenGames();
  }, []);

  const handleJoinGame = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:3000/api/game/joingame/${gameId}`, {}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh the games list after joining
      const response = await axios.get("http://localhost:3000/api/game/myopen", {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.games) {
        setOpenGames(response.data.games);
      }
    } catch (err) {
      setError(`Failed to join game: ${err.response?.data?.message || err.message}`);
      console.error("Error joining game:", err);
    }
  };

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
                        <div className="fw-bold fs-5 mb-2">Game #{index + 1} - Created by: {game.user}</div>
                        <div className="mb-2">
                          <span className="badge bg-secondary me-2">Status: {game.status}</span>
                        </div>
                        <div>
                          <strong>Players:</strong> {game.user} 
                          {game.opponent ? 
                            <span className="text-success"> vs {game.opponent}</span> : 
                            <span className="text-warning"> (Waiting for opponent)</span>
                          }
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">Created: {new Date(game.createdAt).toLocaleString()}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {game.status === "open" && !game.opponent && (
                          <button 
                            className="btn btn-primary me-2"
                            onClick={() => handleJoinGame(game._id)}
                          >
                            Join Game
                          </button>
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














// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import axios from "axios";

// export default function MyOpenGames() {
//   const [openGames, setOpenGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMyOpenGames = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
        
//         const response = await axios.get("http://localhost:3000/api/game/myopen", {
//           withCredentials: true,
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         if (response.data && response.data.games) {
//           setOpenGames(response.data.games);
//         } else {
//           setOpenGames([]);
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching open games:", err);
//         setError(`Failed to fetch open games: ${err.response?.data?.message || err.message}`);
//         setLoading(false);
//       }
//     };

//     fetchMyOpenGames();
//   }, []);

//   const handleJoinGame = async (gameId) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       await axios.post(`http://localhost:3000/api/game/joingame/${gameId}`, {}, {
//         withCredentials: true,
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       // Refresh the games list after joining
//       const response = await axios.get("http://localhost:3000/api/game/myopen", {
//         withCredentials: true,
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data && response.data.games) {
//         setOpenGames(response.data.games);
//       }
//     } catch (err) {
//       setError(`Failed to join game: ${err.response?.data?.message || err.message}`);
//       console.error("Error joining game:", err);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mt-5">
//         {/* Improved header section with larger text and more spacing */}
//         <div className="row mb-4">
//           <div className="col-md-8">
//             <h1 className="display-5 fw-bold">My Open Games</h1>
//           </div>
//           <div className="col-md-4 text-end d-flex align-items-center justify-content-end">
//             <span className="badge bg-info fs-5 py-2 px-3">
//               Total Open Games: {openGames.length}
//             </span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="d-flex justify-content-center my-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="alert alert-danger">{error}</div>
//         ) : (
//           <>
//             {openGames.length === 0 ? (
//               <div className="alert alert-info p-4 fs-5 text-center">
//                 You don't have any open games. Create a new game to get started!
//               </div>
//             ) : (
//               <ol className="list-group list-group-numbered">
//                 {openGames.map((game) => (
//                   <li key={game._id} className="list-group-item d-flex justify-content-between align-items-start p-4">
//                     <div className="ms-2 me-auto">
//                       {/* Better formatted game information */}
//                       <div className="fw-bold fs-5 mb-2">Game created by: {game.user}</div>
//                       <div className="mb-2">
//                         <span className="badge bg-secondary me-2">Status: {game.status}</span>
//                       </div>
//                       <div>
//                         <strong>Players:</strong> {game.user} 
//                         {game.opponent ? 
//                           <span className="text-success"> vs {game.opponent}</span> : 
//                           <span className="text-warning"> (Waiting for opponent)</span>
//                         }
//                       </div>
//                       <div className="mt-2">
//                         <small className="text-muted">Created: {new Date(game.createdAt).toLocaleString()}</small>
//                       </div>
//                     </div>
//                     <div className="d-flex align-items-center">
//                       {/* Consistent button styling */}
//                       {game.status === "open" && !game.opponent && (
//                         <button 
//                           className="btn btn-primary me-2"
//                           onClick={() => handleJoinGame(game._id)}
//                         >
//                           Join Game
//                         </button>
//                       )}
//                       <button className="btn btn-outline-secondary">
//                         Game ID: {game._id.substring(0, 6)}
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// }






// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import axios from "axios";

// export default function MyOpenGames() {
//   const [openGames, setOpenGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMyOpenGames = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("http://localhost:3000/api/game/myopen", {
//           withCredentials: true
//         });
//         setOpenGames(response.data.games);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch open games");
//         setLoading(false);
//         console.error("Error fetching open games:", err);
//       }
//     };

//     fetchMyOpenGames();
//   }, []);

//   const handleJoinGame = async (gameId) => {
//     try {
//       await axios.post(`http://localhost:3000/api/game/joingame/${gameId}`, {}, {
//         withCredentials: true
//       });
//       // Refresh the games list after joining
//       const response = await axios.get("http://localhost:3000/api/game/myopen", {
//         withCredentials: true
//       });
//       setOpenGames(response.data.games);
//     } catch (err) {
//       setError("Failed to join game");
//       console.error("Error joining game:", err);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mt-4">
//         <h2>My Open Games</h2>
//         {loading ? (
//           <p>Loading games...</p>
//         ) : error ? (
//           <div className="alert alert-danger">{error}</div>
//         ) : (
//           <>
//             <div className="mb-3">
//               <span className="badge bg-info">Total Open Games: {openGames.length}</span>
//             </div>
            
//             {openGames.length === 0 ? (
//               <div className="alert alert-info">You don't have any open games. Create a new game to get started!</div>
//             ) : (
//               <ol className="list-group list-group-numbered">
//                 {openGames.map((game) => (
//                   <li key={game._id} className="list-group-item d-flex justify-content-between align-items-start">
//                     <div className="ms-2 me-auto">
//                       <div className="fw-bold">Game created by: {game.user}</div>
//                       <div>Status: {game.status}</div>
//                       <div>
//                         <small className="text-muted">
//                           Players: {game.user} {game.opponent ? `vs ${game.opponent}` : "(Waiting for opponent)"}
//                         </small>
//                       </div>
//                     </div>
//                     <div className="d-flex align-items-center">
//                       {game.status === "open" && !game.opponent && (
//                         <button 
//                           className="btn btn-primary btn-sm me-2"
//                           onClick={() => handleJoinGame(game._id)}
//                         >
//                           Join Game
//                         </button>
//                       )}
//                       <span className="badge bg-primary rounded-pill">ID: {game._id.substring(0, 6)}</span>
//                     </div>
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// }

























// import React from "react";
// import Navbar from "../components/Navbar";

// export default function MyOpenGames() {
//   return (
//     <>
//       <Navbar />
//       <div>MyOpenGames</div>
//       <ol class="list-group list-group-numbered">
//         <li class="list-group-item d-flex justify-content-between align-items-start">
//           <div class="ms-2 me-auto">
//             <div class="fw-bold">Open Game 1</div>
//             Content for list item
//           </div>
//           <span class="badge text-bg-primary rounded-pill">14</span>
//         </li>
//         <li class="list-group-item d-flex justify-content-between align-items-start">
//           <div class="ms-2 me-auto">
//             <div class="fw-bold">Open Game 2</div>
//             Content for list item
//           </div>
//           <span class="badge text-bg-primary rounded-pill">14</span>
//         </li>
//         <li class="list-group-item d-flex justify-content-between align-items-start">
//           <div class="ms-2 me-auto">
//             <div class="fw-bold">Open Game 3</div>
//             Content for list item
//           </div>
//           <span class="badge text-bg-primary rounded-pill">14</span>
//         </li>
//       </ol>
//     </>
//   );
// }
