"use client";

import { CartProvider } from '@/context/useCart';

export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
