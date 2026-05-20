import chalk from "chalk";
import figlet from "figlet";

export function printBanner() {
  const banner = figlet.textSync("Setto Bot", { font: "Big" });
  console.log(chalk.cyan(banner));
  console.log(chalk.yellow("  ╔══════════════════════════════════════╗"));
  console.log(chalk.yellow("  ║") + chalk.white("   WhatsApp Bot by Setto Official     ") + chalk.yellow("║"));
  console.log(chalk.yellow("  ║") + chalk.gray("   Prefix: .  |  Built with Baileys   ") + chalk.yellow("║"));
  console.log(chalk.yellow("  ╚══════════════════════════════════════╝"));
  console.log();
}

export function log(level, msg) {
  const time = new Date().toLocaleTimeString("id-ID", { hour12: false });
  const icons = {
    info:    chalk.blue("[INFO]"),
    success: chalk.green("[✓]"),
    warn:    chalk.yellow("[!]"),
    error:   chalk.red("[✗]"),
  };
  console.log(`${chalk.gray(time)} ${icons[level] ?? icons.info} ${msg}`);
}
