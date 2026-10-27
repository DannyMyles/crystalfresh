"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

export type Slide = { src: string; label: string };

const INTERVAL_MS = 6000;

/**
 * Crossfading background photos with a caption, slide dots and a pause button.
 * Stays on the first slide for visitors who prefer reduced motion.
 * The parent must be `relative isolate overflow-hidden`.
 */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only the first photo loads with the page; the rest follow once it has settled.
  const [loadRest, setLoadRest] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadRest(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setPaused(true);
  }, []);

  // Restarts whenever the slide changes, so a manually chosen slide gets the full interval.
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [paused, slides.length, index]);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 -z-30">
        {slides.map((slide, i) =>
          i !== 0 && i !== index && !loadRest ? null : (
            <Image
              key={slide.src}
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              quality={60}
              sizes="100vw"
              className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ),
        )}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-4 px-4">
        <p
          className="hidden min-w-40 text-right text-sm font-medium text-brand-100 sm:block"
          aria-live="polite"
        >
          {slides[index].label}
        </p>
        <div
          className="flex items-center"
          role="group"
          aria-label="Background slides"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${slide.label}`}
              aria-current={i === index ? "true" : undefined}
              className="group inline-flex h-6 min-w-6 items-center justify-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/50 group-hover:bg-white/80"}`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused ? "Play background slideshow" : "Pause background slideshow"
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition hover:bg-white/20"
        >
          {paused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
        <span className="hidden min-w-40 sm:block" aria-hidden="true" />
      </div>
    </>
  );
}
