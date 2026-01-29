'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, CartItemInput, GrindOption, WeightOption } from '@/types/cart';

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItemInput) => void;
  removeItem: (item: Pick<CartItem, 'id' | 'grind' | 'weight'>) => void;
  updateItemQuantity: (item: Pick<CartItem, 'id' | 'grind' | 'weight'>, quantity: number) => void;
};

const CART_STORAGE_KEY = 'caferico.cart';
const GRIND_OPTIONS: GrindOption[] = ['beans', 'fine', 'coarse'];
const WEIGHT_OPTIONS: WeightOption[] = ['250', '500', '1000'];

const CartContext = createContext<CartContextValue | undefined>(undefined);

const getItemKey = (item: Pick<CartItem, 'id' | 'grind' | 'weight'>) =>
  `${item.id}::${item.grind}::${item.weight}`;

const normalizeQuantity = (value: number) => {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.min(99, Math.max(1, Math.round(value)));
};

const isValidCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as CartItem;
  const hasValidBase =
    typeof item.id === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.name === 'string' &&
    typeof item.collection === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number';

  if (!hasValidBase) {
    return false;
  }

  // For accessories, grind and weight can be null
  const hasValidGrind = item.grind === null || GRIND_OPTIONS.includes(item.grind);
  const hasValidWeight = item.weight === null || WEIGHT_OPTIONS.includes(item.weight);

  return hasValidGrind && hasValidWeight;
};

const loadStoredItems = () => {
  if (typeof window === 'undefined') {
    return [] as CartItem[];
  }

  const stored = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) {
    return [] as CartItem[];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [] as CartItem[];
    }

    return parsed
      .filter(isValidCartItem)
      .map((item) => ({ ...item, quantity: normalizeQuantity(item.quantity) }));
  } catch {
    return [] as CartItem[];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addItem = useCallback((item: CartItemInput) => {
    const quantity = normalizeQuantity(item.quantity ?? 1);
    setItems((current) => {
      const key = getItemKey(item);
      const existingIndex = current.findIndex((existing) => getItemKey(existing) === key);

      if (existingIndex >= 0) {
        const nextItems = [...current];
        const existing = nextItems[existingIndex];
        nextItems[existingIndex] = {
          ...existing,
          quantity: normalizeQuantity(existing.quantity + quantity)
        };
        return nextItems;
      }

      return [...current, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((item: Pick<CartItem, 'id' | 'grind' | 'weight'>) => {
    setItems((current) => current.filter((existing) => getItemKey(existing) !== getItemKey(item)));
  }, []);

  const updateItemQuantity = useCallback(
    (item: Pick<CartItem, 'id' | 'grind' | 'weight'>, quantity: number) => {
      setItems((current) => {
        const key = getItemKey(item);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          return current.filter((existing) => getItemKey(existing) !== key);
        }

        const nextQuantity = normalizeQuantity(quantity);
        return current.map((existing) =>
          getItemKey(existing) === key ? { ...existing, quantity: nextQuantity } : existing
        );
      });
    },
    []
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateItemQuantity
    }),
    [
      items,
      totalItems,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateItemQuantity
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
