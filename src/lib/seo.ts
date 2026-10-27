import type { Metadata } from "next";
import { site } from "@/config/site";
import { products } from "@/content/products";

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${site.name}`, description, url: path },
    twitter: { title: `${title} | ${site.name}`, description },
  };
}

export function businessJsonLd(): Record<string, unknown> {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/opengraph-image`,
    ...(site.logo ? { logo: `${site.url}${site.logo}` } : {}),
    telephone: site.phone.international,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      ...(site.address.locality ? { addressLocality: site.address.locality } : {}),
      addressCountry: site.address.countryCode,
    },
    ...(site.map.geo
      ? { geo: { "@type": "GeoCoordinates", latitude: site.map.geo.latitude, longitude: site.map.geo.longitude } }
      : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone.international,
      email: site.email,
      contactType: "customer service",
      areaServed: site.address.countryCode,
      availableLanguage: ["English", "Swahili"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Water products and services",
      itemListElement: products.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": p.slug === "water-refill" ? "Service" : "Product", name: p.name, description: p.summary },
      })),
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}
