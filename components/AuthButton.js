import React, { useState } from "react";
import LoginModal from "./LoginModal";

export default function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track if the user is logged in
  const [showModal, setShowModal] = useState(false);  // Track modal visibility

  // Handle authentication (login or logout)
  const handleAuth = () => {
    if (isAuthenticated) {
      // Logout logic: clear user data, mark as logged out
      setIsAuthenticated(false);
      // Optionally, clear localStorage or cookies
    } else {
      // Show the login/signup modal
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);  // Close the modal
  };

  const handleSignUp = async (email, password) => {
    // Call the API for user sign-up
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.message === "User created successfully") {
      // Handle success (e.g., mark as authenticated)
      setIsAuthenticated(true);
      console.log("Signup successful");
    } else {
      // Handle error (e.g., show error message)
      console.error(data.message);
    }
  };

  const handleLogin = async (email, password) => {
    // Call the API for user login
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.message === "Login successful") {
      // Handle success (e.g., mark as authenticated)
      setIsAuthenticated(true);
      console.log("Login successful");
    } else {
      // Handle error (e.g., show error message)
      console.error(data.message);
    }
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
        />
      )}
    </>
  );
}
