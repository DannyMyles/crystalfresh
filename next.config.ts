import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Next.js inlines small bootstrap scripts, so script-src needs 'unsafe-inline'
 * unless every page is rendered per request with a nonce. The policy still
 * restricts where scripts, frames, connections and form posts may go.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""} https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`,
  "frame-src https://challenges.cloudflare.com https://www.google.com https://maps.google.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // The end-to-end tests build into a separate folder so they never replace the production build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  // Lets `npm run dev` be opened from other devices on the local network (e.g. a phone).
  // Update if this computer's network address changes. Has no effect in production.
  allowedDevOrigins: ["10.0.0.152"],
  // Put page metadata in <head> for every visitor, so link previews and all crawlers see it.
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100kb",
    },
  },
  async redirects() {
    return [
      { source: "/corporate-supply", destination: "/business", permanent: true },
      { source: "/tenders", destination: "/business", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
