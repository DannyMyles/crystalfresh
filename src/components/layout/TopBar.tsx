import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

/** Slim contact bar above the main menu, on tablets and desktops. */
export function TopBar() {
  const link = "inline-flex items-center gap-2 transition hover:text-white";
  return (
    <div className="hidden bg-brand-950 text-xs text-brand-100 md:block">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <a href={site.map.searchUrl} target="_blank" rel="noopener noreferrer" className={link}>
            <MapPin className="h-3.5 w-3.5 text-logo-light" aria-hidden="true" />
            {site.location}
          </a>
          {site.operatingHours.length > 0 && (
            <span className="hidden items-center gap-2 lg:inline-flex">
              <Clock className="h-3.5 w-3.5 text-logo-light" aria-hidden="true" />
              {site.operatingHours.map((h) => `${h.days} ${h.hours}`).join(" · ")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <a href={telHref} className={link}>
            <Phone className="h-3.5 w-3.5 text-logo-light" aria-hidden="true" />
            Phone: {site.phone.display}
          </a>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={link}>
            <WhatsAppIcon className="h-3.5 w-3.5 text-logo-light" />
            WhatsApp
          </a>
          <a href={mailtoHref()} className={`${link} hidden lg:inline-flex`}>
            <Mail className="h-3.5 w-3.5 text-logo-light" aria-hidden="true" />
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
