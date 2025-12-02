import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProduct } from '../useProducts';
import * as productApiModule from '../../api/productApi';

vi.mock('../api/productApi');

describe('useProduct - Unit Tests', () => {
  const mockProduct = {
    id: '1',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: 170,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('initial state', () => {
    it('should return initial state with null product, loading false, and no error', () => {
      const { result } = renderHook(() => useProduct(null));

      expect(result.current.product).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it.each([
      { id: null, description: 'null' },
      { id: undefined, description: 'undefined' },
      { id: '', description: 'empty string' },
    ])('should not fetch when id is $description', ({ id }) => {
      productApiModule.productApi.getById = vi.fn();

      renderHook(() => useProduct(id));

      expect(productApiModule.productApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('successful fetch', () => {
    it('should fetch and return product', async () => {
      productApiModule.productApi.getById = vi.fn().mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct('1'));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(mockProduct);
      expect(result.current.error).toBeNull();
      expect(productApiModule.productApi.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('Network error');
      productApiModule.productApi.getById = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBeNull();
      expect(result.current.error).toEqual(error);
      expect(console.error).toHaveBeenCalledWith('Error fetching product:', error);
    });

    it.each([
      { response: null, description: 'null response' },
      { response: undefined, description: 'undefined response' },
    ])('should handle product not found with $description', async ({ response }) => {
      productApiModule.productApi.getById = vi.fn().mockResolvedValue(response);

      const { result } = renderHook(() => useProduct('170'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toBeNull();
      expect(result.current.error).toEqual(new Error('Producto no encontrado'));
    });

    it.each([
      { error: new Error('404 Not Found'), description: '404 error' },
      { error: new Error('500 Internal Server Error'), description: '500 error' },
      { error: new Error('Network timeout'), description: 'timeout error' },
    ])('should handle $description', async ({ error }) => {
      productApiModule.productApi.getById = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.product).toBeNull();
    });
  });

  describe('id changes', () => {
    it('should refetch when id changes', async () => {
      const product1 = { ...mockProduct, id: '1' };
      const product2 = { ...mockProduct, id: '2' };

      productApiModule.productApi.getById = vi
        .fn()
        .mockResolvedValueOnce(product1)
        .mockResolvedValueOnce(product2);

      const { result, rerender } = renderHook(({ id }) => useProduct(id), {
        initialProps: { id: '1' },
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(product1);

      rerender({ id: '2' });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(product2);
      expect(productApiModule.productApi.getById).toHaveBeenCalledTimes(2);
    });

    it('should reset state when id changes', async () => {
      productApiModule.productApi.getById = vi.fn().mockResolvedValue(mockProduct);

      const { result, rerender } = renderHook(({ id }) => useProduct(id), {
        initialProps: { id: '1' },
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(mockProduct);

      rerender({ id: '2' });

      expect(result.current.product).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should clear error when id changes', async () => {
      productApiModule.productApi.getById = vi
        .fn()
        .mockRejectedValueOnce(new Error('Error'))
        .mockResolvedValueOnce(mockProduct);

      const { result, rerender } = renderHook(({ id }) => useProduct(id), {
        initialProps: { id: '1' },
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      rerender({ id: '2' });

      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.product).toEqual(mockProduct);
    });
  });

  describe('hook lifecycle', () => {
    it('should not refetch on re-render with same id', async () => {
      productApiModule.productApi.getById = vi.fn().mockResolvedValue(mockProduct);

      const { result, rerender } = renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      rerender();
      rerender();

      expect(productApiModule.productApi.getById).toHaveBeenCalledTimes(1);
    });

    it('should maintain state reference on re-render', async () => {
      productApiModule.productApi.getById = vi.fn().mockResolvedValue(mockProduct);

      const { result, rerender } = renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstProduct = result.current.product;

      rerender();

      expect(result.current.product).toBe(firstProduct);
    });
  });

  describe('API integration', () => {
    it('should call productApi.getById with correct id', async () => {
      productApiModule.productApi.getById = vi.fn().mockResolvedValue(mockProduct);

      renderHook(() => useProduct('123'));

      await waitFor(() => {
        expect(productApiModule.productApi.getById).toHaveBeenCalledWith('123');
      });
    });

    it('should use async/await correctly', async () => {
      const getById = vi.fn().mockResolvedValue(mockProduct);
      productApiModule.productApi.getById = getById;

      const { result } = renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(getById).toHaveBeenCalled();
      expect(result.current.product).toEqual(mockProduct);
    });

    it('should log errors to console', async () => {
      const error = new Error('Test error');
      productApiModule.productApi.getById = vi.fn().mockRejectedValue(error);

      renderHook(() => useProduct('1'));

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching product:', error);
      });
    });
  });
});
