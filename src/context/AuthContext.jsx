import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import { toast } from "sonner";


const AuthContext = createContext({});

const USE_MOCK_AUTH = true;

const DUMMY_USERS = [
  {
    id: 1,
    name: "Sparrowlen",
    email: "sparrowlen@example.com",
    password: "123456",
    role: "customer",
  },
  {
    id: 2,
    name: "Admin",
    email: "admin@example.com",
    password: "123456",
    role: "admin",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    if (USE_MOCK_AUTH) {
      const { password, ...mockUser } = DUMMY_USERS[0];
      setUser(mockUser);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const Login = async (email, password) => {
    if (USE_MOCK_AUTH) {
      const foundUser = DUMMY_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (!foundUser) {
        toast.error("Invalid email or password");
        throw new Error("Invalid email or password");
      }
      const { password: _, ...userWithoutPassword } = foundUser;
      const mockToken = "mock-jwt-token-" + Date.now();
      localStorage.setItem("accessToken", mockToken);
      setUser(userWithoutPassword);
      toast.success("Howdy! You are logged in.");
      return userWithoutPassword;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      toast.success("Howdy! You are logged in.");
      return user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed please try again.");
      throw error;
    }
  };

  const Logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.info("You have been logged out.");
  };

  const register = async (name, email, password) => {
    if (USE_MOCK_AUTH) {
      const exists = DUMMY_USERS.some((u) => u.email === email);
      if (exists) {
        toast.error("Email already registered");
        return { success: false };
      }
      toast.success("Welcome my Sparrow! Your account has been created.");
      return { success: true };
    }

    try {
      const response = await api.post("/auth/register", { name, email, password });
      const { accessToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      toast.success("Welcome my Sparrow! Your account has been created.");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "ill be damned! Registration failed, please try again.");
      return { success: false, error: error.response?.data?.message };
    }
  };

  const forgotPassword = async (email) => {
    if (USE_MOCK_AUTH) {
      toast.success("Password reset link has been sent to your email.");
      return;
    }
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Password reset link has been sent to your email.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Howdy! Failed to send password reset link, Please try again my friend."
      );
    }
  };

  const resetPassword = async (token, newPassword) => {
    if (USE_MOCK_AUTH) {
      toast.success("Your password has been reset successfully.");
      return;
    }
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      toast.success("Your password has been reset successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Howdy! Failed to reset password,please try again."
      );
    }
  };

  const value = {
    user,
    loading,
    Login,
    register,
    Logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};