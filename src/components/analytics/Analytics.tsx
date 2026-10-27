import { GoogleAnalytics } from "@next/third-parties/google";
import { ContactClickTracker } from "./ContactClickTracker";

/** Loads Google Analytics 4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set. */
export function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;
  return (
    <>
      <GoogleAnalytics gaId={measurementId} />
      <ContactClickTracker />
    </>
  );
}
