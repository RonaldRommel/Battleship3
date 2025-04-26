const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { verifyToken } = require("../middleware/verifyToken");
const Game = require("../models/gameModel");

router.get("/open", verifyToken, (req, res) => {
  gameController.openGames(req, res);
});

router.get("/myopen", verifyToken, (req, res) => {
  gameController.myOpenGames(req, res);
});

router.get("/myactive", verifyToken, (req, res) => {
  gameController.myActiveGames(req, res);
});

router.get("/mycompleted", verifyToken, (req, res) => {
  gameController.myCompletedGames(req, res);
});

router.post("/newgame", verifyToken, (req, res) => {
  gameController.createGame(req, res);
});

router.get("/othergame", verifyToken, (req, res) => {
  gameController.otherGames(req, res);
});

router.get("/highscores", (req, res) => {
  gameController.highscores(req, res);
});

router.get("/:gameID", verifyToken, (req, res) => {
  gameController.joinActiveGame(req, res);
});

router.post("/joingame/:gameID", verifyToken, (req, res) => {
  gameController.joinGame(req, res);
});

router.put("/:gameID/move", verifyToken, (req, res) => {
  gameController.makeMove(req, res);
});

//to reset the games
router.put("/reset", async (req, res) => {
  try {
    await Game.updateMany(
      {}, // Select all games
      {
        $set: {
          // Reset fields
          userBoard: Array.from({ length: 10 }, () => Array(10).fill(0)),
          opponentBoard: Array.from({ length: 10 }, () => Array(10).fill(0)),
          userBoardUI: Array.from({ length: 10 }, () => Array(10).fill(0)),
          opponentBoardUI: Array.from({ length: 10 }, () => Array(10).fill(0)),
          opponent: null,
          opponentID: null,
          userShips: 0,
          opponentShips: 0,
          duration: null,
          startTime: null,
          turn: "user",
          status: "open",
          winner: null,
        },
      }
    );
    res.status(200).json({ message: "All games reset successfully" });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
