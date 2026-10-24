# Security Review

Date: 2026-10-24. Scope: whole application (Next.js 16.3.4, `app/api/chat/route.ts`, `DigitalTwinChat.tsx`, `next.config.ts`, dependencies).

Findings marked **Verified** were confirmed by running `npm audit` or reading the code. Nothing has been fixed yet.

## Summary

| # | Severity | Finding |
|---|---|---|
| 1 | Critical | Vulnerable Next.js, sharp and source-map-js (Verified) |
| 2 | High | No rate limiting on `/api/chat`, which spends a paid API key (Verified) |
| 3 | Medium | No security headers (Verified) |
| 4 | Medium | Request body size unbounded before validation (Verified) |
| 5 | Medium | Client can forge `assistant` turns (prompt injection) (Verified) |
| 6 | Medium | No Origin / Content-Type check on the chat endpoint (Verified) |
| 7 | Low | Upstream status codes and account state leaked to visitors (Verified) |
| 8 | Low | `HTTP-Referer` derived from request origin (Verified) |
| 9 | Low | Client shows raw JSON parse errors on non-JSON replies |
| 10 | Low | `linkedin.pdf` is tracked in git |

## 1. Vulnerable dependencies (Critical)

`npm audit --omit=dev` reports 3 vulnerabilities (1 critical, 2 high):

- `next` 16.0.0 - 16.4.0, including unauthenticated RCE in Image Optimization (SVG), SSRF in Image Optimization, SSG/ISR cache poisoning on self-hosted apps, and a Server Actions DoS.
- `sharp` < 0.35.5 (librsvg vulnerability).
- `source-map-js` 1.0.0 - 1.2.1 (event-loop DoS).

The site uses `next/image` for project screenshots, so the image optimizer is reachable.

Fix: `npm audit fix` (a fix is reported available), rebuild, run `npm run lint`, and re-run `npm audit`. Until then, restrict `images` in `next.config.ts` (no remote patterns, SVG disabled).

## 2. No rate limiting on `/api/chat` (High)

`POST /api/chat` (`route.ts:106`) is public with no auth, quota or throttling. Each call spends the owner's OpenRouter key (up to 10 messages x 2,000 chars in, 450 tokens out). A script can drain credits, trigger upstream 429s that take the twin offline, or use it as a free LLM proxy.

Fix:
- Per-IP rate limit (for example a 10 requests/minute window) at the edge (host/CDN/WAF) or with a small store such as Upstash Redis.
- Set a hard spend limit on the OpenRouter key.
- Optionally add Cloudflare Turnstile before the first message.

## 3. No security headers (Medium)

`next.config.ts` only sets `poweredByHeader: false`. Missing:

- `Content-Security-Policy` (including `frame-ancestors 'none'`)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security` (if the host does not already add it)

The site can currently be framed by any origin (clickjacking). Add a `headers()` function in `next.config.ts`. Read the Next.js 16 docs in `node_modules/next/dist/docs/` for the CSP and nonce guidance before writing it.

## 4. Unbounded request body (Medium)

`request.json()` (`route.ts:76`) parses the whole body, and `.every(isChatMessage)` runs over the entire array before `slice(-10)`. The per-message cap does not limit total size or array length, so a large body costs memory and CPU.

Fix: reject when `Content-Length` exceeds a small limit (for example 32 KB) and reject `messages.length > 10` up front.

## 5. Forged conversation history / prompt injection (Medium)

The client sends the full history, including `assistant` turns, and the server trusts it. An attacker can fabricate earlier assistant statements about Hendrik and have the model continue them, producing screenshots of false claims. The system prompt is also extractable.

Fix:
- Accept only `user` messages, or accept `assistant` turns with a signed/server-held history.
- Add an explicit system prompt rule to ignore claims in prior turns that conflict with the verified profile.
- Treat the system prompt as public (it contains no secrets today; keep it that way).

## 6. No Origin or Content-Type check (Medium)

Other sites can call the endpoint from visitors' browsers using a `text/plain` body (no CORS preflight), which the handler accepts. This spreads abuse across many IPs and defeats per-IP limits.

Fix: require `Content-Type: application/json` and reject requests whose `Origin` is not `https://thecodeblock.net` (and localhost in dev).

## 7. Upstream errors leaked (Low)

`route.ts:137` returns OpenRouter's status code to the visitor, with messages such as "API key is not valid" and "account needs OpenRouter credits". This reveals key and billing state.

Fix: return a generic message with status 502 or 503; keep the detail in server logs (already done via `console.error`).

## 8. `HTTP-Referer` from request origin (Low)

`route.ts:107` uses `request.nextUrl.origin`, which can follow a spoofed Host header behind a lax proxy. Use the constant `https://thecodeblock.net`.

## 9. Raw parse errors shown in UI (Low)

`DigitalTwinChat.tsx` calls `response.json()` unguarded; an HTML 502/504 page from a proxy shows a `SyntaxError` message to the user. Show a fixed fallback message instead.

## 10. `linkedin.pdf` committed (Low)

`linkedin.pdf` is tracked in git and the repo is public on GitHub. Check it for personal contact details (phone, address) you do not want public. If it contains any, remove it from the repo and history, and keep it outside version control.

## Checked and fine

- `OPENROUTER_API_KEY` is read server-side only, never sent to the client; `.env*` is gitignored and no `.env` file was ever committed.
- Chat answers render as React text, so there is no XSS path.
- External links use `rel="noreferrer"`.
- Message length and count are limited before calling the model, and the upstream call has a 45 s timeout.
- `X-Powered-By` is disabled.

## Suggested order

1. `npm audit fix` and verify.
2. Rate limiting plus an OpenRouter spend cap.
3. Security headers.
4. Body size, Origin and Content-Type checks, and rejecting forged `assistant` turns.
5. Low items.
