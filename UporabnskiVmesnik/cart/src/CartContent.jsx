import React, { useState, useEffect } from "react";
import { cart, clearCart,postCartData } from "cart/cart";

export default function CartContent() {
  const [items, setItems] = useState([]);

  useEffect(
    () => cart.subscribe((value) => setItems(value?.cartItems ?? [])),
    []
  );

  const totalAmount = items.reduce((a, v) => a + v.quantity * v.price, 0).toFixed(2);
  return (
    <>
      <div className="my-10 max-w-6xl mx-auto">
        {/* Cart Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Količina</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Ime</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 text-right">Cena</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-6 py-3 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 text-right">
                    {item.quantity * item.price} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand Total */}
        <div className="flex justify-end mt-5 text-lg font-semibold">
          <span>Skupaj: </span>
          <span className="ml-2 text-green-900">{totalAmount} €</span>
        </div>

        {/* Buttons */}
        {items.length > 0 && (
          <div className="flex justify-between mt-8">
<button
  id="clearcart"
  className="bg-white border border-red-600 text-red-600 py-3 px-8 rounded-md text-sm font-semibold hover:bg-red-200 transition ease-in-out duration-300 shadow-lg transform hover:scale-105"
  onClick={clearCart}
>
  Počisti Košarico
</button>
<button
  id="postcart"
  className="bg-green-900 text-white py-3 px-8 rounded-md text-sm font-semibold hover:bg-green-800 transition ease-in-out duration-300 shadow-lg transform hover:scale-105"
  onClick={postCartData}
>
  Zaključi Naročilo
</button>
          </div>
        )}
      </div>
    </>
  );
}