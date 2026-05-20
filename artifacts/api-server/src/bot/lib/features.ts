import type { WASocket } from "@whiskeysockets/baileys";
import { log } from "./banner.js";

interface GroupFeatures {
  welcome: boolean;
  antidelete: boolean;
}

const groupSettings = new Map<string, GroupFeatures>();

export function getGroupSettings(groupJid: string): GroupFeatures {
  if (!groupSettings.has(groupJid)) {
    groupSettings.set(groupJid, { welcome: false, antidelete: false });
  }
  return groupSettings.get(groupJid)!;
}

export function setGroupFeature(
  groupJid: string,
  feature: keyof GroupFeatures,
  value: boolean,
): void {
  const settings = getGroupSettings(groupJid);
  settings[feature] = value;
  groupSettings.set(groupJid, settings);
}

export async function handleWelcome(
  sock: WASocket,
  groupJid: string,
  participants: string[],
  action: "add" | "remove",
): Promise<void> {
  const settings = getGroupSettings(groupJid);
  if (!settings.welcome) return;

  try {
    const groupMeta = await sock.groupMetadata(groupJid);

    for (const jid of participants) {
      if (action === "add") {
        await sock.sendMessage(groupJid, {
          text: `👋 Welcome to *${groupMeta.subject}*, @${jid.split("@")[0]}!\n\nHave a great time here 🎉\n\n> _Powered by Setto Official_`,
          mentions: [jid],
        });
      } else {
        await sock.sendMessage(groupJid, {
          text: `👋 Goodbye, @${jid.split("@")[0]}! We'll miss you.\n\n> _Powered by Setto Official_`,
          mentions: [jid],
        });
      }
    }
  } catch (err) {
    log("error", `Welcome handler error: ${err}`);
  }
}

const deletedMessages = new Map<string, { jid: string; content: unknown }>();

export function cacheMessage(key: string, jid: string, content: unknown): void {
  deletedMessages.set(key, { jid, content });
  if (deletedMessages.size > 500) {
    const firstKey = deletedMessages.keys().next().value;
    if (firstKey) deletedMessages.delete(firstKey);
  }
}

export async function handleAntiDelete(
  sock: WASocket,
  groupJid: string,
  deletedKey: string,
): Promise<void> {
  const settings = getGroupSettings(groupJid);
  if (!settings.antidelete) return;

  const cached = deletedMessages.get(deletedKey);
  if (!cached) return;

  try {
    await sock.sendMessage(groupJid, {
      text: `🚫 *Anti-Delete:* A message was deleted!\n\n${JSON.stringify(cached.content, null, 2)}\n\n> _Powered by Setto Official_`,
    });
  } catch (err) {
    log("error", `Anti-delete handler error: ${err}`);
  }
}
