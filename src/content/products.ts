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
  /** `position` is the CSS object-position used when the photo is cropped to the card. */
  image: { src: string; alt: string; position?: string };
  highlights: string[];
  sizes: ProductSize[];
};

export const products: Product[] = [
  {
    slug: "bottled-water",
    name: "Bottled Drinking Water",
    shortName: "Bottled water",
    summary: "Sealed, ready-to-drink water, sold by the case.",
    image: { src: "/images/bottled-water.jpg", alt: "A clear bottle of drinking water" },
    highlights: ["Cases of 24 × 500 ml or 12 × 1 L", "Homes, offices and events", "Delivery available"],
    sizes: [
      { label: "Case of 500 ml bottles", price: 600, note: "24 bottles" },
      { label: "Case of 1 L bottles", price: 600, note: "12 bottles" },
    ],
  },
  {
    slug: "water-refill",
    name: "Water Refill Services",
    shortName: "Water refill",
    summary: "Refill your own containers with clean drinking water.",
    image: { src: "/images/refill-tap.jpg", alt: "Clean water flowing from a tap", position: "50% 45%" },
    highlights: ["Economical for daily use", "One-time or regular refills"],
    sizes: [{ label: "20 L (per piece)", price: null }],
  },
];

/**
 * What customers can choose on the order form. Prices are in KES per unit
 * (`null` = confirmed by phone). Cases come in 500 ml and 1 L; 20 L is sold per piece.
 */
export type OrderOption = {
  label: string;
  hint: string;
  productSlug: string;
  price: number | null;
  unit: [singular: string, plural: string];
  /** What one unit contains, e.g. 24 bottles per case. */
  contents?: { count: number; item: [singular: string, plural: string] };
};

export const orderOptions: OrderOption[] = [
  { label: "Case of 500 ml bottles", hint: "24 bottles · KES 600 per case", productSlug: "bottled-water", price: 600, unit: ["case", "cases"], contents: { count: 24, item: ["bottle", "bottles"] } },
  { label: "Case of 1 L bottles", hint: "12 bottles · KES 600 per case", productSlug: "bottled-water", price: 600, unit: ["case", "cases"], contents: { count: 12, item: ["bottle", "bottles"] } },
  { label: "20 L refill", hint: "Per piece · price confirmed by phone", productSlug: "water-refill", price: null, unit: ["piece", "pieces"] },
];

export function getProduct(slug: string | undefined): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return `KES ${price.toLocaleString("en-KE")}`;
}
