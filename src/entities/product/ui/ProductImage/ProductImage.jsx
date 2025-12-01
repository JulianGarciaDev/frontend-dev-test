import "./ProductImage.css";

export function ProductImage({ product }) {
  return (
    <div className="product-image">
      <img 
        src={product.imgUrl} 
        alt={`${product.brand} ${product.model}`}
        className="product-image__img"
      />
    </div>
  );
}
