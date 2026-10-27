import { Reveal } from "@/components/ui/Reveal";

export type Step = { title: string; description: string };

export function Steps({ steps, invert = false }: { steps: Step[]; invert?: boolean }) {
  return (
    <ol className={`grid gap-6 sm:grid-cols-2 ${steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 90} className="relative">
          <span
            className={`font-display text-5xl font-medium ${invert ? "text-aqua-300/80" : "text-brand-200"}`}
            aria-hidden="true"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={`mt-4 text-lg font-semibold ${invert ? "text-white" : "text-ink"}`}>{step.title}</h3>
          <p className={`mt-2 leading-relaxed ${invert ? "text-brand-200" : "text-muted"}`}>{step.description}</p>
        </Reveal>
      ))}
    </ol>
  );
}
