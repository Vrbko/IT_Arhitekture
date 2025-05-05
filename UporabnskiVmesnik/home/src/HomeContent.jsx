import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "./products";
import { addToCart, useLoggedIn } from "cart/cart";

export default function HomeContent() {
  const loggedIn = useLoggedIn();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-start gap-6 p-5 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <div className="flex-1">
            <Link to={`/product/${product.id}`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:underline">
                {product.name}
              </h2>
            </Link>
            <p className="mt-2 text-gray-700 dark:text-gray-400">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-400">
              <strong>Part Number:</strong> {product.partNumber}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-400">
              <strong>Manufacturer:</strong> {product.manufacturer}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-400">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-400">
              <strong>Stock:</strong> {product.stock}
            </p>
            <p className="mt-1 text-gray-700 dark:text-gray-400">
              <strong>Price:</strong> ${product.price.toFixed(2)}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between">
              <Link
                to={`/product/${product.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details →
              </Link>
          
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}