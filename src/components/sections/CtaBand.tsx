import Image from "next/image";
import { Phone } from "lucide-react";
import { site } from "@/config/site";
import { telHref, whatsappHref } from "@/lib/links";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

type CtaBandProps = {
  title?: string;
  description?: string;
  primary?: { href: string; label: string };
};

export function CtaBand({
  title = "Ready to order?",
  description = "Order online, call or WhatsApp us.",
  primary = { href: "/order", label: "Order Water" },
}: CtaBandProps) {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="cta-title">
      <Container>
        <div className="relative isolate overflow-hidden rounded-4xl bg-brand-900 px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-16">
          <Image src="/images/water-ripple.jpg" alt="" fill sizes="(min-width: 1280px) 1200px, 100vw" className="-z-20 object-cover opacity-40" />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-900 via-brand-900/80 to-aqua-700/50" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 id="cta-title" className="font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 text-lg text-brand-100">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col lg:items-stretch">
              <ButtonLink href={primary.href} variant="light" size="lg">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={whatsappHref()} variant="whatsapp" size="lg">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp us
              </ButtonLink>
              <ButtonLink href={telHref} size="lg" className="bg-white/10 shadow-none ring-1 ring-white/25 hover:bg-white/20">
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {site.phone.display}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
