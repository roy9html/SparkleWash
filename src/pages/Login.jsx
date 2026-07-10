import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const Login = () => {
  const { Login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(email, password);
      await Login(email, password);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Howdy! Please try again my Sparrow.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <div>
      {/* <Navbar /> */}
      <div className="grid justify-items-center shadow-[0_4px_6px_-1px_rgba(41,40,40,0.6)] mx-auto px-4 py-8 rounded-lg bg-gray-400 max-w-md mt-10">
        <h1 className="text-5xl font-bold mb-4">SparkeSplash</h1>
        <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-white font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-white font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="grid justify-items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <h1
            className="mb-4 mt-4 text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            click here to register
          </h1>
          <h1
            className="mb-4 text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            forgot your password?
          </h1>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
};
export default Login;
