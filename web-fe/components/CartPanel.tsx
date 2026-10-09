'use client';

import { useShop, products, FREE_DELIVERY } from '@/lib/shop-context';
import { Icon } from './Icons';
import { money } from '@/lib/products';

export default function CartPanel() {
  const { cart, cartOpen, closeCart, changeQuantity, removeFromCart, showToast } = useShop();

  const lines = cart.map((item) => ({
    ...products.find((p) => p.id === item.id)!,
    quantity: item.quantity,
  }));
  const count = lines.reduce((s, i) => s + i.quantity, 0);
  const subtotal = lines.reduce((s, i) => s + i.price * i.quantity, 0);
  const remaining = FREE_DELIVERY - subtotal;

  return (
    <>
      <div
        className={`scrim${cartOpen ? ' visible' : ''}`}
        id="scrim"
        onClick={closeCart}
      />

      <aside
        className={`cart-panel${cartOpen ? ' open' : ''}`}
        id="cart-panel"
        aria-labelledby="cart-title"
        role="dialog"
        aria-modal="true"
        // @ts-expect-error – inert is valid HTML but not yet in React's types
        inert={cartOpen ? undefined : ''}
      >
        <div className="panel-head">
          <h2 id="cart-title">
            Your bag <span id="panel-count">({count})</span>
          </h2>
          <button className="icon-button" aria-label="Close bag" onClick={closeCart}>
            <Icon name="close" />
          </button>
        </div>

        <div className={`shipping-meter${remaining <= 0 && count > 0 ? ' done' : ''}`} id="shipping-meter">
          <p id="shipping-text">
            {!count ? (
              <>
                Free delivery on orders over <strong>${FREE_DELIVERY}</strong>
              </>
            ) : remaining > 0 ? (
              <>
                You&apos;re <strong>{money(remaining)}</strong> away from free delivery
              </>
            ) : (
              <strong>Free delivery unlocked. Nice haul.</strong>
            )}
          </p>
          <div
            className="meter"
            role="progressbar"
            aria-labelledby="shipping-text"
            aria-valuemin={0}
            aria-valuemax={FREE_DELIVERY}
            aria-valuenow={Math.min(subtotal, FREE_DELIVERY)}
            id="meter"
          >
            <span
              id="meter-fill"
              style={{ transform: `scaleX(${Math.min(subtotal / FREE_DELIVERY, 1)})` }}
            />
          </div>
        </div>

        <ul className="cart-items" id="cart-items">
          {lines.map((item) => (
            <li key={item.id} className="cart-row">
              <div className={`cart-thumb crate-${item.category}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" />
              </div>
              <div className="cart-line">
                <h3>{item.name}</h3>
                <p>{item.material}</p>
                <div
                  className="stepper stepper-sm"
                  role="group"
                  aria-label={`Quantity of ${item.name}`}
                >
                  <button
                    aria-label={`Remove one ${item.name}`}
                    onClick={() => changeQuantity(item.id, -1)}
                  >
                    <Icon name="minus" />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label={`Add one ${item.name}`}
                    onClick={() => changeQuantity(item.id, 1)}
                  >
                    <Icon name="plus" />
                  </button>
                </div>
              </div>
              <div className="cart-side">
                <strong>{money(item.price * item.quantity)}</strong>
                <button
                  className="remove"
                  aria-label={`Remove ${item.name} from bag`}
                  onClick={() => removeFromCart(item.id)}
                >
                  <Icon name="trash" />
                  <span>Remove</span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {count === 0 && (
          <div className="cart-empty" id="cart-empty">
            <Icon name="bag" />
            <h3>Your bag is empty.</h3>
            <p>Pick something off the stall — everything ships free once you pass $75.</p>
            <button className="button button-sign" onClick={closeCart}>
              Keep shopping
            </button>
          </div>
        )}

        {count > 0 && (
          <div className="cart-footer" id="cart-footer">
            <dl>
              <dt>Subtotal</dt>
              <dd id="subtotal">{money(subtotal)}</dd>
            </dl>
            <p>Taxes calculated at checkout.</p>
            <button
              className="button button-sign button-wide"
              id="checkout"
              onClick={() => showToast('Checkout is a demo — no payment is taken.')}
            >
              Checkout <Icon name="arrow" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
