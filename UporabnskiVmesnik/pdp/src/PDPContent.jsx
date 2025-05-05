import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "home/products";
import placeAddToCart from "addtocart/placeAddToCart";

export default function PDPContent() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      getProductById(id).then(setProduct);
    } else {
      setProduct(null);
    }
  }, [id]);

  const addToCart = useRef(null);

  useEffect(() => {
    if (addToCart.current) {
      placeAddToCart(addToCart.current, product.id);
    }
  }, [product]);

  if (!product) return null;

  return (
<a
  className="block p-6 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:bg-gray-50 transition dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="flex items-center justify-center bg-gray-100 rounded-xl h-64 dark:bg-gray-700">
      {/* Placeholder for product image or other content */}
      <span className="text-gray-400">[Product Image]</span>
    </div>

    <div className="flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{product.name}</h1>

        <div className="text-gray-600 dark:text-gray-300 space-y-2">
          <p><span className="font-semibold">Description:</span> {product.description}</p>
          <p><span className="font-semibold">Part Number:</span> {product.partNumber}</p>
          <p><span className="font-semibold">Manufacturer:</span> {product.manufacturer}</p>
          <p><span className="font-semibold">Category:</span> {product.category}</p>
          <p><span className="font-semibold">Stock:</span> {product.stock}</p>
          <p><span className="font-semibold">Price:</span> ${product.price}</p>
        </div>
      </div>

      <div className="mt-6" ref={addToCart}></div>
    </div>
  </div>
</a>
  );
}
