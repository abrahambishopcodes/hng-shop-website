'use client';

import { useShop, products } from '@/lib/shop-context';
import { Icon } from './Icons';
import { FREE_DELIVERY, materialLine } from '@/lib/products';

const featured = products.find((p) => p.tag === 'Restocked') || products[0];

export default function Board() {
  const { addToCart } = useShop();

  return (
    <section className="board" aria-labelledby="board-title">
      <div className="board-copy">
        <h1 id="board-title">
          Good goods,
          <br />
          fairly <span>priced.</span>
        </h1>
        <p>
          Six useful pieces for the kitchen, the table, the desk and the evening — from{' '}
          <strong>$16</strong>.
        </p>
        <div className="board-actions">
          <a className="button button-sign" href="#shop">
            Shop the stall <Icon name="arrow" />
          </a>
          <span className="board-note">
            <Icon name="truck" /> Free delivery over ${FREE_DELIVERY}
          </span>
        </div>
      </div>

      <div className="board-feature" id="board-feature">
        <figure className={`feature crate-${featured.category}`}>
          <div className="feature-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt={featured.name} />
            {featured.tag && <span className="product-tag">{featured.tag}</span>}
          </div>
          <figcaption>
            <span className="feature-name">{featured.name}</span>
            <span className="price-sign price-sign-lg">{featured.price}</span>
            <span className="feature-description">{materialLine(featured)}</span>
            <button
              className="button button-sign"
              onClick={(e) => addToCart(featured.id, 1, e.currentTarget)}
            >
              <Icon name="plus" /> Add to bag
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
