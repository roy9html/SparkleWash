import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Bubbles, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
      toast.error("Invalid reset link. Please request a new one.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success("Your password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="grid justify-items-center shadow-[0_4px_6px_-1px_rgba(41,40,40,0.6)] mx-auto px-4 py-8 rounded-lg bg-gray-400 max-w-md mt-10 mb-10">
          <h1 className="text-3xl font-bold mb-4 text-black">Invalid Reset Link</h1>
          <p className="text-white text-center">{error}</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Request New Link
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="grid justify-items-center shadow-[0_4px_6px_-1px_rgba(41,40,40,0.6)] mx-auto px-4 py-8 rounded-lg bg-gray-400 max-w-md mt-10 mb-10">
        <h1 className="text-5xl font-bold mb-4 text-black">SparkleWash</h1>
        <h1 className="text-3xl font-bold mb-4 text-black">Set New Password</h1>
        <Bubbles className="text-5xl font-bold mb-4 text-blue-500" />
        <p className="text-white text-center mb-6">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-white font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="••••••••"
                minLength="6"
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

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition-colors duration-300"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-white">Remember your password? </span>
          <span
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;