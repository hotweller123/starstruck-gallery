import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  slug: string;
  quantity: number;
}

export interface Bid {
  lotSlug: string;
  amount: number;
  placedAt: string; // ISO
}

export interface UserListing {
  id: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  category: string;
  description: string;
  image: string; // data URL
  createdAt: string;
}

interface Store {
  favorites: string[];
  cart: CartItem[];
  bids: Bid[];
  listings: UserListing[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  addToCart: (slug: string, qty?: number) => void;
  removeFromCart: (slug: string) => void;
  setQuantity: (slug: string, qty: number) => void;
  clearCart: () => void;
  placeBid: (lotSlug: string, amount: number) => void;
  addListing: (l: Omit<UserListing, "id" | "createdAt">) => void;
  removeListing: (id: string) => void;
}

const StoreCtx = createContext<Store | null>(null);

const KEY = "aethelred.store.v1";

interface PersistedState {
  favorites: string[];
  cart: CartItem[];
  bids: Bid[];
  listings: UserListing[];
}

const empty: PersistedState = { favorites: [], cart: [], bids: [], listings: [] };

function load(): PersistedState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [state, hydrated]);

  const value: Store = {
    ...state,
    toggleFavorite: (slug) =>
      setState((s) => ({
        ...s,
        favorites: s.favorites.includes(slug)
          ? s.favorites.filter((f) => f !== slug)
          : [...s.favorites, slug],
      })),
    isFavorite: (slug) => state.favorites.includes(slug),
    addToCart: (slug, qty = 1) =>
      setState((s) => {
        const found = s.cart.find((c) => c.slug === slug);
        return {
          ...s,
          cart: found
            ? s.cart.map((c) => (c.slug === slug ? { ...c, quantity: c.quantity + qty } : c))
            : [...s.cart, { slug, quantity: qty }],
        };
      }),
    removeFromCart: (slug) =>
      setState((s) => ({ ...s, cart: s.cart.filter((c) => c.slug !== slug) })),
    setQuantity: (slug, qty) =>
      setState((s) => ({
        ...s,
        cart:
          qty <= 0
            ? s.cart.filter((c) => c.slug !== slug)
            : s.cart.map((c) => (c.slug === slug ? { ...c, quantity: qty } : c)),
      })),
    clearCart: () => setState((s) => ({ ...s, cart: [] })),
    placeBid: (lotSlug, amount) =>
      setState((s) => ({
        ...s,
        bids: [
          { lotSlug, amount, placedAt: new Date().toISOString() },
          ...s.bids.filter((b) => !(b.lotSlug === lotSlug && b.amount === amount)),
        ],
      })),
    addListing: (l) =>
      setState((s) => ({
        ...s,
        listings: [
          { ...l, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ...s.listings,
        ],
      })),
    removeListing: (id) =>
      setState((s) => ({ ...s, listings: s.listings.filter((l) => l.id !== id) })),
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
