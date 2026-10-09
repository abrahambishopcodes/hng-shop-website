'use client';

import { useShop, products, categories } from '@/lib/shop-context';
import { Icon } from './Icons';
import { money, materialLine } from '@/lib/products';

const sorters: Record<string, (a: { price: number; name: string }, b: { price: number; name: string }) => number> = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function ProductGrid() {
  const { category, sort, setCategory, setSort, addToCart, openQuickView } = useShop();

  const visible = category === 'all' ? products : products.filter((p) => p.category === category);
  const sorted = sorters[sort] ? [...visible].sort(sorters[sort]) : visible;

  const allEntries: [string, { label: string }][] = [
    ['all', { label: 'All' }],
    ...(Object.entries(categories) as [string, { label: string }][]),
  ];

  const label =
    category === 'all' ? 'pieces' : `in ${categories[category as keyof typeof categories].label}`;
  const countLabel = `${sorted.length} ${sorted.length === 1 && category === 'all' ? 'piece' : label}`;

  return (
    <section
      className={`shop crate-${category}${category !== 'all' ? ' is-filtered' : ''}`}
      id="shop"
      aria-labelledby="shop-title"
    >
      <div className="shop-head">
        <h2 id="shop-title">The stall</h2>
        <p className="result-count" id="result-count" aria-live="polite">
          {countLabel}
        </p>
      </div>

      <div className="shop-controls">
        <div className="crates" role="group" aria-label="Filter by category">
          {allEntries.map(([key, { label: lbl }]) => {
            const cnt =
              key === 'all' ? products.length : products.filter((p) => p.category === key).length;
            return (
              <button
                key={key}
                className={`crate crate-${key}`}
                aria-pressed={category === key}
                onClick={() => setCategory(key)}
              >
                {lbl}
                <span>{cnt}</span>
              </button>
            );
          })}
        </div>

        <label className="sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>

      <ul className="product-grid" id="product-grid">
        {sorted.map((p) => (
          <li key={p.id} className={`product crate-${p.category}`}>
            <button
              className="product-media"
              onClick={() => openQuickView(p.id)}
              aria-label={`View details for ${p.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" loading="lazy" />
              {p.tag && <span className="product-tag">{p.tag}</span>}
              <span className="price-sign">{p.price}</span>
            </button>
            <div className="product-info">
              <h3>
                <button onClick={() => openQuickView(p.id)}>{p.name}</button>
              </h3>
              <p>
                <span className="crate-dot" />
                {materialLine(p)}
              </p>
            </div>
            <button
              className="button button-add"
              aria-label={`Add ${p.name} to bag, ${money(p.price)}`}
              onClick={(e) => addToCart(p.id, 1, e.currentTarget)}
            >
              <Icon name="plus" /> Add to bag
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
