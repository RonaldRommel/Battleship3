// Import necessary hooks and functions from React to create and use context
import React, { createContext, useState, useContext, useEffect } from "react";

// Define game constants
const BOARD_SIZE = 10; // Size of the game board (10x10 grid) - used for board initialization and boundary checks
const SHIP_SIZES = [5, 4, 3, 3, 2]; // Sizes of ships to be placed - determines the 5 ships in the game
const shipToSink = 17; // Total number of ship cells to sink (sum of all ship sizes) - used to check win conditions
const NormalContext = createContext(); // Create the context object for normal game mode
const randomness = 0.7; // Probability factor for AI targeting - higher means more random shots

// AI function that determines where the computer will attack on the player's board
// Takes the player's board as input and returns coordinates for the AI's next move
function AIgame(board) {
  let row = 0,
    col = 0;
  // Determine if AI will target empty cells (0) or ship cells (2-5) based on randomness factor
  // This makes the AI sometimes target ship cells directly (simulating "cheating" for difficulty)
  const pick = Math.random() < randomness ? [0] : [2, 3, 4, 5];
  while (true) {
    // Generate random coordinates
    row = Math.floor(Math.random() * BOARD_SIZE);
    col = Math.floor(Math.random() * BOARD_SIZE);
    // If the cell at these coordinates is of a type the AI wants to target, return the coordinates
    if (pick.includes(board[row][col])) {
      return { row: row, col: col };
    }
  }
}

// Helper function to check if a ship can be placed at a specific position
// Prevents ships from being placed out of bounds or overlapping with other ships
function canPlaceShip(board, shipSize, x, y, direction) {
  if (direction === "H") {
    // For horizontal placement, check if the ship would extend beyond the right edge
    if (y + shipSize > BOARD_SIZE) return false;
    // Check if any of the cells the ship would occupy are already taken
    for (let i = 0; i < shipSize; i++) {
      if (board[x][y + i] !== 0) return false;
    }
  } else if (direction === "V") {
    // For vertical placement, check if the ship would extend beyond the bottom edge
    if (x + shipSize > BOARD_SIZE) return false;
    // Check if any of the cells the ship would occupy are already taken
    for (let i = 0; i < shipSize; i++) {
      if (board[x + i][y] !== 0) return false;
    }
  }
  // If all checks pass, the ship can be placed here
  return true;
}

// Function to place a ship on the board
// Ships are represented by their size number (2-5)
function placeShip(board, shipSize) {
  let placed = false;
  // Keep trying random positions until the ship is successfully placed
  while (!placed) {
    // Randomly choose horizontal or vertical orientation
    const direction = Math.random() < 0.5 ? "H" : "V";
    // Generate random coordinates
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);

    // Check if the ship can be placed at these coordinates
    if (canPlaceShip(board, shipSize, x, y, direction)) {
      // Place the ship on the board by marking cells with the ship's size
      if (direction === "H") {
        for (let i = 0; i < shipSize; i++) {
          board[x][y + i] = shipSize; // Mark cells with ship size (2-5)
        }
      } else if (direction === "V") {
        for (let i = 0; i < shipSize; i++) {
          board[x + i][y] = shipSize; // Mark cells with ship size (2-5)
        }
      }
      placed = true; // Ship has been placed, exit the loop
    }
  }
}

// Function to randomly place all ships on a board
// Used to initialize both player and AI boards
function randomShipPlacement(board, setBoard) {
  // Create a new empty board
  const newBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0)
  );
  // Place each ship from the SHIP_SIZES array on the board
  SHIP_SIZES.forEach((shipSize) => {
    placeShip(newBoard, shipSize);
  });
  // Update the board state with the new board containing ships
  setBoard(newBoard);
}

// Custom hook to make it easier to use the NormalContext
// Components can call this hook to access all game state and functions
export const useNormalContext = () => {
  return useContext(NormalContext);
};

