import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { mailtoHref } from "@/lib/links";
import { Container } from "@/components/ui/Section";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description: `How ${site.name} handles the personal information you share through this website.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-20 sm:py-24">
      <p className="eyebrow">Privacy</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">Privacy notice</h1>
      <div className="mt-10 space-y-8 leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-ink">What we collect</h2>
          <p className="mt-2">
            When you use a form on this website, we collect the details you enter, such as your name, phone number, email
            address, organisation, delivery location and the information about your order, quotation or message.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">How we use it</h2>
          <p className="mt-2">
            We use your details only to respond to your request, arrange orders and deliveries, prepare quotations and
            communicate with you about them. We do not sell your information.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">How it is handled</h2>
          <p className="mt-2">
            Form submissions are sent securely to {site.name} by email or to our business systems. We keep them only as
            long as needed for the purposes above and our legal and accounting obligations, in line with the Kenya Data
            Protection Act, 2019.
          </p>
        </section>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <section>
            <h2 className="text-lg font-semibold text-ink">Website analytics</h2>
            <p className="mt-2">
              We use Google Analytics to understand how visitors use this website, such as which pages are viewed and
              whether visitors use the call, WhatsApp or email buttons. Google Analytics uses cookies and does not
              receive the details you type into our forms. You can block analytics cookies in your browser settings.
            </p>
          </section>
        )}
        <section>
          <h2 className="text-lg font-semibold text-ink">Your choices</h2>
          <p className="mt-2">
            You can ask us to access, correct or delete the information you have shared by emailing{" "}
            <a href={mailtoHref("Privacy request")} className="font-semibold text-brand-700 hover:underline">
              {site.email}
            </a>{" "}
            or calling {site.phone.display}.
          </p>
        </section>
      </div>
    </Container>
  );
}
