import React, { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

const API_SERVER = "http://localhost:8080";

export const jwt = new BehaviorSubject(null);
export const cart = new BehaviorSubject(null);

export const getCart = () =>
  fetch(`${API_SERVER}/cart`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      cart.next(res);
      return res;
    });

export const addToCart = (id) =>
  fetch(`${API_SERVER}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then(() => {
      getCart();
    });

export const clearCart = () =>
  fetch(`${API_SERVER}/cart`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,
    },
  })
    .then((res) => res.json())
    .then(() => {
      getCart();
    });

export const login = (username, password) =>
  fetch(`${API_SERVER}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      jwt.next(data.access_token);
      getCart();
      return data.access_token;
    });
    

    export const register = (username, email, password) =>
      fetch(`${API_SERVER}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("API data" , data);
          return data;
        });

export function useLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(!!jwt.value);
  useEffect(() => {
    setLoggedIn(!!jwt.value);
    return jwt.subscribe((c) => {
      setLoggedIn(!!jwt.value);
    });
  }, []);
  return loggedIn;
}

export const postCartData = () => {
  // Get the cart data (assuming the cart is stored in a variable called `cart`)
  const cartData = getCartData();  // Replace with your method of fetching cart data

  // Check if cart data exists
  if (!cartData || cartData.length === 0) {
    console.log("Cart is empty");
    return;  // Early exit if there's no data to send
  }
  console.log(cartData);
  // Make a POST request to send cart data to the API
  return fetch(`${API_SERVER}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.value}`,  // Assuming the JWT token is stored in `jwt.value`
    },
    body: JSON.stringify(cartData),  // Send the cart data as JSON in the body
  })
    .then((res) => {
      if (!res.ok) {
        // Handle any errors in case the API response is not successful
        throw new Error("Failed to post cart data");
      }
      return res.json();  // If the request is successful, parse the JSON response
    })
    .then(() => {
      // Clear the cart after the data is successfully posted
      clearCart();  // Assuming `clearCart` is a function to clear your cart state
      console.log("Cart data has been successfully sent and cleared.");
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch request
      console.error("Error posting cart data:", error);
    });

    
};


