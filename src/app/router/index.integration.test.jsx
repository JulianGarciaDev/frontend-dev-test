import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('@/pages/product-list', () => ({
  ProductListPage: () => <div>Product List Mock</div>,
}));

vi.mock('@/pages/product-details', () => ({
  ProductDetailsPage: () => <div>Product Details Mock</div>,
}));

vi.mock('@/widgets/header', () => ({
  Header: () => <div>Header Mock</div>,
}));

vi.mock('@/app/providers', () => ({
  CartProvider: ({ children }) => <div data-testid="cart-provider">{children}</div>,
}));

import { ProductListPage } from '@/pages/product-list';
import { ProductDetailsPage } from '@/pages/product-details';
import { CartProvider } from '@/app/providers';
import { Header } from '@/widgets/header';

const renderRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('Router - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('route rendering', () => {
    it('should render product list page at /', () => {
      renderRouter('/');

      expect(screen.getByText('Header Mock')).toBeInTheDocument();
      expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
      expect(screen.getByText('Product List Mock')).toBeInTheDocument();
      expect(screen.queryByText('Product Details Mock')).not.toBeInTheDocument();
    });

    it('should render product details page at /product/:id', () => {
      renderRouter('/product/123');

      expect(screen.getByText('Header Mock')).toBeInTheDocument();
      expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
      expect(screen.queryByText('Product List Mock')).not.toBeInTheDocument();
      expect(screen.getByText('Product Details Mock')).toBeInTheDocument();
    });
  });
});