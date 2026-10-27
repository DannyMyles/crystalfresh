import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light" | "whatsapp";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition duration-200 ease-out focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgb(15_105_168/0.7)] hover:bg-brand-700 hover:-translate-y-0.5",
  secondary:
    "bg-white text-brand-700 ring-1 ring-brand-200 hover:ring-brand-400 hover:bg-brand-50 hover:-translate-y-0.5",
  ghost: "text-brand-700 hover:bg-brand-50",
  light: "bg-white text-brand-800 hover:bg-aqua-50 hover:-translate-y-0.5",
  whatsapp: "bg-[#157a42] text-white hover:bg-[#106636] hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** Internal routes use next/link; tel:, mailto: and external URLs use a plain anchor. */
export function ButtonLink({ href, variant, size, className = "", children, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
