import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const navigate = useNavigate();

  const freeplayMode = () => {
    navigate("/game/freeplay");
  };
  const normalMode = () => {
    navigate("/game/normal");
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
  const openGames = async () => {};
  const myOpenGames = async () => {
    try {
      const res = await axios.get("/api/game/myopen", {
        withCredentials: true,
      });
      const openGames = res.data.games;
      console.log("Open games:", openGames);
    } catch (error) {
      console.error("Error fetching open games:", error);
      alert("Error fetching open games. Please try again.");
    }
  };
  const myActiveGames = async () => {};
  const myCompletedGames = async () => {};
  const otherGames = async () => {};

  return (
    <GameContext.Provider
      value={{
        createGame,
        freeplayMode,
        normalMode,
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
