import Image from "next/image";

/** Decorative photo cut-outs. Always paired with aria-hidden containers or empty alt text. */
export function IceCube({ className }: { className?: string }) {
  return <Image src="/images/decor/ice-cube.png" alt="" width={317} height={320} sizes="96px" className={`h-auto ${className ?? ""}`} />;
}

export function Droplet({ className }: { className?: string }) {
  return <Image src="/images/decor/droplet.png" alt="" width={115} height={200} sizes="40px" className={`h-auto ${className ?? ""}`} />;
}
