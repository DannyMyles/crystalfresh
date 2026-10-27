import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Droplets, MapPin, Truck } from "lucide-react";
import { site } from "@/config/site";
import { products } from "@/content/products";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { AudienceCards } from "@/components/sections/AudienceCards";
import { HeroSlideshow, type Slide } from "@/components/sections/HeroSlideshow";
import { Gallery } from "@/components/sections/Gallery";
import { Steps } from "@/components/sections/Steps";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { Clients } from "@/components/sections/Clients";
import { HydrationTips } from "@/components/sections/HydrationTips";
import { FloatingDecor } from "@/components/sections/FloatingDecor";

const heroSlides: Slide[] = [
  { src: "/images/hero/water.jpg", label: "Pure drinking water" },
  { src: "/images/hero/wedding-hall.jpg", label: "Weddings & events" },
  { src: "/images/hero/event-hall.jpg", label: "Conferences & functions" },
  { src: "/images/hero/office.jpg", label: "Offices" },
  { src: "/images/hero/gym.jpg", label: "Gyms & fitness" },
];

const trustPoints = [
  { icon: Droplets, label: "Bottled water & refills" },
  { icon: Truck, label: "Delivery available" },
  { icon: BadgeCheck, label: "Permitted business" },
];

const orderSteps = [
  { title: "Contact us", description: "Order online, call or WhatsApp." },
  { title: "We confirm", description: "Your order and delivery time." },
  { title: "We deliver", description: "To your home, office or event." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <HeroSlideshow slides={heroSlides} />
        <div className="absolute inset-0 -z-20 bg-brand-950/55 sm:bg-transparent sm:bg-linear-to-r sm:from-brand-950/80 sm:via-brand-950/40 sm:to-transparent" aria-hidden="true" />
        <FloatingDecor layout="right" />

        <Container className="pt-12 pb-24 sm:pt-20 lg:pt-28 lg:pb-36">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur md:hidden">
              <MapPin className="h-4 w-4 text-logo-light" aria-hidden="true" />
              {site.location}
            </p>
            <h1 className="mt-7 [text-shadow:0_2px_16px_rgb(11_37_64/0.5)] font-display text-[2.6rem] leading-[1.04] font-medium tracking-tight text-balance sm:text-6xl md:mt-0 lg:text-[4.25rem]">
              Pure Water. <span className="text-logo-light">Reliable Supply.</span>{" "}
              <span className="text-aqua-300 italic">Trusted Partnerships.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-pretty text-white [text-shadow:0_1px_10px_rgb(11_37_64/0.6)]">
              Bottled drinking water and refills, delivered to homes, businesses and institutions.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/order" variant="light" size="lg">
                Order Water
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/quote" size="lg" className="bg-white/10 shadow-none ring-1 ring-white/30 hover:bg-white/20">
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Contact Us
              </ButtonLink>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-brand-100">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-logo-light ring-1 ring-white/15">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

        </Container>
      </section>

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

      <Section tone="mist" labelledBy="how-title">
        <div className="grid items-center gap-12 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <SectionHeading id="how-title" eyebrow="How it works" title="Order in three steps" />
            <div className="mt-12">
              <Steps steps={orderSteps} />
            </div>
          </div>
          <div className="relative mx-auto w-52 sm:w-60 lg:w-full lg:max-w-[17rem]">
            <Image
              src="/images/delivery-carry.jpg"
              alt="A delivery figure carrying a 20 litre water bottle"
              width={626}
              height={751}
              sizes="(min-width: 1024px) 20rem, 16rem"
              className="h-auto w-full brightness-[1.04] mix-blend-multiply"
            />
          </div>
        </div>
      </Section>

      <Section labelledBy="audience-title" className="relative isolate overflow-hidden">
        <FloatingDecor layout="corners" />
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

      <Clients tone="mist" />

      <HydrationTips />

      <Gallery />

      <Testimonials />

      <CtaBand />
    </>
  );
}
