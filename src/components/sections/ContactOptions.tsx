import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { site } from "@/config/site";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

const action =
  "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition sm:flex-none";

/** The three ways to reach the business, each with an explicit action. */
export function ContactOptions() {
  return (
    <ul className="grid gap-3 sm:gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
      <li className="rounded-3xl bg-white p-5 shadow-lift ring-1 ring-line sm:p-6">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#157a42]/10 text-[#157a42]">
            <WhatsAppIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted">Call or WhatsApp</p>
            <p className="text-lg font-semibold text-ink">{site.phone.display}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={`${action} bg-[#157a42] text-white hover:bg-[#106636]`}>
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <a href={telHref} className={`${action} bg-brand-50 text-brand-700 hover:bg-brand-100`}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call
          </a>
        </div>
      </li>

      <li className="rounded-3xl bg-white p-5 shadow-lift ring-1 ring-line sm:p-6">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted">Email</p>
            <p className="truncate font-semibold text-ink">{site.email}</p>
          </div>
        </div>
        <div className="mt-4 flex">
          <a href={mailtoHref("Inquiry from website")} className={`${action} bg-brand-50 text-brand-700 hover:bg-brand-100`}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            Send email
          </a>
        </div>
      </li>

      <li className="rounded-3xl bg-white p-5 shadow-lift ring-1 ring-line sm:p-6">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-muted">Location</p>
            <p className="font-semibold text-ink">
              {site.address.street}, {site.address.locality ?? site.address.country}
            </p>
          </div>
        </div>
        <div className="mt-4 flex">
          <a href={site.map.searchUrl} target="_blank" rel="noopener noreferrer" className={`${action} bg-brand-50 text-brand-700 hover:bg-brand-100`}>
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Directions
          </a>
        </div>
      </li>
    </ul>
  );
}
