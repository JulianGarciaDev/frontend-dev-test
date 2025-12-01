import { ProductCard } from "../ProductCard/ProductCard";
import "./ProductGrid.css";

export function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}