import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { productApi } from './productApi';
import { fetchAPI } from '@/shared/api/base';
import { getCachedData, setCachedData } from '@/shared/api/cache';

vi.mock('@/shared/api/base');
vi.mock('@/shared/api/cache');

describe('productApi - Unit Tests', () => {
  const mockProducts = [
    { id: '1', brand: 'Acer', model: 'Iconia Talk S', price: '170', imgUrl: 'img1.jpg' },
    { id: '2', brand: 'Alcatel', model: 'Flash', price: '100', imgUrl: 'img2.jpg' },
  ];

  const mockProduct = mockProducts[0];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAll()', () => {
    describe('cache hit scenarios', () => {
      it('should return cached data when available and not make API request', async () => {
        getCachedData.mockReturnValue(mockProducts);

        const result = await productApi.getAll();

        expect(result).toEqual(mockProducts);
        
        expect(getCachedData).toHaveBeenCalledWith('products');
        expect(getCachedData).toHaveBeenCalledTimes(1);

        expect(fetchAPI).not.toHaveBeenCalled();
        expect(setCachedData).not.toHaveBeenCalled();
      });

      it('should return cached data immediately', async () => {
        getCachedData.mockReturnValue(mockProducts);

        const start = Date.now();
        const result = await productApi.getAll();
        const duration = Date.now() - start;

        expect(result).toEqual(mockProducts);
        expect(duration).toBeLessThan(10);
      });

      it('should fetch data when empty array products in cache', async () => {
        getCachedData.mockReturnValue([]);
        fetchAPI.mockResolvedValue(mockProducts);

        const result = await productApi.getAll();

        expect(result).toEqual(mockProducts);

        expect(getCachedData).toHaveBeenCalledWith('products');
        expect(fetchAPI).toHaveBeenCalled();
        expect(setCachedData).toHaveBeenCalledWith('products', mockProducts);
      });
    });

    describe('cache miss scenarios', () => {
      it.each([
        { cacheValue: null, description: 'null' },
        { cacheValue: undefined, description: 'undefined' },
        { cacheValue: false, description: 'false' },
      ])('should fetch data when cache is $description', async ({ cacheValue }) => {
        getCachedData.mockReturnValue(cacheValue);
        fetchAPI.mockResolvedValue(mockProducts);

        const result = await productApi.getAll();

        expect(result).toEqual(mockProducts);
        expect(getCachedData).toHaveBeenCalledWith('products');
        expect(fetchAPI).toHaveBeenCalledWith('/product');
        expect(fetchAPI).toHaveBeenCalledTimes(1);
        expect(setCachedData).toHaveBeenCalledWith('products', mockProducts);
      });
    });

    describe('error handling', () => {
      it('should not cache data on error and propagate it', async () => {
        getCachedData.mockReturnValue(null);
        fetchAPI.mockRejectedValue(new Error('Network error'));

        await expect(productApi.getAll()).rejects.toThrow('Network error');
        expect(setCachedData).not.toHaveBeenCalled();
      });
    });

    describe('data validation', () => {
      it('should handle empty array response', async () => {
        getCachedData.mockReturnValue(null);
        fetchAPI.mockResolvedValue([]);

        const result = await productApi.getAll();

        expect(result).toEqual([]);
        expect(setCachedData).toHaveBeenCalledWith('products', []);
      });

      it('should handle single product response', async () => {
        getCachedData.mockReturnValue(null);
        const singleProduct = [mockProduct];
        fetchAPI.mockResolvedValue(singleProduct);

        const result = await productApi.getAll();

        expect(result).toEqual(singleProduct);
      });

      it('should handle large dataset', async () => {
        getCachedData.mockReturnValue(null);
        const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
          id: `${i}`,
          brand: `Brand ${i}`,
          model: `Model ${i}`,
          price: `${i * 100}`,
          imgUrl: `img${i}.jpg`,
        }));
        fetchAPI.mockResolvedValue(largeDataset);

        const result = await productApi.getAll();

        expect(result).toHaveLength(1000);
        expect(setCachedData).toHaveBeenCalledWith('products', largeDataset);
      });

      it('should handle null response from API', async () => {
        getCachedData.mockReturnValue(null);
        fetchAPI.mockResolvedValue(null);

        const result = await productApi.getAll();

        expect(result).toBeNull();
        expect(setCachedData).toHaveBeenCalledWith('products', null);
      });
    });
  });

  describe('getById()', () => {
    describe('cache hit scenarios', () => {
      it('should return cached product when available and not make API request', async () => {
        getCachedData.mockReturnValue(mockProduct);

        const result = await productApi.getById('1');

        expect(result).toEqual(mockProduct);
        expect(getCachedData).toHaveBeenCalledWith('product_1');
        expect(fetchAPI).not.toHaveBeenCalled();
        expect(setCachedData).not.toHaveBeenCalled();
      });

      it('should fetch API when empty object in cache', async () => {
        getCachedData.mockReturnValue({});
        fetchAPI.mockResolvedValue(mockProduct);

        const result = await productApi.getById('1');

        expect(fetchAPI).toHaveBeenCalledWith('/product/1');
        expect(setCachedData).toHaveBeenCalledWith('product_1', mockProduct);
        expect(result).toEqual(mockProduct);
      });

      it('should return cached data immediately', async () => {
        getCachedData.mockReturnValue(mockProduct);

        const start = Date.now();
        const result = await productApi.getById('1');
        const duration = Date.now() - start;

        expect(result).toEqual(mockProduct);
        expect(duration).toBeLessThan(10);
      });
    });

    describe('cache miss scenarios', () => {
      it.each([
        { cacheValue: null, description: 'null' },
        { cacheValue: undefined, description: 'undefined' },
        { cacheValue: false, description: 'false' },
      ])('should fetch data when cache is $description', async ({ cacheValue }) => {
        getCachedData.mockReturnValue(cacheValue);
        fetchAPI.mockResolvedValue(mockProduct);

        const result = await productApi.getById('1');

        expect(result).toEqual(mockProduct);
        expect(fetchAPI).toHaveBeenCalledWith('/product/1');
        expect(setCachedData).toHaveBeenCalledWith('product_1', mockProduct);
      });
    });

    describe('error handling', () => {
      it('should not cache data on error and propagate it', async () => {
        getCachedData.mockReturnValue(null);
        fetchAPI.mockRejectedValue(new Error('Product not found'));

        await expect(productApi.getById('999')).rejects.toThrow('Product not found');
        expect(setCachedData).not.toHaveBeenCalled();
      });
    });

    describe('data validation', () => {
      it('should handle null response from API', async () => {
        getCachedData.mockReturnValue(null);
        fetchAPI.mockResolvedValue(null);

        const result = await productApi.getById('999');

        expect(result).toBeNull();
        expect(setCachedData).toHaveBeenCalledWith('product_999', null);
      });

      it('should handle empty object response', async () => {
        getCachedData.mockReturnValue(null);
        fetchAPI.mockResolvedValue({});

        const result = await productApi.getById('999');

        expect(result).toEqual({});
        expect(setCachedData).toHaveBeenCalledWith('product_999', {});
      });
    });

  });

  describe('API structure', () => {
    it('should export productApi object', () => {
      expect(productApi).toBeDefined();
      expect(typeof productApi).toBe('object');
    });

    it('should have getAll method', () => {
      expect(productApi.getAll).toBeDefined();
      expect(typeof productApi.getAll).toBe('function');
    });

    it('should have getById method', () => {
      expect(productApi.getById).toBeDefined();
      expect(typeof productApi.getById).toBe('function');
    });

    it('should return promises from getAll', async () => {
      getCachedData.mockReturnValue(mockProducts);

      const result = productApi.getAll();

      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('should return promises from getById', async () => {
      getCachedData.mockReturnValue(mockProduct);

      const result = productApi.getById('1');

      expect(result).toBeInstanceOf(Promise);
      await result;
    });
  });
});
