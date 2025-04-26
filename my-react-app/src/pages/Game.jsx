import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Board from "../components/Board";
import GameItem from "../components/GameItem";
import { useAuthContext } from "../context/AuthContext";
import { useGameContext, GameProvider } from "../context/GameContext";

function Game() {
  const { isAuthenticated } = useAuthContext();
  const {
    createGame,
    openGames,
    myActiveGames,
    myCompletedGames,
    otherGames,
    myOpenGames,
    navigateToPage,
  } = useGameContext();

  useEffect(() => {});
  return (
    <>
      <Navbar />
      <div className="container game-container">
        <h1>Types of Games</h1>
        <p>Choose a game type to play!</p>
        <ul className="list-group">
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("freeplay");
            }}
          >
            Freeplay
          </button>
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("normal");
            }}
          >
            Normal
          </button>

          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("multiplayer");
            }}
          >
            Create Multiplayer Game
          </button>
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("openGames");
            }}
          >
            Open Games
          </button>
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("myOpenGames");
            }}
          >
            My Open Games
          </button>
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("myActiveGames");
            }}
          >
            My Active Games
          </button>
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("myCompletedGames");
            }}
          >
            My Completed Games
          </button>
          <button
            type="button"
            className="list-group-item"
            onClick={() => {
              navigateToPage("otherGames");
            }}
          >
            Other Games
          </button>
        </ul>
      </div>
    </>
  );
}

export default function GameWithContext() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
