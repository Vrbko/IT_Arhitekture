import React from "react";
import { Link } from "react-router-dom";

import MiniCart from "cart/MiniCart";
import Login from "cart/Login";

export default function Header() {
  return (
    <div className="p-5 bg-primary text-text-base text-3xl font-bold text-white">
      <div className="flex items-center justify-between">
        {/* Left section: Brand or Navigation */}
        <div className="flex items-center space-x-5">
          <Link to="/" className="hover:underline">
            Iskanje po Avto Delih
          </Link>
        </div>
  
        {/* Right section: Cart, MiniCart, Login */}
        <div className="flex items-center space-x-6">
          <Link id="cart" to="/cart" className="hover:underline text-lg">
            Moja Košarica
          </Link>
          <MiniCart />
          <Login />
        </div>
      </div>
    </div>
  );
}
