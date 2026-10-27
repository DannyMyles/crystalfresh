"use client";

import { useEffect } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { site } from "@/config/site";
import { telHref, whatsappHref } from "@/lib/links";
import { Container } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-4xl font-medium text-ink">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        This page could not load properly. Please try again. You can still reach us directly on {site.phone.display}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        <ButtonLink href={telHref} variant="secondary">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call us
        </ButtonLink>
        <ButtonLink href={whatsappHref()} variant="whatsapp">
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </ButtonLink>
      </div>
    </Container>
  );
}
