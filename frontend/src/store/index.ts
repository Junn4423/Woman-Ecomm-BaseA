import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, Product, ProductVariant, User } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Cart Store
interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  setCart: (cart: Cart | null) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const calculateCartTotals = (items: CartItem[]): Omit<Cart, 'id' | 'items' | 'coupon'> => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = 0; // Will be calculated when coupon is applied
  const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal - discount + shippingFee;
  
  return { subtotal, discount, shippingFee, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      
      setCart: (cart) => set({ cart }),
      
      addItem: (product, variant, quantity = 1) => {
        const { cart } = get();
        const price = variant?.price || product.price;
        
        const newItem: CartItem = {
          id: `${product.id}-${variant?.id || 'default'}`,
          product,
          variant,
          quantity,
          price,
          total: price * quantity,
        };
        
        if (!cart) {
          const items = [newItem];
          const totals = calculateCartTotals(items);
          set({
            cart: {
              id: 'local-cart',
              items,
              ...totals,
            },
            isOpen: true,
          });
          return;
        }
        
        const existingItemIndex = cart.items.findIndex(
          item => item.id === newItem.id
        );
        
        let updatedItems: CartItem[];
        
        if (existingItemIndex > -1) {
          updatedItems = cart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity, total: item.price * (item.quantity + quantity) }
              : item
          );
        } else {
          updatedItems = [...cart.items, newItem];
        }
        
        const totals = calculateCartTotals(updatedItems);
        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...totals,
          },
          isOpen: true,
        });
      },
      
      updateItem: (itemId, quantity) => {
        const { cart } = get();
        if (!cart) return;
        
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        const updatedItems = cart.items.map(item =>
          item.id === itemId
            ? { ...item, quantity, total: item.price * quantity }
            : item
        );
        
        const totals = calculateCartTotals(updatedItems);
        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...totals,
          },
        });
      },
      
      removeItem: (itemId) => {
        const { cart } = get();
        if (!cart) return;
        
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        
        if (updatedItems.length === 0) {
          set({ cart: null });
          return;
        }
        
        const totals = calculateCartTotals(updatedItems);
        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...totals,
          },
        });
      },
      
      clearCart: () => set({ cart: null }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Wishlist Store
interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const { items } = get();
        if (items.some(item => item.id === product.id)) return;
        set({ items: [...items, product] });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// UI Store
interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFilterOpen: boolean;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  toggleFilter: () => void;
  closeMobileMenu: () => void;
  closeSearch: () => void;
  closeFilter: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  closeFilter: () => set({ isFilterOpen: false }),
}));

// Recently Viewed Store
interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const { items } = get();
        const filtered = items.filter(item => item.id !== product.id);
        const updated = [product, ...filtered].slice(0, 10); // Keep only 10 items
        set({ items: updated });
      },
      
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Compare Store
interface CompareState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const { items } = get();
        if (items.length >= 4) return; // Max 4 items to compare
        if (items.some(item => item.id === product.id)) return;
        set({ items: [...items, product] });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },
      
      clearItems: () => set({ items: [] }),
      
      isInCompare: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'compare-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
