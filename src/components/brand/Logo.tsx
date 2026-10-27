import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

/** The Crystal Fresh horizontal lockup: mark, divider, wordmark and tagline. */
export function Logo({ invert = false, size = "md" }: { invert?: boolean; size?: "md" | "lg" }) {
  const large = size === "lg";
  return (
    <Link href="/" className="group inline-flex shrink-0 items-center gap-2.5 sm:gap-3">
      <Image
        src={site.logo}
        alt=""
        width={220}
        height={256}
        priority={!invert}
        className={`w-auto ${large ? "h-14" : "h-11"}`}
      />
      <span aria-hidden="true" className={`w-px self-stretch bg-logo/70 ${large ? "my-2" : "my-1.5"}`} />
      <span className="font-logo leading-none">
        <span className={`block font-extrabold tracking-wide text-logo ${large ? "text-[1.5rem]" : "text-[1.25rem]"}`}>
          CRYSTAL FRESH
        </span>
        <span
          className={`mt-1.5 block font-semibold tracking-[0.24em] uppercase ${large ? "text-[0.7rem]" : "text-[0.58rem]"} ${
            invert ? "text-brand-100" : "text-logo-black"
          }`}
        >
          {site.logoTagline}
        </span>
        <span className="sr-only"> – home</span>
      </span>
    </Link>
  );
}
