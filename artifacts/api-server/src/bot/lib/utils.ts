import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { config } from "./config.js";

export function getSenderJid(msg: WAMessage): string {
  return (
    msg.key.remoteJid?.replace(/:[0-9]+@/g, "@") ??
    msg.key.participant ??
    ""
  );
}

export function isOwner(jid: string): boolean {
  const ownerJid = config.ownerNumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  return jid === ownerJid;
}

export function isGroup(msg: WAMessage): boolean {
  return msg.key.remoteJid?.endsWith("@g.us") ?? false;
}

export async function reply(
  sock: WASocket,
  msg: WAMessage,
  text: string,
): Promise<void> {
  await sock.sendMessage(
    msg.key.remoteJid!,
    { text: `${text}\n\n> _${config.watermark}_` },
    { quoted: msg },
  );
}

export async function react(
  sock: WASocket,
  msg: WAMessage,
  emoji: string,
): Promise<void> {
  await sock.sendMessage(msg.key.remoteJid!, {
    react: { text: emoji, key: msg.key },
  });
}

export function getBody(msg: WAMessage): string {
  return (
    msg.message?.conversation ??
    msg.message?.extendedTextMessage?.text ??
    msg.message?.imageMessage?.caption ??
    msg.message?.videoMessage?.caption ??
    ""
  );
}
