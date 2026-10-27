import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { mailtoHref, telHref } from "@/lib/links";
import { Container } from "@/components/ui/Section";

type Item = { icon: ReactNode; label: string; value: string; href?: string; external?: boolean };

/** Key contact facts at a glance. Opening hours appear once set in config/site.ts. */
export function InfoStrip() {
  const items: Item[] = [
    { icon: <MapPin className="h-4 w-4" />, label: "Location", value: `${site.address.street}, ${site.address.country}`, href: site.map.searchUrl, external: true },
    { icon: <Phone className="h-4 w-4" />, label: "Call / WhatsApp", value: site.phone.display, href: telHref },
    { icon: <Mail className="h-4 w-4" />, label: "Email", value: site.email, href: mailtoHref() },
  ];
  if (site.operatingHours.length > 0) {
    items.push({
      icon: <Clock className="h-4 w-4" />,
      label: "Open",
      value: site.operatingHours.map((h) => `${h.days} ${h.hours}`).join(" · "),
    });
  }

  return (
    <section aria-label="Contact details" className="border-y border-line bg-white">
      <Container>
        <ul className={`grid divide-line sm:grid-cols-2 sm:divide-x ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((item) => {
            const body = (
              <>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted">{item.label}</span>
                  <span className="block truncate text-sm font-semibold text-ink">{item.value}</span>
                </span>
              </>
            );
            return (
              <li key={item.label} className="border-b border-line last:border-b-0 sm:border-b-0">
                {item.href ? (
                  <a
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 py-4 transition hover:text-brand-700 sm:px-5 first:sm:pl-0"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex items-center gap-3 py-4 sm:px-5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
