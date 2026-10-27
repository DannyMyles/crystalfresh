import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Section";
import { FloatingDecor } from "@/components/sections/FloatingDecor";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  image?: { src: string; alt: string };
  children?: ReactNode;
  /** Extra space at the bottom for content that overlaps the hero. */
  overlap?: boolean;
};

export function PageHero({ eyebrow, title, description, image = { src: "/images/water-ripple.jpg", alt: "" }, children, overlap = false }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950 via-brand-950/85 to-brand-900/40" />
      <FloatingDecor layout="right" />
      <Container className={overlap ? "pt-14 pb-24 sm:pt-20 sm:pb-28" : "py-20 sm:py-24 lg:py-28"}>
        <p className="eyebrow text-aqua-300">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-brand-100">{description}</p>
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}
