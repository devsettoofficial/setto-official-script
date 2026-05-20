import { reply, react } from "../lib/utils.js";

export async function kickCommand(sock, msg) {
  const jid = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

  if (!mentioned.length) {
    await reply(sock, msg, "❌ *Usage:* .kick @user");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(jid, mentioned, "remove");
    await react(sock, msg, "✅");
    await reply(sock, msg, `✅ Kicked *${mentioned.length}* member(s).`);
  } catch {
    await reply(sock, msg, "❌ Failed to kick. Make sure I am an admin.");
  }
}

export async function addCommand(sock, msg, args) {
  const jid = msg.key.remoteJid;
  const number = args[0]?.replace(/[^0-9]/g, "");

  if (!number) {
    await reply(sock, msg, "❌ *Usage:* .add <number>\nExample: .add 628123456789");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(jid, [`${number}@s.whatsapp.net`], "add");
    await reply(sock, msg, `✅ Added *${number}*.`);
  } catch {
    await reply(sock, msg, "❌ Failed to add member.");
  }
}

export async function promoteCommand(sock, msg) {
  const jid = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

  if (!mentioned.length) {
    await reply(sock, msg, "❌ *Usage:* .promote @user");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(jid, mentioned, "promote");
    await react(sock, msg, "⬆️");
    await reply(sock, msg, `✅ Promoted *${mentioned.length}* member(s) to admin.`);
  } catch {
    await reply(sock, msg, "❌ Failed to promote. Make sure I am an admin.");
  }
}

export async function demoteCommand(sock, msg) {
  const jid = msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

  if (!mentioned.length) {
    await reply(sock, msg, "❌ *Usage:* .demote @user");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(jid, mentioned, "demote");
    await react(sock, msg, "⬇️");
    await reply(sock, msg, `✅ Demoted *${mentioned.length}* member(s).`);
  } catch {
    await reply(sock, msg, "❌ Failed to demote.");
  }
}
