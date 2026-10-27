import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
      {items.map((item) => (
        <details key={item.question} className="group px-6 py-5 sm:px-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus className="h-5 w-5 shrink-0 text-brand-500 transition group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="mt-3 leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
