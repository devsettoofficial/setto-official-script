import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { reply, react } from "../lib/utils.js";

export async function kickCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const groupJid = msg.key.remoteJid!;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

  if (!mentioned.length) {
    await reply(sock, msg, "❌ Tag a member to kick. Usage: .kick @user");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(groupJid, mentioned, "remove");
    await react(sock, msg, "✅");
    await reply(sock, msg, `✅ Kicked ${mentioned.length} member(s).`);
  } catch {
    await reply(sock, msg, "❌ Failed to kick. Make sure I am an admin.");
  }
}

export async function addCommand(
  sock: WASocket,
  msg: WAMessage,
  args: string[],
): Promise<void> {
  const groupJid = msg.key.remoteJid!;
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) {
    await reply(sock, msg, "❌ Usage: .add <number> (e.g. .add 628123456789)");
    return;
  }

  const jid = number + "@s.whatsapp.net";
  try {
    await sock.groupParticipantsUpdate(groupJid, [jid], "add");
    await reply(sock, msg, `✅ Added ${number}.`);
  } catch {
    await reply(sock, msg, "❌ Failed to add member.");
  }
}

export async function promoteCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const groupJid = msg.key.remoteJid!;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

  if (!mentioned.length) {
    await reply(sock, msg, "❌ Tag a member to promote. Usage: .promote @user");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(groupJid, mentioned, "promote");
    await react(sock, msg, "⬆️");
    await reply(sock, msg, `✅ Promoted ${mentioned.length} member(s) to admin.`);
  } catch {
    await reply(sock, msg, "❌ Failed to promote. Make sure I am an admin.");
  }
}

export async function demoteCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const groupJid = msg.key.remoteJid!;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

  if (!mentioned.length) {
    await reply(sock, msg, "❌ Tag a member to demote. Usage: .demote @user");
    return;
  }

  try {
    await sock.groupParticipantsUpdate(groupJid, mentioned, "demote");
    await react(sock, msg, "⬇️");
    await reply(sock, msg, `✅ Demoted ${mentioned.length} member(s).`);
  } catch {
    await reply(sock, msg, "❌ Failed to demote.");
  }
}
