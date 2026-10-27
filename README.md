# Crystal Fresh Hydrolife — Website

Marketing and ordering website for **Crystal Fresh Hydrolife**, a supplier of bottled drinking water and water refill services in Nairobi, Kenya.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, products, who we serve, ordering steps, clients, contact |
| `/products` | Product cards (bottled water, refills) and delivery information |
| `/order` | Order form. `?product=<slug>` preselects a product |
| `/quote` | Bulk and corporate quotation request form |
| `/business` | Organisations we supply, clients, supply options and FAQ. `/corporate-supply` and `/tenders` redirect here |
| `/contact` | Contact methods, contact form, map and hours |
| `/privacy` | Privacy notice |

The site also generates `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, an Open Graph image, and LocalBusiness structured data.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in at least one delivery channel
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest): validation, delivery, rate limiting, spam checks, links |
| `npm run test:e2e` | Browser tests (Playwright): every page, navigation, all forms, failure cases, analytics |
| `npm run test:all` | Lint, unit tests and browser tests |
| `npm run check:delivery` | Sends one real test submission through your configured email / webhook |

Don't run `npm run build` while `npm run dev` is running. Both write to `.next`, and the dev server will start returning errors. Stop the dev server first, or restart it afterwards.

## Environment variables

See [`.env.example`](.env.example) for the full list with comments.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | When the domain is known | Canonical URLs, sitemap, Open Graph, structured data |
| `SMTP_USER`, `SMTP_PASSWORD` | One of email or webhook | Sends email through Gmail (or another SMTP server) using an app password. **Currently in use** |
| `SMTP_HOST`, `SMTP_PORT` | No | Defaults to Gmail: `smtp.gmail.com`, port 465 |
| `RESEND_API_KEY` | Alternative to SMTP | Sends email via Resend. Ignored when `SMTP_USER` is set |
| `INQUIRY_TO_EMAIL` | No | Recipient(s). Defaults to `muhadiwawire@gmail.com` |
| `INQUIRY_FROM_EMAIL` | With Resend | Sender address on a Resend-verified domain |
| `FORM_WEBHOOK_URL` | One of email or webhook | Receives each submission as JSON |
| `FORM_WEBHOOK_SECRET` | No | Sent as the `X-Webhook-Secret` header |
| `SEND_CUSTOMER_CONFIRMATION` | No | Set to `false` to stop receipt emails to customers |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | No (recommended) | Cloudflare Turnstile spam protection |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | No (recommended on Vercel) | Shared rate limit across server instances |
| `FORM_RATE_LIMIT_MAX` | No | Submissions per visitor per 10 minutes (default 5) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 |

### How form submissions work

All three forms (order, quote, contact) post to one Server Action (`src/app/actions.ts`). It:

1. Rejects bots: a hidden honeypot field, a minimum fill time, and Turnstile when configured.
2. Validates every field on the server, using the same rules the browser uses (`src/lib/forms/validate.ts`). Dates cannot be in the past, using Kenya time.
3. Rate-limits valid submissions per visitor (`src/lib/forms/rate-limit.ts`). With Upstash Redis configured, the count is shared by every server instance and IP addresses are stored only as hashes. Without it, or if Redis is unreachable, each instance counts in memory.
4. Delivers to every configured channel (`src/lib/forms/deliver.ts`) and reports success **only if at least one channel confirms delivery**.
5. After success, emails the customer a short receipt with their reference number, if they gave an email address and a verified sender is set. The receipt never repeats their message, so the form can't be used to send spam.

If no channel is configured, delivery fails, the visitor's connection drops, or the site was redeployed while their page was open, the form shows an error. It never shows a false success. The error offers a one-tap button that sends the details they entered by WhatsApp, and a call button. The form also works with JavaScript turned off.

Every successful submission gets a reference number such as `CFH-261026-ABC12`. That number appears in the email subject, the webhook payload and the sheet.

**Recommended setup:** use both email (to be notified) and the Google Sheets log (a permanent record that doesn't depend on email). Then run `npm run check:delivery` to send a test through both.

**Email setup (Gmail, currently used):**

1. On the Google account, turn on 2-Step Verification, then create an app password under **Security → App passwords**.
2. Set `SMTP_USER` to the Gmail address and `SMTP_PASSWORD` to the app password (spaces are fine) in `.env.local` and in Vercel.
3. Run `npm run check:delivery`.

Notifications are sent from and to that Gmail address, and customers who give an email get a receipt from it. Gmail allows about 500 emails a day, which is plenty for a contact form. If the app password is ever revoked or Google changes the account password, sending stops and the form shows its error with the WhatsApp fallback. Create a new app password to fix it.

**Email setup (Resend, alternative):**

1. Create an account at resend.com and create an API key.
2. Verify a sending domain once the business domain exists, and set `INQUIRY_FROM_EMAIL` (for example `Crystal Fresh Hydrolife <orders@yourdomain>`). Until then, leave it empty. The test sender `onboarding@resend.dev` works only if the Resend account uses `muhadiwawire@gmail.com`, and customer receipts stay off.

Replies to the notification email go straight to the customer when they gave an email address.

**Webhook payload:**

```json
{
  "reference": "CFH-261026-ABC12",
  "formId": "order",
  "formTitle": "Water order",
  "subject": "New water order request: Jane",
  "submittedAt": "2026-10-26T10:00:00.000Z",
  "replyTo": "jane@example.com",
  "fields": [{ "name": "name", "label": "Your name", "value": "Jane" }],
  "data": { "name": "Jane", "phone": "0712345678" }
}
```

**Google Sheets log:** a ready-made Apps Script and a 10-minute setup guide are in [`integrations/google-sheets/`](integrations/google-sheets/README.md). Each form gets its own tab. Values are stored as plain text, so nothing a visitor types can run as a spreadsheet formula.

### Analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to turn on Google Analytics 4. Without it, no analytics code loads. Besides page views, the site sends these events, which you can mark as **key events** (conversions) in GA4:

| Event | When |
| --- | --- |
| `click_call` | A phone link is tapped (includes `page_path`) |
| `click_whatsapp` | A WhatsApp link is tapped |
| `click_email` | An email link is tapped |
| `form_submit_success` / `form_submit_error` | A form is submitted (includes `form_id`: order, quote or contact) |

Form contents are never sent to analytics. The privacy notice gains an analytics section automatically when the ID is set.

### Security

- Strict security headers, including a Content-Security-Policy, are set in `next.config.ts`. Scripts may only come from this site, Cloudflare Turnstile and Google Analytics. If you add another third-party script or embed, add its domain to the policy.
- Pages place their metadata in `<head>` for every visitor (`htmlLimitedBots`), so WhatsApp, Facebook and LinkedIn link previews always work.

## Editing business information

Everything that is not yet confirmed is kept out of the UI until you fill it in. Nothing has been invented.

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, address, delivery area | `src/config/site.ts` |
| Operating hours, delivery charges, logo, social links, map embed, coordinates | `src/config/site.ts` (currently `null` or empty) |
| Products: names, descriptions, images, **sizes and prices** | `src/content/products.ts` (sizes are empty, so cards say prices are confirmed on contact) |
| Organisations you have worked with ("Trusted by" logos) | `src/content/clients.ts`, with logos in `public/images/clients/` |
| Testimonials (section hidden while empty) | `src/content/testimonials.ts` |
| Hydration tips on the home page (hidden while empty) | `src/content/tips.ts` |
| Photo gallery on the home page (hidden while empty) | `src/content/gallery.ts`, with photos in `public/images/gallery/` |
| Organisation types on the corporate page | `src/content/segments.ts` |
| Form fields and dropdown options | `src/lib/forms/definitions.ts` |

**Documents:** anything in `public/` can be downloaded by anyone. Only upload documents the business is happy to publish, and redact ID numbers and other personal details first. Set `file: null` to show "Available on request" instead.

**Images:** the photos in `public/images/` come from Unsplash (free licence). Replace them with real photos of the business and its products when available, keeping the same file names or updating the paths in the content files.

**Logo:** add the file to `public/images/` and set `logo: "/images/logo.svg"` in `src/config/site.ts`.

**Map:** in Google Maps, choose *Share → Embed a map* for the verified location. Copy the iframe `src` into `site.map.embedUrl`.

## Testing

```bash
npm test             # unit tests, about 1 second
npm run test:e2e     # builds into .next-e2e and runs the browser tests
```

The browser tests start their own servers: one with a mock webhook backend and one with no backend configured. They cover every page on desktop and mobile, navigation, contact links, every form (validation, delivery, past dates), a failing backend, a missing backend, a dropped connection, a stale page after a redeploy, submitting without JavaScript, and analytics events. They build into `.next-e2e`, so they never touch your production build.

The first time, install the browser with `npx playwright install chromium`, or use an installed Google Chrome with `PW_CHANNEL=chrome npm run test:e2e`.

## Deploying to Vercel

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository. The defaults (Framework: Next.js, `npm run build`) work as they are.
3. Add the environment variables from `.env.example` under **Settings → Environment Variables**. At minimum, set up one delivery channel. Email plus the Google Sheets log is recommended. Also recommended:
   - Turnstile keys for spam protection.
   - Upstash Redis from **Storage / Marketplace**, which sets the `KV_REST_API_*` variables for you, for a shared rate limit.
   - A GA4 measurement ID.
4. Deploy. Until a custom domain is added, the site uses the Vercel production URL automatically.
5. When the domain is ready, add it under **Settings → Domains**, set `NEXT_PUBLIC_SITE_URL=https://yourdomain`, and redeploy.
6. Submit `https://yourdomain/sitemap.xml` in Google Search Console, and set up a Google Business Profile for local search.

Other Node.js hosts work too: run `npm run build && npm start` on Node 18.18 or newer and set the same environment variables.

## Project structure

```
src/
  app/                 routes, Server Action, metadata routes (sitemap, robots, OG image)
  components/
    brand/             logo, WhatsApp icon
    forms/             SmartForm (client), Turnstile
    layout/            header, footer, floating WhatsApp button
    sections/          page sections (hero, product card, CTA band, map, FAQ…)
    ui/                buttons, containers, headings, scroll reveal
  config/site.ts       business details
  components/analytics GA4 loader and call/WhatsApp/email click tracking
  content/             products, segments, documents, testimonials
  lib/                 links (tel/mailto/WhatsApp), SEO helpers, analytics, form logic
integrations/
  google-sheets/       Apps Script that logs submissions to a Google Sheet
scripts/
  check-delivery.ts    sends a real test submission through configured channels
tests/
  unit/                Vitest
  e2e/                 Playwright, with a mock webhook server
```
