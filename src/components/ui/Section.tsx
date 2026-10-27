import type { ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type SectionProps = {
  id?: string;
  className?: string;
  tone?: "white" | "mist" | "deep";
  children: ReactNode;
  labelledBy?: string;
};

const tones = {
  white: "bg-white",
  mist: "bg-mist",
  deep: "bg-brand-950 text-white",
};

export function Section({ id, className = "", tone = "white", children, labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-20 sm:py-24 lg:py-28 ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

type HeadingProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  as?: "h1" | "h2";
};

export function SectionHeading({ id, eyebrow, title, description, align = "left", invert = false, as = "h2" }: HeadingProps) {
  const Heading = as;
  const centered = align === "center";
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${centered ? "justify-center" : ""} ${invert ? "text-aqua-300" : ""}`}>{eyebrow}</p>}
      <Heading
        id={id}
        className={`mt-4 font-display text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </Heading>
      {description && (
        <p className={`mt-5 text-base leading-relaxed text-pretty sm:text-lg ${invert ? "text-brand-100" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
