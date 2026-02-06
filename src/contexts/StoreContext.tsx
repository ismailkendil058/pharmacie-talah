import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, DeliveryPrice, Ordonnance, AdminUser } from '@/types';
import { initialProducts } from '@/data/products';
import { initialDeliveryPrices } from '@/data/deliveryPrices';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  
  // Delivery Prices
  deliveryPrices: DeliveryPrice[];
  updateDeliveryPrice: (wilaya: string, domicile: number, bureau: number) => void;
  getDeliveryPrice: (wilaya: string, method: 'domicile' | 'bureau') => number;
  
  // Ordonnances
  ordonnances: Ordonnance[];
  addOrdonnance: (ordonnance: Omit<Ordonnance, 'id' | 'createdAt'>) => void;
  deleteOrdonnance: (id: string) => void;
  
  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (telephone: string, password: string) => boolean;
  adminLogout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'pharmacie_talah_products',
  CART: 'pharmacie_talah_cart',
  ORDERS: 'pharmacie_talah_orders',
  DELIVERY_PRICES: 'pharmacie_talah_delivery_prices',
  ORDONNANCES: 'pharmacie_talah_ordonnances',
  ADMIN_AUTH: 'pharmacie_talah_admin_auth',
};

// Default admin credentials
const DEFAULT_ADMIN: AdminUser = {
  id: '1',
  telephone: '0797939772',
  password: '000000',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return stored ? JSON.parse(stored) : initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    return stored ? JSON.parse(stored) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [];
  });

  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrice[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.DELIVERY_PRICES);
    return stored ? JSON.parse(stored) : initialDeliveryPrices;
  });

  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDONNANCES);
    return stored ? JSON.parse(stored) : [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    return stored === 'true';
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELIVERY_PRICES, JSON.stringify(deliveryPrices));
  }, [deliveryPrices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDONNANCES, JSON.stringify(ordonnances));
  }, [ordonnances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated.toString());
  }, [isAdminAuthenticated]);

  // Product functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.prix * item.quantity, 0);

  // Order functions
  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: generateId(),
      status: 'en_attente',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
    clearCart();
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Delivery price functions
  const updateDeliveryPrice = (wilaya: string, domicile: number, bureau: number) => {
    setDeliveryPrices(prev => prev.map(dp =>
      dp.wilaya === wilaya ? { ...dp, domicile, bureau } : dp
    ));
  };

  const getDeliveryPrice = (wilaya: string, method: 'domicile' | 'bureau'): number => {
    const price = deliveryPrices.find(dp => dp.wilaya === wilaya);
    return price ? price[method] : 600;
  };

  // Ordonnance functions
  const addOrdonnance = (ordonnance: Omit<Ordonnance, 'id' | 'createdAt'>) => {
    const newOrdonnance: Ordonnance = {
      ...ordonnance,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setOrdonnances(prev => [...prev, newOrdonnance]);
  };

  const deleteOrdonnance = (id: string) => {
    setOrdonnances(prev => prev.filter(o => o.id !== id));
  };

  // Admin auth functions
  const adminLogin = (telephone: string, password: string): boolean => {
    if (telephone === DEFAULT_ADMIN.telephone && password === DEFAULT_ADMIN.password) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <StoreContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      deliveryPrices,
      updateDeliveryPrice,
      getDeliveryPrice,
      ordonnances,
      addOrdonnance,
      deleteOrdonnance,
      isAdminAuthenticated,
      adminLogin,
      adminLogout,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
