'use client';

import { useShop, categories } from '@/lib/shop-context';
import { Icon } from './Icons';

export default function Header({
  onOpenAuth,
}: {
  onOpenAuth: () => void;
}) {
  const { cart, authUser, menuOpen, bagButtonRef, toggleMenu, closeMenu, openCart, setCategory, handleLogout } = useShop();
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className={`site-header${menuOpen ? ' menu-open' : ''}`} id="site-header">
      <button
        className="icon-button menu-button"
        id="open-menu"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="primary-nav"
        onClick={toggleMenu}
      >
        <Icon name="menu" />
      </button>

      <a className="wordmark" href="#top" aria-label="Morrow Goods home">
        Morrow<span>Goods</span>
      </a>

      <nav className="primary-nav" id="primary-nav" aria-label="Primary">
        <a href="#shop" onClick={() => { setCategory('all'); closeMenu(); }}>Shop all</a>
        {Object.entries(categories).map(([key, { label }]) => (
          <a key={key} href="#shop" onClick={() => { setCategory(key); closeMenu(); }}>
            {label}
          </a>
        ))}
        <a href="#journal" onClick={closeMenu}>Journal</a>
      </nav>

      <div className="header-actions">
        {authUser ? (
          <button
            className="text-button account-button"
            title={`Signed in as ${authUser.email}. Click to sign out.`}
            onClick={handleLogout}
          >
            <Icon name="user" />
            <span>Hi, {authUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button className="text-button account-button" id="open-auth" onClick={onOpenAuth}>
            <Icon name="user" />
            <span>Sign in</span>
          </button>
        )}

        <button
          ref={bagButtonRef}
          className={`bag-button${count > 0 ? ' has-items' : ''}`}
          id="open-cart"
          aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
          aria-controls="cart-panel"
          aria-expanded={false}
          onClick={openCart}
        >
          <Icon name="bag" />
          <span className="bag-label">Bag</span>
          <span className="cart-count" aria-hidden="true">{count}</span>
        </button>
      </div>
    </header>
  );
}
