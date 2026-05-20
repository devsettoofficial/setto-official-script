import type { WAMessage, WASocket } from "@whiskeysockets/baileys";
import { config } from "./lib/config.js";
import { getBody, getSenderJid, isGroup, isOwner, reply } from "./lib/utils.js";
import { log } from "./lib/banner.js";
import { menuCommand } from "./commands/menu.js";
import { pingCommand, infoCommand } from "./commands/general.js";
import { stickerCommand } from "./commands/sticker.js";
import { downloadCommand } from "./commands/download.js";
import { broadcastCommand, restartCommand } from "./commands/owner.js";
import { kickCommand, addCommand, promoteCommand, demoteCommand } from "./commands/group.js";
import { setGroupFeature, getGroupSettings } from "./lib/features.js";

export async function handleMessage(sock: WASocket, msg: WAMessage): Promise<void> {
  if (!msg.message) return;
  if (msg.key.fromMe) return;

  const body = getBody(msg);
  const senderJid = getSenderJid(msg);
  const groupJid = msg.key.remoteJid!;
  const inGroup = isGroup(msg);
  const owner = isOwner(senderJid);

  if (!body.startsWith(config.prefix)) return;

  const [rawCmd, ...args] = body.slice(config.prefix.length).trim().split(/\s+/);
  const cmd = rawCmd?.toLowerCase() ?? "";

  log("info", `CMD: .${cmd} | FROM: ${senderJid.split("@")[0]} | GROUP: ${inGroup}`);

  try {
    switch (cmd) {
      case "menu":
      case "help":
        await menuCommand(sock, msg);
        break;

      case "ping":
        await pingCommand(sock, msg);
        break;

      case "info":
        await infoCommand(sock, msg);
        break;

      case "sticker":
      case "s":
        await stickerCommand(sock, msg);
        break;

      case "dl":
      case "download":
        await downloadCommand(sock, msg, args);
        break;

      case "welcome":
        if (!inGroup) return await reply(sock, msg, "❌ This command is for groups only.");
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        {
          const enable = args[0] === "on";
          setGroupFeature(groupJid, "welcome", enable);
          await reply(sock, msg, `✅ Welcome message turned *${enable ? "ON" : "OFF"}* for this group.`);
        }
        break;

      case "antidelete":
        if (!inGroup) return await reply(sock, msg, "❌ This command is for groups only.");
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        {
          const enable = args[0] === "on";
          setGroupFeature(groupJid, "antidelete", enable);
          await reply(sock, msg, `✅ Anti-delete turned *${enable ? "ON" : "OFF"}* for this group.`);
        }
        break;

      case "kick":
        if (!inGroup) return await reply(sock, msg, "❌ This command is for groups only.");
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await kickCommand(sock, msg);
        break;

      case "add":
        if (!inGroup) return await reply(sock, msg, "❌ This command is for groups only.");
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await addCommand(sock, msg, args);
        break;

      case "promote":
        if (!inGroup) return await reply(sock, msg, "❌ This command is for groups only.");
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await promoteCommand(sock, msg);
        break;

      case "demote":
        if (!inGroup) return await reply(sock, msg, "❌ This command is for groups only.");
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await demoteCommand(sock, msg);
        break;

      case "broadcast":
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await broadcastCommand(sock, msg, args);
        break;

      case "restart":
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await restartCommand(sock, msg);
        break;

      default:
        await reply(sock, msg, `❓ Unknown command: *.${cmd}*\nType *.menu* to see available commands.`);
    }
  } catch (err) {
    log("error", `Command error [${cmd}]: ${err}`);
    await reply(sock, msg, "❌ An error occurred while processing your command.").catch(() => {});
  }
}
