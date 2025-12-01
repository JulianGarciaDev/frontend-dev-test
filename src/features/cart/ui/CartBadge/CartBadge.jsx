import { useCart } from "../../model/useCart";
import "./CartBadge.css";

export function CartBadge() {
  const { cartCount } = useCart();

  return (
    <div className="cart-badge">
      <span className="cart-badge__label">Carrito</span>
      {cartCount > 0 && (
        <span className="cart-badge__count">{cartCount}</span>
      )}
    </div>
  );
}
