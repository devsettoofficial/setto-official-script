import { reply } from "../lib/utils.js";

export async function broadcastCommand(sock, msg, args) {
  const text = args.join(" ");

  if (!text) {
    await reply(sock, msg, "❌ *Usage:* .broadcast <message>");
    return;
  }

  const groups = await sock.groupFetchAllParticipating();
  const jids = Object.keys(groups);

  await reply(sock, msg, `📢 Broadcasting to *${jids.length}* groups...`);

  let sent = 0;
  for (const jid of jids) {
    try {
      await sock.sendMessage(jid, { text });
      sent++;
    } catch {
      // skip failed sends
    }
  }

  await reply(sock, msg, `✅ Done! Sent to *${sent}/${jids.length}* groups.`);
}

export async function restartCommand(sock, msg) {
  await reply(sock, msg, "🔄 *Restarting bot...*");
  setTimeout(() => process.exit(0), 1000);
}
