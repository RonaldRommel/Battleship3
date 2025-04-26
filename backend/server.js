// server.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/gameRoutes");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: ['http://localhost:4173',"https://ronaldrommel.github.io/Battleship3"], // frontend URL
  credentials: true, // Allow cookies to be sent with requests
};

const app = express();
const port = 3000 || process.env.PORT;
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// mongoose.connection.on("connected", () => {
//   console.log("MongoDB connected to: ", mongoose.connection.name);
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
