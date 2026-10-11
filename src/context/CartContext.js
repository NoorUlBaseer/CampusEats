import { createContext, useContext, useState } from 'react';

// Shared app state (cart, favourites, orders).
// Header buttons on different screens update this data, and every screen
// that reads it re-renders automatically.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // [{ item, cafeteriaName, quantity }]
  const [favourites, setFavourites] = useState([]); // [{ item, cafeteriaName }]
  const [orders, setOrders] = useState([]); // [{ id, items, total, placedAt }]

  const addToCart = (item, cafeteriaName, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { item, cafeteriaName, quantity }];
    });
  };

  // delta is +1 or -1. An item whose quantity reaches 0 is removed.
  const changeQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const isFavourite = (itemId) => favourites.some((f) => f.item.id === itemId);

  const toggleFavourite = (item, cafeteriaName) => {
    setFavourites((prev) =>
      prev.some((f) => f.item.id === item.id)
        ? prev.filter((f) => f.item.id !== item.id)
        : [...prev, { item, cafeteriaName }]
    );
  };

  // Turns the current cart into an order and returns it, so the caller
  // can pass the new order's id as a route param.
  const placeOrder = () => {
    const order = {
      id: 'ORD-' + Date.now().toString().slice(-6),
      items: cart,
      total: cart.reduce((sum, e) => sum + e.item.price * e.quantity, 0),
      placedAt: new Date().toLocaleString(),
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  const cartCount = cart.reduce((sum, e) => sum + e.quantity, 0);
  const cartTotal = cart.reduce((sum, e) => sum + e.item.price * e.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        changeQuantity,
        removeFromCart,
        clearCart,
        favourites,
        isFavourite,
        toggleFavourite,
        orders,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
