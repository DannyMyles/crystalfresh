import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Droplets, MapPin, Phone, Truck } from "lucide-react";
import { site } from "@/config/site";
import { products } from "@/content/products";
import { telHref } from "@/lib/links";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { AudienceCards } from "@/components/sections/AudienceCards";
import { InfoStrip } from "@/components/sections/InfoStrip";
import { Gallery } from "@/components/sections/Gallery";
import { Steps } from "@/components/sections/Steps";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { Clients } from "@/components/sections/Clients";

const trustPoints = [
  { icon: Droplets, label: "Bottled water & refills" },
  { icon: Truck, label: "Local delivery" },
  { icon: BadgeCheck, label: "Permitted business" },
];

const orderSteps = [
  { title: "Contact us", description: "Order online, call or WhatsApp." },
  { title: "We confirm", description: "Price, quantity and delivery time." },
  { title: "We deliver", description: "Along Ndwaru Road and nearby." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-linear-to-b from-brand-50/70 via-white to-white">
        <div
          className="absolute -top-40 -right-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-aqua-100/60 blur-3xl"
          aria-hidden="true"
        />
        <Container className="grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-20 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-soft ring-1 ring-brand-100">
              <MapPin className="h-4 w-4 text-aqua-500" aria-hidden="true" />
              Ndwaru Road, Kenya
            </p>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.04] font-medium tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.25rem]">
              Pure Water. <span className="text-brand-600">Reliable Supply.</span>{" "}
              <span className="text-aqua-600 italic">Trusted Partnerships.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-pretty text-muted">
              Bottled drinking water and refills for homes, businesses and institutions along Ndwaru Road.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/order" size="lg">
                Order Water
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/quote" variant="secondary" size="lg">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" size="lg">
                Contact Us
              </ButtonLink>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-ink">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-600 shadow-soft ring-1 ring-line">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="animate-blob relative aspect-4/5 overflow-hidden shadow-lift">
              <Image
                src="/images/hero-glass-pour.jpg"
                alt="Fresh water being poured into a clear glass"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 28rem, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-950/60 to-transparent" />
            </div>
            <div className="animate-float-slow absolute -bottom-6 left-4 rounded-2xl bg-white/95 p-4 pr-6 shadow-lift ring-1 ring-line backdrop-blur sm:-left-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Order by phone</p>
              <a href={telHref} className="mt-1 flex items-center gap-2 text-lg font-semibold text-brand-700">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {site.phone.display}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <InfoStrip />

      <Section id="products" labelledBy="products-title">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="products-title" eyebrow="Products" title="Our water" />
          <Link href="/products" className="inline-flex items-center gap-2 font-semibold text-brand-700 transition-all hover:gap-3">
            All products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 120}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="mist" labelledBy="audience-title">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="audience-title" eyebrow="Who we serve" title="Water for every need" />
          <Link href="/business" className="inline-flex items-center gap-2 font-semibold text-brand-700 transition-all hover:gap-3">
            Business supply <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12">
          <AudienceCards />
        </div>
      </Section>

      <Section labelledBy="how-title">
        <SectionHeading id="how-title" eyebrow="How it works" title="Order in three steps" />
        <div className="mt-12">
          <Steps steps={orderSteps} />
        </div>
      </Section>

      <Clients tone="mist" />

      <Gallery />

      <Testimonials />

      <CtaBand />
    </>
  );
}
