import React, { useState } from "react";
import LoginModal from "./LoginModal";
import toast from "react-hot-toast";

export default function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogOutConfirmation, setShowLogOutConfirmation] = useState(false); // State for confirmation modal

  const handleAuth = () => {
    if (isAuthenticated) {
      // Show the confirmation modal before logging out
      setShowLogOutConfirmation(true);
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");  // Clear the token
    setShowLogOutConfirmation(false); // Close the confirmation modal
    toast.success("Log out successfully!");
  };

  const handleCancelLogOut = () => {
    setShowLogOutConfirmation(false); // Close the confirmation modal without logging out
  };

  const handleSignUp = async (email, password) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response;
  };

  const handleLogin = async (email, password) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response;
  };

  return (
    <>
      <button
        onClick={handleAuth}
        className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#d946ef] to-[#0ea5e9] hover:from-[#a23dc7] hover:to-[#087fbe] transition duration-300 ease-in-out shadow-lg"
      >
        {isAuthenticated ? "Log Out" : "Sign In"}
      </button>

      {/* Show login modal when needed */}
      {showModal && (
        <LoginModal
          onClose={handleModalClose}
          onSignUp={handleSignUp}
          onLogin={handleLogin}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      {/* Log Out Confirmation Modal */}
      {showLogOutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Log Out</h2>
            <p className="mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-gradient-to-r from-[#d946ef] to-[#0ea5e9] text-white rounded hover:from-[#a23dc7] hover:to-[#087fbe]"
              >
                Yes, Log Out
              </button>
              <button
                onClick={handleCancelLogOut}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
