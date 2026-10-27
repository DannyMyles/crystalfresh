/**
 * Organisations Crystal Fresh Hydrolife has supplied. Shown as "Trusted by" on
 * the home and Business pages; the section is hidden while this list is empty.
 *
 * Only list real clients, and use their logo with their permission.
 * Logos go in /public/images/clients/. Use `tone: "dark"` for white or
 * light-coloured logos so they sit on a dark tile.
 *
 * Example:
 *   { name: "Example Academy", logo: "/images/clients/example-academy.png", tone: "light" },
 */

export type Client = {
  name: string;
  logo: string;
  tone: "light" | "dark";
};

export const clients: Client[] = [
  { name: "Velocity Gym & Spa", logo: "/images/clients/velocity-gym-spa.png", tone: "light" },
  { name: "Ultimo Fitness & Spa", logo: "/images/clients/ultimo-fitness-spa.png", tone: "dark" },
  { name: "Good Kenyan Foundation", logo: "/images/clients/good-kenyan-foundation.png", tone: "light" },
];
