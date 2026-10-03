# CLAUDE.md

## Next.js agent rules (from AGENTS.md)

This is NOT the Next.js you know. This version (16.3.x) has breaking changes — APIs, conventions, and file structure may all differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

`AGENTS.md` is written and re-added by `next dev` (see `node_modules/next/dist/server/lib/generate-agent-files.js`). Leave it in place; removing it only re-creates the uncommitted change.

## Project

Personal portfolio site for Hendrik Oosthuizen, branded "the codeblock" (https://thecodeblock.net). Single page plus an AI "Digital Twin" chat that answers questions about Hendrik's career.

- Repo: https://github.com/thecodeblock-hendrik/profile_site (branch `main`, work merged via PRs)
- Stack: Next.js 16 (App Router), React 19, TypeScript 5, plain CSS. No UI or CSS libraries.

## Structure

| Path | Purpose |
|---|---|
| `app/layout.tsx` | Root layout, metadata, viewport |
| `app/page.tsx` | Portfolio page: hero, impact, about, journey, expertise, education, portfolio callout |
| `app/globals.css` | All styling and responsive rules |
| `app/components/DigitalTwinChat.tsx` | Client chat widget, posts to `/api/chat` |
| `app/api/chat/route.ts` | Server route calling OpenRouter (`openai/gpt-oss-120b`) with a verified career profile as system prompt |
| `CODEBASE_TUTORIAL.md` | Beginner walkthrough of the codebase |
| `linkedin.pdf` | Source profile for the career facts |

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — type check (`tsc --noEmit`)

## Configuration

- `.env` must define `OPENROUTER_API_KEY`. Without it `/api/chat` returns 503.
- Chat facts live in `CAREER_CONTEXT` in `app/api/chat/route.ts`. Only add verified facts; contact email is hendrik@thecodeblock.net.

## Status (2026-10-03)

- Portfolio page and Digital Twin chat are complete and merged (PRs #1–#5). Latest work: chat window UX, close button, email update.
- `node_modules/` and `.next/` were untracked from git (they are in `.gitignore`).
- No tests yet; `npm run lint` is the only check.
