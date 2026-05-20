import { config } from "../lib/config.js";
import { reply } from "../lib/utils.js";

export async function menuCommand(sock, msg) {
  const p = config.prefix;

  const menu = `
╔══════════════════════════╗
║   🤖 *${config.botName}*     ║
╚══════════════════════════╝

*📋 General*
├ ${p}menu — Show this menu
├ ${p}ping — Check bot speed
└ ${p}info — Bot information

*🖼️ Media*
├ ${p}sticker — Image → sticker
└ ${p}dl <url> — Download media

*👥 Group Admin*
├ ${p}welcome on/off
├ ${p}antidelete on/off
├ ${p}kick @user
├ ${p}add <number>
├ ${p}promote @user
└ ${p}demote @user

*👑 Owner Only*
├ ${p}broadcast <text>
└ ${p}restart
`.trim();

  await reply(sock, msg, menu);
}
