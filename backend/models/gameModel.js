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
    },
    opponentBoard: {
      type: [[Number]],
      default: defaultBoard,
    },
    userBoardUI: {
      type: [[Number]],
      default: defaultBoard,
    },
    opponentBoardUI: {
      type: [[Number]],
      default: defaultBoard,
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
    },
    turn: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return this.userID;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Game", GameSchema);
