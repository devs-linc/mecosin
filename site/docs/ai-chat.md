# Ask Mecosin AI product chat

Owner authorized GitHub push/merge and automatic Vercel release. Provider live
verification is still pending; local acceptance uses explicit test fixtures.
Non-secret defaults: `https://api.linc.id/v1`, `gemini-3.8-flash`, reasoning
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
- `NINE_ROUTER_MODEL`: exact discovered model ID. User supplied
  `gemini-3.8-flash med`; candidate mapping `gemini-3.8-flash` with
  `reasoning_effort: medium` is NOT verified. Do not substitute another model.
- `CHAT_ALLOWED_ORIGINS`: comma-separated exact HTTPS origins, e.g.
  `https://mecosin.vercel.app`. Do not add arbitrary preview wildcards.

Verify `/models`, structured JSON output, reasoning support and live adversarial
conversations before release. No silent fallback to another provider/model.
Request timeout 20s; widget timeout 25s. Secrets and chat text are not logged by
application code. Provider retention must be confirmed separately. Widget warns
that messages/context go to AI; history lives in tab memory, never storage.

## Claim boundaries

Model classifies intent and selects up to three allowlisted product IDs. Server
renders conversational approved templates and exact source excerpts; arbitrary
model-generated prose, claims and links are never rendered. This intentionally
limits language variety until reviewed free-form generation is authorized.
Medical/emergency requests use fixed refusals/escalation, without products.
Keyword checks are supplementary, not proof of perfect intent classification.
Matching source products is not a personal suitability assessment.

`src/data/chat-knowledge.json` records all 20 product source pages, retrieval time
and SHA-256 of locally retained Reader exports in `evidence/chat/sources/`.
Only product descriptions enter the model context, not articles, prices,
ratings, testimonials or site instructions. Serum universal-suitability/testing
sentence, GO regulatory detail and D3 clinical-targeting claim are excluded.
D3 remains name/link-only. Source claims still need qualified review before public
release; retrieval does not establish clinical truth or current authorization.
Snapshot is manual, not continuously synced. Refresh source exports and review
changes before replacing the checked-in knowledge file.

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
