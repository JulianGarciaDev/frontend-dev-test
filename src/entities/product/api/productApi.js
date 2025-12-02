import { fetchAPI } from "@/shared/api/base";
import { getCachedData, setCachedData } from "@/shared/api/cache";

export const productApi = {
  async getAll() {
    const cached = getCachedData("products");
    if (cached && cached.length > 0) return cached;

    const data = await fetchAPI("/product");
    setCachedData("products", data);
    return data;
  },

  async getById(id) {
    const cached = getCachedData(`product_${id}`);
    if (cached && Object.keys(cached).length > 0) return cached;

    const data = await fetchAPI(`/product/${id}`);
    setCachedData(`product_${id}`, data);
    return data;
  },
};