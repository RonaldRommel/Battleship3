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

router.get("/:gameID", verifyToken, (req, res) => {
  gameController.joinActiveGame(req, res);
});

router.post("/joingame/:gameID", verifyToken, (req, res) => {
  gameController.joinGame(req, res);
});

router.post("/:gameID/move", verifyToken, (req, res) => {
  gameController.makeMove(req, res);
});

//DUMMY
router.get("/open/:gameID", async (req, res) => {
  const gameID = req.params.gameID;
  try {
    const game = await Game.findById(gameID);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json({ message: "Game found", game });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
