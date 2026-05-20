import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  type WASocket,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import { printBanner, log } from "./lib/banner.js";
import { config } from "./lib/config.js";
import { handleMessage } from "./handler.js";
import { handleWelcome, handleAntiDelete, cacheMessage } from "./lib/features.js";

async function startBot(): Promise<void> {
  printBanner();
  log("info", "Starting WhatsApp bot...");

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  log("info", `Using Baileys v${version.join(".")}`);

  const sock: WASocket = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, console as never),
    },
    printQRInTerminal: false,
    browser: ["Setto Bot", "Chrome", "1.0.0"],
    syncFullHistory: false,
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      log("info", "Scan the QR code below to log in:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

      log(
        shouldReconnect ? "warn" : "error",
        `Connection closed. Reason: ${(lastDisconnect?.error as Boom)?.output?.statusCode}`,
      );

      if (shouldReconnect) {
        log("info", "Reconnecting...");
        startBot();
      } else {
        log("error", "Logged out. Delete the session folder and restart.");
        process.exit(1);
      }
    }

    if (connection === "open") {
      log("success", `Bot connected as ${sock.user?.name ?? sock.user?.id ?? "Unknown"}`);
      log("success", `Prefix: "${config.prefix}" | Bot: ${config.botName}`);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message) continue;

      const key = msg.key.id ?? "";
      const jid = msg.key.remoteJid ?? "";

      cacheMessage(key, jid, msg.message);

      await handleMessage(sock, msg).catch((err) =>
        log("error", `Unhandled message error: ${err}`),
      );
    }
  });

  sock.ev.on("messages.delete", async (item) => {
    if (!("keys" in item)) return;
    for (const key of item.keys) {
      if (!key.remoteJid?.endsWith("@g.us")) continue;
      await handleAntiDelete(sock, key.remoteJid, key.id ?? "").catch(() => {});
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    if (update.action === "add" || update.action === "remove") {
      const jids = update.participants.map((p) =>
        typeof p === "string" ? p : (p as { id: string }).id,
      );
      await handleWelcome(
        sock,
        update.id,
        jids,
        update.action as "add" | "remove",
      ).catch((err) => log("error", `Group event error: ${err}`));
    }
  });

  log("info", "Event listeners registered. Waiting for QR or session restore...");
}

export { startBot };
