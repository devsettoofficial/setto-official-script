import { log } from "./banner.js";

const groupSettings = new Map();
const messageCache  = new Map();

export function getGroupSettings(groupJid) {
  if (!groupSettings.has(groupJid)) {
    groupSettings.set(groupJid, { welcome: false, antidelete: false });
  }
  return groupSettings.get(groupJid);
}

export function setGroupFeature(groupJid, feature, value) {
  const s = getGroupSettings(groupJid);
  s[feature] = value;
  groupSettings.set(groupJid, s);
}

export function cacheMessage(id, jid, content) {
  messageCache.set(id, { jid, content });
  if (messageCache.size > 500) {
    const firstKey = messageCache.keys().next().value;
    if (firstKey) messageCache.delete(firstKey);
  }
}

export async function handleWelcome(sock, groupJid, participants, action) {
  const settings = getGroupSettings(groupJid);
  if (!settings.welcome) return;

  try {
    const meta = await sock.groupMetadata(groupJid);
    for (const jid of participants) {
      const num = jid.split("@")[0];
      const text =
        action === "add"
          ? `👋 Welcome to *${meta.subject}*, @${num}! Have a great time 🎉\n\n> _Powered by Setto Official_`
          : `👋 Goodbye, @${num}! We'll miss you.\n\n> _Powered by Setto Official_`;
      await sock.sendMessage(groupJid, { text, mentions: [jid] });
    }
  } catch (err) {
    log("error", `Welcome handler: ${err.message}`);
  }
}

export async function handleAntiDelete(sock, groupJid, deletedId) {
  const settings = getGroupSettings(groupJid);
  if (!settings.antidelete) return;

  const cached = messageCache.get(deletedId);
  if (!cached) return;

  try {
    await sock.sendMessage(groupJid, {
      text: `🚫 *Anti-Delete* — A message was deleted!\n\`\`\`${JSON.stringify(cached.content, null, 2)}\`\`\`\n\n> _Powered by Setto Official_`,
    });
  } catch (err) {
    log("error", `Anti-delete: ${err.message}`);
  }
}
