# BAVEXA.tech

Production website for **BAVEXA — AI Lead Conversion System for Roofing Companies**.

The site is built with Next.js App Router, React, TypeScript, Tailwind CSS, Motion, and Lucide icons. It includes a long-form conversion homepage, five public routes, an interactive ROI calculator, product workflow animation, demo modal, audit form endpoint, SEO files, and structured data.

## Local setup

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Where to edit the site

### Official BAVEXA branding

The approved logo and icon sources are preserved in `public/assets/` as `bavexa-logo-source.png` and `bavexa-icon-source.png`.

- `bavexa-logo.png` is the tightly cropped official wordmark used in the header and footer.
- `bavexa-icon.png` is the tightly framed 512×512 brand icon.
- `bavexa-icon-192.png`, `apple-touch-icon.png`, and `favicon-32.png` are framework-ready favicon sizes generated from the approved icon.

Keep the same filenames when replacing these assets so the navigation, footer, and metadata continue to work without code changes.

### Site copy and brand settings

Edit `content/site.ts`. It contains the main brand positioning, navigation, calls to action, founder record, capability copy, audiences, integration categories, and feature flags.

Section-specific homepage copy is in `components/sections/HomeSections.tsx`. Route-level introductions and metadata are in each folder under `app/`.

### Founder photo

The approved portrait is stored at:

```text
public/images/founder.png
```

The portrait is enabled through `founder.imageEnabled` in `content/site.ts`. Replace it with an approved portrait using the same filename, or update the centrally configured founder image path. A neutral monogram is shown if the image is disabled or fails to load. Do not use a generated or unapproved founder photo.

### Roofing photography

Replace these files while keeping the filenames:

```text
public/images/roofing-hero.jpg
public/images/roofing-inspection.jpg
```

Use optimized landscape JPEG or WebP files with descriptive, roofing-specific imagery. Current photos are free-to-use Unsplash images.

### Live AI Demo page

`/demo` introduces Mike and includes a voice interface placeholder. It does not load a voice SDK, access the microphone, or simulate calls. The start button remains a placeholder until the approved agent is connected.

The interactive boundary is `components/demo/LiveAiDemo.tsx`. The three static automation cards in `app/demo/page.tsx` are always visible and the same card component is reused inside `PostCallPreviewModal`. Both locations clearly label their records as fictional sample integration previews. Styles are isolated in `components/demo/LiveDemo.module.css`.

The voice panel is still a placeholder; there are no active agent callbacks in this checkout. When connecting the approved agent, call `reportMikeCallLifecycle` from `components/demo/callLifecycle.ts` exclusively from verified SDK lifecycle callbacks: `{ type: "connected", callId }` once the call connects, then `{ type: "disconnected", callId, outcome: "completed" }` after a clean hang-up. Use `"cancelled"` or `"error"` for other disconnects. Keep the same actual session identifier across both events. Never emit connection events from the Start button or on page load. The modal opens only for a connected, completed session, and ignores duplicate disconnects, errors, and pre-connection cancellation. These guards are tested in `tests/call-lifecycle.test.ts`.

The final consultation button reuses `CalBookingButton` and its existing Cal.com modal.

### Homepage demo video

Add the final video at:

```text
public/demo/bavexa-demo.mp4
```

The current demo modal intentionally shows an animated product walkthrough instead of pretending placeholder footage is real. When a final MP4 is available, replace the modal placeholder in `components/DemoExperience.tsx` with a `<video controls preload="metadata">` element that uses the path above. Do not autoplay audio.

### Audit form webhook

Copy `.env.example` to `.env.local` and set:

```text
LEAD_WEBHOOK_URL=https://your-secure-webhook.example
```

Submissions are posted as JSON through `app/api/audit/route.ts`. The endpoint validates required fields, validates email format, includes a honeypot, and forwards the request to the configured webhook. If no webhook is configured, the UI shows an honest configuration error and does not fake success.

Hosted deployments should configure `LEAD_WEBHOOK_URL` as a runtime secret rather than committing it.

### Integrations

Integration capability categories are in `content/site.ts` under `integrations`. They intentionally use no vendor logos and imply no official partnerships. Confirm actual support before naming any platform publicly.

### Pricing

Pricing is configured—but disabled—in `content/site.ts`:

```ts
pricing: {
  enabled: false,
  trialDays: 14,
  minimumMonthly: 297,
  maximumMonthly: 497,
}
```

Keep `enabled: false` until the commercial offer is approved and a pricing section has been reviewed.

### Testimonials and social proof

Social proof is configured—but disabled—in `content/site.ts`:

```ts
socialProof: {
  enabled: false,
  testimonials: [],
  logos: [],
  caseStudies: [],
}
```

Only add approved, verifiable proof. Do not add placeholders that could look like real customers, results, ratings, partnerships, or case studies.

## ROI calculator

The shared calculation is in `lib/roi.ts`, the UI is in `components/RoiCalculator.tsx`, and the logic tests are in `tests/roi.test.ts`.

The calculator is an illustrative opportunity estimate. Its disclaimer must remain visible near the result, and outputs must never be presented as guaranteed savings, guaranteed ROI, or forecast revenue.

## Routes

- `/` — long-form homepage
- `/demo` — Mike voice interface preview and sample automation results
- `/contact`
- `/privacy`
- `/terms`

SEO support includes page metadata, canonical paths, Open Graph/Twitter metadata, `sitemap.xml`, `robots.txt`, and Organization/Person structured data in `app/layout.tsx`.

## Launch checklist

- Connect the approved Mike voice agent and verified lifecycle callbacks before enabling live calls.
- Add the final 60-second demo video and switch the modal to the video element.
- Configure `LEAD_WEBHOOK_URL` and submit a real test lead.
- Have qualified counsel review Privacy and Terms for the operating jurisdiction.
- Confirm each named integration before publishing vendor-specific claims.
- Add only approved customer proof.
