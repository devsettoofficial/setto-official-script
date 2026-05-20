import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { config } from "../lib/config.js";
import { reply } from "../lib/utils.js";

export async function pingCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const start = Date.now();
  await sock.sendMessage(msg.key.remoteJid!, { text: "Pinging..." });
  const latency = Date.now() - start;
  await reply(sock, msg, `🏓 Pong! *${latency}ms*`);
}

export async function infoCommand(sock: WASocket, msg: WAMessage): Promise<void> {
  const info = `
╔══════════════════════╗
║   📱 *Bot Info*      ║
╚══════════════════════╝

🤖 *Name:* ${config.botName}
⚙️ *Prefix:* ${config.prefix}
🌐 *Platform:* Node.js + Baileys
👨‍💻 *Author:* Setto Official
📅 *Uptime:* ${getUptime()}
`.trim();

  await reply(sock, msg, info);
}

function getUptime(): string {
  const seconds = Math.floor(process.uptime());
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
