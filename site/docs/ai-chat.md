# Ask Mecosin AI product chat

Owner authorized GitHub push/merge and automatic Vercel release. Provider live
verification is still pending; local acceptance uses explicit test fixtures.
Non-secret defaults: `https://api.linc.id/v1`, `cx/gpt-6.1-sol`, reasoning
`medium`, allowed origin `https://mecosin.vercel.app`. The only required secret is
`NINE_ROUTER_API_KEY`; the variables below can override non-secret defaults.

## Provider setup

Vercel project root must be `site`, output `dist`, build `npm run build`.
`api/chat.mjs` is a native Node Vercel Function alongside static Astro pages;
Astro preview alone does not serve it. Confirm actual project binding before
release; the existing checkout has no remote or Vercel project metadata.

Set server-only variables through the authorized secret store, never public
Astro variables, repository files, browser JS, or Discord:

- `NINE_ROUTER_BASE_URL`: authorized HTTPS OpenAI-compatible base URL including
  `/v1` if required by that router. Handler appends `/chat/completions`.
- `NINE_ROUTER_API_KEY`: project-scoped credential.
- `NINE_ROUTER_MODEL`: exact Owner-confirmed ID `cx/gpt-6.1-sol`.
  Request also includes `reasoning_effort: medium`. Do not substitute another model.
  Composer clears on submit and stays empty even on provider failure; failed
  message remains visible in conversation history rather than restoring input.
- `CHAT_ALLOWED_ORIGINS`: comma-separated exact HTTPS origins, e.g.
  `https://mecosin.vercel.app`. Do not add arbitrary preview wildcards.

Verify `/models`, structured JSON output, reasoning support and live adversarial
conversations before release. No silent fallback to another provider/model.
Request timeout 20s; widget timeout 25s. Secrets and chat text are not logged by
application code. Provider retention must be confirmed separately. Widget warns
that messages are processed through a service provider; history lives in tab memory, never storage.

## Claim boundaries

Owner authorized flexible conversational prose: model returns a short reply,
intent and allowlisted product IDs. Prompt separates conversation from claims;
server screens common medical/claim terms and markup. This heuristic is not a
proof that all unsupported prose is impossible. Product claims, images and URLs
are server-owned source data rendered as linked product cards, never model URLs.
Identity/greetings/thanks use context instead of category templates. Prompt asks
one relevant preference question at most, no repeated known questions, and one
product by default (up to three for requested comparison).
Medical/emergency requests use fixed refusals/escalation, without products.
Keyword checks are supplementary, not proof of perfect intent classification.
Matching source products is not a personal suitability assessment.

`src/data/chat-knowledge.json` includes 16 Owner-authorized secondary-source
description enrichments, retrieval times, supporting quotes and prior official
snapshot provenance. Four unresolved products retain the previous snapshot.
Descriptions and available composition enter model context; ingredient replies
render source-owned composition cards with field-specific URLs. Cards show the
actual source domain, not an official-brand attribution for third-party text.
D3 uses 1000 IU (25 mcg), never the source paragraph's conflicting 1000 mg.
No researched dosing was promoted: directions remain withheld pending exact
label verification. No prices, testimonials, regulatory promises, clinical-targeting
or disease-cure claims are imported. Raw research stays outside published source.
Warnings are retained as provenance data, not a verified clinical decision engine.
Check `node scripts/check-chat-knowledge.mjs` for coverage, exclusions and field
provenance. Self-review only; no independent reviewer. Snapshot is manual, not
continuously synced. Retrieval does not establish clinical truth or authorization.

Process-local limit: 20 requests/minute/client and 5000 active buckets. This is
not a distributed spending guard. Configure native Vercel firewall/rate limits
and 9router credential quota before exposing a public billable endpoint.
Origin validation is CSRF protection, not authentication or bot prevention.

## Verification

```sh
npm run build
node scripts/check-chat.mjs
# Separate shell: npx astro preview --host 127.0.0.1 --port 4357
PREVIEW_URL=http://127.0.0.1:4357 CHROME_PATH=/usr/bin/google-chrome node scripts/check-chat-browser.mjs
PREVIEW_URL=http://127.0.0.1:4357 CHROME_PATH=/usr/bin/google-chrome npm run check
```

Both chat scripts use explicit provider fixtures, not real AI. Browser test runs
actual HTTP handler and widget at 1440/390/360 widths. API tests cover invalid
roles, missing config, source fidelity, exact model/effort payload, unknown IDs,
extra output claims, medical/emergency/injection refusal, origin, timeout,
provider failure, body limits and throttling. Existing full regression also
passed. Model behavior, Vercel bundling, distributed limits and public live
acceptance remain unverified. Self-review only; no independent agent review.

`npm audit --omit=dev` reports four existing high-severity dependency groups:
http-cache-semantics, undici, vite, zod. No dependency upgrade performed in this
bounded feature. Review/update before public release.
