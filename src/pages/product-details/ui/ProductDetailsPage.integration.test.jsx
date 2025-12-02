import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, userEvent, expectLoading } from '@/__test__/test-utils';
import { renderWithRouter, mockProducts, setupCartMock } from '@/__test__/test-utils';
import { ProductDetailsPage } from './ProductDetailsPage';
import * as productApi from '@/entities/product/api/productApi';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

describe('ProductDetailsPage - Integration Tests', () => {
  const mockProduct = mockProducts[0];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('cartCount', '0');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    setupCartMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Loading and Data Display', () => {
    it('should show loading spinner while fetching product', () => {
      vi.spyOn(productApi.productApi, 'getById').mockImplementation(
        () => new Promise(() => {})
      );

      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      expectLoading(screen, /cargando producto/i);
    });

    it('should display product details after successful fetch', async () => {
      vi.spyOn(productApi.productApi, 'getById').mockResolvedValue(mockProduct);

      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      expect(screen.getByText('Acer')).toBeInTheDocument();
      expect(screen.getByText('170€')).toBeInTheDocument();
    });

    it('should display product image', async () => {
      vi.spyOn(productApi.productApi, 'getById').mockResolvedValue(mockProduct);

      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockProduct.imgUrl);
    });

    it('should display error message on fetch failure', async () => {
      vi.spyOn(productApi.productApi, 'getById').mockRejectedValue(
        new Error('Network error')
      );

      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Product Configuration Options', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getById').mockResolvedValue(mockProduct);
    });

    it('should display color options when available', async () => {
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const colorSelects = screen.getAllByRole('combobox');
      expect(colorSelects.length).toBeGreaterThan(0);
    });

    it('should allow changing color selection', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const selects = screen.getAllByRole('combobox');
      const colorSelect = selects.find(select => 
        select.querySelector('option[value="1000"]')
      );

      if (colorSelect) {
        expect(colorSelect).toHaveValue('1000');
        await user.selectOptions(colorSelect, '1001');
        expect(colorSelect).toHaveValue('1001');
      }
    });
  });

  describe('Add to Cart Functionality', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getById').mockResolvedValue(mockProduct);
    });

    it('should display add to cart button', async () => {
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /añadir/i });
      expect(addButton).toBeInTheDocument();
    });

    it('should add product to cart when button clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /añadir/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });
    });

    it('should update cart counter after adding', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      expect(localStorage.getItem('cartCount')).toBe('0');

      const addButton = screen.getByRole('button', { name: /añadir/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(localStorage.getItem('cartCount')).toBe('1');
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getById').mockResolvedValue(mockProduct);
    });

    it('should display back to catalog link', async () => {
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const backLink = screen.getByText(/volver/i);
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.spyOn(productApi.productApi, 'getById').mockResolvedValue(mockProduct);
    });

    it('should have accessible product image', async () => {
      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      await waitFor(() => {
        expect(screen.getByText('Iconia Talk S')).toBeInTheDocument();
      });

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt');
      expect(image.getAttribute('alt')).not.toBe('');
    });

    it('should announce loading state', () => {
      vi.spyOn(productApi.productApi, 'getById').mockImplementation(
        () => new Promise(() => {})
      );

      renderWithRouter(<ProductDetailsPage />, { route: '/product/1' });

      expectLoading(screen, /cargando producto/i);
    });
  });
});