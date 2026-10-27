import Link from "next/link";
import { ArrowRight, Briefcase, Dumbbell, Home, PartyPopper, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type Audience = { icon: LucideIcon; title: string; description: string; href: string; action: string };

const audiences: Audience[] = [
  { icon: Home, title: "Homes", description: "Bottled water and refills for the family.", href: "/order", action: "Order Water" },
  { icon: Briefcase, title: "Offices", description: "Regular supply for staff and visitors.", href: "/quote", action: "Request a Quote" },
  { icon: PartyPopper, title: "Events", description: "Water for weddings, meetings and functions.", href: "/quote", action: "Request a Quote" },
  { icon: Dumbbell, title: "Gyms & fitness", description: "Hydration for members and staff.", href: "/quote", action: "Request a Quote" },
];

export function AudienceCards() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {audiences.map(({ icon: Icon, title, description, href, action }, i) => (
        <Reveal as="li" key={title} delay={i * 80}>
          <Link
            href={href}
            className="group flex h-full flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand-300 sm:p-6"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-semibold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand-700">
              {action}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
