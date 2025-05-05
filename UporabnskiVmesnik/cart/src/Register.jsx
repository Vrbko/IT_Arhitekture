import React, { useState } from "react";
import { register, useLoggedIn } from "./cart";  // Assuming register function exists in cart

export default function Register() {
  const loggedIn = useLoggedIn();
  const [showRegister, setShowRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");  // Assuming email is required for registration
  const [errorMessage, setErrorMessage] = useState("");  // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  if (loggedIn) return null;

  const handleRegister = async () => {
    // Check if the fields are not empty
    if (!username || !password || !email) {
      setErrorMessage("All fields are required!");
      return;
    }

    try {
      const response = await register(username, email, password); // assuming register is async and takes username, email, and password
      if (response["message"] == "User created successfully") {
        setSuccessMessage("Registration successful! You can now log in.");
      } else {
        setErrorMessage("Registration failed. Please try again." + JSON.stringify(response));
      }
    } catch (error) {
      setErrorMessage("There was an error during registration." + response);
    }
  };

  return (
    <>
      <span onClick={() => setShowRegister(!showRegister)}>
      <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth="2"
  id="showregister"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M16 12v4m0 0h4m-4 0h-4m8-5c0-2.5-2-4.5-4.5-4.5S15 7.5 15 10s2 4.5 4.5 4.5S20 12.5 20 10zM16 14a4 4 0 10-8 0 4 4 0 008 0z"
  />
</svg>
      </span>
      
      {showRegister && (
        <div
          className="absolute p-5 border-2 border-blue-800 bg-primary rounded-xl"
          style={{
            width: 300,
            top: "10rem",
            left: "50%",
            transform: "translateX(-50%)", // Centers the form horizontally
          }}
        >
          {/* Input fields */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
            className="border text-sm border-gray-400 p-2 rounded-md w-full text-text-base-dark"
          />
          
          <input
            type="email"  // Email input for registration
            placeholder="Email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            className="border text-sm border-gray-400 p-2 rounded-md w-full mt-3 text-text-base-dark"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            className="border text-sm border-gray-400 p-2 rounded-md w-full mt-3 text-text-base-dark"
          />
          
          {/* Show success or error message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mt-2">{successMessage}</div>
          )}

          <button
            className="bg-green-900 border-2 py-2 px-5 rounded-md text-sm mt-5 text-text-base"
            onClick={handleRegister}
            id="registerbtn"
          >
            Register
          </button>
        </div>
      )}
    </>
  );
}