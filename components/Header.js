import React from "react";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <div className="p-4 border-b fixed w-full z-50 bg-white">
      <div className="max-w-5xl mx-auto relative">
        <h1
          className="inline-block text-transparent bg-clip-text text-5xl font-bold bg-gradient-to-r from-[#d946ef] to-[#0ea5e9]"
        >
          AI-Powered Fitness Coach
        </h1>
        {/* AuthButton positioned at the top-right */}
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
