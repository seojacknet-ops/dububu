import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  costPrice?: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
  variantSku?: string;
  fulfillmentType?: 'aliexpress' | 'printful' | 'manual';
}

interface AppliedDiscount {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  appliedDiscount: AppliedDiscount | null;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values (as functions to get latest state)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 4.99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedDiscount: null,

      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(
          (item) =>
            item.productId === newItem.productId &&
            (item.variantId || '') === (newItem.variantId || '')
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { ...newItem, id: nanoid() }],
            isOpen: true,
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], appliedDiscount: null }),

      applyDiscount: (discount) => set({ appliedDiscount: discount }),
      removeDiscount: () => set({ appliedDiscount: null }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      getDiscountAmount: () => {
        const { appliedDiscount } = get();
        if (!appliedDiscount) return 0;

        const subtotal = get().getSubtotal();
        if (appliedDiscount.type === 'percentage') {
          return subtotal * (appliedDiscount.value / 100);
        } else if (appliedDiscount.type === 'fixed') {
          return Math.min(appliedDiscount.value, subtotal);
        }
        return 0;
      },

      getShipping: () => {
        const { appliedDiscount } = get();
        const subtotal = get().getSubtotal();

        if (appliedDiscount?.type === 'free_shipping') return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        if (get().items.length === 0) return 0;
        return STANDARD_SHIPPING;
      },

      getTotal: () => {
        return (
          get().getSubtotal() - get().getDiscountAmount() + get().getShipping()
        );
      },
    }),
    {
      name: 'dububu-cart-storage',
      skipHydration: true,
    }
  )
);

// Helper hooks for common computed values
export const useCartTotalItems = () => useCartStore((state) => state.getTotalItems());
export const useCartSubtotal = () => useCartStore((state) => state.getSubtotal());
export const useCartTotal = () => useCartStore((state) => state.getTotal());
