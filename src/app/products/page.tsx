import Image from "next/image";
import { products } from "@/content/products";
import { pageMetadata } from "@/lib/seo";
import { whatsappHref } from "@/lib/links";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/sections/ProductCard";
import { DeliveryInfo } from "@/components/sections/DeliveryInfo";
import { CtaBand } from "@/components/sections/CtaBand";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export const metadata = pageMetadata({
  title: "Bottled Water & Water Refill Services",
  description:
    "Order bottled drinking water or water refill services from Crystal Fresh Hydrolife in Nairobi, Kenya. Individual orders, bulk quotations and delivery.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Bottled water & refills"
        description="Ready-to-drink bottles, or refills for your own containers."
        image={{ src: "/images/bottle-light.jpg", alt: "" }}
      >
        <ButtonLink href="/order" variant="light" size="lg">
          Order Water
        </ButtonLink>
        <ButtonLink href="/quote" size="lg" className="bg-white/10 shadow-none ring-1 ring-white/25 hover:bg-white/20">
          Request a Quote
        </ButtonLink>
      </PageHero>

      <Section labelledBy="product-list-title">
        <h2 id="product-list-title" className="sr-only">
          Our products
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 120}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="mist" labelledBy="delivery-title">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="delivery-title" eyebrow="Delivery" title="Delivery details" />
          <ButtonLink href={whatsappHref("Hello Crystal Fresh Hydrolife, do you deliver to my area? My location is: ")} variant="secondary">
            <WhatsAppIcon className="h-4 w-4 text-[#157a42]" />
            Check my area
          </ButtonLink>
        </div>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_9rem]">
          <DeliveryInfo className="rounded-4xl bg-white p-8 ring-1 ring-line md:grid-cols-3" />
          <Image
            src="/images/delivery-shoulder.jpg"
            alt="A delivery figure carrying a 20 litre water bottle on the shoulder"
            width={417}
            height={626}
            sizes="9rem"
            className="mx-auto hidden h-auto w-full brightness-[1.04] mix-blend-multiply lg:block"
          />
        </div>
      </Section>

      <CtaBand title="Buying in bulk?" description="Get a quotation for your organisation." primary={{ href: "/quote", label: "Request a Quote" }} />
    </>
  );
}
