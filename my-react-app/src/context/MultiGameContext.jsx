import React, { createContext, useState, useContext, useEffect } from "react";

const BOARD_SIZE = 10; // Size of the board
const SHIP_SIZES = [5, 4, 3, 3, 2]; // Ship sizes
const shipToSink = 17;
const randomness = 0.7;

function AIgame(board) {
  let row = 0,
    col = 0;
  const pick = Math.random() < randomness ? [0] : [2, 3, 4, 5];
  while (true) {
    row = Math.floor(Math.random() * BOARD_SIZE);
    col = Math.floor(Math.random() * BOARD_SIZE);
    if (pick.includes(board[row][col])) {
      return { row: row, col: col };
    }
  }
}

function canPlaceShip(board, shipSize, x, y, direction) {
  if (direction === "H") {
    // Horizontal placement
    if (y + shipSize > BOARD_SIZE) return false;
    for (let i = 0; i < shipSize; i++) {
      if (board[x][y + i] !== 0) return false;
    }
  } else if (direction === "V") {
    // Vertical placement
    if (x + shipSize > BOARD_SIZE) return false;
    for (let i = 0; i < shipSize; i++) {
      if (board[x + i][y] !== 0) return false;
    }
  }
  return true;
}

// Function to place a ship on the board, 1 == ship, 0 == empty
function placeShip(board, shipSize) {
  let placed = false;
  while (!placed) {
    const direction = Math.random() < 0.5 ? "H" : "V";
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);

    if (canPlaceShip(board, shipSize, x, y, direction)) {
      // Place the ship on the board
      if (direction === "H") {
        for (let i = 0; i < shipSize; i++) {
          board[x][y + i] = shipSize;
        }
      } else if (direction === "V") {
        for (let i = 0; i < shipSize; i++) {
          board[x + i][y] = shipSize;
        }
      }
      placed = true;
    }
  }
}

function randomShipPlacement(board, setBoard) {
  const newBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0)
  );
  SHIP_SIZES.forEach((shipSize) => {
    placeShip(newBoard, shipSize);
  });
  setBoard(newBoard);
}

const MultiGameContext = createContext();

const MultiGameProvider = ({ children }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [myShipsSunk, setMyShipsSunk] = useState(0);
  const [opShipsSunk, setOpShipsSunk] = useState(0);

  useEffect(() => {
    if (timerRunning) {
      const timerInterval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timerRunning]);

  //My ship
  const [myBoard, setMyBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  const [myBoardUI, setMyBoardUI] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  //Opponenet ships
  const [opBoard, setOpBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  const [opBoardUI, setOpBoardUI] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
    setTimerRunning(false);
  };

  const startTimer = () => {
    setTimerRunning(true);
  };

  useEffect(() => {
    randomShipPlacement(opBoard, setOpBoard);
  }, []);

  useEffect(() => {
    console.log("OpBoard", opBoard);
  }, [opBoard]);

  const myShipRandom = () => {
    randomShipPlacement(myBoard, setMyBoard);
  };

  const handleMyBoardClick = (r, c) => {};

  function BoardOperation(row, col, board, shipCount, cellStates) {
    if (board[row][col] === 0) {
      cellStates[row][col] = 1;
    } else {
      if (board[row][col] === 2) {
        cellStates[row][col] = 2;
      } else if (board[row][col] === 3) {
        cellStates[row][col] = 3;
      } else if (board[row][col] === 4) {
        cellStates[row][col] = 4;
      } else if (board[row][col] === 5) {
        cellStates[row][col] = 5;
      }
      shipCount((x) => x + 1);
    }
  }

  const handleOpBoardClick = (row, col) => {
    const newOPCellStates = [...opBoardUI];
    BoardOperation(row, col, opBoard, setOpShipsSunk, newOPCellStates);
    setOpBoardUI(newOPCellStates);
    setTimeout(() => {
      const newMyCellStates = [...myBoardUI];
      if (opShipsSunk !== 17 && myShipsSunk < shipToSink) {
        const { row, col } = AIgame(myBoard);
        BoardOperation(row, col, myBoard, setMyShipsSunk, newMyCellStates);
        myBoard[row][col] = 10;
        setMyBoard(myBoard);
        setMyBoardUI(newMyCellStates);
      }
    }, 500);
  };

  useEffect(() => {
    if (opShipsSunk === shipToSink) {
      setModalTitle("Congratulations!");
      setModalContent(`You have sunk all the ships in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    }
  }, [opShipsSunk]);

  useEffect(() => {
    if (myShipsSunk === shipToSink) {
      setModalTitle("Game Over!");
      setModalContent(`You have lost the game in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    }
  }, [myShipsSunk]);

  const getButtonClass = (clicked) => {
    if (clicked === 0) {
      return ""; // Default or Ship cell
    } else if (clicked === 1) {
      return "btn-danger"; // Miss
    } else if (clicked === 2) {
      return "btn-success";
    } else if (clicked === 3) {
      return "btn-warning";
    } else if (clicked === 4) {
      return "btn-primary";
    } else if (clicked === 5) {
      return "btn-info";
    }
    return ""; // In case of any unexpected value
  };

  useEffect(() => {
    if (opShipsSunk === shipToSink || myShipsSunk === shipToSink) {
      setShowModal(true);
    }
  }, [modalTitle, modalContent]);

  return (
    <MultiGameContext.Provider
      value={{
        myBoard,
        handleMyBoardClick,
        timeElapsed,
        myShipRandom,
        myBoardUI,
        opBoardUI,
        handleOpBoardClick,
        myShipsSunk,
        opShipsSunk,
        showModal,
        closeModal,
        modalTitle,
        modalContent,
        startTimer,
        getButtonClass,
      }}
    >
      {children}
    </MultiGameContext.Provider>
  );
};

const useMultiGameContext = () => useContext(MultiGameContext);

export { MultiGameProvider, useMultiGameContext };
