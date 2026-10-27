import { CalendarClock, ClipboardList, FileText, PartyPopper } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SegmentGrid } from "@/components/sections/SegmentGrid";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Clients } from "@/components/sections/Clients";

export const metadata = pageMetadata({
  title: "Business & Bulk Water Supply",
  description:
    "Bulk and recurring drinking water supply for offices, schools, hospitals, hotels, churches, events and NGOs in Kenya.",
  path: "/business",
});

const requestTypes = [
  { icon: ClipboardList, title: "Bulk orders", description: "One-off large orders." },
  { icon: CalendarClock, title: "Recurring supply", description: "Weekly, monthly or as needed." },
  { icon: FileText, title: "Formal quotations", description: "For approvals and budgeting." },
  { icon: PartyPopper, title: "Events", description: "Weddings, conferences and functions." },
];

const faqs = [
  {
    question: "How is pricing set?",
    answer: "A case of 24 × 500 ml or 12 × 1 L bottles is KES 600. For bulk or recurring orders, request a quote for exact pricing.",
  },
  {
    question: "Where do you deliver?",
    answer: "Across Nairobi and beyond. Tell us your location and we'll confirm delivery.",
  },
  {
    question: "Can you provide permits and compliance documents?",
    answer: "Yes. Copies are available on request.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageHero eyebrow="Business" title="Water supply for organisations" description="Bulk orders and recurring supply.">
        <ButtonLink href="/quote" variant="light" size="lg">
          Request a Quote
        </ButtonLink>
        <ButtonLink href="/contact" size="lg" className="bg-white/10 shadow-none ring-1 ring-white/25 hover:bg-white/20">
          Talk to us
        </ButtonLink>
      </PageHero>

      <Section labelledBy="who-title">
        <SectionHeading id="who-title" eyebrow="Who we supply" title="From offices to events" />
        <div className="mt-12">
          <SegmentGrid />
        </div>
      </Section>

      <Section tone="mist" labelledBy="request-title">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="request-title" eyebrow="What you can request" title="Flexible supply options" />
          <ButtonLink href="/quote">Request a Quote</ButtonLink>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {requestTypes.map(({ icon: Icon, title, description }, i) => (
            <Reveal as="li" key={title} delay={i * 80}>
              <div className="h-full rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Clients />

      <Section tone="mist" labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Common questions" />
          <Faq items={faqs} />
        </div>
      </Section>

      <CtaBand title="Get a quotation" description="Share your quantities and schedule." primary={{ href: "/quote", label: "Request a Quote" }} />
    </>
  );
}
