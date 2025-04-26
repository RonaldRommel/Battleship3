// Import necessary hooks and functions from React to create and use context
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  use,
} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

// Define game constants
const BOARD_SIZE = 10; // Size of the game board (10x10 grid)
const SHIP_SIZES = [5, 4, 3, 3, 2]; // Sizes of ships to be placed (5 ships of different lengths)
const shipToSink = 17; // Total number of ship cells to sink (sum of all ship sizes)
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

// Create a React Context to share multiplayer game state across components
const MultiGameContext = createContext();

// Provider component that wraps the game components and provides multiplayer game state
const MultiGameProvider = ({ children }) => {
  const [gameId, setGameId] = useState(null);
  // Game timer state
  const [timeElapsed, setTimeElapsed] = useState(0); // Track game duration in seconds
  const [timerRunning, setTimerRunning] = useState(false); // Control whether timer is active

  // Track ships sunk for both players
  const [myShipsSunk, setMyShipsSunk] = useState(0); // Player's ships that have been sunk
  const [opShipsSunk, setOpShipsSunk] = useState(0); // Opponent's ships that have been sunk
  const [turn, setTurn] = useState(false); // Track whose turn it is

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

  const formatTimeElapsed = (seconds) => {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format the time as hh:mm:ss
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    return formattedTime;
  };

  // Player's board state (where player's ships are placed)
  const [myBoard, setMyBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  // UI representation of player's board (what's visible to the player)
  const [myBoardUI, setMyBoardUI] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );

  // Opponent's board state (where AI's ships are placed)tai
  const [opBoard, setOpBoard] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  // UI representation of opponent's board (what's visible to the player)
  const [opBoardUI, setOpBoardUI] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0))
  );
  const [isCreator, setIsCreator] = useState(null); // Creator of the game

  // Modal state for displaying game results
  const [modalTitle, setModalTitle] = useState(""); // Title for the result modal
  const [modalContent, setModalContent] = useState(""); // Content for the result modal
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [gameDetails, setGameDetails] = useState(null); // Game details fetched from backend
  // Function to close the result modal and stop the timer
  const closeModal = () => {
    setShowModal(false);
    setTimerRunning(false);
  };

  // Function to start the game timer
  const startTimer = () => {
    const startTime = new Date(gameDetails.startTime);
    const currentTime = new Date();
    const diffInSeconds = Math.floor((currentTime - startTime) / 1000);
    setTimeElapsed(diffInSeconds);
    if (gameDetails.status === "active") {
      setTimerRunning(true);
    }
  };
  const { isAuthenticated, user } = useAuthContext();

  const updateBoardInDB = async () => {
    if (isCreator) {
      gameDetails.userBoard = myBoard;
    } else {
      gameDetails.opponentBoard = myBoard;
    }
    console.log("Game details to update:", gameDetails);
    try {
      const res = await axios.put(
        `/api/game/${gameId}/move`,
        { game: gameDetails },
        { withCredentials: true }
      );
      console.log("Game updated successfully:", res.data);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  //Call backend and set the board and other details
  useEffect(() => {
    if (gameId !== null && user !== null) {
      const fetchGameDetails = async () => {
        try {
          const res = await axios.get(`/api/game/${gameId}`, {
            withCredentials: true,
          });
          setGameDetails(res.data.game);
          console.log("Game details fetched:", res.data.game);
          setIsCreator(user.id === res.data.game.userID);
          const tempUser = user.id === res.data.game.userID;
          if (tempUser && res.data.game.turn === "user") {
            console.log("User is creator and it's their turn");
            setTurn(true);
          } else if (!tempUser && res.data.game.turn === "opponent") {
            console.log("User is opponent and it's their turn");
            setTurn(true);
          } else {
            console.log("User's turn is not active");
            setTurn(false);
          }
        } catch (error) {
          console.error("Error fetching game details:", error);
        }
      };

      fetchGameDetails();
    }
  }, [gameId, user]);

  useEffect(() => {
    if (isCreator !== null && gameDetails !== null) {
      if (isCreator) {
        console.log(
          "User is creator",
          user.id,
          gameDetails.userID,
          gameDetails.user
        );
        setMyBoard(gameDetails.userBoard);
        setMyBoardUI(gameDetails.userBoardUI); //change this
        setOpBoard(gameDetails.opponentBoard);
        setOpBoardUI(gameDetails.opponentBoardUI); //change this
        setMyShipsSunk(gameDetails.userShips);
        setOpShipsSunk(gameDetails.opponentShips);
        console.log("Opponent ship", gameDetails.opponentBoard);
      } else {
        console.log(
          "User is opponent",
          user.id,
          gameDetails.opponentID,
          gameDetails.opponent
        );
        setMyBoard(gameDetails.opponentBoard);
        setMyBoardUI(gameDetails.opponentBoardUI); //change this
        setOpBoard(gameDetails.userBoard);
        setOpBoardUI(gameDetails.userBoardUI); //change this
        setMyShipsSunk(gameDetails.opponentShips);
        setOpShipsSunk(gameDetails.userShips);
        console.log("Opponent ship", gameDetails.userBoard);
      }
    }
  }, [isCreator]);

  // Function to randomly place ships on player's board
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
      return 0;
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
      return 1;
    }
  }

  const playerMoveUpdateDB = async (cellStates, count) => {
    if (isCreator) {
      gameDetails.opponentBoardUI = cellStates;
      gameDetails.opponentShips = gameDetails.opponentShips + count;
    } else {
      gameDetails.userBoardUI = cellStates;
      gameDetails.userShips = gameDetails.userShips + count;
    }
    console.log("Player Move Updated", gameDetails);
    try {
      const res = await axios.put(
        `/api/game/${gameId}/move`,
        { game: gameDetails },
        { withCredentials: true }
      );
      console.log("Game updated successfully:", res.data);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  // Function to handle player clicks on opponent's board (player's attacks)
  const handleOpBoardClick = (row, col) => {
    if (
      gameDetails.status === "completed" ||
      (user.id !== gameDetails.userID && user.id !== gameDetails.opponentID)
    ) {
      return;
    }
    const newOPCellStates = [...opBoardUI];
    const count = BoardOperation(
      row,
      col,
      opBoard,
      setOpShipsSunk,
      newOPCellStates
    );
    setOpBoardUI(newOPCellStates);
    playerMoveUpdateDB(newOPCellStates, count);
    setTurn(false);
  };

  useEffect(() => {
    if (opShipsSunk === shipToSink && isCreator) {
      console.log("Opponent sunk all ships and Creator");
      setModalTitle("Congratulations!");
      setModalContent(`You have sunk all the ships in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    } else if (opShipsSunk === shipToSink && !isCreator) {
      console.log("Opponent sunk all ships and not Creator");
      setModalTitle("Game Over!");
      setModalContent(`You have lost the game in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    }
  }, [opShipsSunk]);

  useEffect(() => {
    if (myShipsSunk === shipToSink && isCreator) {
      console.log("my sunk all ships and Creator");
      setModalTitle("Congratulations!");
      setModalContent(`You have sunk all the ships in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    } else if (myShipsSunk === shipToSink && !isCreator) {
      console.log("my sunk all ships and not Creator");
      setModalTitle("Game Over!");
      setModalContent(`You have lost the game in ${timeElapsed} seconds!`);
      setTimerRunning(false);
    }
  }, [myShipsSunk]);

  // Function to determine CSS class for cells based on their state
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

  // Provide all multiplayer game state and functions to child components
  return (
    <MultiGameContext.Provider
      value={{
        myBoard, // Player's board with ship positions
        handleMyBoardClick, // Function for handling clicks on player's board
        timeElapsed, // Game timer
        myShipRandom, // Function to randomly place player's ships
        myBoardUI, // UI representation of player's board
        opBoardUI, // UI representation of opponent's board
        handleOpBoardClick, // Function for handling player's attacks
        myShipsSunk, // Count of player's ship cells hit
        opShipsSunk, // Count of opponent's ship cells hit
        showModal, // Controls visibility of result modal
        closeModal, // Function to close the result modal
        modalTitle, // Title for the result modal
        modalContent, // Content for the result modal
        startTimer, // Function to start the game timer
        getButtonClass, // Function to get CSS class for cells
        setGameId,
        updateBoardInDB,
        gameDetails,
        isCreator,
        turn,
        setTurn,
        formatTimeElapsed,
      }}
    >
      {children}
    </MultiGameContext.Provider>
  );
};

// Custom hook to make it easier to use the MultiGameContext
const useMultiGameContext = () => useContext(MultiGameContext);

// Export both the provider component and the custom hook
export { MultiGameProvider, useMultiGameContext };
