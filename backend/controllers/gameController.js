const Game = require("../models/gameModel");

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
    const games = await Game.find({ userID: user.id, status: "open" });
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

exports.otherGames = async (req, res) => {};

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
      console.log(game);
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
      message: "Server error",
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
  delete updatedGame._id;
  console.log("_____BEFORE____UPDATED GAME_____", updatedGame);
  try {
    updatedGame.turn =
      updatedGame.turn === user.id
        ? updatedGame.opponentID
        : updatedGame.userID; // Switching turns
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
    const allGames = await Game.find({ status: "completed" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
