import chalk from "chalk";
import figlet from "figlet";

export function printBanner(): void {
  const banner = figlet.textSync("Setto Bot", {
    font: "Big",
    horizontalLayout: "default",
  });

  console.log(chalk.cyan(banner));
  console.log(chalk.yellow("  ╔══════════════════════════════════════╗"));
  console.log(chalk.yellow("  ║") + chalk.white("   WhatsApp Bot by Setto Official     ") + chalk.yellow("║"));
  console.log(chalk.yellow("  ║") + chalk.gray("   Built with Baileys + Node.js        ") + chalk.yellow("║"));
  console.log(chalk.yellow("  ╚══════════════════════════════════════╝"));
  console.log();
}

export function log(level: "info" | "success" | "warn" | "error", msg: string): void {
  const time = new Date().toLocaleTimeString("id-ID", { hour12: false });
  const icons: Record<string, string> = {
    info: chalk.blue("[INFO]"),
    success: chalk.green("[✓]"),
    warn: chalk.yellow("[!]"),
    error: chalk.red("[✗]"),
  };
  console.log(`${chalk.gray(time)} ${icons[level]} ${msg}`);
}
