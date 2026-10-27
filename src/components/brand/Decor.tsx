import { useId } from "react";

export function IceCube({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`top-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cdeaf9" />
        </linearGradient>
        <linearGradient id={`left-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9e1f6" />
          <stop offset="1" stopColor="#7dc0ec" />
        </linearGradient>
        <linearGradient id={`right-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d7ecfa" />
          <stop offset="1" stopColor="#9ed2f2" />
        </linearGradient>
      </defs>
      <path d="M50 8 L88 26 L50 44 L12 26 Z" fill={`url(#top-${id})`} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 26 L50 44 L50 92 L12 72 Z" fill={`url(#left-${id})`} stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M88 26 L50 44 L50 92 L88 72 Z" fill={`url(#right-${id})`} stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M22 34 L22 60" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 52 L76 44" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="44" cy="22" rx="9" ry="3.5" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

export function Droplet({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`drop-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#62dbe8" />
          <stop offset="1" stopColor="#1b84c9" />
        </linearGradient>
      </defs>
      <path d="M20 2 C20 2 4 22 4 34 a16 16 0 0 0 32 0 C36 22 20 2 20 2 Z" fill={`url(#drop-${id})`} />
      <path d="M12 34 a8 8 0 0 0 7 8" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
