import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, userEvent, expectLoading } from '@/__test__/test-utils';
import { renderWithRouter, mockProducts } from '@/__test__/test-utils';
import { ProductListPage } from './ProductListPage';
import * as productApi from '@/entities/product/api/productApi';

describe('ProductListPage - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Loading and Data Fetching', () => {
    it('should show loading spinner while fetching products', () => {
      vi.spyOn(productApi.productApi, 'getAll').mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithRouter(<ProductListPage />);

      expectLoading(screen, /cargando productos/i);
    });

    it('should display all products after successful fetch', async () => {
      vi.spyOn(productApi.productApi, 'getAll').mockResolvedValue(mockProducts);

      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.queryByText(/cargando productos/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      expect(screen.getByText('Flash (2017)')).toBeInTheDocument();
      expect(screen.getByText('Iconia One 7')).toBeInTheDocument();
    });

    it('should display error message when fetch fails', async () => {
      vi.spyOn(productApi.productApi, 'getAll').mockRejectedValue(
        new Error('Network error')
      );

      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText(/error al cargar los productos/i)).toBeInTheDocument();
      });
    });

    it('should handle empty product list', async () => {
      vi.spyOn(productApi.productApi, 'getAll').mockResolvedValue([]);

      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getAll').mockResolvedValue(mockProducts);
    });

    it('should render search bar', async () => {
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
      });
    });

    it('should filter products by brand name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      await user.type(searchInput, 'Alcatel');

      await waitFor(() => {
        expect(screen.getByText('Flash (2017)')).toBeInTheDocument();
        expect(screen.queryByText('Iconia Talk S')).not.toBeInTheDocument();
      });
    });

    it('should filter products by model name', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      await user.type(searchInput, 'Flash');

      await waitFor(() => {
        expect(screen.getByText('Flash (2017)')).toBeInTheDocument();
        expect(screen.queryByText('Iconia Talk S')).not.toBeInTheDocument();
      });
    });

    it('should be case insensitive', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      await user.type(searchInput, 'ACER');

      await waitFor(() => {
        expect(screen.getAllByText('Acer')).toHaveLength(2);
        expect(screen.queryByText('Alcatel')).not.toBeInTheDocument();
      });
    });

    it('should show all products when search is cleared', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      
      await user.type(searchInput, 'Alcatel');
      
      await waitFor(() => {
        expect(screen.queryByText('Iconia Talk S')).not.toBeInTheDocument();
      });

      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
        expect(screen.getByText('Flash (2017)')).toBeInTheDocument();
      });
    });

    it('should show "no products found" for non-matching query', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      await user.type(searchInput, 'Nokia');

      await waitFor(() => {
        expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Product Navigation', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getAll').mockResolvedValue(mockProducts);
    });

    it('should render product cards as links', async () => {
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const productLinks = screen.getAllByRole('link');
      expect(productLinks.length).toBeGreaterThan(0);
    });

    it('should have correct href for each product', async () => {
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/product/1');
    });
  });

  describe('Product Grid Layout', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getAll').mockResolvedValue(mockProducts);
    });

    it('should render product images', async () => {
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      
      images.forEach((img) => {
        expect(img).toHaveAttribute('src');
        expect(img).toHaveAttribute('alt');
      });
    });

    it('should apply lazy loading to images', async () => {
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getAll').mockResolvedValue(mockProducts);
    });

    it('should have accessible product images', async () => {
      renderWithRouter(<ProductListPage />);

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('should announce loading state', () => {
      vi.spyOn(productApi.productApi, 'getAll').mockImplementation(
        () => new Promise(() => {})
      );

      renderWithRouter(<ProductListPage />);

      expectLoading(screen, /cargando productos/i);
    });
  });
});