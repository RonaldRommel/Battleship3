import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log("Token from cookie:", token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

export { verifyToken };
