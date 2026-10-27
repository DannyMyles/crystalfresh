/**
 * Real photos of the business: premises, bottles, refill station, deliveries.
 * The gallery section on the home page stays hidden while this list is empty.
 * Put photos in /public/images/gallery/ (landscape or square works best).
 *
 * Example:
 *   { src: "/images/gallery/refill-station.jpg", alt: "Our refill station" },
 */

export type GalleryPhoto = { src: string; alt: string };

export const gallery: GalleryPhoto[] = [];
