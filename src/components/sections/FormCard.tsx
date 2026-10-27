import type { ReactNode } from "react";

export function FormCard({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-4xl bg-white p-6 shadow-lift ring-1 ring-line sm:p-10">
      <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 leading-relaxed text-muted">{description}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}
