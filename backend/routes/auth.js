const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/signup", (req, res) => {
  authController.register(req, res);
});

router.post("/login", (req, res) => {
  authController.login(req, res);
});

router.post("/logout", (req, res) => {
  authController.logout(req, res);
});

router.get("/user", verifyToken, (req, res) => {
  authController.user(req, res);
});

module.exports = router;
