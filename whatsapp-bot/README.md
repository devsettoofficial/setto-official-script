# Setto Bot — WhatsApp Bot

A modern WhatsApp bot built with Node.js and the Baileys library.

**Author:** Setto Official

---

## Quick Start

```bash
cd whatsapp-bot
npm install
npm start
```

Scan the QR code that appears in the terminal with your WhatsApp, then start sending commands.

---

## Setup

1. Set your owner number (your own WhatsApp number):
   ```bash
   # Linux / Mac
   export OWNER_NUMBER=628123456789

   # Windows
   set OWNER_NUMBER=628123456789
   ```
   Format: country code + number, no `+` or spaces.  
   Example: `628123456789`

2. Run the bot:
   ```bash
   npm start
   ```

---

## Commands

| Command | Description |
|---|---|
| `.menu` | Show all commands |
| `.ping` | Check bot response speed |
| `.info` | Bot info & uptime |
| `.sticker` | Reply to image → convert to sticker |
| `.dl <url>` | Download media (extendable) |
| `.welcome on/off` | Toggle welcome messages (group) |
| `.antidelete on/off` | Toggle anti-delete (group) |
| `.kick @user` | Kick a group member |
| `.add <number>` | Add someone to the group |
| `.promote @user` | Make someone a group admin |
| `.demote @user` | Remove someone as admin |
| `.broadcast <text>` | Send message to all groups (owner) |
| `.restart` | Restart the bot (owner) |

---

## File Structure

```
whatsapp-bot/
├── src/
│   ├── index.js          ← Main entry point (run this)
│   ├── handler.js        ← Command router
│   ├── lib/
│   │   ├── config.js     ← Bot config (prefix, owner, watermark)
│   │   ├── utils.js      ← Helper functions
│   │   ├── banner.js     ← Console logger & banner
│   │   └── features.js   ← Welcome & anti-delete logic
│   └── commands/
│       ├── menu.js
│       ├── general.js
│       ├── sticker.js
│       ├── download.js
│       ├── group.js
│       └── owner.js
├── sessions/             ← Auto-created, stores login session
├── package.json
└── .gitignore
```

---

## Notes

- Session is saved in `sessions/` — you only need to scan QR once.
- Delete `sessions/` folder to log out and scan again.
- All replies are watermarked with **Setto Official**.
