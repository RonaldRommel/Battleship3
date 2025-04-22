// Import necessary hooks and functions from React to create and use context
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the game board size as 10x10 grid
const BOARD_SIZE = 10; 
// Define the sizes of ships to be placed on the board (5 ships of different lengths)
const SHIP_SIZES = [5, 4, 3, 3, 2]; 

// Helper function to check if a ship can be placed at a specific position
// This prevents ships from being placed out of bounds or overlapping with other ships
function canPlaceShip(board, shipSize, x, y, direction) {
  if (direction === "H") {
    // For horizontal placement, check if the ship would extend beyond the right edge
    if (y + shipSize > BOARD_SIZE) return false; 
    // Check if any of the cells the ship would occupy are already taken
    for (let i = 0; i < shipSize; i++) {
      if (board[x][y + i] !== 0) return false; // 0 means empty cell
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

// Function to randomly place a ship on the board
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

// Create a React Context to share game state across components
export const FreeplayContext = createContext();

// Custom hook to make it easier to use the FreeplayContext
export const useFreeplayContext = () => {
  return useContext(FreeplayContext);
};

// Provider component that wraps the game components and provides game state
export const FreeplayProvider = ({ children }) => {
  // Initialize the game board as a 10x10 grid filled with zeros (empty cells)
  const [board, setBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  // Track the state of each cell for UI rendering (whether it's been clicked)
  // 0: not clicked, 1: miss, 2-5: hit on ship of that size
  const [cellStates, setCellStates] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  // Track how many ship cells have been hit (total should be 17 for all ships)
  const [shipsSunk, setShipsSunk] = useState(0);

  // When the component mounts, place ships randomly on the board
  useEffect(() => {
    const newBoard = [...board]; // Create a copy of the board
    // Place each ship from the SHIP_SIZES array
    SHIP_SIZES.forEach((shipSize) => {
      placeShip(newBoard, shipSize); 
    });
    console.log(newBoard); // Log the board for debugging
    setBoard(newBoard); // Update the board state with ships placed
  }, []); // Empty dependency array means this runs once on mount

  // Handle player clicks on the game board
  const handleCellClick = (row, col) => {
    const newCellStates = [...cellStates]; // Create a copy of cell states
    if (board[row][col] === 0) {
      newCellStates[row][col] = 1; // Mark as miss (empty space clicked)
    } else if (board[row][col] >= 2 && board[row][col] <= 5) {
      // If a ship is hit, mark the cell with the ship's size
      if (board[row][col] === 2) {
        newCellStates[row][col] = 2; // Hit on ship of size 2
      } else if (board[row][col] === 3) {
        newCellStates[row][col] = 3; // Hit on ship of size 3
      } else if (board[row][col] === 4) {
        newCellStates[row][col] = 4; // Hit on ship of size 4
      } else if (board[row][col] === 5) {
        newCellStates[row][col] = 5; // Hit on ship of size 5
      }
      setShipsSunk((count) => count + 1); // Increment hit counter
    }
    setCellStates(newCellStates); // Update the cell states
  };

  // Track game time
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Set up a timer that increments every second while the game is running
  useEffect(() => {
    if (timerRunning) {
      const timerInterval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1); // Increment timer every second
      }, 1000);
      // Clean up the interval when component unmounts or timerRunning changes
      return () => clearInterval(timerInterval);
    }
  }, [timerRunning]);

  // Stop the timer when all ships are sunk (17 cells total across all ships)
  useEffect(() => {
    if (shipsSunk === 17) {
      setTimerRunning(false); // Game over, stop the timer
    }
  }, [shipsSunk]);

  // Determine CSS class for each cell based on its state
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

  // Provide all game state and functions to child components
  return (
    <FreeplayContext.Provider
      value={{
        board,           // The game board with ship positions
        shipsSunk,       // Number of ship cells hit
        cellStates,      // UI state of each cell
        handleCellClick, // Function to handle cell clicks
        timeElapsed,     // Game timer
        getButtonClass,  // Function to get CSS class for cells
      }}
    >
      {children}
    </FreeplayContext.Provider>
  );
};















// import React, { createContext, useContext, useState, useEffect } from "react";

// const BOARD_SIZE = 10; 
// const SHIP_SIZES = [5, 4, 3, 3, 2]; 

// // Function to check if a ship can be placed at a given position
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
//     const direction = Math.random() < 0.5 ? "H" : "V"; // Randomly choose a direction (H or V)
//     const x = Math.floor(Math.random() * BOARD_SIZE);
//     const y = Math.floor(Math.random() * BOARD_SIZE);

//     if (canPlaceShip(board, shipSize, x, y, direction)) {
//       // Place the ship on the board
//       if (direction === "H") {
//         for (let i = 0; i < shipSize; i++) {
//           board[x][y + i] = shipSize; // Mark the cells with the ship's size
//         }
//       } else if (direction === "V") {
//         for (let i = 0; i < shipSize; i++) {
//           board[x + i][y] = shipSize; // Mark the cells with the ship's size
//         }
//       }
//       placed = true;
//     }
//   }
// }

// // Create the context
// export const FreeplayContext = createContext();

// // Custom hook to access the context
// export const useFreeplayContext = () => {
//   return useContext(FreeplayContext);
// };

// export const FreeplayProvider = ({ children }) => {
//   // Initialize the board (10x10) with 0s indicating empty spaces
//   const [board, setBoard] = useState(
//     Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
//   );

//   // State to track whether cells are clicked (for UI interaction)
//   const [cellStates, setCellStates] = useState(
//     Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
//   );

//   // State to track the number of ships sunk
//   const [shipsSunk, setShipsSunk] = useState(0);

//   // Place ships on the board once the component is mounted
//   useEffect(() => {
//     const newBoard = [...board]; 
//     SHIP_SIZES.forEach((shipSize) => {
//       placeShip(newBoard, shipSize); 
//     });
//     console.log(newBoard); 
//     setBoard(newBoard); 
//   }, []); 

//   // Function to handle a cell click, toggle its state, 2==miss, 3==hit
//   const handleCellClick = (row, col) => {
//     const newCellStates = [...cellStates];
//     if (board[row][col] === 0) {
//       newCellStates[row][col] = 1; // Mark as miss (empty space clicked)
//     } else if (board[row][col] >= 2 && board[row][col] <= 5) {
//       if (board[row][col] === 2) {
//         newCellStates[row][col] = 2; // Mark as hit (ship clicked)
//       } else if (board[row][col] === 3) {
//         newCellStates[row][col] = 3; // Mark as hit (ship clicked)
//       } else if (board[row][col] === 4) {
//         newCellStates[row][col] = 4; // Mark as hit (ship clicked)
//       } else if (board[row][col] === 5) {
//         newCellStates[row][col] = 5; // Mark as hit (ship clicked)
//       }
//       setShipsSunk((count) => count + 1); 
//     }
//     setCellStates(newCellStates); 
//   };

//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [timerRunning, setTimerRunning] = useState(true);

//   useEffect(() => {
//     if (timerRunning) {
//       const timerInterval = setInterval(() => {
//         setTimeElapsed((prevTime) => prevTime + 1); 
//       }, 1000);
//       return () => clearInterval(timerInterval);
//     }
//   }, [timerRunning]);

//   // Effect to open the modal when shipsSunk reaches 17
//   useEffect(() => {
//     if (shipsSunk === 17) {
//       setTimerRunning(false);
//     }
//   }, [shipsSunk]);

//   const getButtonClass = (clicked) => {
//     if (clicked === 0) {
//       return ""; // Default or Ship cell
//     } else if (clicked === 1) {
//       return "btn-danger"; // Miss
//     } else if (clicked === 2) {
//       return "btn-success"; // Miss
//     } else if (clicked === 3) {
//       return "btn-warning"; // Hit
//     } else if (clicked === 4) {
//       return "btn-primary"; // Hit
//     } else if (clicked === 5) {
//       return "btn-info"; // Hit
//     }
//     return ""; // In case of any unexpected value
//   };

//   return (
//     <FreeplayContext.Provider
//       value={{
//         board,
//         shipsSunk,
//         cellStates,
//         handleCellClick,
//         timeElapsed,
//         getButtonClass,
//       }}
//     >
//       {children}
//     </FreeplayContext.Provider>
//   );
// };
