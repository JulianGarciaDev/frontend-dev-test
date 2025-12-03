import { useState } from "react";
import { useCart } from "../../model/useCart";
import "./AddToCart.css";

export function AddToCart({ product, colorCode, storageCode }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    try {
      setAdding(true);
      setError(null);
      
      await addToCart(product.id, colorCode, storageCode);
    } catch (err) {
      console.error("Error al añadir al carrito:", err);
      setError("Error al añadir el producto al carrito");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="add-to-cart">
      {error && (
        <div className="add-to-cart__error">
          {error}
        </div>
      )}
      <button 
        onClick={handleAdd}
        className="add-to-cart__button"
        disabled={adding}
        data-testid="add-to-cart-button"
      >
        {adding ? "Añadiendo..." : "Añadir al carrito"}
      </button>
    </div>
  );
}