// Provider component that wraps the game components and provides normal game mode state
export const NormalProvider = ({ children }) => {
  // Game timer state
  const [timeElapsed, setTimeElapsed] = useState(0); // Track game duration in seconds
  const [timerRunning, setTimerRunning] = useState(false); // Control whether timer is active
  
  // Track ships sunk for both players
  const [myShipsSunk, setMyShipsSunk] = useState(0); // Player's ships that have been sunk
  const [opShipsSunk, setOpShipsSunk] = useState(0); // Opponent's ships that have been sunk

  // Set up the game timer that increments every second while the game is running
  useEffect(() => {
    if (timerRunning) {
      const timerInterval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1); // Increment timer every second
      }, 1000);
      // Clean up the interval when component unmounts or timerRunning changes
      return () => clearInterval(timerInterval);
    }
  }, [timerRunning]);

  // Player's board state (where player's ships are placed)
  const [myBoard, setMyBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  // UI representation of player's board (what's visible to the player)
  const [myBoardUI, setMyBoardUI] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  // Opponent's board state (where AI's ships are placed)
  const [opBoard, setOpBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  // UI representation of opponent's board (what's visible to the player)
  const [opBoardUI, setOpBoardUI] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  // Modal state for displaying game results
  const [modalTitle, setModalTitle] = useState(""); // Title for the result modal
  const [modalContent, setModalContent] = useState(""); // Content for the result modal
  const [showModal, setShowModal] = useState(false); // Controls modal visibility

  // Function to close the result modal and stop the timer
  const closeModal = () => {
    setShowModal(false);
    setTimerRunning(false);
  };

  // Function to start the game timer
  const startTimer = () => {
    setTimerRunning(true);
  };

  // Initialize opponent's board with random ship placement when component mounts
  useEffect(() => {
    randomShipPlacement(opBoard, setOpBoard);
  }, []);

  // Log opponent's board for debugging purposes
  useEffect(() => {
    console.log("OpBoard", opBoard);
  }, [opBoard]);

  // Function to randomly place ships on player's board
  // Called when player wants to randomize their ship placement
  const myShipRandom = () => {
    randomShipPlacement(myBoard, setMyBoard);
  };

  // Placeholder function for handling clicks on player's board
  // Not implemented as player shouldn't interact with their own board during gameplay
  const handleMyBoardClick = (r, c) => {};

  // Helper function to update board state and count hits when a cell is clicked
  function BoardOperation(row, col, board, shipCount, cellStates) {
    if (board[row][col] === 0) {
      // If empty cell, mark as miss (1)
      cellStates[row][col] = 1;
    } else {
      // If ship cell, mark with the ship's size (2-5)
      if (board[row][col] === 2) {
        cellStates[row][col] = 2;
      } else if (board[row][col] === 3) {
        cellStates[row][col] = 3;
      } else if (board[row][col] === 4) {
        cellStates[row][col] = 4;
      } else if (board[row][col] === 5) {
        cellStates[row][col] = 5;
      }
      // Increment the ship cells hit counter
      shipCount((x) => x + 1);
    }
  }

  // Function to handle player clicks on opponent's board (player's attacks)
  const handleOpBoardClick = (row, col) => {
    // Create a copy of opponent's UI board
    const newOPCellStates = [...opBoardUI];
    // Process the player's attack
    BoardOperation(row, col, opBoard, setOpShipsSunk, newOPCellStates);
    // Update the opponent's UI board
    setOpBoardUI(newOPCellStates);
    
    // After a short delay, let the AI make its move
    setTimeout(() => {
      // Create a copy of player's UI board
      const newMyCellStates = [...myBoardUI];
      // Only allow AI to move if game is not over
      if (opShipsSunk !== 17 && myShipsSunk < shipToSink) {
        // Get AI's move coordinates
        const { row, col } = AIgame(myBoard);
        // Process the AI's attack
        BoardOperation(row, col, myBoard, setMyShipsSunk, newMyCellStates);
        // Mark the cell as attacked (10) to prevent AI from targeting it again
        myBoard[row][col] = 10;
        // Update the player's board state
        setMyBoard(myBoard);
        // Update the player's UI board
        setMyBoardUI(newMyCellStates);
      }
    }, 500); // 500ms delay before AI's move
  };

  // Check if player has won (sunk all opponent's ships)
  useEffect(() => {
    if (opShipsSunk === shipToSink) {
      setModalTitle("Congratulations!");
      setModalContent(`You have sunk all the ships in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    }
  }, [opShipsSunk]);

  // Check if AI has won (sunk all player's ships)
  useEffect(() => {
    if (myShipsSunk === shipToSink) {
      setModalTitle("Game Over!");
      setModalContent(`You have lost the game in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    }
  }, [myShipsSunk]);

  // Function to determine CSS class for cells based on their state
  // Used to visually represent hits, misses, and different ship types
  const getButtonClass = (clicked) => {
    if (clicked === 0) {
      return ""; // Default or Ship cell (not clicked)
    } else if (clicked === 1) {
      return "btn-danger"; // Miss
    } else if (clicked === 2) {
      return "btn-success"; // Hit on ship of size 2
    } else if (clicked === 3) {
      return "btn-warning"; // Hit on ship of size 3
    } else if (clicked === 4) {
      return "btn-primary"; // Hit on ship of size 4
    } else if (clicked === 5) {
      return "btn-info"; // Hit on ship of size 5
    }
    return ""; // Fallback for unexpected values
  };

  // Show the result modal when game ends
  useEffect(() => {
    if (opShipsSunk === shipToSink || myShipsSunk === shipToSink) {
      setShowModal(true);
    }
  }, [modalTitle, modalContent]);

  // Provide all normal game mode state and functions to child components
  return (
    <NormalContext.Provider
      value={{
        myBoard,             // Player's board with ship positions
        handleMyBoardClick,  // Function for handling clicks on player's board
        timeElapsed,         // Game timer
        myShipRandom,        // Function to randomly place player's ships
        myBoardUI,           // UI representation of player's board
        opBoardUI,           // UI representation of opponent's board
        handleOpBoardClick,  // Function for handling player's attacks
        myShipsSunk,         // Count of player's ship cells hit
        opShipsSunk,         // Count of opponent's ship cells hit
        showModal,           // Controls visibility of result modal
        closeModal,          // Function to close the result modal
        modalTitle,          // Title for the result modal
        modalContent,        // Content for the result modal
        startTimer,          // Function to start the game timer
        getButtonClass,      // Function to get CSS class for cells
      }}
    >
      {children}
    </NormalContext.Provider>
  );
};

















// import React, { createContext, useState, useContext, useEffect } from "react";

// const BOARD_SIZE = 10; // Size of the board
// const SHIP_SIZES = [5, 4, 3, 3, 2]; // Ship sizes
// const shipToSink = 17;
// const NormalContext = createContext();
// const randomness = 0.7;

// function AIgame(board) {
//   let row = 0,
//     col = 0;
//   const pick = Math.random() < randomness ? [0] : [2, 3, 4, 5];
//   while (true) {
//     row = Math.floor(Math.random() * BOARD_SIZE);
//     col = Math.floor(Math.random() * BOARD_SIZE);
//     if (pick.includes(board[row][col])) {
//       return { row: row, col: col };
//     }
//   }
// }


// function canPlaceShip(board, shipSize, x, y, direction) {
//   if (direction === "H") {
//     // Horizontal placement
//     if (y + shipSize > BOARD_SIZE) return false;
//     for (let i = 0; i < shipSize; i++) {
//       if (board[x][y + i] !== 0) return false;
//     }
//   } else if (direction === "V") {
//     // Vertical placement
//     if (x + shipSize > BOARD_SIZE) return false;
//     for (let i = 0; i < shipSize; i++) {
//       if (board[x + i][y] !== 0) return false;
//     }
//   }
//   return true;
// }

// // Function to place a ship on the board, 1 == ship, 0 == empty
// function placeShip(board, shipSize) {
//   let placed = false;
//   while (!placed) {
//     const direction = Math.random() < 0.5 ? "H" : "V";
//     const x = Math.floor(Math.random() * BOARD_SIZE);
//     const y = Math.floor(Math.random() * BOARD_SIZE);

//     if (canPlaceShip(board, shipSize, x, y, direction)) {
//       // Place the ship on the board
//       if (direction === "H") {
//         for (let i = 0; i < shipSize; i++) {
//           board[x][y + i] = shipSize;
//         }
//       } else if (direction === "V") {
//         for (let i = 0; i < shipSize; i++) {
//           board[x + i][y] = shipSize;
//         }
//       }
//       placed = true;
//     }
//   }
// }

// function randomShipPlacement(board, setBoard) {
//   const newBoard = Array.from({ length: BOARD_SIZE }, () =>
//     Array(BOARD_SIZE).fill(0)
//   );
//   SHIP_SIZES.forEach((shipSize) => {
//     placeShip(newBoard, shipSize);
//   });
//   setBoard(newBoard);
// }

// export const useNormalContext = () => {
//   return useContext(NormalContext);
// };

// export const NormalProvider = ({ children }) => {
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [timerRunning, setTimerRunning] = useState(false);
//   const [myShipsSunk, setMyShipsSunk] = useState(0);
//   const [opShipsSunk, setOpShipsSunk] = useState(0);

//   useEffect(() => {
//     if (timerRunning) {
//       const timerInterval = setInterval(() => {
//         setTimeElapsed((prevTime) => prevTime + 1);
//       }, 1000);
//       return () => clearInterval(timerInterval);
//     }
//   }, [timerRunning]);

//   //My ship
//   const [myBoard, setMyBoard] = useState(
//     Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
//   );
//   const [myBoardUI, setMyBoardUI] = useState(
//     Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
//   );

//   //Opponenet ships
//   const [opBoard, setOpBoard] = useState(
//     Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
//   );
//   const [opBoardUI, setOpBoardUI] = useState(
//     Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
//   );

//   const [modalTitle, setModalTitle] = useState("");
//   const [modalContent, setModalContent] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const closeModal = () => {
//     setShowModal(false);
//     setTimerRunning(false);
//   };

//   const startTimer = () => {
//     setTimerRunning(true);
//   };

//   useEffect(() => {
//     randomShipPlacement(opBoard, setOpBoard);
//   }, []);

//   useEffect(() => {
//     console.log("OpBoard", opBoard);
//   }, [opBoard]);

//   const myShipRandom = () => {
//     randomShipPlacement(myBoard, setMyBoard);
//   };

//   const handleMyBoardClick = (r, c) => {};

//   function BoardOperation(row, col, board, shipCount, cellStates) {
//     if (board[row][col] === 0) {
//       cellStates[row][col] = 1;
//     } else {
//       if (board[row][col] === 2) {
//         cellStates[row][col] = 2;
//       } else if (board[row][col] === 3) {
//         cellStates[row][col] = 3;
//       } else if (board[row][col] === 4) {
//         cellStates[row][col] = 4;
//       } else if (board[row][col] === 5) {
//         cellStates[row][col] = 5;
//       }
//       shipCount((x) => x + 1);
//     }
//   }

//   const handleOpBoardClick = (row, col) => {
//     const newOPCellStates = [...opBoardUI];
//     BoardOperation(row, col, opBoard, setOpShipsSunk, newOPCellStates);
//     setOpBoardUI(newOPCellStates);
//     setTimeout(() => {
//       const newMyCellStates = [...myBoardUI];
//       if (opShipsSunk !== 17 && myShipsSunk < shipToSink) {
//         const { row, col } = AIgame(myBoard);
//         BoardOperation(row, col, myBoard, setMyShipsSunk, newMyCellStates);
//         myBoard[row][col] = 10;
//         setMyBoard(myBoard);
//         setMyBoardUI(newMyCellStates);
//       }
//     }, 500);
//   };

//   useEffect(() => {
//     if (opShipsSunk === shipToSink) {
//       setModalTitle("Congratulations!");
//       setModalContent(`You have sunk all the ships in ${timeElapsed} seconds!`);
//       setTimerRunning(false);
//     }
//   }, [opShipsSunk]);

//   useEffect(() => {
//     if (myShipsSunk === shipToSink) {
//       setModalTitle("Game Over!");
//       setModalContent(`You have lost the game in ${timeElapsed} seconds!`);
//       setTimerRunning(false);
//     }
//   }, [myShipsSunk]);

//   const getButtonClass = (clicked) => {
//     if (clicked === 0) {
//       return ""; // Default or Ship cell
//     } else if (clicked === 1) {
//       return "btn-danger"; // Miss
//     } else if (clicked === 2) {
//       return "btn-success";
//     } else if (clicked === 3) {
//       return "btn-warning";
//     } else if (clicked === 4) {
//       return "btn-primary";
//     } else if (clicked === 5) {
//       return "btn-info";
//     }
//     return ""; // In case of any unexpected value
//   };

//   useEffect(() => {
//     if (opShipsSunk === shipToSink || myShipsSunk === shipToSink) {
//       setShowModal(true);
//     }
//   }, [modalTitle, modalContent]);

//   return (
//     <NormalContext.Provider
//       value={{
//         myBoard,
//         handleMyBoardClick,
//         timeElapsed,
//         myShipRandom,
//         myBoardUI,
//         opBoardUI,
//         handleOpBoardClick,
//         myShipsSunk,
//         opShipsSunk,
//         showModal,
//         closeModal,
//         modalTitle,
//         modalContent,
//         startTimer,
//         getButtonClass,
//       }}
//     >
//       {children}
//     </NormalContext.Provider>
//   );
// };
