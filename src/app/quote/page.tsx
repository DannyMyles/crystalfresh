import Link from "next/link";
import { getProduct } from "@/content/products";
import { formDefinitions } from "@/lib/forms/definitions";
import { pageMetadata } from "@/lib/seo";
import { mailtoHref } from "@/lib/links";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { FormCard } from "@/components/sections/FormCard";
import { SmartForm } from "@/components/forms/SmartForm";

export const metadata = pageMetadata({
  title: "Request a Quotation",
  description:
    "Request a quotation for bulk or recurring bottled water and water refill supply from Crystal Fresh Hydrolife for offices, schools, hospitals, hotels, events and institutions.",
  path: "/quote",
});

type Props = { searchParams: Promise<{ product?: string | string[] }> };

export default async function QuotePage({ searchParams }: Props) {
  const { product: slug } = await searchParams;
  const product = getProduct(Array.isArray(slug) ? slug[0] : slug);
  const definition = formDefinitions.quote;

  return (
    <>
      <PageHero
        eyebrow="Bulk & corporate"
        title="Request a quotation"
        description="Share your needs and we'll send a quote."
      />

      <section className="bg-mist py-16 sm:py-20" aria-label="Quotation request form">
        <Container className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <FormCard title="Quotation request">
            <SmartForm
              formId="quote"
              title={definition.title}
              fields={definition.fields}
              submitLabel="Request quotation"
              defaults={product ? { products: product.name } : undefined}
            />
          </FormCard>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-4xl bg-brand-900 p-8 text-white">
              <h2 className="font-semibold">Responding to a tender?</h2>
              <Link href="/business#tender-form" className="mt-3 inline-block text-sm font-semibold text-aqua-300 hover:text-white">
                Tender inquiry →
              </Link>
              <p className="mt-6 border-t border-white/10 pt-6 text-sm text-brand-100">
                Prefer email?{" "}
                <a href={mailtoHref("Quotation request")} className="font-semibold break-words text-white underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
