import React, { useState } from "react";
import toast from "react-hot-toast";

export default function LoginModal({ onClose, onLogin, onSignUp, loading, setIsAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage inline errors

  // Success and error feedback using toast
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await onLogin(email, password);
      if (response.status !== 200) {
        throw new Error();
      }
      toast.success("Login successful!");
      setIsAuthenticated(true); // Set as authenticated after successful login
      onClose(); // Close modal on success
    } catch (err) {
      toast.error("Please check your credentials and try again.");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await onSignUp(email, password);
      if (response.status !== 201) {
        throw new Error();
      } else {
        // After successful sign-up, automatically log in the user
        const loginResponse = await onLogin(email, password); // Auto-login after sign-up
        if (loginResponse.status !== 200) {
          throw new Error("Login failed after sign-up. Please try again.");
        }
        toast.success("Sign-up and Login successful!");
        setIsAuthenticated(true); // Set as authenticated after successful sign-up and login
        onClose(); // Close modal on success
      }
    } catch (err) {
      toast.error("Sign-up failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-500 text-white text-center p-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#d946ef] to-[#0ea5e9] text-white rounded hover:from-[#a23dc7] hover:to-[#087fbe]"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
