import React, { createContext, useState, useContext, useEffect } from "react";
const AuthContext = createContext();
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.get("/api/auth/user", {
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
    await axios.post("/api/auth/logout", null, {
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
