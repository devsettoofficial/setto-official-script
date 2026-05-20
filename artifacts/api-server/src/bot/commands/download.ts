import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { reply, react } from "../lib/utils.js";

export async function downloadCommand(
  sock: WASocket,
  msg: WAMessage,
  args: string[],
): Promise<void> {
  const url = args[0];

  if (!url) {
    await reply(sock, msg, "❌ Usage: .dl <url>\nExample: .dl https://youtu.be/xxx");
    return;
  }

  await react(sock, msg, "⏳");
  await reply(
    sock,
    msg,
    `⚠️ Download feature requires yt-dlp or a third-party API.\n\nURL received: ${url}\n\nThis feature can be extended by connecting to a download service.`,
  );
}
