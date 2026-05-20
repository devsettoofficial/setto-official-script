import { reply, react } from "../lib/utils.js";

export async function downloadCommand(sock, msg, args) {
  const url = args[0];

  if (!url) {
    await reply(sock, msg, "❌ *Usage:* .dl <url>\nExample: .dl https://youtu.be/xxx");
    return;
  }

  await react(sock, msg, "⏳");
  await reply(
    sock,
    msg,
    `⚠️ *Download feature placeholder*\n\nURL received: ${url}\n\nYou can extend this by integrating yt-dlp or a download API.`,
  );
}
