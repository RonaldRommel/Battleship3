const mongoose = require("mongoose");

const defaultBoard = Array.from({ length: 10 }, () => Array(10).fill(0));

const GameSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    opponent: {
      type: String,
      default: null,
    },
    opponentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userBoard: {
      type: [[Number]],
      default: defaultBoard,
      required: true,
    },
    opponentBoard: {
      type: [[Number]],
      default: defaultBoard,
      required: true,
    },
    userBoardUI: {
      type: [[Number]],
      default: defaultBoard,
      required: true,
    },
    opponentBoardUI: {
      type: [[Number]],
      default: defaultBoard,
      required: true,
    },
    userShips: {
      type: Number,
      default: 0,
      required: true,
    },
    opponentShips: {
      type: Number,
      default: 0,
      required: true,
    },
    winner: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    startTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "active", "completed"],
      default: "open",
      required: true,
    },
    turn: {
      type: String,
      enum: ["user", "opponent"],
      default: "user", // or whoever should start first
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", GameSchema);
