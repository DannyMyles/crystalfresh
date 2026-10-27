import { CalendarClock, ClipboardList, Download, FileCheck2, FileLock2, FileText, Mail, PartyPopper, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { products } from "@/content/products";
import { complianceDocuments } from "@/content/documents";
import { formDefinitions } from "@/lib/forms/definitions";
import { pageMetadata } from "@/lib/seo";
import { mailtoHref, telHref } from "@/lib/links";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SegmentGrid } from "@/components/sections/SegmentGrid";
import { FormCard } from "@/components/sections/FormCard";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Clients } from "@/components/sections/Clients";
import { SmartForm } from "@/components/forms/SmartForm";

export const metadata = pageMetadata({
  title: "Business Water Supply & Tenders",
  description:
    "Bulk and recurring drinking water supply for offices, schools, hospitals, hotels, churches, events and NGOs near Ndwaru Road, Kenya. Company information, compliance documents and tender inquiries for procurement teams.",
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
    answer: "By product, quantity, location and frequency. Request a quote for exact pricing.",
  },
  {
    question: "Where do you deliver?",
    answer: "Ndwaru Road and nearby areas. Further away? Include your location and we'll confirm.",
  },
  {
    question: "Can you provide permits and compliance documents?",
    answer: "Yes. Copies are available on request.",
  },
];

const documentRequestHref = mailtoHref(
  "Request for compliance documents",
  "Hello Crystal Fresh Hydrolife,\n\nPlease share copies of your permits and compliance documents.\n\nOrganisation:\nTender reference (if any):\nDocuments required:\n",
);

export default function BusinessPage() {
  const tender = formDefinitions.tender;

  const companyInfo: { label: string; value: React.ReactNode }[] = [
    { label: "Business name", value: site.name },
    { label: "Location", value: `${site.address.street}, ${site.address.country}` },
    { label: "Products & services", value: products.map((p) => p.name).join("; ") },
    { label: "Delivery coverage", value: site.deliveryArea },
    {
      label: "Telephone / WhatsApp",
      value: (
        <a href={telHref} className="font-semibold text-brand-700 hover:underline">
          {site.phone.display}
        </a>
      ),
    },
    {
      label: "Email",
      value: (
        <a href={mailtoHref("Tender / procurement inquiry")} className="font-semibold break-words text-brand-700 hover:underline">
          {site.email}
        </a>
      ),
    },
    { label: "Permits", value: "Held. Copies on request." },
  ];

  return (
    <>
      <PageHero eyebrow="Business" title="Water supply for organisations" description="Bulk orders, recurring supply and tenders.">
        <ButtonLink href="/quote" variant="light" size="lg">
          Request a Quote
        </ButtonLink>
        <ButtonLink href="#tenders" size="lg" className="bg-white/10 shadow-none ring-1 ring-white/25 hover:bg-white/20">
          Tenders & procurement
        </ButtonLink>
      </PageHero>

      <Clients tone="mist" />

      <Section labelledBy="who-title">
        <SectionHeading id="who-title" eyebrow="Who we supply" title="Organisations of every size" />
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

      <Section id="tenders" labelledBy="tenders-title">
        <SectionHeading
          id="tenders-title"
          eyebrow="Tenders & procurement"
          title="For procurement teams"
          description="Company details and compliance documents for supplier evaluation."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <dl className="divide-y divide-line overflow-hidden rounded-3xl bg-white ring-1 ring-line">
            {companyInfo.map((row) => (
              <div key={row.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6 sm:px-8">
                <dt className="text-sm font-medium text-muted">{row.label}</dt>
                <dd className="text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div id="documents" className="flex flex-col gap-4">
            {complianceDocuments.length > 0 ? (
              <ul className="grid gap-3">
                {complianceDocuments.map((doc) => (
                  <li key={doc.title} className="flex items-center justify-between gap-4 rounded-2xl bg-mist p-4">
                    <div className="flex min-w-0 gap-3">
                      <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-aqua-600" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink">{doc.title}</h3>
                        <p className="text-sm text-muted">
                          {[doc.issuer, doc.reference && `Ref. ${doc.reference}`, doc.validUntil && `Valid until ${doc.validUntil}`]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </div>
                    {doc.file ? (
                      <ButtonLink href={doc.file} variant="secondary" target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" aria-hidden="true" />
                        View
                      </ButtonLink>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted">
                        <FileLock2 className="h-4 w-4" aria-hidden="true" />
                        On request
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-200 bg-white px-6 py-10 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-xl font-medium text-ink">Permits & documents</h3>
                <p className="mt-1 text-sm text-muted">Copies available on request.</p>
              </div>
            )}
            <ButtonLink href={documentRequestHref} variant="secondary">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Request documents
            </ButtonLink>
          </div>
        </div>
      </Section>

      <section id="tender-form" className="bg-mist py-20 sm:py-24" aria-labelledby="tender-form-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="tender-form-title"
              eyebrow="Tender inquiry"
              title="Send your tender details"
              description="We'll respond with the information or quotation you need."
            />
            <p className="mt-6 text-sm text-muted">
              Attachments: email{" "}
              <a href={mailtoHref("Tender documents")} className="font-semibold break-words text-brand-700 hover:underline">
                {site.email}
              </a>{" "}
              with your tender reference.
            </p>
          </div>
          <FormCard title="Tender inquiry">
            <SmartForm formId="tender" title={tender.title} fields={tender.fields} submitLabel="Submit tender inquiry" />
          </FormCard>
        </Container>
      </section>

      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Common questions" />
          <Faq items={faqs} />
        </div>
      </Section>

      <CtaBand title="Get a quotation" description="Share your quantities and schedule." primary={{ href: "/quote", label: "Request a Quote" }} />
    </>
  );
}
