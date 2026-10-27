import Link from "next/link";
import { ArrowRight, Building2, FileText, ShoppingBag } from "lucide-react";
import { formDefinitions } from "@/lib/forms/definitions";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { ContactOptions } from "@/components/sections/ContactOptions";
import { MapPanel } from "@/components/sections/MapPanel";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { FormCard } from "@/components/sections/FormCard";
import { SmartForm } from "@/components/forms/SmartForm";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact Crystal Fresh Hydrolife in Nairobi, Kenya. Call or WhatsApp (+254) 758 269 725, email muhadiwawire@gmail.com, or send us a message online.",
  path: "/contact",
});

const shortcuts = [
  { href: "/order", icon: ShoppingBag, label: "Order Water" },
  { href: "/quote", icon: FileText, label: "Request a Quote" },
  { href: "/business", icon: Building2, label: "Business supply" },
];

export default function ContactPage() {
  const definition = formDefinitions.contact;
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" description="We're on WhatsApp, phone and email." overlap />

      <section className="relative z-10 -mt-16 sm:-mt-20" aria-label="Ways to contact us">
        <Container>
          <ContactOptions />
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-12">
          <FormCard title="Send a message">
            <SmartForm formId="contact" title={definition.title} fields={definition.fields} submitLabel="Send message" />
          </FormCard>

          <div className="space-y-6 lg:sticky lg:top-28">
            <nav aria-label="Shortcuts" className="rounded-3xl bg-brand-900 p-6 text-white">
              <h2 className="font-semibold">Looking for something specific?</h2>
              <ul className="mt-4 divide-y divide-white/10">
                {shortcuts.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <Link href={href} className="group flex items-center gap-3 py-3 text-brand-100 transition hover:text-white">
                      <Icon className="h-4 w-4 text-aqua-300" aria-hidden="true" />
                      <span className="flex-1 text-sm font-medium">{label}</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="overflow-hidden rounded-3xl bg-mist">
              <MapPanel compact />
              <div className="p-6">
                <h2 className="font-semibold text-ink">Delivery & hours</h2>
                <DeliveryInfo className="mt-5" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
