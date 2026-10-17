# BAVEXA production security review

Reviewed: October 18, 2026. No deployment, Git commit/push, agent setting change, real booking, contact submission, or customer workflow execution was performed.

## Decision: production approval pending

The production dependency tree is free of currently reported npm advisories after patching. Account-level demo isolation and hosted abuse/privacy controls still need owner verification. Passing a build or rendering fictional sample cards does not establish that the remote voice agent cannot write customer data.

## Changes applied

- Updated Next.js and its ESLint plugin from 16.3.1 to 16.3.8; stayed on the existing patch line. Compatible transitive updates include sharp 0.35.5, baseline-browser-mapping 2.11.29, source-map-js 1.2.2, js-yaml 4.3.2, browserslist 4.29.3, and patched brace-expansion releases.
- Hardened `/api/audit`: JSON-only requests; cross-origin browser requests rejected; streamed 16 KiB limit; explicit field allowlist and lengths; website protocol checks; server-owned source/timestamp; HTTPS-only webhook; no redirects; eight-second timeout; no-store responses; generic errors. Added an optional server-only shared webhook header secret and regression tests with mocked outbound requests only.
- Added nosniff, same-origin framing, referrer, camera/geolocation/microphone permissions, and limited CSP protections. Microphone access from the site itself remains allowed. This is not a comprehensive nonce-based script CSP; that would require separate integration compatibility work.
- Added `npm run security:scan`, which checks non-ignored text files and reachable local Git history for common secret patterns and prints locations, never credential values.

## Dependency audit

- Initial full audit: 11 affected packages (1 critical, 9 high, 1 moderate).
- Production-only audit after patching: **0 vulnerabilities**.
- Full audit after patching: **4 high findings**, all from one development-only chain: `@next/eslint-plugin-next → fast-glob → micromatch → braces@3.0.3`.
- No patched braces release was available at review time. npm proposes downgrading the Next lint plugin to 14.2.35 with `--force`, which would be an incompatible major downgrade. Not applied; rules were not disabled and advisories were not hidden. Review upstream regularly and lint only trusted repository content. Production installs should exclude dev dependencies where the deployment workflow supports that; the build step still uses them.
- Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm ; upstream tracking: https://github.com/micromatch/braces/issues/84 .

## Secrets and API boundaries

- No private credential patterns detected in scanned working files or reachable local history. `.env*` files are ignored except the empty `.env.example` template. No private ElevenLabs API key or lead webhook was available in this local environment. Vercel secrets/settings and remote GitHub alerts were not accessible, so those are not certified by this review.
- The ElevenLabs agent ID is public, not an API secret. Conversation tokens are temporary client session credentials managed by the SDK, not hardcoded keys. No application transcript/token logging or browser storage was found.
- `LEAD_WEBHOOK_URL` and optional `LEAD_WEBHOOK_SECRET` are read only by the server API route, never passed to a Client Component or public runtime configuration. Do not use a `NEXT_PUBLIC_` prefix for either.
- The contact form's existing Web3Forms access key is intentionally public according to its vendor; it is not an administrative API key. Its owner must verify allowed-domain/spam controls and recipient settings. Moving that public key into a public environment variable would not make it secret. Existing form behavior was preserved.
- The unused `app/chatgpt-auth.ts` helper trusts identity headers supplied by a proxy. No current page/API imports it. Do not use it to authorize requests on ordinary Vercel hosting without an authenticated proxy that strips and verifies those headers.
- The audit API has no durable, distributed rate limiter or CAPTCHA. Configure an appropriate Vercel Firewall/rate limit and receiver authentication before exposing a configured webhook. Browser-origin checks do not stop arbitrary HTTP clients.

## Demo and account verification required

1. **Sample cards:** Lead Spreadsheet, Inspection Calendar, and CRM previews are static fictional data. Their page and popup render only; they perform no synchronization, API requests, or booking writes. The popup is gated by a verified connected call ending normally.
2. **ElevenLabs live agent:** the browser uses the supplied real agent, not a locally guaranteed sandbox. No API credential or connected account inspector was available to read its tools, procedures, post-call webhooks, guardrails, retention, allowed hosts, usage limits, or credential bindings. Do not claim remote tool isolation until these are checked.
3. **n8n / Google Calendar / CRM:** no workflow exports, OAuth bindings, service-account configuration, or sandbox credentials exist in this checkout. Verify dedicated demo credentials, test calendars, sandbox CRM and non-production workflow endpoints in the agent/n8n dashboards. Confirm no production tools are reachable; use mocked tools when testing remote agent flows. Do not test this by creating a real customer record.
4. **Cal.com CTA:** intentionally opens the founder's existing `basitaminbhatti/roofing-growth-call` booking flow. It is a real consultation booking path, not a sample integration. Confirm that this is intended; do not label it as a sandbox. No booking was submitted during review.
5. **Privacy / consent:** the existing privacy policy is generic and does not specify live microphone, transcript/audio processing or the agent's retention. Verify actual provider settings and approve accurate recording/transcription/retention disclosures before public live-voice use. This requires owner/legal input, not invented retention promises.
6. **Hosting:** configure secrets separately for Preview and Production, prevent preview/test submissions from reaching production workflows, verify HTTPS/HSTS, set narrow agent domain allowlists and abuse/cost limits, and exercise a real voice call in a microphone-capable browser. The embedded preview previously lacked microphone support; token issuance alone is not a successful audio test.

## Verification

- Production build (Next.js 16.3.8), standalone TypeScript, and ESLint: passed.
- Tests: 16 passed, including bounded-body/origin checks, field filtering, failure confidentiality, call lifecycle guards and ROI logic. All outbound audit forwarding tests use a mocked fetch; no test lead was submitted externally.
- Secret scan: passed across working-tree text, 87 historical text blobs, and 15 built client assets at the final build. This is pattern-based and does not certify hosted secrets or inaccessible account settings.
- Production-only dependency audit: passed (0 findings). Full audit: exits nonzero for the 4 development-only findings described above; no false clean-audit claim is made.
- Local production smoke tests: `/`, `/demo`, `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt` and optimized roofing image returned 200. Five security headers and removal of X-Powered-By were asserted. Invalid API requests returned 400/403/415 as expected.
- An attempted fresh browser check was unavailable because the embedded preview tab was on an unsupported error-page URL. No browser security policy was bypassed. Cal.com UI/audio end-to-end verification was therefore not newly certified after the patch. Outgoing embeds remain permitted by the limited CSP, and no call/booking/provider configuration was changed.
- Pending site/voice work was preserved. No Git commit, push, deployment, real form submission, real booking, or remote account change was performed.
