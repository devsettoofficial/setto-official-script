import { config } from "./config.js";

export function getSenderJid(msg) {
  return (
    msg.key.remoteJid?.replace(/:[0-9]+@/g, "@") ??
    msg.key.participant ??
    ""
  );
}

export function isOwner(jid) {
  const ownerJid = config.ownerNumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  return jid === ownerJid;
}

export function isGroup(msg) {
  return msg.key.remoteJid?.endsWith("@g.us") ?? false;
}

export function getBody(msg) {
  return (
    msg.message?.conversation ??
    msg.message?.extendedTextMessage?.text ??
    msg.message?.imageMessage?.caption ??
    msg.message?.videoMessage?.caption ??
    ""
  );
}

export async function reply(sock, msg, text) {
  await sock.sendMessage(
    msg.key.remoteJid,
    { text: `${text}\n\n> _${config.watermark}_` },
    { quoted: msg },
  );
}

export async function react(sock, msg, emoji) {
  await sock.sendMessage(msg.key.remoteJid, {
    react: { text: emoji, key: msg.key },
  });
}
