import { useParams, Link } from "react-router-dom";
import { useProduct, ProductImage, ProductDetails, ProductActions } from "@/entities/product";
import { Spinner } from "@/shared/ui";
import "./ProductDetailsPage.css";

export function ProductDetailsPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <Spinner />
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error al cargar el producto:", error);
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Error al cargar el producto</h2>
          <p>No se pudo cargar la información del producto. Por favor, intenta de nuevo más tarde.</p>
          <Link to="/" className="back-link-button">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe.</p>
          <Link to="/" className="back-link-button">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        ← Volver al catálogo
      </Link>

      <div className="product-details-layout">
        <div className="product-image-column">
          <ProductImage product={product} />
        </div>

        <div className="product-info-column">
          <ProductDetails product={product} />
          <ProductActions key={product.id} product={product} />
        </div>
      </div>
    </div>
  );
}