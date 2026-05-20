import { config } from "../lib/config.js";
import { reply } from "../lib/utils.js";

export async function pingCommand(sock, msg) {
  const start = Date.now();
  await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pinging..." });
  const ms = Date.now() - start;
  await reply(sock, msg, `🏓 *Pong!* Response time: *${ms}ms*`);
}

export async function infoCommand(sock, msg) {
  const uptime = getUptime();
  const text = `
╔══════════════════════════╗
║   📱 *Bot Information*   ║
╚══════════════════════════╝

🤖 *Name:* ${config.botName}
⚙️  *Prefix:* ${config.prefix}
🌐 *Platform:* Node.js + Baileys
👨‍💻 *Author:* Setto Official
⏱️  *Uptime:* ${uptime}
`.trim();

  await reply(sock, msg, text);
}

function getUptime() {
  const s = Math.floor(process.uptime());
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}
