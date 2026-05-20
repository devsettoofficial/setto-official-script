import { config } from "./lib/config.js";
import { getBody, getSenderJid, isGroup, isOwner, reply } from "./lib/utils.js";
import { log } from "./lib/banner.js";
import { setGroupFeature } from "./lib/features.js";
import { menuCommand } from "./commands/menu.js";
import { pingCommand, infoCommand } from "./commands/general.js";
import { stickerCommand } from "./commands/sticker.js";
import { downloadCommand } from "./commands/download.js";
import { kickCommand, addCommand, promoteCommand, demoteCommand } from "./commands/group.js";
import { broadcastCommand, restartCommand } from "./commands/owner.js";

export async function handleMessage(sock, msg) {
  if (!msg.message) return;
  if (msg.key.fromMe) return;

  const body       = getBody(msg);
  const senderJid  = getSenderJid(msg);
  const groupJid   = msg.key.remoteJid;
  const inGroup    = isGroup(msg);
  const owner      = isOwner(senderJid);

  if (!body.startsWith(config.prefix)) return;

  const [rawCmd, ...args] = body.slice(config.prefix.length).trim().split(/\s+/);
  const cmd = rawCmd?.toLowerCase() ?? "";

  log("info", `CMD: .${cmd} | FROM: ${senderJid.split("@")[0]} | GROUP: ${inGroup}`);

  try {
    switch (cmd) {
      // ─── General ─────────────────────────────────────
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

      // ─── Media ───────────────────────────────────────
      case "sticker":
      case "s":
        await stickerCommand(sock, msg);
        break;

      case "dl":
      case "download":
        await downloadCommand(sock, msg, args);
        break;

      // ─── Group features ──────────────────────────────
      case "welcome":
        if (!inGroup)  return await reply(sock, msg, "❌ This command only works in groups.");
        if (!owner)    return await reply(sock, msg, "❌ Only the owner can use this.");
        setGroupFeature(groupJid, "welcome", args[0] === "on");
        await reply(sock, msg, `✅ Welcome messages turned *${args[0] === "on" ? "ON" : "OFF"}*.`);
        break;

      case "antidelete":
        if (!inGroup)  return await reply(sock, msg, "❌ This command only works in groups.");
        if (!owner)    return await reply(sock, msg, "❌ Only the owner can use this.");
        setGroupFeature(groupJid, "antidelete", args[0] === "on");
        await reply(sock, msg, `✅ Anti-delete turned *${args[0] === "on" ? "ON" : "OFF"}*.`);
        break;

      case "kick":
        if (!inGroup)  return await reply(sock, msg, "❌ This command only works in groups.");
        if (!owner)    return await reply(sock, msg, "❌ Only the owner can use this.");
        await kickCommand(sock, msg);
        break;

      case "add":
        if (!inGroup)  return await reply(sock, msg, "❌ This command only works in groups.");
        if (!owner)    return await reply(sock, msg, "❌ Only the owner can use this.");
        await addCommand(sock, msg, args);
        break;

      case "promote":
        if (!inGroup)  return await reply(sock, msg, "❌ This command only works in groups.");
        if (!owner)    return await reply(sock, msg, "❌ Only the owner can use this.");
        await promoteCommand(sock, msg);
        break;

      case "demote":
        if (!inGroup)  return await reply(sock, msg, "❌ This command only works in groups.");
        if (!owner)    return await reply(sock, msg, "❌ Only the owner can use this.");
        await demoteCommand(sock, msg);
        break;

      // ─── Owner only ──────────────────────────────────
      case "broadcast":
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await broadcastCommand(sock, msg, args);
        break;

      case "restart":
        if (!owner) return await reply(sock, msg, "❌ Only the owner can use this.");
        await restartCommand(sock, msg);
        break;

      default:
        await reply(sock, msg, `❓ Unknown command: *.${cmd}*\nType *.menu* to see all commands.`);
    }
  } catch (err) {
    log("error", `Command error [${cmd}]: ${err.message}`);
    await reply(sock, msg, "❌ Something went wrong while processing your command.").catch(() => {});
  }
}
