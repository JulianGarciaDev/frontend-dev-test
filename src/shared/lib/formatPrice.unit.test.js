import { describe, it, expect } from 'vitest';
import { formatPrice, isPriceAvailable } from './formatPrice';

describe('formatPrice - Unit Tests', () => {
  describe('valid prices', () => {
    it.each([
      { price: 170, expected: '170€', description: 'numeric price' },
      { price: '170', expected: '170€', description: 'string price' },
      { price: 99.99, expected: '99.99€', description: 'decimal price' },
      { price: '99.99', expected: '99.99€', description: 'decimal string' },
      { price: 0, expected: 'Gratis', description: 'zero as number' },
      { price: '0', expected: 'Gratis', description: 'zero as string' },
    ])('should format $description correctly', ({ price, expected }) => {
      expect(formatPrice(price)).toBe(expected);
    });
  });

  describe('invalid prices', () => {
    it.each([
      { price: '', expected: 'Precio no disponible', description: 'empty string' },
      { price: null, expected: 'Precio no disponible', description: 'null' },
      { price: undefined, expected: 'Precio no disponible', description: 'undefined' },
      { price: NaN, expected: 'Precio no disponible', description: 'NaN' },
      { price: 'abc', expected: 'Precio no disponible', description: 'non-numeric string' },
      { price: '   ', expected: 'Precio no disponible', description: 'whitespace string' },
    ])('should handle $description', ({ price, expected }) => {
      expect(formatPrice(price)).toBe(expected);
    });
  });

  describe('edge cases', () => {
    it.each([
      { price: 0.01, expected: '0.01€', description: 'very small numbers' },
      { price: ' 100 ', expected: '100€', description: 'string with spaces' },
      { price: 1e2, expected: '100€', description: 'scientific notation' },
    ])('should handle $description', ({ price, expected }) => {
      expect(formatPrice(price)).toBe(expected);
    });
  });
});

describe('isPriceAvailable - Unit Tests', () => {
  describe('available prices', () => {
    it.each([
      { price: 170, description: 'valid numeric price' },
      { price: '170', description: 'valid string price' },
      { price: 0, description: 'zero' },
      { price: '0', description: 'string zero' },
      { price: 99.99, description: 'decimal' },
      { price: '99.99', description: 'string decimal' },
    ])('should return true for $description', ({ price }) => {
      expect(isPriceAvailable(price)).toBe(true);
    });
  });

  describe('unavailable prices', () => {
    it.each([
      { price: '', description: 'empty string' },
      { price: null, description: 'null' },
      { price: undefined, description: 'undefined' },
      { price: NaN, description: 'NaN' },
      { price: 'abc', description: 'non-numeric string' },
      { price: '   ', description: 'whitespace' },
    ])('should return false for $description', ({ price }) => {
      expect(isPriceAvailable(price)).toBe(false);
    });
  });
});