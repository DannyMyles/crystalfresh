import { Droplets } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
        <Droplets className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-medium text-ink">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">The page you are looking for has moved or does not exist.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/order" variant="secondary">
          Order water
        </ButtonLink>
      </div>
    </Container>
  );
}
