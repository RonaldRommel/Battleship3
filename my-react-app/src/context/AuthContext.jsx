// // Import necessary hooks and functions from React
// import React, { createContext, useState, useContext, useEffect } from "react";
// // Create a new Context object that will hold authentication state and functions
// const AuthContext = createContext();
// // Import axios for making HTTP requests to the backend
// import axios from "axios";

// // Define the AuthProvider component that will wrap the application
// // It accepts children props which are the components that will have access to the auth context
// const AuthProvider = ({ children }) => {
//   // Create a state variable 'user' to store the authenticated user's information
//   // Initially set to null (no user logged in)
//   const [user, setUser] = useState(null);

//   // Create a state variable to track whether a user is authenticated
//   // Initially set to false (not authenticated)
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Define a function to handle user login
//   // This function fetches the current user's data from the server
//   const handleLogin = async () => {
//     try {
//       // Make a GET request to the authentication endpoint
//       // withCredentials: true ensures cookies are sent with the request (important for session-based auth)
//       const res = await axios.get("/api/auth/user", {
//         withCredentials: true,
//       });
//       // Update the user state with the user data from the response
//       setUser(res.data.user);
//       // Log the user data to the console (for debugging)
//       console.log("User data:", res.data.user);
//       // Set authentication status to true
//       setIsAuthenticated(true);
//     } catch (error) {
//       // Log any errors that occur during the authentication process
//       console.error("Error fetching user data:", error);
//     }
//   };

//   // Use the useEffect hook to run handleLogin when the component mounts
//   // This checks if the user is already logged in when the app loads
//   // The empty dependency array [] means this only runs once when the component mounts
//   useEffect(() => {
//     handleLogin();
//   }, []);

//   // Define a function to handle user logout
//   const handleLogout = async () => {
//     // Make a POST request to the logout endpoint
//     // null is passed as the second parameter since no data needs to be sent
//     await axios.post("/api/auth/logout", null, {
//       withCredentials: true,
//     });
//     // Reset the user state to null (no user)
//     setUser(null);
//     // Set authentication status to false
//     setIsAuthenticated(false);
//   };

//   // Return the AuthContext.Provider component with the value prop containing
//   // all the authentication-related state and functions
//   return (
//     <AuthContext.Provider
//       value={{
//         handleLogin,     // Function to log in
//         handleLogout,    // Function to log out
//         user,            // Current user data
//         isAuthenticated, // Boolean indicating if user is authenticated
//       }}
//     >
//       {/* Render all the child components that need access to the auth context */}
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Create a custom hook that makes it easier to use the auth context
// // This allows components to access the auth context without having to use useContext directly
// const useAuthContext = () => useContext(AuthContext);

// // Export both the provider component and the custom hook
// export { AuthProvider, useAuthContext };
const API = import.meta.env.VITE_API_BASE_URL;

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  use,
} from "react";
const AuthContext = createContext();
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    try {
      console.log("API URL:", API);
      const res = await axios.get(API + "/api/auth/user", {
        withCredentials: true,
      });
      setUser(res.data.user);
      console.log("User data:", res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    handleLogin();
  }, []);

  const handleLogout = async () => {
    await axios.post(API + "/api/auth/logout", null, {
      withCredentials: true,
    });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        handleLogout,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
