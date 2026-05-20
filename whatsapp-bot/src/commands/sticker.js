import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { reply, react } from "../lib/utils.js";

export async function stickerCommand(sock, msg) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const hasMedia =
    msg.message?.imageMessage ??
    quoted?.imageMessage ??
    msg.message?.videoMessage ??
    quoted?.videoMessage;

  if (!hasMedia) {
    await reply(sock, msg, "❌ Reply to an *image* or *video* with .sticker to convert it.");
    return;
  }

  await react(sock, msg, "⏳");

  try {
    const buffer = await downloadMediaMessage(msg, "buffer", {});
    await sock.sendMessage(msg.key.remoteJid, { sticker: buffer });
    await react(sock, msg, "✅");
  } catch (err) {
    await react(sock, msg, "❌");
    await reply(sock, msg, `❌ Failed to create sticker: ${err.message}`);
  }
}
