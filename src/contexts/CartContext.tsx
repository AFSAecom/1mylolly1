import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  refComplete: string;
  codeProduit: string;
  nomLolly: string;
  nomParfumInspire?: string;
  contenance: number;
  unite: string;
  prix: number;
  quantity: number;
  imageURL: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (refComplete: string) => void;
  updateQuantity: (refComplete: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.refComplete === item.refComplete,
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i.refComplete === item.refComplete
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prevItems, { ...item, quantity }];
    });
  };

  const removeFromCart = (refComplete: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.refComplete !== refComplete),
    );
  };

  const updateQuantity = (refComplete: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(refComplete);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.refComplete === refComplete ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.prix * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
