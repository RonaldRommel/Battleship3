import React, { use, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthContext, AuthProvider } from "../context/AuthContext";
import {
  MultiGameProvider,
  useMultiGameContext,
} from "../context/MultiGameContext";
import Board from "../components/Board";
import Modal from "../components/Modal";
import Timer from "../components/Timer";
import "../index.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Multiplayer() {
  const {
    showModal,
    closeModal,
    modalTitle,
    modalContent,
    startTimer,
    getButtonClass,
    turn,
    setTurn,
    formatTimeElapsed,
  } = useMultiGameContext();
  const { myBoard, handleMyBoardClick, myShipRandom, myBoardUI, setGameId } =
    useMultiGameContext();
  const {
    opBoardUI,
    handleOpBoardClick,
    myShipsSunk,
    opShipsSunk,
    updateBoardInDB,
    gameDetails,
    isCreator,
  } = useMultiGameContext();
  const { user, isAuthenticated } = useAuthContext();
  const [buildShipModal, setShipModal] = useState(false);
  const closeBuildShipModal = async () => {
    if (!shipsArePlaced(myBoard)) {
      alert("Please place your ship on the board!");
      return;
    } else {
      updateBoardInDB();
      setTurn(false);
      setShipModal(false);
    }
  };
  const { gameID } = useParams();
  const { timeElapsed } = useMultiGameContext();
  function shipsArePlaced(board) {
    const filledCells = board.reduce((count, row) => {
      return count + row.filter((cell) => cell > 0).length;
    }, 0);
    return filledCells === 17;
  }
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // -1 goes back one page
  };

  useEffect(() => {
    setGameId(gameID);
  }, []);

  useEffect(() => {
    if (gameDetails !== null && gameDetails) {
      if (
        shipsArePlaced(gameDetails.userBoard) &&
        shipsArePlaced(gameDetails.opponentBoard)
      ) {
        startTimer();
      }
      if (isCreator && shipsArePlaced(gameDetails.userBoard)) {
        console.log("Checking if ships are placed...userBoard");
        setShipModal(false);
      } else if (!isCreator && shipsArePlaced(gameDetails.opponentBoard)) {
        console.log("Checking if ships are placed... opponentBoard");
        setShipModal(false);
      } else {
        setShipModal(true);
      }
    }
  }, [gameDetails]);

  return (
    <>
      <Navbar />
      {gameDetails && (
        <>
          <div
            className="container"
            style={{
              filter:
                buildShipModal || showModal || turn === false
                  ? "blur(5px)"
                  : "none",
            }}
          >
            <h1 className="large-title">Multiplayer Game</h1>
            <Timer timeElapsed={formatTimeElapsed(timeElapsed)} />
            <div className="board-wrapper">
              <div>
                <h2 className="small-title">
                  {!isCreator ? gameDetails.user : gameDetails.opponent}'s Board
                </h2>
                <Board
                  cellStates={opBoardUI}
                  handleCellClick={handleOpBoardClick}
                  getButtonClass={getButtonClass}
                />
                <h2 className="small-title">Your Board</h2>
                <Board
                  cellStates={myBoardUI}
                  handleCellClick={handleMyBoardClick}
                  getButtonClass={getButtonClass}
                />
              </div>
            </div>
          </div>
          <Modal
            showModal={showModal}
            closeModal={closeModal}
            title={modalTitle}
            message={modalContent}
          />
          <div
            className={`modal fade ${buildShipModal ? "show" : ""}`}
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden={!buildShipModal}
            style={{ display: buildShipModal ? "block" : "none" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    Build your ship!
                  </h5>
                </div>
                <div className="modal-body">
                  <center>
                    <Board
                      cellStates={myBoard}
                      handleCellClick={handleMyBoardClick}
                      getButtonClass={getButtonClass}
                    />
                  </center>
                </div>
                <button className="btn btn-danger" onClick={myShipRandom}>
                  Random
                </button>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={closeBuildShipModal}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {!buildShipModal &&
        turn === false &&
        gameDetails &&
        gameDetails.winner === null && (
          <div
            className="modal fade show"
            id="waitingForTurnModal"
            tabIndex="-1"
            aria-labelledby="waitingForTurnLabel"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content text-center">
                <div className="modal-body">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h3 className="mt-3">Waiting for opponent's turn...</h3>
                  <button
                    className="btn btn-secondary mt-3"
                    onClick={handleGoBack}
                  >
                    ← Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      {!gameDetails && (
        <div
          className="container d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="alert alert-warning text-center w-100" role="alert">
            <h4 className="alert-heading">Oops! Something went wrong</h4>
            {isAuthenticated && <p>It looks like the game doesn’t exist.</p>}
            {!isAuthenticated && (
              <p>
                It looks like the game doesn’t exist or you might need to log in
                first.
              </p>
            )}
            <hr />
            <Link to="/" className="btn btn-primary mt-2">
              Go to Homepage
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function MultiplayerFunction() {
  return (
    <AuthProvider>
      <MultiGameProvider>
        <Multiplayer />
      </MultiGameProvider>
    </AuthProvider>
  );
}
