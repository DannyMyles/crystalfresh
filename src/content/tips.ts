import type { LucideIcon } from "lucide-react";
import { Box, GlassWater, Sparkles, Sun } from "lucide-react";

/**
 * Hydration tips shown on the home page. Keep them short, practical and
 * general: avoid medical claims or specific daily amounts.
 */
export type Tip = { icon: LucideIcon; title: string; text: string };

export const tips: Tip[] = [
  {
    icon: GlassWater,
    title: "Sip through the day",
    text: "Drink regularly instead of waiting until you feel thirsty.",
  },
  {
    icon: Sun,
    title: "Drink more in the heat",
    text: "Hot days and exercise mean you need more water than usual.",
  },
  {
    icon: Sparkles,
    title: "Clean before refilling",
    text: "Wash and rinse your containers before every refill.",
  },
  {
    icon: Box,
    title: "Store bottles well",
    text: "Keep bottled water in a cool, shaded place, away from direct sunlight.",
  },
];
