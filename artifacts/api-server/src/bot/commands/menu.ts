import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { config } from "../lib/config.js";
import { reply } from "../lib/utils.js";

export async function menuCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const p = config.prefix;
  const menu = `
╔══════════════════════╗
║   🤖 *${config.botName}*   ║
╚══════════════════════╝

*📋 General*
├ ${p}menu — Show this menu
├ ${p}ping — Check bot latency
└ ${p}info — Bot information

*🖼️ Media*
├ ${p}sticker — Convert image to sticker
└ ${p}dl <url> — Download media

*👥 Group*
├ ${p}welcome on/off — Welcome message
├ ${p}antidelete on/off — Anti delete
├ ${p}kick @user — Kick member
├ ${p}add <number> — Add member
├ ${p}promote @user — Promote to admin
└ ${p}demote @user — Demote admin

*👑 Owner*
├ ${p}broadcast — Send to all chats
└ ${p}restart — Restart bot

> _${config.watermark}_
`.trim();

  await reply(sock, msg, menu);
}
