# the codeblock

Personal portfolio for Hendrik Oosthuizen, live at https://www.thecodeblock.net. A single page plus a "Digital Twin" chat that answers questions about his career.

## Stack

Next.js 16 (App Router), React 19, TypeScript, plain CSS. Chat model: `openai/gpt-oss-120b` via OpenRouter. Hosted on Vercel.

## Run

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # type check (tsc --noEmit)
```

Create `.env` with `OPENROUTER_API_KEY=...`. Without it `/api/chat` returns 503.

## Layout

| Path | Purpose |
|---|---|
| `app/page.tsx` | Portfolio page |
| `app/components/` | Chat widget and selected work section |
| `app/api/chat/route.ts` | Chat endpoint and the career profile used as the system prompt |
| `app/images/` | Project screenshots |
| `next.config.ts` | Security headers, CSP and image optimizer settings |

## Security

The chat endpoint checks Origin, content type, body size and history, and hides upstream errors. Vercel rate limits `/api/chat` to 10 requests per minute per IP. See `security.md` for findings and `security_checks.md` for the fix checklist.
