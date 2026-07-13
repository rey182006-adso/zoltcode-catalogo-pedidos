// src/context/CartContext.jsx
// Maneja el estado global del carrito de compras (persistido en localStorage)

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  function agregarProducto(producto) {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function quitarProducto(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad } : i))
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const totalPrecio = items.reduce((acc, i) => acc + i.cantidad * i.precio, 0);

  return (
    <CartContext.Provider
      value={{ items, agregarProducto, quitarProducto, cambiarCantidad, vaciarCarrito, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}