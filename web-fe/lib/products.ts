export interface Product {
  id: number;
  name: string;
  category: keyof typeof categories;
  material: string;
  price: number;
  tag: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export const FREE_DELIVERY = 75;
export const STORAGE_KEY = 'morrow-bag';

export const categories = {
  kitchen: { label: 'Kitchen' },
  candlelight: { label: 'Candlelight' },
  desk: { label: 'Desk' },
  linen: { label: 'Linen' },
} as const;

export const products: Product[] = [
  {
    id: 1,
    name: 'Low arc pitcher',
    category: 'kitchen',
    material: 'Stoneware · Oat',
    price: 58,
    tag: 'New',
    description:
      'A wide, low-shouldered pitcher for water, milk or a handful of stems. The pour lip is pulled by hand, so it stops cleanly.',
    image:
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Morrow taper set',
    category: 'candlelight',
    material: 'Beeswax · Clay',
    price: 24,
    tag: 'Restocked',
    description:
      'A pair of hand-dipped beeswax tapers with a small clay holder. Burns slow and smells faintly of honey.',
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Field notes no. 3',
    category: 'desk',
    material: 'Paper · 80 pages',
    price: 16,
    tag: '',
    description:
      'A pocket notebook with 80 dot-grid pages and a soft card cover. Lies flat, takes fountain pen ink without bleeding.',
    image:
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Sunday table cloth',
    category: 'linen',
    material: 'Linen · Undyed',
    price: 82,
    tag: 'Limited',
    description:
      'Heavyweight undyed linen, stonewashed so it drapes softly from the first use. Seats six comfortably.',
    image:
      'https://images.unsplash.com/photo-1672386608328-415973e6134e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Dawn cup',
    category: 'kitchen',
    material: 'Stoneware · Moss',
    price: 32,
    tag: '',
    description:
      'A handleless cup that holds a generous coffee and sits warm in two hands. Moss glaze, unglazed foot.',
    image:
      'https://images.unsplash.com/photo-1525629545813-e4e7ba89e506?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Brass wick trimmer',
    category: 'candlelight',
    material: 'Solid brass',
    price: 28,
    tag: '',
    description:
      'Long-reach scissors that trim and catch the wick in one cut, for a cleaner, longer burn.',
    image:
      'https://images.unsplash.com/photo-1537948756265-406a522f1a45?auto=format&fit=crop&w=900&q=80',
  },
];

export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function materialLine(p: Product): string {
  const label = categories[p.category].label;
  return p.material.startsWith(label) ? p.material : `${label} · ${p.material}`;
}
