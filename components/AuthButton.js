import React, { useState } from "react";

export default function AuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    if (isAuthenticated) {
      // Add logout logic here
      setIsAuthenticated(false);
    } else {
      // Add login logic here
      setIsAuthenticated(true);
    }
  };

  return (
    <button
      onClick={handleAuth}
      className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#d946ef] to-[#0ea5e9] hover:from-[#a23dc7] hover:to-[#087fbe] transition duration-300 ease-in-out shadow-lg"
    >
      {isAuthenticated ? "Sign Out" : "Sign In"}
    </button>
  );
}
