# BAVEXA.tech

Production website for **BAVEXA — AI Lead Conversion System for Roofing Companies**.

The site is built with Next.js-compatible App Router conventions through Vinext, React, TypeScript, Tailwind CSS, Motion, and Lucide icons. It includes a long-form conversion homepage, six primary marketing routes, an interactive ROI calculator, product workflow animation, demo modal, audit form endpoint, SEO files, and structured data.

## Local setup

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run lint
npm run test
npm run build
```

## Where to edit the site

### Site copy and brand settings

Edit `content/site.ts`. It contains the main brand positioning, navigation, calls to action, founder record, capability copy, audiences, integration categories, and feature flags.

Section-specific homepage copy is in `components/sections/HomeSections.tsx`. Route-level introductions and metadata are in each folder under `app/`.

### Founder photo

Add the real approved portrait at:

```text
public/images/founder.jpg
```

The site currently uses a neutral monogram placeholder. After adding the approved portrait, set `founder.imageEnabled` to `true` in `content/site.ts`. Do not use a generated or unapproved founder photo. The founder path and all founder details are centrally configured in the same file.

### Roofing photography

Replace these files while keeping the filenames:

```text
public/images/roofing-hero.jpg
public/images/roofing-inspection.jpg
public/images/roofing-commercial.jpg
```

Use optimized landscape JPEG or WebP files with descriptive, roofing-specific imagery. Current photos are free-to-use Unsplash images.

### Demo video

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
- `/how-it-works`
- `/solutions`
- `/demo`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

SEO support includes page metadata, canonical paths, Open Graph/Twitter metadata, `sitemap.xml`, `robots.txt`, and Organization/Person structured data in `app/layout.tsx`.

## Launch checklist

- Add the approved founder photo.
- Add the final 60-second demo video and switch the modal to the video element.
- Configure `LEAD_WEBHOOK_URL` and submit a real test lead.
- Have qualified counsel review Privacy and Terms for the operating jurisdiction.
- Confirm each named integration before publishing vendor-specific claims.
- Add only approved customer proof.
