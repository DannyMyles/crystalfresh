import Image from "next/image";
import { Check, ShoppingBag, FileText } from "lucide-react";
import { formatPrice, type Product } from "@/content/products";
import { whatsappHref } from "@/lib/links";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";
import { BottleLineup } from "@/components/brand/Bottles";

export function ProductCard({ product, headingLevel = "h3" }: { product: Product; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-4/3 overflow-hidden bg-brand-50">
        {"illustration" in product.image ? (
          <div role="img" aria-label={product.image.alt} className="h-full">
            <BottleLineup className="transition duration-700 ease-out group-hover:scale-[1.03]" />
          </div>
        ) : (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <Heading className="font-display text-2xl font-medium text-ink">{product.name}</Heading>
        <p className="mt-2 text-muted">{product.summary}</p>

        <ul className="mt-5 space-y-2">
          {product.highlights.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-500" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl bg-mist p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Sizes &amp; prices</p>
          {product.sizes.length > 0 && product.sizes.every((size) => size.price === null) ? (
            <p className="mt-1 text-sm text-ink">
              <span className="font-semibold">{product.sizes.map((size) => size.label).join(" · ")}</span>
              <span className="text-muted"> · Prices on request</span>
            </p>
          ) : product.sizes.length > 0 ? (
            <dl className="mt-3 divide-y divide-line">
              {product.sizes.map((size) => (
                <div key={size.label} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                  <dt className="text-ink">{size.label}</dt>
                  <dd className="text-right font-semibold text-brand-700">
                    {formatPrice(size.price)}
                    {size.note && <span className="ml-1 font-normal text-muted">{size.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-1 text-sm text-ink">On request</p>
          )}
        </div>

        <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
          <ButtonLink href={`/order?product=${product.slug}`}>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Order now
          </ButtonLink>
          <ButtonLink href={`/quote?product=${product.slug}`} variant="secondary">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Bulk quote
          </ButtonLink>
          <ButtonLink
            href={whatsappHref(`Hello Crystal Fresh Hydrolife, I would like to inquire about your ${product.name.toLowerCase()}.`)}
            variant="ghost"
            className="sm:col-span-2"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#157a42]" />
            Ask on WhatsApp
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
