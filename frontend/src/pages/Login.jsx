import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, Bubbles, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const { Login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect if user already exists (e.g., after refresh)
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await Login(email, password);
      toast.success("Logged in successfully!");
      if (loggedInUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="grid justify-items-center shadow-[0_4px_6px_-1px_rgba(41,40,40,0.6)] mx-auto px-4 py-8 rounded-lg bg-gray-400 max-w-md mt-10 mb-10">
        <h1 className="text-5xl font-bold mb-4">SparkleWash</h1>
        <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
        <Bubbles className="text-5xl font-bold mb-4 text-blue-500" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="grid justify-items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 w-full transition-colors duration-300"
          >
            {loading ? "Logging in..." : "Login"}
            <LogIn />
          </button>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-blue-500 hover:text-blue-700 cursor-pointer">
              Click here to register
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link to="/reset-password" className="text-blue-500 hover:text-blue-700 cursor-pointer">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;