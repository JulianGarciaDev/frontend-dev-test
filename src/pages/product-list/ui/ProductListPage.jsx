import { useProducts, ProductGrid } from "@/entities/product";
import { useSearch, SearchBar } from "@/features/product-search";
import { Spinner } from "@/shared/ui";
import "./ProductListPage.css";

export function ProductListPage() {
  const { products, loading, error } = useProducts();
  
  const { query, setQuery, filtered } = useSearch(
    products,
    (product) => `${product.brand} ${product.model}`
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <Spinner />
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Error al cargar los productos</h2>
          <p>Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="search-container">
        <SearchBar value={query} onChange={setQuery} />
      </div>
      
      <ProductGrid products={filtered} />
    </div>
  );
}