import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const navigate = useNavigate();

  const navigateToPage = async (val) => {
    switch (val) {
      case "freeplay":
        navigate("/game/freeplay");
        break;
      case "normal":
        navigate("/game/normal");
        break;
      case "multiplayer":
        const res = await axios.post(API+"/api/game/newgame", {
          withCredentials: true,
        });
        console.log("New Game created:", res.data);
        navigate("/game/my-open-games");
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
      const newGame = await axios.post(API+"/api/game/newgame", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game. Please try again.");
    }
  };

  const openGames = async () => {
    try {
      const res = await axios.get(API+"/api/game/open", {
        withCredentials: true,
      });
      const openGames = res.data.games;
      return openGames;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const myOpenGames = async () => {
    try {
      const res = await axios.get(API+"/api/game/myopen", {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const myActiveGames = async () => {
    try {
      const res = await axios.get(API+"/api/game/myactive", {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const myCompletedGames = async () => {
    try {
      const res = await axios.get(API+"/api/game/mycompleted", {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const otherGames = async () => {};

  const playerMove = async () => {
    try {
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };

  const loadPage = async (gameID) => {};

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
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => useContext(GameContext);

export { GameProvider, useGameContext };
