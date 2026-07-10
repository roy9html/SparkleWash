import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext"; 

const ResetPassword = () => {
  const { resetPassword } = useAuth(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email); 
      toast.success("Password reset link sent to your email!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid justify-items-center shadow-[0_4px_6px_-1px_rgba(41,40,40,0.6)] mx-auto px-4 py-8 rounded-lg bg-gray-400 max-w-md mt-10">
      <h1 className="text-5xl font-bold mb-4 text-black">SparkeSplash</h1>
      <h1 className="text-3xl font-bold mb-4 text-black">Reset Password</h1>
      <p className="text-white text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition-colors duration-300"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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
  );
};

export default ResetPassword;