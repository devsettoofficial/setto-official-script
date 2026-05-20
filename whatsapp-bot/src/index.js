import http from "http";
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import { printBanner, log } from "./lib/banner.js";
import { config } from "./lib/config.js";
import { handleMessage } from "./handler.js";
import {
  cacheMessage,
  handleWelcome,
  handleAntiDelete,
} from "./lib/features.js";

// ─── Bot status (updated by connection events) ──────────────────────────────
const botStatus = { connected: false, user: null, startedAt: new Date().toISOString() };

// ─── Status HTTP server (required so the run button works on Replit) ─────────
const PORT = process.env.PORT ?? 8080;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    bot: config.botName,
    author: "Setto Official",
    status: botStatus.connected ? "connected" : "waiting_for_qr",
    user: botStatus.user,
    prefix: config.prefix,
    uptime: process.uptime().toFixed(0) + "s",
    startedAt: botStatus.startedAt,
  }));
});
server.listen(PORT, () => log("info", `Status server running on port ${PORT}`));

// ─── Bot core ────────────────────────────────────────────────────────────────
async function startBot() {
  printBanner();
  log("info", "Starting WhatsApp bot...");

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  log("info", `Baileys version: ${version.join(".")}`);

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, console),
    },
    printQRInTerminal: false,
    browser: ["Setto Bot", "Chrome", "1.0.0"],
    syncFullHistory: false,
  });

  // ─── Connection Events ─────────────────────────────────────────────────
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      log("info", "Scan the QR code below with WhatsApp:");
      console.log();
      qrcode.generate(qr, { small: true });
      console.log();
    }

    if (connection === "close") {
      const code = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      botStatus.connected = false;

      if (shouldReconnect) {
        log("warn", `Connection closed (code ${code}). Reconnecting...`);
        startBot();
      } else {
        log("error", "Logged out! Delete the 'sessions' folder and restart.");
        process.exit(1);
      }
    }

    if (connection === "open") {
      botStatus.connected = true;
      botStatus.user = sock.user?.name ?? sock.user?.id ?? "Unknown";
      log("success", `Bot connected! Logged in as: ${botStatus.user}`);
      log("success", `Prefix: "${config.prefix}"  |  Bot: ${config.botName}`);
      log("success", "Ready to receive commands.");
    }
  });

  // ─── Save session ──────────────────────────────────────────────────────
  sock.ev.on("creds.update", saveCreds);

  // ─── Incoming messages ─────────────────────────────────────────────────
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      if (!msg.message) continue;
      cacheMessage(msg.key.id ?? "", msg.key.remoteJid ?? "", msg.message);
      await handleMessage(sock, msg).catch((err) =>
        log("error", `Message handler error: ${err.message}`)
      );
    }
  });

  // ─── Anti-delete ───────────────────────────────────────────────────────
  sock.ev.on("messages.delete", async (item) => {
    if (!("keys" in item)) return;
    for (const key of item.keys) {
      if (!key.remoteJid?.endsWith("@g.us")) continue;
      await handleAntiDelete(sock, key.remoteJid, key.id ?? "").catch(() => {});
    }
  });

  // ─── Welcome / goodbye ─────────────────────────────────────────────────
  sock.ev.on("group-participants.update", async (update) => {
    if (update.action !== "add" && update.action !== "remove") return;
    const jids = update.participants.map((p) =>
      typeof p === "string" ? p : p.id
    );
    await handleWelcome(sock, update.id, jids, update.action).catch((err) =>
      log("error", `Group event error: ${err.message}`)
    );
  });

  log("info", "All event listeners registered. Waiting for QR or session...");
}

startBot().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
