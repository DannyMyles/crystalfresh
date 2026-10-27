/**
 * Customer testimonials. The testimonials section stays hidden while this list
 * is empty. Only add genuine testimonials, with the customer's permission.
 *
 * Example:
 *   { quote: "…", name: "Jane W.", role: "Office Manager, Example Ltd" },
 */

export type Testimonial = { quote: string; name: string; role?: string };

export const testimonials: Testimonial[] = [];
