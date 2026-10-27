import { Quote } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { Section, SectionHeading } from "@/components/ui/Section";

/** Renders nothing until genuine testimonials are added to content/testimonials.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Section tone="mist" labelledBy="testimonials-title">
      <SectionHeading id="testimonials-title" eyebrow="Customer voices" title="What our customers say" align="center" />
      <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <li key={t.name} className="rounded-3xl bg-white p-8 ring-1 ring-line">
            <Quote className="h-7 w-7 text-aqua-400" aria-hidden="true" />
            <blockquote className="mt-4 leading-relaxed text-ink">{t.quote}</blockquote>
            <p className="mt-6 text-sm font-semibold text-ink">{t.name}</p>
            {t.role && <p className="text-sm text-muted">{t.role}</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
