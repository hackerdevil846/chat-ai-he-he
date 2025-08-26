var data = ["https://i.imgur.com/XetbfAe.jpg", "https://i.imgur.com/4dwdpG9.jpg", "https://i.imgur.com/9My3K5w.jpg", "https://i.imgur.com/vK67ofl.jpg", "https://i.imgur.com/fGwlsFL.jpg"];
["https://i.imgur.com/a3JShJK.jpeg"];

const { commands } = global.GoatBot;
const ADMIN_UID = "61571630409265";
const IMAGE_URL = "https://files.catbox.moe/e7bozl.jpg";
const ITEMS_PER_PAGE = 10;

module.exports = {
  config: {
    name: "help",
    version: "1.3",
    author: "Asif",
    role: 0,
    category: "info",
    priority: 1,
  },

  onChat: async function ({ event, message }) {
    let text = (message.body || "").trim();
    if (!text) return;
    const parts = text.toLowerCase().split(/\s+/);
    const cmd = parts.shift();
    const args = parts;

    if (cmd !== "help" && cmd !== "menu") return;
    if (event.senderID !== ADMIN_UID) return;

    return this.onStart({ message, args, event, role: 2 });
  },

  onStart: async function ({ message, args, event, role }) {
    const top = "╭──═━┈ { ✧  I-AM-ATOMIC  ✧ } ┈━═──╮";
    const mid = "┃";
    const sep = "┠──────────────────────────────";
    const bottom = "╰──═━┈  [  𝐊 𝐍 𝐈 𝐆 𝐇 𝐓  ]  ┈━═──╯";

    const arg = args[0]?.toLowerCase();

    const categories = {};
    for (const [name, cmd] of commands.entries()) {
      if (cmd.config?.role <= role) {
        const cat = (cmd.config.category || "Uncategorized").trim().toUpperCase();
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
      }
    }

    if (!arg || /^\d+$/.test(arg)) {
      const page = arg ? Math.max(1, parseInt(arg)) : 1;
      const catNames = Object.keys(categories).sort((a, b) => a.localeCompare(b));
      const totalPages = Math.ceil(catNames.length / ITEMS_PER_PAGE);

      if (page > totalPages)
        return message.reply(`❌ Page ${page} does not exist. Total pages: ${totalPages}`);

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const selectedCats = catNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      let body = `${top}\n${mid} 📘 HELP MENU (Page ${page}/${totalPages})\n${sep}\n`;
      body += `${mid} 🔑 Prefix: -\n${mid} 📂 Total Commands: ${commands.size}\n${sep}\n`;

      selectedCats.forEach((cat) => {
        const cmds = categories[cat];
        body += `${mid} 📁 ${cat} [${cmds.length}]\n`;
        cmds.forEach((n) => {
          body += `${mid} ✦ ${n}\n`;
        });
        body += `${sep}\n`;
      });

      body += `${bottom}`;

      return message.reply({ body, attachment: await global.utils.getStreamFromURL(IMAGE_URL) });
    }

    if (arg.startsWith("-")) {
      const catName = arg.slice(1).toUpperCase();
      const cmdsInCat = [];

      for (const [name, cmd] of commands.entries()) {
        const cat = (cmd.config.category || "Uncategorized").trim().toUpperCase();
        if (cat === catName && cmd.config.role <= role) {
          cmdsInCat.push(`${mid} ✦ ${name}`);
        }
      }

      if (!cmdsInCat.length) {
        return message.reply(`❌ No commands found in category "${catName}"`);
      }

      return message.reply(
        `${top}\n${mid} 📁 CATEGORY: ${catName}\n${sep}\n` +
          `${cmdsInCat.join("\n")}\n${bottom}`
      );
    }

    const cmdObj = commands.get(arg) || commands.get(global.GoatBot.aliases.get(arg));
    if (!cmdObj || cmdObj.config.role > role) {
      return message.reply(`❌ Command "${arg}" not found or you don't have permission.`);
    }

    const cfg = cmdObj.config;
    const shortDesc = cfg.shortDescription?.en || "No short description.";
    const longDesc = cfg.longDescription?.en || "No detailed description.";
    const usage = cfg.guide?.en || "No usage provided.";

    const details =
      `${top}\n` +
      `${mid} 📌 COMMAND DETAILS\n${sep}\n` +
      `${mid} 📁 Category: ${cfg.category || "Uncategorized"}\n` +
      `${mid} 📄 Name: ${cfg.name}\n` +
      `${mid} 📜 Short: ${shortDesc}\n` +
      `${mid} 📖 Long:\n${mid} ${longDesc.replace(/\n/g, `\n${mid} `)}\n` +
      `${mid} 🧩 Usage: ${usage.replace(/{p}/g, "-").replace(/{n}/g, cfg.name)}\n` +
      `${mid} 👤 Author: ${cfg.author || "Unknown"}\n` +
      bottom;

    return message.reply(details);
  },
};
