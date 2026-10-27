import Image from "next/image";
import { gallery } from "@/content/gallery";
import { Section, SectionHeading } from "@/components/ui/Section";

/** Renders nothing until photos are listed in content/gallery.ts. */
export function Gallery() {
  if (gallery.length === 0) return null;
  return (
    <Section labelledBy="gallery-title">
      <SectionHeading id="gallery-title" eyebrow="Gallery" title="Inside Crystal Fresh" />
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {gallery.map((photo) => (
          <li key={photo.src} className="relative aspect-square overflow-hidden rounded-3xl bg-brand-50">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition duration-700 hover:scale-[1.03]"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
