// Import the User model from the models directory
// This model defines the schema for user data and provides methods to interact with the users collection in the database
const User = require("../models/User");

// Import the jsonwebtoken library for creating and verifying JWTs (JSON Web Tokens)
// JWTs are used for secure authentication and maintaining user sessions
const jwt = require("jsonwebtoken");

// Export the register function that handles new user registration
// This function is exposed as an API endpoint, likely at /api/auth/register
exports.register = async (req, res) => {
  // Extract user registration data from the request body
  // These fields should match the form fields in the registration page
  const { firstName, lastName, email, password } = req.body;
  
  // Check if a user with the provided email already exists in the database
  // This prevents duplicate user accounts with the same email
  const user = await User.findOne({ email: email });
  
  // If a user with this email exists, return an error response
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  
  // Create a new User instance with the provided registration data
  // This follows the User schema defined in the User model
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
  });
  
  try {
    // Save the new user to the database
    // This creates a new document in the users collection
    await newUser.save();
    
    // Return a success response with status code 201 (Created)
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // If an error occurs during user creation, return a server error response
    // This could happen due to database connection issues or validation errors
    res.status(500).json({ message: "Server error", error });
  }
};

// Helper function to generate a JWT access token for authenticated users
// This function is used internally by the login function
const generateAccessToken = (user) => {
  // Create and sign a JWT containing user information
  // The token will be used to authenticate subsequent requests
  return jwt.sign(
    {
      // Include essential user information in the token payload
      id: user.id,          // User's unique identifier
      email: user.email,    // User's email
      firstName: user.firstName, // User's first name
      lastName: user.lastName,   // User's last name
    },
    // Use a secret key from environment variables to sign the token
    // This secret should be kept secure and not exposed in the code
    process.env.JWT_ACCESS_SECRET,
    {
      // Set token expiration time to 10 hours
      // After this time, the user will need to log in again
      expiresIn: "10h",
    }
  );
};

// Export the login function that authenticates users
// This function is exposed as an API endpoint, likely at /api/auth/login
exports.login = async (req, res) => {
  // Extract login credentials from the request body
  // These should match the form fields in the login page
  const { email, password } = req.body;
  
  try {
    // Find a user with the provided email in the database
    const user = await User.findOne({ email: email });
    
    // If no user is found or the password doesn't match, return an error
    // Note: In production, this should use a secure password comparison method like bcrypt.compare()
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    
    // Log successful user lookup for debugging
    console.log("User found:", user.email);
    
    // Generate an access token for the authenticated user
    const accessToken = generateAccessToken(user);
    
    // Set the access token as an HTTP-only cookie
    // This is more secure than storing the token in localStorage
    res.cookie("accessToken", accessToken, {
      httpOnly: true,     // Prevents JavaScript access to the cookie
      secure: true,       // Only sent over HTTPS
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
    });
    
    // Return a success response with the access token
    // The client can store this token for API requests
    res.status(200).json({
      message: "Login successful",
      accessToken,
    });
    
    // Log the generated access token for debugging
    console.log("Access Token granted:", accessToken);
  } catch (error) {
    // If an error occurs during authentication, log it and return a server error
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Export the user function that returns the current user's data
// This function is exposed as an API endpoint, likely at /api/auth/user
// It would be protected by authentication middleware that adds the user to req.user
exports.user = async (req, res) => {
  // Return the user data that was attached to the request by auth middleware
  // This endpoint allows the frontend to get the current user's information
  res.status(200).json({
    message: "User data retrieved successfully",
    user: req.user,
  });
  
  // Log that user data was sent for debugging
  console.log("User data sent:", req.user);
};

// Export the logout function that ends a user's session
// This function is exposed as an API endpoint, likely at /api/auth/logout
exports.logout = (req, res) => {
  // Clear the access token cookie to log the user out
  // This invalidates the user's session
  res.clearCookie("accessToken", {
    httpOnly: true,     // Must match the cookie settings used during login
    secure: true,
    sameSite: "Strict",
  });
  
  // Return a 204 status code (No Content)
  // This indicates successful logout with no response body needed
  return res.sendStatus(204);
};


















// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// exports.register = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;
//   const user = await User.findOne({ email: email });
//   if (user) {
//     return res.status(400).json({ message: "User already exists" });
//   }
//   const newUser = new User({
//     firstName,
//     lastName,
//     email,
//     password,
//   });
//   try {
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// const generateAccessToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//     },
//     process.env.JWT_ACCESS_SECRET,
//     {
//       expiresIn: "10h",
//     }
//   );
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email: email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ message: "Invalid email or password!" });
//     }
//     console.log("User found:", user.email);
//     const accessToken = generateAccessToken(user);
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     res.status(200).json({
//       message: "Login successful",
//       accessToken,
//     });
//     console.log("Access Token granted:", accessToken);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// exports.user = async (req, res) => {
//   res.status(200).json({
//     message: "User data retrieved successfully",
//     user: req.user,
//   });
//   console.log("User data sent:", req.user);
// };

// exports.logout = (req, res) => {
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "Strict",
//   });
//   return res.sendStatus(204); // No Content
// };
