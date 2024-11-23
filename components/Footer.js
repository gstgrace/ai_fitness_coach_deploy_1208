import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className={"flex-shrink-0 text-center text-md p-4 border-t bg-white"}>
      Created by{" "}
      <Link
        className={"text-primary-main"}
        href={"https://github.com/NaomiW7/AIFitnessCoach"}
        target={"_blank"}
        rel={"noopener noreferrer"}
      >
        CS5500 Final Project Group 10
      </Link>
    </div>
  );
}
