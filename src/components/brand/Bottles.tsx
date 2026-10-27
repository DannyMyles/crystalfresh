import { useId } from "react";

export type BottleSize = "20l" | "10l" | "1l";

type BottleProps = { size: BottleSize; className?: string };

/** Clean illustrations of the hard (reusable) bottle sizes, drawn in brand colours. */
export function Bottle({ size, className }: BottleProps) {
  const id = useId().replace(/:/g, "");
  const body = `body-${id}`;
  const water = `water-${id}`;
  const shine = `shine-${id}`;

  const defs = (
    <defs>
      <linearGradient id={body} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#b2daf5" />
        <stop offset="0.35" stopColor="#eef7fd" />
        <stop offset="0.7" stopColor="#d7ecfa" />
        <stop offset="1" stopColor="#7dc0ec" />
      </linearGradient>
      <linearGradient id={water} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#42a0de" stopOpacity="0.28" />
        <stop offset="1" stopColor="#0f69a8" stopOpacity="0.42" />
      </linearGradient>
      <linearGradient id={shine} x1="0" x2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
  );

  if (size === "20l") {
    const outline =
      "M50 34 C50 48 14 50 14 70 L14 182 Q14 196 28 196 L92 196 Q106 196 106 182 L106 70 C106 50 70 48 70 34 Z";
    return (
      <svg viewBox="0 0 120 200" className={className} role="img" aria-label="20 litre hard bottle">
        {defs}
        <rect x="47" y="4" width="26" height="16" rx="4" fill="#0f69a8" />
        <rect x="47" y="15" width="26" height="4" fill="#0e5488" />
        <rect x="51" y="19" width="18" height="16" rx="2" fill={`url(#${body})`} stroke="#7dc0ec" strokeWidth="1.5" />
        <path d={outline} fill={`url(#${body})`} stroke="#7dc0ec" strokeWidth="1.5" />
        <path d="M14 84 L106 84 L106 182 Q106 196 92 196 L28 196 Q14 196 14 182 Z" fill={`url(#${water})`} />
        <path d="M14 108 Q60 117 106 108" fill="none" stroke="#7dc0ec" strokeWidth="2" />
        <path d="M14 114 Q60 123 106 114" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
        <path d="M14 150 Q60 159 106 150" fill="none" stroke="#7dc0ec" strokeWidth="2" />
        <path d="M14 156 Q60 165 106 156" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
        <rect x="22" y="74" width="9" height="104" rx="4.5" fill={`url(#${shine})`} />
      </svg>
    );
  }

  if (size === "10l") {
    const outline = "M22 74 Q22 58 38 56 L82 56 Q98 58 98 74 L98 182 Q98 196 84 196 L36 196 Q22 196 22 182 Z";
    return (
      <svg viewBox="0 0 120 200" className={className} role="img" aria-label="10 litre hard bottle">
        {defs}
        <path d="M70 56 L70 40 Q70 30 80 30 L88 30 Q98 30 98 40 L98 70" fill="none" stroke="#7dc0ec" strokeWidth="9" strokeLinejoin="round" />
        <path d="M70 56 L70 40 Q70 30 80 30 L88 30 Q98 30 98 40 L98 70" fill="none" stroke="#eef7fd" strokeWidth="5" strokeLinejoin="round" />
        <rect x="32" y="28" width="22" height="14" rx="3.5" fill="#0f69a8" />
        <rect x="32" y="38" width="22" height="3" fill="#0e5488" />
        <rect x="35" y="41" width="16" height="16" rx="2" fill={`url(#${body})`} stroke="#7dc0ec" strokeWidth="1.5" />
        <path d={outline} fill={`url(#${body})`} stroke="#7dc0ec" strokeWidth="1.5" />
        <path d="M22 96 L98 96 L98 182 Q98 196 84 196 L36 196 Q22 196 22 182 Z" fill={`url(#${water})`} />
        <path d="M22 140 L98 140" stroke="#7dc0ec" strokeWidth="2" />
        <path d="M22 145 L98 145" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
        <rect x="29" y="72" width="8" height="108" rx="4" fill={`url(#${shine})`} />
      </svg>
    );
  }

  const outline = "M52 44 L52 52 Q36 62 36 82 L36 186 Q36 196 46 196 L74 196 Q84 196 84 186 L84 82 Q84 62 68 52 L68 44 Z";
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label="1 litre bottle">
      {defs}
      <rect x="49" y="24" width="22" height="20" rx="4" fill="#0f69a8" />
      <path d="M49 30 H71 M49 35 H71 M49 40 H71" stroke="#0e5488" strokeWidth="1.2" />
      <path d={outline} fill={`url(#${body})`} stroke="#7dc0ec" strokeWidth="1.5" />
      <path d="M36 100 L84 100 L84 186 Q84 196 74 196 L46 196 Q36 196 36 186 Z" fill={`url(#${water})`} />
      <rect x="36" y="112" width="48" height="40" fill="#0f69a8" />
      <rect x="36" y="112" width="48" height="5" fill="#22c2d4" />
      <path d="M60 124 c-1 0 -1.6 .5 -2 1 -2 3 -6 8 -6 11.5 a8 8 0 0 0 16 0 c0 -3.5 -4 -8.5 -6 -11.5 -.4 -.5 -1 -1 -2 -1 z" fill="#ffffff" />
      <rect x="42" y="66" width="6" height="120" rx="3" fill={`url(#${shine})`} />
    </svg>
  );
}

const lineup: { size: BottleSize; label: string; height: string }[] = [
  { size: "20l", label: "20 L", height: "h-[78%]" },
  { size: "10l", label: "10 L", height: "h-[60%]" },
  { size: "1l", label: "1 L", height: "h-[46%]" },
];

/** The three bottle sizes side by side, bottom-aligned, for product imagery. */
export function BottleLineup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-full w-full items-end justify-center gap-[4%] bg-linear-to-br from-brand-50 via-white to-aqua-50 px-[8%] pb-[9%] ${className}`}
    >
      <div className="absolute inset-x-[10%] bottom-[8%] h-3 rounded-full bg-brand-900/10 blur-md" aria-hidden="true" />
      {lineup.map((b) => (
        <figure key={b.size} className={`relative flex ${b.height} flex-col items-center`}>
          <Bottle size={b.size} className="h-full w-auto drop-shadow-[0_10px_14px_rgb(11_37_64/0.12)]" />
          <figcaption className="absolute -bottom-7 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-700 shadow-soft ring-1 ring-brand-100">
            {b.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
