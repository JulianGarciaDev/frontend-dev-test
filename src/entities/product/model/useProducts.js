import { useState, useEffect } from "react";
import { productApi } from "../api/productApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productApi
      .getAll()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setProduct(null);
    setError(null);

    const fetchProduct = async () => {
      try {
        const data = await productApi.getById(id);
        
        if (!data) {
          setError(new Error("Producto no encontrado"));
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchProduct();
  }, [id]);

  return { product, loading: isLoading, error };
}