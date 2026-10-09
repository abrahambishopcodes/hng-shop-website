import type { Metadata } from 'next';
import { Big_Shoulders, Figtree } from 'next/font/google';
import './globals.css';

const bigShoulders = Big_Shoulders({
  variable: '--font-big-shoulders',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Morrow Goods — Everyday goods',
  description:
    'Morrow Goods — useful everyday goods for the kitchen, table, desk and candlelit evenings.',
  themeColor: '#18231d',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
