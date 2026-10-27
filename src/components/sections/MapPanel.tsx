import { MapPin, Navigation } from "lucide-react";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";

/** Shows a live map when `site.map.embedUrl` is set, otherwise a tasteful placeholder. */
export function MapPanel({ compact = false }: { compact?: boolean }) {
  if (site.map.embedUrl) {
    return (
      <div className="overflow-hidden rounded-3xl ring-1 ring-line">
        <iframe
          src={site.map.embedUrl}
          title={`Map showing ${site.name} on ${site.address.street}`}
          className={`${compact ? "h-[240px]" : "h-[380px]"} w-full border-0`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={`relative isolate flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-brand-50 text-center ring-1 ring-brand-100 ${compact ? "min-h-[220px] p-6" : "min-h-[340px] p-8"}`}>
      <svg className="absolute inset-0 -z-10 h-full w-full text-brand-200/70" aria-hidden="true">
        <defs>
          <pattern id="map-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0v44" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        <path d="M-20 220 C 120 160, 220 280, 380 200 S 640 120, 900 190" fill="none" stroke="#ffffff" strokeWidth="18" />
        <path d="M-20 220 C 120 160, 220 280, 380 200 S 640 120, 900 190" fill="none" stroke="#b2daf5" strokeWidth="2" strokeDasharray="10 10" />
      </svg>
      <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400 opacity-30" aria-hidden="true" />
        <MapPin className="relative h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-5 font-display text-2xl font-medium text-ink">{site.address.street}</p>
      <p className="mt-1 text-muted">{site.address.country}</p>
      <ButtonLink href={site.map.searchUrl} variant="secondary" className="mt-6">
        <Navigation className="h-4 w-4" aria-hidden="true" />
        Open in Google Maps
      </ButtonLink>
    </div>
  );
}
