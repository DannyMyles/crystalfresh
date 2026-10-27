import { tips } from "@/content/tips";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function HydrationTips() {
  if (tips.length === 0) return null;
  return (
    <Section labelledBy="tips-title">
      <SectionHeading id="tips-title" eyebrow="Hydration tips" title="Stay well hydrated" />
      <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {tips.map(({ icon: Icon, title, text }, i) => (
          <Reveal as="li" key={title} delay={i * 80}>
            <div className="flex h-full gap-4 rounded-3xl bg-linear-to-b from-brand-50 to-white p-5 ring-1 ring-line sm:block sm:p-6">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-line">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-ink sm:mt-5">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
