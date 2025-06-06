const Game = require("../models/gameModel");

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

function shipsArePlaced(board) {
  const filledCells = board.reduce((count, row) => {
    return count + row.filter((cell) => cell > 0).length;
  }, 0);
}

exports.openGames = async (req, res) => {
  const user = req.user;
  try {
    const games = await Game.find({
      userID: { $ne: user.id },
      status: "open",
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "Open games retrieved successfully",
      games,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.myOpenGames = async (req, res) => {
  const user = req.user;
  try {
    // const games = await Game.find({ userID: user.id, status: "open" });
    const games = await Game.find({ userID: user.id, status: "open" }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "Open games retrieved successfully",
      games,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.myActiveGames = async (req, res) => {
  const user = req.user;
  try {
    const allGames = await Game.find({
      status: "active",
      $or: [{ userID: user.id }, { opponentID: user.id }],
    }).sort({
      startTime: -1,
    });
    res.status(200).json({
      message: "Active games retrieved successfully",
      allGames,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.myCompletedGames = async (req, res) => {
  const user = req.user;
  try {
    const games = await Game.find({
      status: "completed",
      $or: [{ userID: user.id }, { opponentID: user.id }],
    }).sort({
      startTime: -1,
    });
    res.status(200).json({
      message: "Completed games retrieved successfully",
      games,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.otherGames = async (req, res) => {
  const user = req.user;
  try {
    const activeGames = await Game.find({
      userID: { $ne: user.id },
      status: "active",
    }).sort({
      startTime: -1,
    });
    const completedGames = await Game.find({
      userID: { $ne: user.id },
      status: "completed",
    }).sort({
      startTime: -1,
    });
    res.status(200).json({
      message: "Other games retrieved successfully",
      activeGames,
      completedGames,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.createGame = async (req, res) => {
  const user = req.user;
  const newGame = new Game({
    user: user.firstName + " " + user.lastName,
    userID: user.id,
  });
  try {
    await newGame.save();
    res.status(201).json({
      message: "Game created successfully",
      game: newGame,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.joinGame = async (req, res) => {
  const user = req.user;
  const gameid = req.params.gameID;
  try {
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    } else if (game.userID.toString() === user.id) {
      return res.status(400).json({
        message: "Cant join your own game",
      });
    } else if (game.opponentID === null) {
      game.opponent = user.firstName + " " + user.lastName;
      game.opponentID = user.id;
      game.status = "active";
      game.startTime = new Date();
      console.log("GAME", game);
      try {
        await game.save();
        return res.status(200).json({
          message: "Joined game successfully",
          game,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Server error hmmm",
          error,
        });
      }
    } else {
      return res.status(400).json({
        message: "Cant join game",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error WEEWWEWWW",
      error,
    });
  }
};

exports.joinActiveGame = async (req, res) => {
  const gameid = req.params.gameID;
  try {
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }
    return res.status(200).json({
      message: "Joined the active game successfully",
      game,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.makeMove = async (req, res) => {
  const user = req.user;
  const gameId = req.params.gameID;
  const updatedGame = req.body.game;
  if (!updatedGame) {
    return res.status(400).json({
      message: "Invalid game data",
    });
  }
  if (!(updatedGame.userID === user.id || updatedGame.opponentID === user.id)) {
    return res.status(403).json({
      message: "You are not authorized to make this move",
    });
  }
  if (updatedGame.status === "completed") {
    return res.status(403).json({
      message: "Game is already complete",
    });
  }
  delete updatedGame._id;
  console.log("_____BEFORE____UPDATED GAME_____", updatedGame);
  try {
    updatedGame.turn = user.id === updatedGame.userID ? "opponent" : "user";
    if (updatedGame.status === "active") {
      if (updatedGame.userShips === 17) {
        updatedGame.status = "completed";
        updatedGame.winner = updatedGame.opponentID;
        updatedGame.duration = formatTimeElapsed(
          (new Date() - new Date(updatedGame.startTime)) / 1000
        );
      } else if (updatedGame.opponentShips === 17) {
        updatedGame.status = "completed";
        updatedGame.winner = updatedGame.userID;
        updatedGame.duration = formatTimeElapsed(
          (new Date() - new Date(updatedGame.startTime)) / 1000
        );
      }
    }
    console.log("_____UPDATED GAME_____", updatedGame);
    await Game.updateOne({ _id: gameId }, updatedGame);
    res.status(200).json({
      message: "Game updated successfully",
      game: updatedGame,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

exports.highscores = async (req, res) => {
  try {
    // Step 1: Fetch all completed games
    const allGames = await Game.find({ status: "completed" });

    // Step 2: Create playerMap (playerID -> username)
    const playerMap = {};
    allGames.forEach((game) => {
      if (game.userID && !playerMap[game.userID]) {
        playerMap[game.userID] = game.user;
      }
      if (game.opponentID && !playerMap[game.opponentID]) {
        playerMap[game.opponentID] = game.opponent;
      }
    });

    // Step 3: Initialize playerStats for all known players
    const playerStats = {};
    for (const playerId in playerMap) {
      playerStats[playerId] = { wins: 0, losses: 0 };
    }

    // Step 4: Update wins and losses based on each completed game
    allGames.forEach((game) => {
      const winner = game.winner.toString();
      const loser =
        winner === game.userID.toString()
          ? game.opponentID.toString()
          : game.userID.toString();
      console.log("Game", game.id, "winner", winner, "loser", loser);
      if (winner && playerStats[winner]) {
        playerStats[winner].wins++;
      }

      if (loser && playerStats[loser]) {
        playerStats[loser].losses++;
      }
    });

    // Step 5: Create a highscores array
    const players = Object.keys(playerStats).map((playerId) => ({
      id: playerId,
      username: playerMap[playerId] || "Unknown Player",
      wins: playerStats[playerId].wins,
      losses: playerStats[playerId].losses,
    }));

    // Step 6: Sort players by wins desc, then losses asc, then username asc
    players.sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins; // More wins first
      } else if (a.losses !== b.losses) {
        return a.losses - b.losses; // Fewer losses next
      } else {
        return a.username.localeCompare(b.username); // Alphabetical by username
      }
    });

    // Step 7: Send the response
    res.status(200).json({
      message: "High scores fetched successfully",
      highscores: players,
      playerMap: playerMap,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
