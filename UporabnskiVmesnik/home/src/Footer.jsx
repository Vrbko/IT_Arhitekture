import React from "react";

export default function Footer() {
  return (
    <footer className="py-10 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">AutoParts Hub</h2>
        <p className="text-sm mb-4">
          Your one-stop shop for quality car parts and accessories.
        </p>
        <p className="text-xs ">
          &copy; {new Date().getFullYear()} AutoParts Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
