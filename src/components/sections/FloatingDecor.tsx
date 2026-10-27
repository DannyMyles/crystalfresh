import { Bottle } from "@/components/brand/Bottles";
import { Droplet, IceCube } from "@/components/brand/Decor";

/**
 * Ice cubes, drops and bottles drifting at the sides of a section. Purely
 * decorative: hidden from screen readers, ignores clicks, hidden on small
 * screens, and still when the visitor prefers reduced motion.
 * The parent must be `relative isolate` (and usually `overflow-hidden`).
 */
export function FloatingDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
      <IceCube className="animate-drift absolute top-[14%] left-[4%] w-20 opacity-90 lg:left-[8%] lg:w-24" />
      <IceCube className="animate-drift-slow absolute bottom-[12%] left-[2%] w-14 opacity-80 [animation-delay:-4s] lg:left-[5%] lg:w-16" />
      <Droplet className="animate-drift-slow absolute top-[52%] left-[14%] w-6 opacity-80 [animation-delay:-7s] lg:w-7" />

      <div className="animate-drift absolute top-[12%] right-[4%] w-14 rotate-[18deg] [animation-delay:-3s] lg:right-[8%] lg:w-16">
        <Bottle size="1l" className="h-auto w-full drop-shadow-lg" />
      </div>
      <div className="animate-drift-slow absolute right-[2%] bottom-[10%] w-16 -rotate-[14deg] [animation-delay:-9s] lg:right-[5%] lg:w-20">
        <Bottle size="10l" className="h-auto w-full drop-shadow-lg" />
      </div>
      <Droplet className="animate-drift absolute top-[46%] right-[16%] w-5 opacity-70 [animation-delay:-5s] lg:w-6" />
    </div>
  );
}
