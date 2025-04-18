// Import the Game model from the models directory
// This model defines the schema for game data and provides methods to interact with the games collection in the database
const Game = require("../models/gameModel");

// Export the openGames function that retrieves games open for joining
// This function is exposed as an API endpoint, likely at /api/game/open
exports.openGames = async (req, res) => {
  // Extract the authenticated user from the request object
  // This user object was attached by authentication middleware
  const user = req.user;
  
  // Log the user information for debugging purposes
  console.log("User from token:", user);
  
  try {
    // Query the database for games that:
    // 1. Were NOT created by the current user ($ne means "not equal")
    // 2. Have a status of "open" (waiting for an opponent)
    // This finds games the user can join
    const games = await Game.find({
      userID: { $ne: user.id },
      status: "open",
    });
    
    // Return a success response with the list of open games
    // Frontend components like a game lobby would display these games
    res.status(200).json({
      message: "Open games retrieved successfully",
      games,
    });
  } catch (error) {
    // Log any errors that occur during the database query
    console.error("Error retrieving open games:", error);
    
    // Return a server error response with the error details
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// Export the myOpenGames function that retrieves the current user's open games
// This function is exposed as an API endpoint, likely at /api/game/myopen
exports.myOpenGames = async (req, res) => {
  // Extract the authenticated user from the request object
  const user = req.user;
  
  // Log the user information for debugging purposes
  console.log("User from token:", user);
  
  try {
    // Query the database for games that:
    // 1. Were created by the current user
    // 2. Have a status of "open" (waiting for an opponent)
    // This finds games the user has created that haven't been joined yet
    const games = await Game.find({ userID: user.id, status: "open" });
    
    // Return a success response with the list of the user's open games
    // Frontend would use this to show the user their created games
    res.status(200).json({
      message: "Open games retrieved successfully",
      games,
    });
  } catch (error) {
    // Log any errors that occur during the database query
    console.error("Error retrieving open games:", error);
    
    // Return a server error response with the error details
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// Export the myActiveGames function that retrieves the current user's active games
// This function is exposed as an API endpoint, likely at /api/game/myactive
exports.myActiveGames = async (req, res) => {
  // Extract the authenticated user from the request object
  const user = req.user;
  
  // Log the user information for debugging purposes
  console.log("User from token:", user);
  
  try {
    // Query the database for games that:
    // 1. Were created by the current user
    // 2. Have a status of "active" (game in progress)
    // This finds games the user is currently playing
    const games = await Game.find({ userID: user.id, status: "active" });
    
    // Return a success response with the list of the user's active games
    // Frontend would use this to show games the user can continue playing
    res.status(200).json({
      message: "Active games retrieved successfully",
      games,
    });
  } catch (error) {
    // Log any errors that occur during the database query
    // Note: The error message says "open games" which is inconsistent with the function purpose
    console.error("Error retrieving open games:", error);
    
    // Return a server error response with the error details
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// Export the myCompletedGames function that retrieves the current user's completed games
// This function is exposed as an API endpoint, likely at /api/game/mycompleted
exports.myCompletedGames = async (req, res) => {
  // Extract the authenticated user from the request object
  const user = req.user;
  
  // Log the user information for debugging purposes
  console.log("User from token:", user);
  
  try {
    // Query the database for games that:
    // 1. Were created by the current user
    // 2. Have a status of "completed" (game finished)
    // This finds games the user has finished playing
    const games = await Game.find({ userID: user.id, status: "completed" });
    
    // Return a success response with the list of the user's completed games
    // Frontend would use this to show the user's game history
    res.status(200).json({
      message: "Completed games retrieved successfully",
      games,
    });
  } catch (error) {
    // Log any errors that occur during the database query
    // Note: The error message says "open games" which is inconsistent with the function purpose
    console.error("Error retrieving open games:", error);
    
    // Return a server error response with the error details
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// Empty function stub for retrieving other games
// This might be intended for games where the user is an opponent rather than creator
exports.otherGames = async (req, res) => {};

// Export the createGame function that creates a new game
// This function is exposed as an API endpoint, likely at /api/game/newgame
exports.createGame = async (req, res) => {
  // Extract the authenticated user from the request object
  const user = req.user;
  
  // Log the user information for debugging purposes
  console.log("User from token:", user);
  
  // Create a new Game instance with the user's information
  // This initializes a game with the current user as the creator
  const newGame = new Game({
    user: user.firstName + " " + user.lastName, // Creator's full name
    userID: user.id,                            // Creator's ID
    // Other fields use default values from the Game model:
    // - status: "open" (default)
    // - opponent: null (default)
    // - opponentID: null (default)
    // - startTime: null (default)
    // - endTime: null (default)
  });
  
  try {
    // Save the new game to the database
    // This creates a new document in the games collection
    await newGame.save();
    
    // Return a success response with the created game
    // Frontend would use this to show the user their new game or redirect to it
    res.status(201).json({
      message: "Game created successfully",
      game: newGame,
    });
  } catch (error) {
    // Log any errors that occur during game creation
    console.error("Error creating game:", error);
    
    // Return a server error response with the error details
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// Export the joinGame function that allows a user to join an existing game
// This function is exposed as an API endpoint, likely at /api/game/join/:gameID
exports.joinGame = async (req, res) => {
  // Extract the authenticated user from the request object
  const user = req.user;
  
  // Extract the game ID from the request parameters
  // This would be part of the URL, e.g., /api/game/join/123456
  const gameid = req.params.gameID;
  
  // Log the game ID for debugging purposes
  console.log("GameID", gameid);
  
  try {
    // Find the game by its ID in the database
    const game = await Game.findById(gameid);
    
    // Log that the game was found for debugging
    console.log("Found game");
    
    // If no game with this ID exists, return a 404 error
    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    } 
    // If the user is the creator of the game, return a success message
    // This handles the case where a user tries to join their own game
    else if (game.userID.toString() === user.id) {
      return res.status(200).json({
        message: "Joined your game",
        game,
      });
    } 
    // If the game doesn't have an opponent yet, let the user join
    else if (game.opponentID === null) {
      // Update the game with the joining user's information
      game.opponent = user.firstName + " " + user.lastName; // Opponent's full name
      game.opponentID = user.id;                           // Opponent's ID
      game.status = "active";                              // Change status to active
      game.startTime = new Date();                         // Set the start time to now
      
      try {
        // Save the updated game to the database
        await game.save();
        
        // Return a success response with the joined game
        // Frontend would use this to redirect to the game page
        return res.status(200).json({
          message: "Joined game successfully",
          game,
        });
      } catch (error) {
        // Log any errors that occur during game update
        console.error("Error saving game:", error);
        
        // Return a server error response with the error details
        return res.status(500).json({
          message: "Server error",
          error,
        });
      }
    }
    // Note: There's no explicit handling for the case where the game already has an opponent
    // This could be an oversight in the code
  } catch (error) {
    // Log any errors that occur during the database query
    console.error("Error finding game:", error);
    
    // Return a server error response with the error details
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};








// const Game = require("../models/gameModel");

// exports.openGames = async (req, res) => {
//   const user = req.user;
//   console.log("User from token:", user);
//   try {
//     const games = await Game.find({
//       userID: { $ne: user.id },
//       status: "open",
//     });
//     res.status(200).json({
//       message: "Open games retrieved successfully",
//       games,
//     });
//   } catch (error) {
//     console.error("Error retrieving open games:", error);
//     res.status(500).json({
//       message: "Server error",
//       error,
//     });
//   }
// };

// exports.myOpenGames = async (req, res) => {
//   const user = req.user;
//   console.log("User from token:", user);
//   try {
//     const games = await Game.find({ userID: user.id, status: "open" });
//     res.status(200).json({
//       message: "Open games retrieved successfully",
//       games,
//     });
//   } catch (error) {
//     console.error("Error retrieving open games:", error);
//     res.status(500).json({
//       message: "Server error",
//       error,
//     });
//   }
// };

// exports.myActiveGames = async (req, res) => {
//   const user = req.user;
//   console.log("User from token:", user);
//   try {
//     const games = await Game.find({ userID: user.id, status: "active" });
//     res.status(200).json({
//       message: "Active games retrieved successfully",
//       games,
//     });
//   } catch (error) {
//     console.error("Error retrieving open games:", error);
//     res.status(500).json({
//       message: "Server error",
//       error,
//     });
//   }
// };

// exports.myCompletedGames = async (req, res) => {
//   const user = req.user;
//   console.log("User from token:", user);
//   try {
//     const games = await Game.find({ userID: user.id, status: "completed" });
//     res.status(200).json({
//       message: "Completed games retrieved successfully",
//       games,
//     });
//   } catch (error) {
//     console.error("Error retrieving open games:", error);
//     res.status(500).json({
//       message: "Server error",
//       error,
//     });
//   }
// };

// exports.otherGames = async (req, res) => {};

// exports.createGame = async (req, res) => {
//   const user = req.user;
//   console.log("User from token:", user);
//   const newGame = new Game({
//     user: user.firstName + " " + user.lastName,
//     userID: user.id,
//   });
//   try {
//     await newGame.save();
//     res.status(201).json({
//       message: "Game created successfully",
//       game: newGame,
//     });
//   } catch (error) {
//     console.error("Error creating game:", error);
//     res.status(500).json({
//       message: "Server error",
//       error,
//     });
//   }
// };

// exports.joinGame = async (req, res) => {
//   const user = req.user;
//   const gameid = req.params.gameID;
//   console.log("GameID", gameid);
//   try {
//     const game = await Game.findById(gameid);
//     console.log("Found game");
//     if (!game) {
//       return res.status(404).json({
//         message: "Game not found",
//       });
//     } else if (game.userID.toString() === user.id) {
//       return res.status(200).json({
//         message: "Joined your game",
//         game,
//       });
//     } else if (game.opponentID === null) {
//       game.opponent = user.firstName + " " + user.lastName;
//       game.opponentID = user.id;
//       game.status = "active";
//       game.startTime = new Date();
//       try {
//         await game.save();
//         return res.status(200).json({
//           message: "Joined game successfully",
//           game,
//         });
//       } catch (error) {
//         console.error("Error saving game:", error);
//         return res.status(500).json({
//           message: "Server error",
//           error,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error finding game:", error);
//     return res.status(500).json({
//       message: "Server error",
//       error,
//     });
//   }
// };
