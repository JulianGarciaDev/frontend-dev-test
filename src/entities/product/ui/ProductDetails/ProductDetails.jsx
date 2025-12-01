import "./ProductDetails.css";

export function ProductDetails({ product }) {
  return (
    <div className="product-details">
      <div className="product-details__header">
        <span className="product-details__brand">{product.brand}</span>
        <h1 className="product-details__title">{product.model}</h1>
        <p className="product-details__price">{product.price}€</p>
      </div>

      {product.description && (
        <div className="product-details__description">
          <p>{product.description}</p>
        </div>
      )}

      <div className="product-details__specs">
        <h2>Especificaciones técnicas</h2>
        
        <div className="specs-grid">
          {product.cpu && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Procesador</strong>
                <span>{product.cpu}</span>
              </div>
            </div>
          )}
          
          {product.ram && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Memoria RAM</strong>
                <span>{product.ram}</span>
              </div>
            </div>
          )}
          
          {product.os && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Sistema Operativo</strong>
                <span>{product.os}</span>
              </div>
            </div>
          )}
          
          {product.displayResolution && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Resolución de Pantalla</strong>
                <span>{product.displayResolution}</span>
              </div>
            </div>
          )}
          
          {product.displaySize && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Tamaño de Pantalla</strong>
                <span>{product.displaySize}"</span>
              </div>
            </div>
          )}
          
          {product.battery && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Batería</strong>
                <span>{product.battery}</span>
              </div>
            </div>
          )}
          
          {(product.primaryCamera || product.secondaryCamera) && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Cámaras</strong>
                <span>
                  {product.primaryCamera && `Principal: ${product.primaryCamera}`}
                  {product.primaryCamera && product.secondaryCamera && <br />}
                  {product.secondaryCamera && `Frontal: ${product.secondaryCamera}`}
                </span>
              </div>
            </div>
          )}

          {product.dimentions && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Dimensiones</strong>
                <span>{product.dimentions}</span>
              </div>
            </div>
          )}

          {product.weight && (
            <div className="spec-item">
              <div className="spec-content">
                <strong>Peso</strong>
                <span>{product.weight}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
