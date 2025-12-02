import { Link } from "react-router-dom";
import "./ProductCard.css";

export function ProductCard({ product }) {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card"
    >
      <div className="product-card__image">
        <img 
          src={product.imgUrl} 
          alt={`${product.brand} ${product.model}`}
          loading="lazy"
        />
      </div>
      
      <div className="product-card__info">
        <h3 className="product-card__brand">{product.brand}</h3>
        <p className="product-card__model">{product.model}</p>
        <p className="product-card__price">{product.price}€</p>
      </div>
    </Link>
  );
}