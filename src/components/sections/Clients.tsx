import Image from "next/image";
import { clients } from "@/content/clients";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FloatingDecor } from "@/components/sections/FloatingDecor";

/** Renders nothing until clients are listed in content/clients.ts. */
export function Clients({ tone = "white" }: { tone?: "white" | "mist" }) {
  if (clients.length === 0) return null;
  return (
    <Section tone={tone} labelledBy="clients-title" className="relative isolate overflow-hidden py-16! sm:py-20!">
      <FloatingDecor />
      <SectionHeading id="clients-title" eyebrow="Trusted by" title="Organisations we've worked with" align="center" />
      <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4 sm:gap-6">
        {clients.map((client) => (
          <li key={client.name} className="w-[calc(50%-0.5rem)] sm:w-56">
            <figure className="flex flex-col items-center gap-3">
              <div
                className={`relative flex h-32 w-full items-center justify-center rounded-3xl p-5 ring-1 sm:h-36 ${
                  client.tone === "dark" ? "bg-brand-700 ring-brand-800" : "bg-white ring-line"
                }`}
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  fill
                  sizes="(min-width: 640px) 14rem, 45vw"
                  className="object-contain p-5"
                />
              </div>
              <figcaption className="text-center text-sm font-medium text-muted">{client.name}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
