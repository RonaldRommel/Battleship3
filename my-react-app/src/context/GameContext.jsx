import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameContext = createContext();

const GameProvider = ({ children }) => {
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
      const newGame = await axios.post("/api/game/newgame", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game. Please try again.");
    }
  };

  const openGames = async () => {
    try {
      const res = await axios.get("/api/game/open", {
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
      const res = await axios.get("/api/game/myopen", {
        withCredentials: true,
      });
      const openGames = res.data.games;
      return openGames;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const myActiveGames = async () => {
    try {
      const res = await axios.get("/api/game/myactive", {
        withCredentials: true,
      });
      const openGames = res.data.games;
      return openGames;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const myCompletedGames = async () => {
    try {
      const res = await axios.get("/api/game/mycompleted", {
        withCredentials: true,
      });
      const openGames = res.data.games;
      return openGames;
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const otherGames = async () => {};

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
