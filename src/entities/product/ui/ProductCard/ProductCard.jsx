import { Link } from "react-router-dom";
import { formatPrice, isPriceAvailable } from '@/shared/lib/formatPrice';
import "./ProductCard.css";

export function ProductCard({ product }) {
  return (

    <Link 
      to={`/product/${product.id}`}
      className="product-card"
      data-testid="product-card"
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
        <p className="product-card__model" data-testid="product-card-model">{product.model}</p>
        <p 
          className={`product-card__price ${!isPriceAvailable(product.price) ? 'product-card__price--unavailable' : ''}`}
        >
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}