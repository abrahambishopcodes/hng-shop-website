'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import {
  categories,
  products,
  type AuthUser,
  type CartItem,
  FREE_DELIVERY,
  STORAGE_KEY,
} from './products';

// Re-export for convenience
export { FREE_DELIVERY, categories, products };

export interface ToastState {
  message: string;
  action?: { label: string; action: () => void };
  id: number;
}

interface ShopContextValue {
  cart: CartItem[];
  category: string;
  sort: string;
  cartOpen: boolean;
  quickViewId: number | null;
  toast: ToastState | null;
  authUser: AuthUser | null;
  announcementDismissed: boolean;
  menuOpen: boolean;
  bagButtonRef: RefObject<HTMLButtonElement | null>;
  addToCart: (id: number, quantity: number, sourceEl?: HTMLElement | null) => void;
  changeQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  setCategory: (category: string) => void;
  setSort: (sort: string) => void;
  openCart: () => void;
  closeCart: () => void;
  openQuickView: (id: number) => void;
  closeQuickView: () => void;
  showToast: (message: string, action?: { label: string; action: () => void }) => void;
  dismissAnnouncement: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleLogout: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}

function persistCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity })))
    );
  } catch {}
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, _setCategory] = useState('all');
  const [sort, _setSort] = useState('featured');
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bagButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as CartItem[];
      const valid = saved.filter(
        (item) => products.some((p) => p.id === item.id) && item.quantity > 0
      );
      setCart(valid);
    } catch {}
    try {
      if (localStorage.getItem('morrow-announcement') === 'closed') {
        setAnnouncementDismissed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${apiBase}/api/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then(({ user }: { user: AuthUser | null }) => {
        if (user) setAuthUser(user);
      })
      .catch(() => {});

    const outcome = new URLSearchParams(window.location.search).get('auth');
    if (outcome) {
      window.history.replaceState({}, '', window.location.pathname);
      const messages: Record<string, string> = {
        success: "You're signed in with Google.",
        cancelled: 'Google sign-in was cancelled.',
        failed: 'We could not sign you in. Please try again.',
      };
      if (messages[outcome]) showToastInternal(messages[outcome]);
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function showToastInternal(
    message: string,
    action?: { label: string; action: () => void }
  ): void {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    const id = Date.now();
    setToast({ message, action, id });
    toastTimerRef.current = setTimeout(
      () => setToast((prev) => (prev?.id === id ? null : prev)),
      action ? 4500 : 2800
    );
  }

  function flyToBag(sourceEl: HTMLElement | null | undefined, image: string): void {
    const btn = bagButtonRef.current;
    if (!btn) return;
    btn.classList.remove('bump');
    void btn.offsetWidth;
    btn.classList.add('bump');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !sourceEl) return;

    const fromEl =
      (sourceEl
        .closest<HTMLElement>('.product, .feature, .qv-body')
        ?.querySelector('img') as HTMLElement) || sourceEl;
    const from = fromEl.getBoundingClientRect();
    const to = btn.getBoundingClientRect();

    const ghost = document.createElement('img') as HTMLImageElement;
    ghost.src = image;
    ghost.alt = '';
    ghost.className = 'fly';
    const size = 72;
    Object.assign(ghost.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${from.left + from.width / 2 - size / 2}px`,
      top: `${from.top + from.height / 2 - size / 2}px`,
    });
    document.body.appendChild(ghost);

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    ghost
      .animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          {
            transform: `translate(${dx * 0.6}px,${dy * 0.6 - 60}px) scale(.7)`,
            opacity: 1,
            offset: 0.6,
          },
          { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0.2 },
        ],
        { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' }
      )
      .addEventListener('finish', () => ghost.remove());
  }

  const addToCart = (id: number, quantity: number, sourceEl?: HTMLElement | null): void => {
    const product = products.find((p) => p.id === id)!;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      const next = existing
        ? prev.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
              : item
          )
        : [...prev, { id, quantity }];
      persistCart(next);
      return next;
    });
    flyToBag(sourceEl, product.image);
    setQuickViewId(null);
    if (!cartOpen) {
      showToastInternal(`${quantity > 1 ? `${quantity} × ` : ''}${product.name} added`, {
        label: 'View bag',
        action: () => setCartOpen(true),
      });
    }
  };

  const changeQuantity = (id: number, delta: number): void => {
    setCart((prev) => {
      const next = prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0);
      persistCart(next);
      return next;
    });
  };

  const removeFromCart = (id: number): void => {
    setCart((prev) => {
      const removed = prev.find((item) => item.id === id);
      const next = prev.filter((item) => item.id !== id);
      persistCart(next);
      if (removed) {
        const name = products.find((p) => p.id === id)!.name;
        showToastInternal(`${name} removed`, {
          label: 'Undo',
          action: () =>
            setCart((c) => {
              const undo = [...c, removed];
              persistCart(undo);
              return undo;
            }),
        });
      }
      return next;
    });
  };

  const openCart = useCallback(() => {
    setToast(null);
    setCartOpen(true);
  }, []);

  const closeCart = useCallback(() => setCartOpen(false), []);
  const openQuickView = useCallback((id: number) => setQuickViewId(id), []);
  const closeQuickView = useCallback(() => setQuickViewId(null), []);
  const showToast = useCallback(
    (message: string, action?: { label: string; action: () => void }) =>
      showToastInternal(message, action),
    []
  );
  const setCategory = useCallback((c: string) => _setCategory(c), []);
  const setSort = useCallback((s: string) => _setSort(s), []);
  const dismissAnnouncement = useCallback(() => {
    setAnnouncementDismissed(true);
    try {
      localStorage.setItem('morrow-announcement', 'closed');
    } catch {}
  }, []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const handleLogout = useCallback(async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    await fetch(`${apiBase}/api/logout`, { method: 'POST', credentials: 'include' });
    window.location.assign('/');
  }, []);

  const value: ShopContextValue = {
    cart,
    category,
    sort,
    cartOpen,
    quickViewId,
    toast,
    authUser,
    announcementDismissed,
    menuOpen,
    bagButtonRef,
    addToCart,
    changeQuantity,
    removeFromCart,
    setCategory,
    setSort,
    openCart,
    closeCart,
    openQuickView,
    closeQuickView,
    showToast,
    dismissAnnouncement,
    toggleMenu,
    closeMenu,
    handleLogout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
