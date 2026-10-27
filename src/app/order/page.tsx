import { Phone } from "lucide-react";
import { site } from "@/config/site";
import { getProduct } from "@/content/products";
import { formDefinitions } from "@/lib/forms/definitions";
import { pageMetadata } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/links";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { FormCard } from "@/components/sections/FormCard";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { SmartForm } from "@/components/forms/SmartForm";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export const metadata = pageMetadata({
  title: "Order Water",
  description:
    "Order bottled drinking water or water refills from Crystal Fresh Hydrolife for delivery along Ndwaru Road and nearby areas. Order online, by phone or on WhatsApp.",
  path: "/order",
});

type Props = { searchParams: Promise<{ product?: string | string[] }> };

export default async function OrderPage({ searchParams }: Props) {
  const { product: slug } = await searchParams;
  const product = getProduct(Array.isArray(slug) ? slug[0] : slug);
  const definition = formDefinitions.order;

  return (
    <>
      <PageHero
        eyebrow="Order water"
        title="Order water"
        description="We'll call or WhatsApp you to confirm price and delivery."
        image={{ src: "/images/bottled-water.jpg", alt: "" }}
      />

      <section className="bg-mist py-16 sm:py-20" aria-label="Order form">
        <Container className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <FormCard title="Your order" description="No online payment.">
            <SmartForm
              formId="order"
              title={definition.title}
              fields={definition.fields}
              submitLabel="Send order"
              defaults={product ? { product: product.name } : undefined}
            />
          </FormCard>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-4xl bg-brand-900 p-8 text-white">
              <h2 className="font-display text-2xl font-medium">Prefer to talk?</h2>
              <div className="mt-6 grid gap-3">
                <ButtonLink href={telHref} variant="light">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {site.phone.display}
                </ButtonLink>
                <ButtonLink
                  href={whatsappHref(
                    `Hello Crystal Fresh Hydrolife, I would like to order${product ? ` ${product.name.toLowerCase()}` : " water"}.\nQuantity: \nDelivery location: `,
                  )}
                  variant="whatsapp"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Order on WhatsApp
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-4xl bg-white p-8 ring-1 ring-line">
              <h2 className="font-semibold text-ink">Delivery</h2>
              <DeliveryInfo className="mt-6" />
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
