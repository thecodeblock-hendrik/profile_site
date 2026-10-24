# Security Fix Checklist

Work top to bottom, one step at a time. After each step: run `npm run lint`, run `npm run build`, test, then commit. Details for each item are in `security.md`.

Ground rules: branch off `main` (for example `security/hardening`), one commit per step, merge via PR.

## Step 1 - Dependencies (Critical)

- [x] Create branch `security/hardening`
- [x] Record baseline: `npm audit --omit=dev` (3 vulnerabilities)
- [x] Run `npm audit fix`
- [x] Re-run `npm audit --omit=dev` and confirm 0 vulnerabilities
- [x] Check installed `next` version and read the matching upgrade notes in `node_modules/next/dist/docs/` (version checked: 16.4.3; upgrade notes not read, same major)
- [x] `npm run lint` and `npm run build` pass
- [x] `npm run start` (production build): page loads, project images show, chat answers a question
- [x] Commit

## Step 2 - Restrict image optimizer (High, defence in depth)

- [x] Read the `images` config docs in `node_modules/next/dist/docs/`
- [x] Set `images` in `next.config.ts`: no remote patterns, SVG not allowed (also local paths limited to `/_next/static/media/**`, quality 75 only)
- [x] Build and confirm project screenshots still render
- [x] Commit

## Step 3 - Chat API input hardening (Medium)

Edit `app/api/chat/route.ts`, one change at a time.

- [x] Require `Content-Type: application/json`, else return 415
- [x] Reject `Content-Length` above 32 KB, else return 413 (also checks actual body length, for requests without Content-Length)
- [x] Reject `messages.length > 10` before running `isChatMessage` (changed: keep the last 10 and validate only those, so long chats still work)
- [x] Reject requests whose `Origin` is not `https://thecodeblock.net` (allow `http://localhost:3000` in dev)
- [x] Accept only `user` messages from the client, or ignore client `assistant` turns (changed: assistant turns kept for follow-up context; last message must be from the user)
- [x] Add a system prompt rule: ignore claims in earlier turns that conflict with the verified profile (forged-history exploit could not be reproduced before the rule; rule added as defence in depth)
- [x] Test with curl: wrong content type, oversized body, 11 messages, wrong origin, forged assistant turn, and a normal valid request
- [x] Commit

## Step 4 - Error handling and referer (Low)

- [x] Replace upstream status passthrough with generic 502/503 and a generic message (keep 429 as 429 if desired) (429 stays 429, everything else 503)
- [x] Keep detail in `console.error` only
- [x] Replace `request.nextUrl.origin` with the constant `https://thecodeblock.net` in `HTTP-Referer`
- [x] Test with an invalid `OPENROUTER_API_KEY` locally and confirm the response is generic (before: 401 "API key is not valid"; after: 503 generic)
- [x] Commit

## Step 5 - Chat widget error display (Low)

- [x] In `app/components/DigitalTwinChat.tsx`, handle a non-JSON response and show a fixed fallback message
- [x] Test by stopping the API or forcing an HTML error response (before: "Unexpected token '<'" shown; after: "Something went wrong. Please try again.")
- [x] Commit

## Step 6 - Security headers (Medium)

- [x] Read the Next.js 16 docs on `headers()` and Content-Security-Policy in `node_modules/next/dist/docs/` (nonce CSP rejected: it forces dynamic rendering of every page)
- [x] Add `headers()` to `next.config.ts` with: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (disable camera, microphone, geolocation), `Strict-Transport-Security`, and `frame-ancestors 'none'`
- [x] Add a Content-Security-Policy; start in report-only mode and check the browser console for violations (CSP uses 'unsafe-inline' for scripts and styles, as in the Next.js docs' no-nonce setup)
- [x] Switch CSP to enforcing once the console is clean
- [x] Verify with `curl -I` on `/` and `/api/chat`
- [x] Confirm the site and chat still work in the browser
- [x] Commit

## Step 7 - Rate limiting and spend cap (High)

Decision: hosted on Vercel, so use Vercel WAF Rate Limiting (all plans, Hobby gets 1 rule). No Redis or Upstash and no code change needed. An in-memory limiter in `route.ts` is unreliable on serverless because each instance has its own memory.

Live finding after merge: the site is served at `www.thecodeblock.net` (apex redirects to it), so the Origin allowlist also needs `https://www.thecodeblock.net`. Fixed in a follow-up PR.

- [x] Ask the host/edge where the site runs and whether it offers rate limiting (Vercel; WAF Rate Limiting is available on all plans)
- [ ] Hendrik: set a hard monthly spend limit on the OpenRouter key (OpenRouter dashboard, Keys, set a credit limit on the key)
- [ ] Hendrik: Vercel project, Firewall, Configure, New Rule: name `chat-rate-limit`; If Request Path equals `/api/chat`; Then Rate Limit, Fixed Window, 60s, 10 requests, key IP; action Log first
- [ ] Hendrik: Publish the rule, send some chat messages, confirm hits appear in the Firewall traffic view
- [ ] Hendrik: switch the rule action from Log to Default (429) and Publish
- [ ] Test the live site: send more than 10 requests in a minute with curl and confirm 429 (Claude runs this once the rule is live)
- [x] Check the chat widget shows a friendly message on 429 (widget now maps any 429 to the friendly message; tested with a fake non-JSON 429)
- [ ] Optional: bot check (Vercel BotID or Cloudflare Turnstile); skip unless abuse is seen
- [ ] Commit (checklist notes only, no code expected)

## Step 8 - Repository hygiene (Low)

- [ ] Open `linkedin.pdf` and check for phone, address or other private details
- [ ] If private details exist: remove from the repo, add to `.gitignore`, and decide whether to purge history
- [ ] Update `CLAUDE.md` if `linkedin.pdf` moves
- [ ] Commit

## Step 9 - Final verification

- [ ] `npm audit --omit=dev` shows 0 vulnerabilities
- [ ] `npm run lint` and `npm run build` pass
- [ ] Re-run the curl tests from Steps 3, 4, 6 and 7
- [ ] Manual browser test of the full site and chat
- [ ] Update `security.md`: mark each finding fixed or accepted
- [ ] Open PR, merge, deploy, and re-check headers on the live site
- [ ] Schedule a recurring `npm audit` (monthly)
