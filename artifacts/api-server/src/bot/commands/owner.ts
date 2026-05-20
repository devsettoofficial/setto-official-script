import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { reply } from "../lib/utils.js";

export async function broadcastCommand(
  sock: WASocket,
  msg: WAMessage,
  args: string[],
): Promise<void> {
  const text = args.join(" ");
  if (!text) {
    await reply(sock, msg, "❌ Usage: .broadcast <message>");
    return;
  }

  const chats = await sock.groupFetchAllParticipating();
  const jids = Object.keys(chats);

  await reply(sock, msg, `📢 Broadcasting to ${jids.length} groups...`);

  let sent = 0;
  for (const jid of jids) {
    try {
      await sock.sendMessage(jid, { text });
      sent++;
    } catch {
      // skip failed
    }
  }

  await reply(sock, msg, `✅ Broadcast sent to ${sent}/${jids.length} groups.`);
}

export async function restartCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  await reply(sock, msg, "🔄 Restarting bot...");
  setTimeout(() => process.exit(0), 1000);
}
