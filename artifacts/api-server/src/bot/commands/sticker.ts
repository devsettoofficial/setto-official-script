import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { reply, react } from "../lib/utils.js";
import { config } from "../lib/config.js";

export async function stickerCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const hasImage =
    msg.message?.imageMessage ??
    quoted?.imageMessage ??
    msg.message?.videoMessage ??
    quoted?.videoMessage;

  if (!hasImage) {
    await reply(sock, msg, "❌ Reply to an image or video to convert it to a sticker.");
    return;
  }

  await react(sock, msg, "⏳");

  try {
    const buffer = await downloadMediaMessage(msg, "buffer", {});

    await sock.sendMessage(msg.key.remoteJid!, {
      sticker: buffer as Buffer,
    });

    await react(sock, msg, "✅");
  } catch {
    await reply(sock, msg, `❌ Failed to create sticker.\n\n> _${config.watermark}_`);
    await react(sock, msg, "❌");
  }
}
