"use client";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, selectedSize, quantity) => {
    setCartItems((prevItems) => {
      const isExist = prevItems.find(
        (item) => item.id === product.id && item.size === selectedSize
      );

      if (isExist) {
        return prevItems.map((item) =>
          item.id === product.id && item.size === selectedSize
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, size: selectedSize, qty: quantity }];
    });
  };

  const removeItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQty = (id, size, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.size === size) 
      ? { ...item, qty: Math.max(1, item.qty + delta) } 
      : item
    ));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};