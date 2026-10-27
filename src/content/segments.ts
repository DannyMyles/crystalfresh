import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Church,
  GraduationCap,
  HandHeart,
  Hospital,
  Hotel,
  PartyPopper,
  Store,
  UtensilsCrossed,
} from "lucide-react";

export type Segment = { name: string; icon: LucideIcon };

export const segments: Segment[] = [
  { name: "Offices", icon: Briefcase },
  { name: "Schools", icon: GraduationCap },
  { name: "Hospitals & clinics", icon: Hospital },
  { name: "Hotels & lodges", icon: Hotel },
  { name: "Restaurants & cafés", icon: UtensilsCrossed },
  { name: "Retailers & shops", icon: Store },
  { name: "Churches", icon: Church },
  { name: "Event organisers", icon: PartyPopper },
  { name: "NGOs", icon: HandHeart },
  { name: "Other institutions", icon: Building2 },
];
