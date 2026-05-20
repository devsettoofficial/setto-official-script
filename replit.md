# Setto Bot

A WhatsApp bot built with Node.js and the Baileys library by Setto Official.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the bot + API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- Required env: `OWNER_NUMBER` — your WhatsApp number with country code (e.g. 628123456789)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Bot: @whiskeysockets/baileys (WhatsApp Web API)
- API: Express 5 (health endpoints)
- Runtime: tsx (direct TypeScript execution)

## Where things live

- `artifacts/api-server/src/bot/` — all bot code
  - `index.ts` — Baileys connection, QR login, event listeners
  - `handler.ts` — command router (prefix ".")
  - `lib/config.ts` — bot config (prefix, owner number, watermark)
  - `lib/utils.ts` — helpers (reply, react, getBody, etc.)
  - `lib/banner.ts` — pretty console logger + figlet banner
  - `lib/features.ts` — welcome, anti-delete state management
  - `commands/` — one file per command group
- `artifacts/api-server/src/bot/sessions/` — Baileys session files (gitignored)

## Architecture decisions

- Bot runs inside the existing Express API server process (started in index.ts).
- tsx is used for dev to avoid esbuild bundling issues with Baileys/protobufjs.
- Group settings (welcome, antidelete) are stored in-memory (Map); restart clears them.
- Anti-delete caches up to 500 recent messages in memory.
- Owner check uses OWNER_NUMBER env var — set it before running.

## Product

WhatsApp bot featuring: QR scan login, "." prefix commands, .menu, .ping, .info, .sticker, .dl, group admin commands (kick/add/promote/demote), welcome message, anti-delete, owner-only broadcast/restart. Watermarked "Setto Official".

## User preferences

- Watermark: "Setto Official"
- Prefix: "."
- Code should be clean and beginner-friendly

## Gotchas

- Set OWNER_NUMBER env var (e.g. 628123456789 — no + or spaces) before running
- Session files are saved to `src/bot/sessions/` — delete this folder to log out
- Baileys cannot be bundled by esbuild (uses dynamic require), so dev uses tsx directly
- The build script is for the Express server only — bot is tsx-only

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
