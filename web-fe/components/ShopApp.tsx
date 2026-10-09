'use client';

import { useState } from 'react';
import { ShopProvider } from '@/lib/shop-context';
import { IconSprite } from './Icons';
import Announcement from './Announcement';
import Header from './Header';
import Board from './Board';
import ProductGrid from './ProductGrid';
import CartPanel from './CartPanel';
import AuthDialog from './AuthDialog';
import QuickView from './QuickView';
import Toast from './Toast';

export default function ShopApp() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <ShopProvider>
      <IconSprite />

      <a className="skip-link" href="#shop">
        Skip to products
      </a>

      <Announcement />
      <Header onOpenAuth={() => setAuthOpen(true)} />

      <main id="top">
        <Board />

        <ProductGrid />

        <section className="journal" id="journal" aria-labelledby="journal-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1753164725860-ffcd260b7b32?auto=format&fit=crop&w=1100&q=80"
            alt="A potter shaping a clay pot on a throwing wheel"
            loading="lazy"
          />
          <div className="journal-copy">
            <h2 id="journal-title">Made slowly, used daily.</h2>
            <p>
              Notes from the makers behind the stall: how the pitchers are thrown, why the tapers
              are hand-dipped, and the good kind of ordinary.
            </p>
            <a className="button button-ghost" href="#journal">
              Read the journal{' '}
              <svg className="icon" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#top">
          Morrow<span>Goods</span>
        </a>
        <ul>
          <li>
            <svg className="icon" aria-hidden="true">
              <use href="#i-truck" />
            </svg>{' '}
            Free delivery over $75
          </li>
          <li>Demo storefront — no real orders are placed</li>
        </ul>
        <p>© 2026 Morrow Goods</p>
      </footer>

      <CartPanel />
      <QuickView />
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
      <Toast />
    </ShopProvider>
  );
}
