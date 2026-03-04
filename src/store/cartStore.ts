import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  gradient: string;
}

interface CartState {
  items: CartItem[];
  purchased: number[]; // subject IDs that have been "purchased"
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  isPurchased: (id: number) => boolean;
  purchaseAll: () => void;
  purchaseSingle: (id: number) => void;
  getTotal: () => number;
  getOriginalTotal: () => number;
}

const useCartStore = create<CartState>()(
  persist(
  
    (set, get) => ({
      items: [],
      purchased: [],

      addItem: (item) => {
        const { items } = get();
        if (!items.find((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearCart: () => set({ items: [] }),

      isInCart: (id) => get().items.some((i) => i.id === id),

      isPurchased: (id) => get().purchased.includes(id),

      purchaseAll: () => {
        const { items, purchased } = get();
        const newPurchased = [...purchased, ...items.map((i) => i.id)];
        set({ purchased: [...new Set(newPurchased)], items: [] });
      },

      purchaseSingle: (id) => {
        const { purchased, items } = get();
        if (!purchased.includes(id)) {
          set({
            purchased: [...purchased, id],
            items: items.filter((i) => i.id !== id),
          });
        }
      },

      getTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),

      getOriginalTotal: () => get().items.reduce((sum, i) => sum + i.originalPrice, 0),
    }),
    { name: 'kodemy-cart' }
  )
);

export default useCartStore;
