const Game = require("../models/gameModel");

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
    const games = await Game.find({ userID: user.id, status: "completed" });
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
      game.startTime = new Date();
      try {
        await game.save();
        return res.status(200).json({
          message: "Joined game successfully",
          game,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Server error",
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
