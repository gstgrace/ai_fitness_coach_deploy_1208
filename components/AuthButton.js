import React, { useState } from "react";
import LoginModal from "./LoginModal";

export default function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAuth = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");  // Clear the token
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
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
        {isAuthenticated ? "Sign Out" : "Sign In"}
      </button>
      {showModal && (
        <LoginModal
          onClose={handleModalClose}
          onSignUp={handleSignUp}
          onLogin={handleLogin}
          setIsAuthenticated={setIsAuthenticated} // Pass the setter here
        />
      )}
    </>
  );
}
