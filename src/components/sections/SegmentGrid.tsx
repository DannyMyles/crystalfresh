import { segments } from "@/content/segments";
import { Reveal } from "@/components/ui/Reveal";

export function SegmentGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {segments.map((segment, i) => {
        const Icon = segment.icon;
        return (
          <Reveal as="li" key={segment.name} delay={(i % 5) * 60}>
            <div className="flex h-full items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-line transition hover:ring-aqua-300">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-ink">{segment.name}</span>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
