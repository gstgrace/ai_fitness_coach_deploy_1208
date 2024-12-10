import React, { useState } from "react";
import toast from "react-hot-toast";

export default function LoginModal({ onClose, onLogin, onSignUp, loading, setIsAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage inline errors

  // Function to request the 2FA code from the backend
  const request2FACode = async (email) => {
    try {
      const response = await fetch("/api/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send 2FA code. Please try again.");

      const data = await response.json();
      return data.generatedCode;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred.");
      return null;
    }
  };

  // Function to handle sign-up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous error messages

    try {
      // Step 1: Request 2FA Code
      const generatedCode = await request2FACode(email);
      if (!generatedCode) return toast.error("Failed to request 2FA code, please try again.");

      // Step 2: Prompt for 2FA Code
      const enteredCode = prompt("Enter the 2FA code sent to your email:");

      if (!enteredCode || enteredCode !== generatedCode) {
        // Combined error handling for invalid or missing code
        toast.error(enteredCode ? "Invalid 2FA code." : "2FA code is required.");
        return;
      }

      // Step 3: Write User to Database (sign-up)
      const signUpResponse = await onSignUp(email, password);
      if (signUpResponse.status !== 201) throw new Error("Sign-up failed. User already exists.");

      // Step 4: Auto-login After Successful Sign-Up
      const loginResponse = await onLogin(email, password);
      if (loginResponse.status !== 200) throw new Error("Login failed after sign-up.");

      toast.success("Sign-up and Login successful!");
      setIsAuthenticated(true); // Set as authenticated after successful login
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err); // For debugging
      toast.error(err.message || "An error occurred during sign-up.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    try {
      // Step 1: Attempt login
      const response = await onLogin(email, password);
      if (response.status !== 200) {
        throw new Error("Invalid credentials.");
      }

      // Step 2: Request 2FA Code if login is successful
      const generatedCode = await request2FACode(email); // Send request to backend to send 2FA code
      if (!generatedCode) {
        throw new Error("Failed to request 2FA code, please try again.");
      }

      // Step 3: Prompt for 2FA Code
      const enteredCode = prompt("Enter the 2FA code sent to your email:");

      if (!enteredCode || enteredCode !== generatedCode) {
        // Combined error handling for invalid or missing code
        toast.error(enteredCode ? "Invalid 2FA code." : "2FA code is required.");
        return;
      }

      // Step 4: Complete login process if 2FA validation is successful
      toast.success("Login successful!");
      setIsAuthenticated(true); // Set as authenticated after successful login
      onClose(); // Close modal on success

    } catch (err) {
      console.error(err); // Debugging information
      toast.error(err.message || "An error occurred during login.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Log In"}</h2>

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

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#d946ef] to-[#0ea5e9] text-white rounded hover:from-[#a23dc7] hover:to-[#087fbe]"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
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
