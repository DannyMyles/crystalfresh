/**
 * Central business configuration.
 *
 * Every confirmed business detail lives here so it can be changed in one place.
 * Fields set to `null` (or empty arrays) are details the business has not yet
 * confirmed. The UI hides them or shows an honest "on request" message until
 * they are filled in. Do not add information that has not been verified.
 */

export type OperatingHours = { days: string; hours: string };

export type SocialLinks = {
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  x: string | null;
  linkedin: string | null;
};

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Crystal Fresh Hydrolife",
  shortName: "Crystal Fresh",
  tagline: "Pure Water. Reliable Supply. Trusted Partnerships.",
  logoTagline: "Pure Drinking Water",
  description:
    "Crystal Fresh Hydrolife supplies bottled drinking water and water refill services in Nairobi, Kenya, delivering to homes, businesses and institutions. Order water or request bulk and corporate quotations.",

  /** Set NEXT_PUBLIC_SITE_URL once the domain is confirmed. */
  url: resolveSiteUrl(),

  phone: {
    display: "(+254) 758 269 725",
    /** Used for click-to-call links: tel:0758269725 */
    tel: "0758269725",
    international: "+254758269725",
  },

  whatsapp: {
    /** International format without "+", used by wa.me links. */
    number: "254758269725",
    display: "(+254) 758 269 725",
    defaultMessage:
      "Hello Crystal Fresh Hydrolife, I would like to inquire about your water supply.",
  },

  email: "muhadiwawire@gmail.com",

  /** General location shown across the site. The street is used only for directions and search engines. */
  location: "Nairobi, Kenya",

  address: {
    street: "Ndwaru Road",
    /** e.g. a building name or landmark, once confirmed. */
    landmark: null as string | null,
    locality: "Nairobi" as string | null,
    country: "Kenya",
    countryCode: "KE",
  },

  /** Where you deliver. Replace with the confirmed areas, e.g. "Nairobi and surrounding counties". */
  deliveryArea: "Nairobi and beyond. Ask about your area.",

  map: {
    /**
     * Paste a verified Google Maps embed URL (Share → Embed a map → the iframe's
     * src) to replace the map placeholder with a live map.
     */
    embedUrl: "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s7519144759564615141" as string | null,
    /** Exact coordinates, once verified. Used in structured data. */
    geo: null as { latitude: number; longitude: number } | null,
    /** The business's own Google Maps place (opens the pin; visitors tap Directions from there). */
    searchUrl: "https://www.google.com/maps?cid=7519144759564615141",
  },

  /** e.g. [{ days: "Monday – Saturday", hours: "7:00 am – 7:00 pm" }] */
  operatingHours: [] as OperatingHours[],

  /** e.g. "Free delivery for orders above …". */
  deliveryCharges: null as string | null,

  /** The logo mark (tap and ring) under /public; the wordmark text is set in Logo.tsx. */
  logo: "/images/brand/logo-mark.png",

  social: {
    facebook: null,
    instagram: null,
    tiktok: null,
    x: null,
    linkedin: null,
  } as SocialLinks,
} as const;

export const navigation = [
  { href: "/products", label: "Products" },
  { href: "/business", label: "Business" },
  { href: "/contact", label: "Contact" },
] as const;
