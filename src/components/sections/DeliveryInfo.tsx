import { Clock, MapPin, Wallet } from "lucide-react";
import { site } from "@/config/site";

export function DeliveryInfo({ className = "" }: { className?: string }) {
  const items = [
    { icon: MapPin, label: "Coverage", value: site.deliveryArea },
    {
      icon: Wallet,
      label: "Charges",
      value: site.deliveryCharges ?? "Confirmed when you order",
    },
    {
      icon: Clock,
      label: "Hours",
      value:
        site.operatingHours.length > 0
          ? site.operatingHours.map((h) => `${h.days}: ${h.hours}`).join(" · ")
          : "Call or WhatsApp to confirm",
    },
  ];

  return (
    <dl className={`grid gap-6 ${className}`}>
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="relative min-h-10 pl-14">
          <dt className="text-sm font-semibold text-ink">
            <span className="absolute top-0 left-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {label}
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
