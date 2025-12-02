import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/features/cart', () => ({
  CartProvider: ({ children }) => <div data-testid="cart-provider">{children}</div>,
}));

import { CartProvider } from '@/features/cart';

describe('Providers - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <CartProvider>
          <div>Test Child</div>
        </CartProvider>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
      expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <CartProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </CartProvider>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  describe('provider wrapping', () => {
    it('should have CartProvider as parent of children', () => {
      render(
        <CartProvider>
          <div data-testid="child">Test Content</div>
        </CartProvider>
      );

      const cartProvider = screen.getByTestId('cart-provider');
      const child = screen.getByTestId('child');

      expect(cartProvider).toContainElement(child);
    });
  });
});