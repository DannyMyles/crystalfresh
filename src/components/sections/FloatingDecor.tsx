import { Droplet, IceCube } from "@/components/brand/Decor";

type Layout = "sides" | "right" | "corners";

/**
 * Ice cubes and drops drifting in a section. Purely decorative: hidden from
 * screen readers, ignores clicks, hidden on small screens, and still when the
 * visitor prefers reduced motion. Use `right` where text sits on the left.
 * The parent must be `relative isolate` (and usually `overflow-hidden`).
 */
export function FloatingDecor({ layout = "sides" }: { layout?: Layout }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
      {layout === "sides" && (
        <>
          <IceCube className="animate-drift absolute top-[14%] left-[4%] w-20 rotate-[-8deg] opacity-90 lg:left-[8%] lg:w-24" />
          <IceCube className="animate-drift-slow absolute bottom-[12%] left-[2%] w-14 rotate-[14deg] opacity-80 [animation-delay:-4s] lg:left-[5%] lg:w-16" />
          <Droplet className="animate-drift-slow absolute top-[52%] left-[14%] w-7 opacity-90 [animation-delay:-7s]" />
          <IceCube className="animate-drift absolute top-[14%] right-[5%] w-16 rotate-[10deg] opacity-85 [animation-delay:-3s] lg:right-[9%] lg:w-20" />
          <IceCube className="animate-drift-slow absolute right-[3%] bottom-[12%] w-12 rotate-[-16deg] opacity-75 [animation-delay:-9s] lg:right-[6%] lg:w-14" />
          <Droplet className="animate-drift absolute top-[46%] right-[16%] w-6 opacity-85 [animation-delay:-5s]" />
        </>
      )}
      {layout === "right" && (
        <>
          <IceCube className="animate-drift absolute top-[16%] right-[6%] w-20 rotate-[12deg] opacity-90 lg:right-[10%] lg:w-24" />
          <IceCube className="animate-drift-slow absolute right-[22%] bottom-[14%] w-12 rotate-[-10deg] opacity-80 [animation-delay:-5s] lg:w-14" />
          <Droplet className="animate-drift-slow absolute top-[22%] right-[26%] w-6 opacity-90 [animation-delay:-2s]" />
          <Droplet className="animate-drift absolute right-[4%] bottom-[18%] w-8 opacity-90 [animation-delay:-8s]" />
        </>
      )}
      {layout === "corners" && (
        <>
          <IceCube className="animate-drift absolute top-[6%] left-[3%] w-16 rotate-[-12deg] opacity-80 lg:w-20" />
          <Droplet className="animate-drift-slow absolute top-[10%] right-[4%] w-7 opacity-85 [animation-delay:-4s]" />
          <IceCube className="animate-drift-slow absolute right-[3%] bottom-[6%] w-14 rotate-[16deg] opacity-75 [animation-delay:-7s] lg:w-16" />
          <Droplet className="animate-drift absolute bottom-[10%] left-[5%] w-6 opacity-85 [animation-delay:-2s]" />
        </>
      )}
    </div>
  );
}
