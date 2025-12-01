import { useState, useEffect } from "react";
import { fetchAPI } from "@/shared/api/base";
import { CartContext } from "./cartContext";

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(() => {
    const saved = localStorage.getItem("cartCount");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("cartCount", cartCount.toString());
  }, [cartCount]);

  const addToCart = async (id, colorCode, storageCode) => {
    try {
      await fetchAPI("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: id.toString(), 
          colorCode: parseInt(colorCode, 10), 
          storageCode: parseInt(storageCode, 10) 
        }),
      });
      
      setCartCount(prev => prev + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}