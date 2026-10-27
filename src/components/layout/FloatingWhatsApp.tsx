import { whatsappHref } from "@/lib/links";
import { WhatsAppIcon } from "@/components/brand/WhatsAppIcon";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed right-4 bottom-4 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[#157a42] px-4 text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-[#106636] sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-sm font-semibold sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
