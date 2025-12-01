import { CartProvider } from "@/features/cart";

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}