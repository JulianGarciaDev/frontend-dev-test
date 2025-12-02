import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '../useProducts';
import * as productApiModule from '../../api/productApi';

vi.mock('../api/productApi');

describe('useProducts - Unit Tests', () => {
  const mockProducts = [
    { id: '1', brand: 'Acer', model: 'Iconia Talk S', price: 170 },
    { id: '2', brand: 'Alcatel', model: 'Flash', price: 100 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('initial state', () => {
    it('should return initial state with empty products, loading true, and no error', () => {
      productApiModule.productApi.getAll = vi.fn(() => new Promise(() => {}));

      const { result } = renderHook(() => useProducts());

      expect(result.current.products).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('successful fetch', () => {
    it('should fetch and return products', async () => {
      productApiModule.productApi.getAll = vi.fn().mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
      expect(productApiModule.productApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty products array', async () => {
      productApiModule.productApi.getAll = vi.fn().mockResolvedValue([]);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('error handling', () => {
    it.each([
      { error: new Error('404 Not Found'), description: '404 error' },
      { error: new Error('500 Internal Server Error'), description: '500 error' },
      { error: new Error('Network timeout'), description: 'timeout error' },
      { error: new Error('Connection refused'), description: 'connection error' },
    ])('should handle $description', async ({ error }) => {
      productApiModule.productApi.getAll = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.products).toEqual([]);
    });
  });

  describe('hook lifecycle', () => {
    it('should only fetch once on mount', async () => {
      productApiModule.productApi.getAll = vi.fn().mockResolvedValue(mockProducts);

      const { result, rerender } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender();
      rerender();
      rerender();

      expect(productApiModule.productApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should not fetch again on re-render', async () => {
      productApiModule.productApi.getAll = vi.fn().mockResolvedValue(mockProducts);

      const { result, rerender } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstProducts = result.current.products;

      rerender();

      expect(result.current.products).toBe(firstProducts);
      expect(productApiModule.productApi.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('API integration', () => {
    it('should call productApi.getAll without arguments', async () => {
      productApiModule.productApi.getAll = vi.fn().mockResolvedValue(mockProducts);

      renderHook(() => useProducts());

      await waitFor(() => {
        expect(productApiModule.productApi.getAll).toHaveBeenCalledWith();
      });
    });

    it('should use promise chain correctly', async () => {
      const getAll = vi.fn().mockResolvedValue(mockProducts);
      productApiModule.productApi.getAll = getAll;

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(getAll).toHaveBeenCalled();
      expect(result.current.products).toEqual(mockProducts);
    });
  });
});