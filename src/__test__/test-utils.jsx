import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/features/cart';

export function renderWithRouter(ui, { route = '/', ...options } = {}) {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <CartProvider>
        {children}
      </CartProvider>
    </BrowserRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    route,
  };
}

export async function waitForLoadingToFinish() {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(
    () => {
      const spinners = document.querySelectorAll('.spinner');
      expect(spinners).toHaveLength(0);
    },
    { timeout: 3000 }
  );
}

export function expectLoading(screen, message = /cargando/i) {
  expect(screen.getByText(message)).toBeInTheDocument();
  const spinner = document.querySelector('.spinner');
  expect(spinner).toBeInTheDocument();
}

export const mockProducts = [
  {
    id: '1',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: '170',
    cpu: 'Mediatek MT8735',
    ram: '2GB',
    os: 'Android 6.0',
    displayResolution: '1280x720',
    battery: '3400mAh',
    primaryCamera: '13MP',
    secondaryCamera: '2MP',
    dimentions: '191.7 x 101 x 9.4mm',
    weight: '260g',
    imgUrl: 'https://mobitx.com/images/1.jpg',
    options: {
      colors: [
        { code: 1000, name: 'Negro' },
        { code: 1001, name: 'Plata' },
      ],
      storages: [
        { code: 2000, name: '16GB' },
        { code: 2001, name: '32GB' },
      ],
    },
  },
  {
    id: '2',
    brand: 'Alcatel',
    model: 'Flash (2017)',
    price: '100',
    cpu: 'Mediatek MT6737',
    ram: '1GB',
    os: 'Android 7.0',
    displayResolution: '1280x720',
    battery: '2500mAh',
    primaryCamera: '8MP',
    secondaryCamera: '5MP',
    dimentions: '144 x 71.8 x 8.6mm',
    weight: '140g',
    imgUrl: 'https://mobitx.com/images/2.jpg',
    options: {
      colors: [
        { code: 1000, name: 'Negro' },
      ],
      storages: [
        { code: 2000, name: '8GB' },
      ],
    },
  },
  {
    id: '3',
    brand: 'Acer',
    model: 'Iconia One 7',
    price: '90',
    cpu: 'Mediatek MT8167B',
    ram: '1GB',
    os: 'Android 7.0',
    displayResolution: '1024x600',
    battery: '3450mAh',
    primaryCamera: '2MP',
    secondaryCamera: '2MP',
    dimentions: '193.3 x 102.2 x 9.2mm',
    weight: '250g',
    imgUrl: 'https://mobitx.com/images/3.jpg',
    options: {
      colors: [],
      storages: [],
    },
  },
];

export const mockProductApi = {
  getAll: vi.fn().mockResolvedValue(mockProducts),
  getById: vi.fn((id) => 
    Promise.resolve(mockProducts.find(p => p.id === id) || null)
  ),
};

export function setupCartMock() {
  globalThis.fetch = vi.fn((url, options) => {
    if (url.includes('/cart') && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 1 }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
}

export { screen, waitFor, within, fireEvent } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';