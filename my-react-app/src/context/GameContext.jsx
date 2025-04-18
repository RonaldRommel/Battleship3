// Import necessary hooks and functions from React
import React, { createContext, useState, useContext } from "react";
// Import useNavigate hook from react-router-dom for programmatic navigation
import { useNavigate } from "react-router-dom";
// Import axios for making HTTP requests to the backend server
import axios from "axios";

// Create a new Context object that will hold game-related state and functions
const GameContext = createContext();

// Define the GameProvider component that will wrap parts of the application
// It accepts children props which are the components that will have access to the game context
const GameProvider = ({ children }) => {
  // Get the navigate function from react-router-dom to handle navigation between routes
  const navigate = useNavigate();

  const navigateToPage = (val) => {
    switch (val) {
      case "freeplay":
        navigate("/game/freeplay");
        break;
      case "normal":
        navigate("/game/normal");
        break;
      case "openGames":
        navigate("/game/open-games");
        break;
      case "myOpenGames":
        navigate("/game/my-open-games");
        break;
      case "myActiveGames":
        navigate("/game/my-active-games");
        break;
      case "myCompletedGames":
        navigate("/game/my-completed-games");
        break;
      case "otherGames":
        navigate("/game/other-games");
        break;
      default:
        console.log("unknownPage");
    }
  };

  const createGame = async () => {
    try {
      // Make a POST request to create a new game
      // withCredentials ensures the user's session cookie is sent with the request
      const newGame = await axios.post("/api/game/newgame", {
        withCredentials: true,
      });
      // Note: The response isn't being used here, which might be an oversight
    } catch (error) {
      // Log any errors that occur during game creation
      console.error("Error creating game:", error);
      // Alert the user about the error
      alert("Error creating game. Please try again.");
    }
  };
  const openGames = async () => {};
  
  // Function to fetch games created by the current user that are waiting for opponents
  const myOpenGames = async () => {
    try {
      // Make a GET request to fetch the user's open games
      const res = await axios.get("/api/game/myopen", {
        withCredentials: true,
      });
      // Extract the games array from the response
      const openGames = res.data.games;
      // Log the open games to the console (for debugging)
      console.log("Open games:", openGames);
      // Note: The games aren't being stored in state, which might be an oversight
    } catch (error) {
      // Log any errors that occur during the fetch
      console.error("Error fetching open games:", error);
      // Alert the user about the error
      alert("Error fetching open games. Please try again.");
    }
  };
  
  // Function stub for fetching games that the user is currently playing
  const myActiveGames = async () => {};
  
  // Function stub for fetching games that the user has completed
  const myCompletedGames = async () => {};
  
  // Function stub for fetching games created by other users
  // This would likely show games the user could join
  const otherGames = async () => {};

  // Return the GameContext.Provider component with the value prop containing
  // all the game-related functions
  return (
    <GameContext.Provider
      value={{
        navigateToPage,
        createGame,
        openGames,
        myActiveGames,
        myCompletedGames,
        otherGames,
        myOpenGames,
      }}
    >
      {/* Render all the child components that need access to the game context */}
      {children}
    </GameContext.Provider>
  );
};

// Create a custom hook that makes it easier to use the game context
// This allows components to access the game context without having to use useContext directly
const useGameContext = () => useContext(GameContext);

// Export both the provider component and the custom hook
export { GameProvider, useGameContext };









// import React, { createContext, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const GameContext = createContext();

// const GameProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const freeplayMode = () => {
//     navigate("/game/freeplay");
//   };
//   const normalMode = () => {
//     navigate("/game/normal");
//   };
//   const createGame = async () => {
//     try {
//       const newGame = await axios.post("/api/game/newgame", {
//         withCredentials: true,
//       });
//     } catch (error) {
//       console.error("Error creating game:", error);
//       alert("Error creating game. Please try again.");
//     }
//   };
//   const openGames = async () => {};
//   const myOpenGames = async () => {
//     try {
//       const res = await axios.get("/api/game/myopen", {
//         withCredentials: true,
//       });
//       const openGames = res.data.games;
//       console.log("Open games:", openGames);
//     } catch (error) {
//       console.error("Error fetching open games:", error);
//       alert("Error fetching open games. Please try again.");
//     }
//   };
//   const myActiveGames = async () => {};
//   const myCompletedGames = async () => {};
//   const otherGames = async () => {};

//   return (
//     <GameContext.Provider
//       value={{
//         createGame,
//         freeplayMode,
//         normalMode,
//         openGames,
//         myActiveGames,
//         myCompletedGames,
//         otherGames,
//         myOpenGames,
//       }}
//     >
//       {children}
//     </GameContext.Provider>
//   );
// };

// const useGameContext = () => useContext(GameContext);

// export { GameProvider, useGameContext };
