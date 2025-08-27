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
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "info",
    priority: 1,
  },

  onChat: async function ({ event, message }) {
    let text = (event.body || "").trim();
    if (!text) return;
    const parts = text.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    if (cmd !== "help" && cmd !== "menu") return;
    if (event.senderID !== ADMIN_UID) return;

    return this.onStart({ message, args, event, role: 2 });
  },

  onStart: async function ({ message, args, event, role }) {
    try {
      const top = "╭──═━┈ { ✧  𝑰-𝑨𝑴-𝑨𝑻𝑶𝑴𝑰𝑪  ✧ } ┈━═──╮";
      const mid = "┃";
      const sep = "┠──────────────────────────────";
      const bottom = "╰──═━┈  [  𝑲 𝑵 𝑰 𝑮 𝑯 𝑻  ]  ┈━═──╯";

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

        let body = `${top}\n${mid} 📘 𝑯𝑬𝑳𝑷 𝑴𝑬𝑵𝑼 (Page ${page}/${totalPages})\n${sep}\n`;
        body += `${mid} 🔑 𝑷𝒓𝒆𝒇𝒊𝒙: -\n${mid} 📂 𝑻𝒐𝒕𝒂𝒍 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔: ${commands.size}\n${sep}\n`;

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
          `${top}\n${mid} 📁 𝑪𝑨𝑻𝑬𝑮𝑶𝑹𝒀: ${catName}\n${sep}\n` +
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
        `${mid} 📌 𝑪𝑶𝑴𝑴𝑨𝑵𝑫 𝑫𝑬𝑻𝑨𝑰𝑳𝑺\n${sep}\n` +
        `${mid} 📁 𝑪𝒂𝒕𝒆𝒈𝒐𝒓𝒚: ${cfg.category || "Uncategorized"}\n` +
        `${mid} 📄 𝑵𝒂𝒎𝒆: ${cfg.name}\n` +
        `${mid} 📜 𝑺𝒉𝒐𝒓𝒕: ${shortDesc}\n` +
        `${mid} 📖 𝑳𝒐𝒏𝒈:\n${mid} ${longDesc.replace(/\n/g, `\n${mid} `)}\n` +
        `${mid} 🧩 𝑼𝒔𝒂𝒈𝒆: ${usage.replace(/{p}/g, "-").replace(/{n}/g, cfg.name)}\n` +
        `${mid} 👤 𝑨𝒖𝒕𝒉𝒐𝒓: ${cfg.author || "Unknown"}\n` +
        bottom;

      return message.reply(details);
    } catch (error) {
      console.error("Help Command Error:", error);
      await message.reply("❌ An error occurred while processing your request.");
    }
  },
};
