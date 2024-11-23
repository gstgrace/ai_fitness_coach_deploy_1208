import React from "react";

export default function Intro() {
  return (
    <div className={"text-md text-zinc-600 mt-3"}>
      <p className={"font-semibold text-2xl"}>
        Welcome to the CS5500 AI-Powered Fitness Coach!
      </p>
      <p className="mt-2">
        Unleash your potential with exercise plans crafted just for you! Whether
        you’re taking your first step or pushing new limits, we’re here to help
        you become the best version of yourself.{" "}
        <span className="mt-2 font-bold">
          Begin your fitness journey now and see the difference!
        </span>
      </p>
    </div>
  );
}
