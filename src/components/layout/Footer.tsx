import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navigation, site } from "@/config/site";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";
import { Logo } from "@/components/brand/Logo";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { Container } from "@/components/ui/Section";

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
};

export function Footer() {
  const socials = Object.entries(site.social).filter((entry): entry is [string, string] => Boolean(entry[1]));
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div>
          <Logo invert />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
            Bottled water and refills along Ndwaru Road.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 hover:bg-white/10"
                  >
                    {socialLabels[key] ?? key}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-white">Get started</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/order" className="hover:text-white">
                Order water
              </Link>
            </li>
            <li>
              <Link href="/quote" className="hover:text-white">
                Request a quote
              </Link>
            </li>
            <li>
              <Link href="/business#tender-form" className="hover:text-white">
                Tender inquiry
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy notice
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <a href={telHref} className="flex items-center gap-3 hover:text-white">
              <Phone className="h-4 w-4 shrink-0 text-aqua-300" aria-hidden="true" />
              {site.phone.display}
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-aqua-300" />
              WhatsApp {site.whatsapp.display}
            </a>
            <a href={mailtoHref()} className="flex items-center gap-3 break-words hover:text-white">
              <Mail className="h-4 w-4 shrink-0 text-aqua-300" aria-hidden="true" />
              {site.email}
            </a>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-aqua-300" aria-hidden="true" />
              {site.address.street}, {site.address.country}
            </p>
          </address>
          {site.operatingHours.length > 0 && (
            <dl className="mt-5 space-y-1 text-sm">
              {site.operatingHours.map((h) => (
                <div key={h.days} className="flex gap-2">
                  <dt className="text-brand-200">{h.days}:</dt>
                  <dd className="text-white">{h.hours}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>{site.address.street}, {site.address.country}</p>
        </Container>
      </div>
    </footer>
  );
}
