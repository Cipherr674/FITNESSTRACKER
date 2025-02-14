import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  // Function to fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      sessionStorage.removeItem("token");
      setUser(null);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        await fetchUserProfile(token);
      } catch (error) {
        console.error("Auth check failed:", error);
        sessionStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const loginRes = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      if (loginRes.data && loginRes.data.token) {
        // Store token and update state
        sessionStorage.setItem("token", loginRes.data.token);
        setToken(loginRes.data.token);
        // Fetch user profile with the new token
        const userProfile = await fetchUserProfile(loginRes.data.token);
        if (userProfile) {
          // Redirect based on role: admin users go to /admin, others to /dashboard.
          navigate(userProfile.role === "admin" ? "/admin" : "/dashboard");
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
