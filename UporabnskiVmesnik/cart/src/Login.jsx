import React, { useState } from "react";
import { login, useLoggedIn } from "./cart";  // Assuming login function exists in cart

export default function Login() {
  const loggedIn = useLoggedIn();
  const [showLogin, setShowLogin] = useState(false);

  const [username, setUsername] = useState("john_doe");
  const [password, setPassword] = useState("securepassword");
  
  const [errorMessage, setErrorMessage] = useState("");  // State for error message

  if (loggedIn) return null;

  const handleLogin = async () => {
    try {
      const response = await login(username, password); // assuming login is async
      if (response.success) {
        setShowLogin(false);  // Hide login form if login is successful
      } else {
        setErrorMessage("Invalid username or password!");  // Set error if login fails
      }
    } catch (error) {
      setErrorMessage("Wrong username or password");
    }
  };

  return (
    <>
      <span onClick={() => setShowLogin(!showLogin)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          id="showlogin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      </span>
      
      {showLogin && (
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
            placeholder="Uporabniško ime"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
            className="border text-sm border-gray-400 p-2 rounded-md w-full text-text-base-dark"
          />
          
          <input
            type="password" 
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            className="border text-sm border-gray-400 p-2 rounded-md w-full mt-3 text-text-base-dark"
          />
          
          {/* Show error message if login fails */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <button
            className="bg-green-900 border-2 py-2 px-5 rounded-md text-sm mt-5 text-text-base"
            onClick={handleLogin}
            id="loginbtn"
          >
            Vpis
          </button>
        </div>
      )}
    </>
  );
}