/**
 * Products and services.
 *
 * Sizes and prices are intentionally empty until the business confirms them.
 * To publish a size, add an entry such as:
 *
 *   sizes: [
 *     { label: "500 ml", price: 50, note: "per bottle" },
 *     { label: "20 litres", price: null }, // shows "Price on request"
 *   ],
 *
 * Prices are in Kenyan shillings (KES). Replace images by adding a file to
 * /public/images and updating `image.src`.
 */

export type ProductSize = {
  label: string;
  /** Price in KES. `null` shows "Price on request". */
  price: number | null;
  note?: string;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  /** A photo in /public, or the built-in illustration of the bottle sizes. */
  image: { src: string; alt: string } | { illustration: "bottles"; alt: string };
  highlights: string[];
  sizes: ProductSize[];
};

export const products: Product[] = [
  {
    slug: "bottled-water",
    name: "Bottled Drinking Water",
    shortName: "Bottled water",
    summary: "Sealed, ready-to-drink water.",
    image: { illustration: "bottles", alt: "20 litre, 10 litre and 1 litre water bottles" },
    highlights: ["Homes, offices and events", "Single or bulk orders", "Local delivery"],
    sizes: [
      { label: "20 L", price: null },
      { label: "10 L", price: null },
      { label: "1 L", price: null },
    ],
  },
  {
    slug: "water-refill",
    name: "Water Refill Services",
    shortName: "Water refill",
    summary: "Refill your own containers with clean drinking water.",
    image: {
      src: "/images/water-refill.jpg",
      alt: "A glass bottle and a glass filled with clean water",
    },
    highlights: ["Economical for daily use", "Ask about regular refills"],
    sizes: [],
  },
];

export function getProduct(slug: string | undefined): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return `KES ${price.toLocaleString("en-KE")}`;
}
