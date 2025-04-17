import React from "react";
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
    freeplayMode,
    normalMode,
    openGames,
    myActiveGames,
    myCompletedGames,
    otherGames,
    myOpenGames,
  } = useGameContext();
  return (
    <>
      <Navbar />
      <div className="container game-container">
        <h1>Types of Games</h1>
        <p>Choose a game type to play!</p>
        {/* <div className="button-container">
          <Link to="/game/freeplay">
            <button type="button" className="btn btn-info game-btn">
              Freeplay
            </button>
          </Link>
        </div> */}
        <div className="accordion accordion-flush" id="accordionExample">
          <GameItem
            header="Freeplay"
            id="freeplay"
            content="Freeplay mode"
            gamefunction={freeplayMode}
          />
          <GameItem
            header="Normal"
            id="normal"
            content="NormalMode"
            gamefunction={normalMode}
          />
          <GameItem
            header="Start Game"
            id="startgame"
            content="Start a new game"
            gamefunction={createGame}
          />
          <GameItem
            header="Open Games"
            id="opengames"
            content="Open games that you can join"
            gamefunction={openGames}
          />
          <GameItem
            header="My Open Games"
            id="myopengames"
            content=""
            gamefunction={myOpenGames}
          />
          <GameItem
            header="My Active Games"
            id="myactivegames"
            content="Active games that you are playing"
            gamefunction={myActiveGames}
          />
          <GameItem
            header="My Completed Games"
            id="mycompletedgames"
            content="Games that you have completed"
            gamefunction={myCompletedGames}
          />
          <GameItem
            header="Other Games"
            id="othergames"
            content="Other games that you have played"
            gamefunction={otherGames}
          />
        </div>
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
