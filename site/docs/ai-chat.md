# Ask Mecosin conversational agent

The model leads every conversational turn, including greetings, follow-up questions,
product information and safety cautions. No local intake state machine or fixed
intent replies remain. The backend validates requests, executes bounded read-only
tools, validates output and renders product cards from reviewed local data.

## Runtime

Vercel root `site`, build `npm run build`, static output `dist` with native Node
Function `api/chat.mjs`. Astro preview alone does not serve the API.

Server-only settings (never expose credentials to browser/repository):
- `NINE_ROUTER_BASE_URL`: default `https://api.linc.id/v1`.
- `NINE_ROUTER_API_KEY`: project credential, maintained by Owner in Vercel.
- `NINE_ROUTER_MODEL`: default `cx/gpt-6.1-sol`; `reasoning_effort: medium`.
- `CHAT_ALLOWED_ORIGINS`: exact origins; default `https://mecosin.vercel.app`.

Native OpenAI-compatible function calling uses:
- `search_products({query})`: bounded lexical search of reviewed catalogue.
- `get_product({slug})`: exact product facts and explicit missing label fields.

No network tool, arbitrary URL fetching, write action, purchasing or background
agent. Tools run only within the current request. Maximum four model rounds and
six tool calls; final round disallows further tools. One transient retry per round,
12-second attempt timeout inside a 32-second total deadline. Widget waits 40
seconds; function max duration 45 seconds. No model fallback.

Final JSON retains `{intent, reply, products}`. Cards require `get_product` in the
current request; missing retrieval or common unsafe output triggers one model
repair instead of replacing prose with a stock sentence. Failed contracts return
an explicit error. `X-Chat-Tool-Calls` exposes only the number of executed tools,
not prompts, arguments, raw provider data or credentials.

## Dialogue and boundaries

Prompt asks for attentive, flexible clarification, using all facts already supplied.
Symptom-led discovery gathers relevant recipient/age, duration and risk context
without forcing a fixed order. Named-product fact questions do not require intake.
Topic/patient changes and corrections must be interpreted from bounded history.

No diagnosis, personal dosing, interaction/suitability assurances or cure guarantees.
Children and special conditions are not cleared from age or negative risk answers.
Persistent complaints prioritize examination; active emergencies prioritize medical
help without sales cards. The assistant identifies itself truthfully if asked.

Product cards are built from server-owned names, descriptions/compositions, images
and `/produk/<slug>/` links. External publisher names/links remain internal. The
knowledge snapshot includes 16 secondary-description enrichments; four unresolved
products retain the previous snapshot. No researched dosing was promoted. Missing
age eligibility, contraindications and interaction data do not establish safety.

Conversational safeguards use the system prompt, tool schema, allowlisted product
IDs, retrieval requirement, limited repair and a supplementary claim/markup screen.
They do not constitute clinically validated triage or proof against every possible
hallucination/injection. Live dialogue testing is separate from fixture transport
checks. A disclaimer does not validate an unsupported medical claim.

## Privacy and operational limits

Widget discloses processing by service provider. History stays in tab memory,
not browser storage or a new database; reload clears it. Widget retains 22 messages;
API accepts up to 24, 12 KB total, 500 characters for latest question. Older context
can be lost; model must not assume omitted facts or safety. No application logging
of chat content, keys or upstream bodies. Provider retention needs separate review.

Process-local rate limit: 20 requests/minute/client, 5000 buckets. This is not a
fleet-wide spending guard. Native Vercel firewall and router quotas require separate
configuration/verification. Origin checks are not authentication or bot prevention.
Tool rounds can increase inference cost and latency relative to a single request.

## Checks

```sh
npm run build
# In another shell: npm run preview -- --port 4357
PREVIEW_URL=http://127.0.0.1:4357 npm run check
```

`check-chat-agent.mjs` exercises the actual HTTP handler with explicit provider
fixtures: model-led clarification, search/detail function loop, field provenance,
unknown/invalid tool arguments, retrieval/claim repair, loop limits, malformed
output and retry. `check-chat.mjs` retains validation/config/origin/body/rate/error
coverage and exact model/effort assertions. Knowledge and responsive browser tests
cover card fidelity, image decode, context, typing, input clearing and outage recovery.
These fixtures do not prove live model reasoning. Verify real provider tool calls,
multiturn behaviour and safety cases after authorized deployment; keep raw test
conversations in local evidence, not the published repository.
