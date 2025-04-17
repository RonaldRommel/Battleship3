import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
// import { NormalProvider, useNormalContext } from "../context/NormalContext";
import {
  MultiGameProvider,
  useMultiGameContext,
} from "../context/MultiGameContext";
import Board from "../components/Board";
import Modal from "../components/Modal";
import Timer from "../components/Timer";
import RefreshButton from "../components/RefreshBtn";
import "../index.css";

function Multiplayer() {
  const {
    showModal,
    closeModal,
    modalTitle,
    modalContent,
    startTimer,
    getButtonClass,
  } = useMultiGameContext();
  const { myBoard, handleMyBoardClick, myShipRandom, myBoardUI } =
    useMultiGameContext();
  const { opBoardUI, handleOpBoardClick, myShipsSunk, opShipsSunk } =
    useMultiGameContext();
  const [buildShipModal, setShipModal] = useState(true);
  const closeBuildShipModal = () => {
    if (!hasBoardChanged()) {
      alert("Please place your ship on the board!");
      return;
    } else {
      setShipModal(false);
      startTimer();
    }
  };
  const { timeElapsed } = useMultiGameContext();
  function hasBoardChanged() {
    return myBoard.some((row) => row.some((cell) => cell !== 0));
  }

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{ filter: buildShipModal || showModal ? "blur(5px)" : "none" }}
      >
        <h1 className="large-title">Normal Game</h1>
        <Timer timeElapsed={timeElapsed} />
        <div className="board-wrapper">
          <div>
            <h2 className="small-title">Opponent Board</h2>
            <Board
              cellStates={opBoardUI}
              handleCellClick={handleOpBoardClick}
              getButtonClass={getButtonClass}
            />
            <h2 className="small-title">My Board</h2>
            <Board
              cellStates={myBoardUI}
              handleCellClick={handleMyBoardClick}
              getButtonClass={getButtonClass}
            />
          </div>
        </div>

        <RefreshButton />
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
  );
}

export default function MultiplayerFunction() {
  return (
    <MultiGameProvider>
      <Multiplayer />
    </MultiGameProvider>
  );
}
