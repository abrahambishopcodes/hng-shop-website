'use client';

import { useEffect, useRef, useState } from 'react';
import { useShop, products } from '@/lib/shop-context';
import { Icon } from './Icons';
import { FREE_DELIVERY, materialLine } from '@/lib/products';

export default function QuickView() {
  const { quickViewId, closeQuickView, addToCart } = useShop();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (quickViewId !== null) {
      setQty(1);
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [quickViewId]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = () => closeQuickView();
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [closeQuickView]);

  const product = quickViewId !== null ? products.find((p) => p.id === quickViewId) : null;

  return (
    <dialog
      ref={dialogRef}
      className="quick-view"
      id="quick-view"
      aria-labelledby="qv-name"
      onClick={(e) => { if (e.target === dialogRef.current) closeQuickView(); }}
    >
      <button className="icon-button qv-close" aria-label="Close product details" onClick={closeQuickView}>
        <Icon name="close" />
      </button>

      {product && (
        <div className="qv-body" id="qv-body">
          <div className={`qv-media crate-${product.category}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} />
            {product.tag && <span className="product-tag">{product.tag}</span>}
          </div>
          <div className={`qv-info crate-${product.category}`}>
            <h2 id="qv-name">{product.name}</h2>
            <p className="qv-material">
              <span className="crate-dot" />
              {materialLine(product)}
            </p>
            <span className="price-sign price-sign-lg">{product.price}</span>
            <p className="qv-description">{product.description}</p>
            <div className="qv-buy">
              <div className="stepper" role="group" aria-label="Quantity">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Icon name="minus" />
                </button>
                <span aria-live="polite">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(9, q + 1))}
                >
                  <Icon name="plus" />
                </button>
              </div>
              <button
                className="button button-sign button-wide"
                onClick={(e) => addToCart(product.id, qty, e.currentTarget)}
              >
                <Icon name="plus" /> Add to bag
              </button>
            </div>
            <p className="qv-note">
              <Icon name="truck" /> Free delivery on orders over ${FREE_DELIVERY}
            </p>
          </div>
        </div>
      )}
    </dialog>
  );
}
