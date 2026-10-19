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

`/demo` connects to Mike through the official `@elevenlabs/react` SDK in `components/demo/MikeVoiceAgent.tsx`. The supplied public agent ID is configured there. `MIKE_CONNECTION_TYPE` in `voiceConnection.ts` explicitly selects `"websocket"` for voice, bypassing the failing LiveKit/WebRTC path without enabling text-only mode. The SDK streams microphone audio to the public conversation endpoint and plays incoming agent audio through its own input/output controllers. No API key is sent to the browser, and no floating widget is loaded. The SDK requests microphone access only after the visitor clicks **Talk to Mike** and owns capture/track cleanup; the application does not run a separate capture/stop preflight. The existing interface includes End Call, Mute/Unmute, speaking/listening states, connection cancellation, a connection timeout, and friendly permission/device/network errors. The SDK releases the conversation and microphone when the component unmounts.

The interactive boundary is `components/demo/LiveAiDemo.tsx`. The three static automation cards in `app/demo/page.tsx` are always visible and the same card component is reused inside `PostCallPreviewModal`. Both locations clearly label their records as fictional sample integration previews. Styles are isolated in `components/demo/LiveDemo.module.css`.

`createMikeCallSession` in `components/demo/callLifecycle.ts` forwards verified SDK connection/disconnect callbacks using the actual conversation ID. The sample-results modal requires a connected call with both a user transcript and an agent response, then an explicit visitor hang-up or the agent's `end_call` event. Only boolean activity flags are retained, not transcript text. Generic LiveKit `close` events are not success, even if the SDK labels them `agent`; abnormal closure, errors, connection cancellation, and navigation never open the popup. These guards and public error messages are covered by tests. The cards remain fictional samples, not data from the call; this frontend does not write to a spreadsheet, calendar, or CRM.

The agent must allow public conversations from the deployed site’s origin. Check its authentication and domain allowlist in the agent dashboard if connections are rejected. An authenticated agent would require a server-issued conversation token; never add a private API key to client code. Production microphone access requires HTTPS (localhost is permitted for development). Test in a browser with an actual microphone before launch. Existing remote agent tools, prompts, and webhook integrations are not changed by this integration.

The installed React SDK's `startSession` returns `void`, not a connection promise. `voiceConnection.ts` adapts its actual `onConnect` / `onError` callbacks into the promise awaited by the start handler; cancellation, timeout, and a disconnect before connection reject that attempt. Connection errors log an allowlisted `[BAVEXA voice]` diagnostic (stage, selected transport, category, and HTTP/close code when available), never raw provider payloads, tokens or transcripts. WebSocket startup `SessionConnectionError` close codes are retained as well as later disconnect codes. Diagnose production failures in a microphone-capable browser using Console and Network; a successful page load is not proof of two-way audio. The public agent's existing authentication, domain allowlist, tools and webhook bindings are unchanged.

The provider identity stays stable on errors and retries: an `onError` callback reports the problem but does not remount/end the provider during negotiation. Only visitor End/Cancel, the explicit connection timeout, actual SDK disconnect, or page unmount ends the session. UI connection status follows SDK transport status events rather than treating every SDK error notification as a disconnected transport. Safe lifecycle Console events include elapsed time so a local teardown request can be distinguished from a remote disconnect. See `VOICE_DEMO_INVESTIGATION.md` for the investigation evidence and remaining production verification.

For local testing, retain `bavexa.vercel.app` and add `localhost:3000` as a separate hostname in the agent’s **Security → Allowlist**. Enter the hostname with port, not `http://` or `/demo`. Do not disable the allowlist. A successful token request alone does not prove that the browser origin is allowed or that a voice call connected.

Some embedded preview browsers do not expose microphone APIs. If the demo reports an unsupported browser, open `http://localhost:3000/demo` in Chrome or Edge for the real audio test. Never bypass browser permissions or claim a call succeeded based only on sample cards or a token response.

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

The audit endpoint accepts same-origin JSON, caps request bodies at 16 KiB, validates field lengths and website protocols, and forwards only documented fields. The destination must be HTTPS; redirects are rejected and requests time out after eight seconds. Optionally set `LEAD_WEBHOOK_SECRET` (at least 32 random characters) and configure the receiver to verify its `X-Bavexa-Webhook-Secret` header. Provider details and secret values are never returned to visitors. Configure distributed rate limiting at the hosting/WAF layer before public use; origin checks and a honeypot are not bot authentication.

### Integrations

Integration capability categories are in `content/site.ts` under `integrations`. They intentionally use no vendor logos and imply no official partnerships. Confirm actual support before naming any platform publicly.

### Pricing

The single BAVEXA Starter card and all hero/demo/popup pricing reminders share `content/site.ts`:

```ts
pricing: {
  enabled: true,
  planName: "BAVEXA Starter",
  currency: "USD",
  startingMonthly: 399,
  setupFee: 299,
  launchOffer: {
    enabled: true,
    badge: "Launch Offer",
    setupLabel: "Setup Fee Waived — FREE",
  },
  implementationDays: { minimum: 3, maximum: 7 },
  includedCallMinutes: null,
  overagePerMinute: null,
}
```

The card sits after Integrations and before Speak With the Founder. Edit `features`, `customPricing`, and `cta` in the same object. Setting `enabled: false` hides the pricing section and all three reminders. There is no advertised free trial, unlimited-usage promise, or purchase/checkout flow; the CTA uses the existing Cal.com strategy-call modal.

The $399 starting price is the monthly subscription, not a separate activation or starting fee. The original $299 one-time setup fee is preserved, struck through, and waived for Starter launch customers while `launchOffer.enabled` is true. The shared `SetupOffer` component presents “Setup Fee Waived — FREE” consistently wherever setup pricing appears. Set `launchOffer.enabled` to false to restore the setup charge. No countdown, deadline, or limited-time claim is invented.

Call-minute allowances and overage rates are **not confirmed**. Leave both fields `null` until approved; the card states: “Monthly call allowance and any additional usage charges are confirmed in your proposal before you commit.” Once confirmed, set the included monthly minutes and the USD rate per extra minute; `lib/pricing.ts` generates the disclosure without guessing missing values. The 3–7-business-day implementation window is a target, not a guarantee.

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

- Verify a live Mike call on the production HTTPS domain with microphone permissions, mute, hang-up, and the sample-results popup.
- Add the final 60-second demo video and switch the modal to the video element.
- Configure `LEAD_WEBHOOK_URL` and submit a real test lead.
- Have qualified counsel review Privacy and Terms for the operating jurisdiction.
- Confirm each named integration before publishing vendor-specific claims.
- Add only approved customer proof.

## Security review

See `SECURITY_REVIEW.md` for the latest findings, residual development-only advisory, and account-level checks still required before production. Run `npm run security:scan` to scan working-tree text and local Git history for common private credential patterns without printing values. This heuristic check cannot inspect Vercel secrets, hosted account settings, or guarantee that a secret has never appeared in GitHub.
