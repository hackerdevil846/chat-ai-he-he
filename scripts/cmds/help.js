const { commands } = global.GoatBot;

const ADMIN_UID = "61571630409265";
const IMAGE_URL = "https://files.catbox.moe/e7bozl.jpg";
const ITEMS_PER_PAGE = 10;

module.exports = {
  config: {
    name: "help",
    version: "1.4",
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
    // Knight theme design elements
    const top = "╭──═━┈ { ✧  I-AM-ATOMIC  ✧ } ┈━═──╮";
    const sep = "┠──────────────────────────────";
    const bottom = "╰──═━┈  [  𝐊 𝐍 𝐈 𝐆 𝐇 𝐓  ]  ┈━═──╯";
    const mid = "┃";
    const section = "┠━─⊰ ✦ ⊱─━";

    const arg = args[0]?.toLowerCase();

    // Group commands
    const categories = {};
    for (const [name, cmd] of commands.entries()) {
      if (cmd.config?.role <= role) {
        const cat = (cmd.config.category || "Uncategorized").trim().toUpperCase();
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
      }
    }

    // Pagination view
    if (!arg || /^\d+$/.test(arg)) {
      const page = arg ? Math.max(1, parseInt(arg)) : 1;
      const catNames = Object.keys(categories).sort((a, b) => a.localeCompare(b));
      const totalPages = Math.ceil(catNames.length / ITEMS_PER_PAGE);

      if (page > totalPages)
        return message.reply(`❌ Invalid page! Only ${totalPages} pages available`);

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const selectedCats = catNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      let body = `${top}\n`;
      body += `${mid} 🔰 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 » [${page}/${totalPages}]\n`;
      body += `${mid} ═══════════════════\n`;
      body += `${mid} ➠ Prefix: -\n`;
      body += `${mid} ➠ Commands: ${commands.size}\n`;
      body += `${sep}\n`;

      selectedCats.forEach((cat) => {
        const cmds = categories[cat];
        body += `${section}\n`;
        body += `${mid} ❯ ${cat} [${cmds.length}]\n`;
        body += `${mid} ╰──────────────\n`;
        
        // Split commands into chunks of 3 for better layout
        const chunkSize = 3;
        for (let i = 0; i < cmds.length; i += chunkSize) {
          const chunk = cmds.slice(i, i + chunkSize);
          const cmdLine = chunk.map(cmd => `✦ ${cmd}`).join("  •  ");
          body += `${mid}  ${cmdLine}\n`;
        }
      });

      body += `${sep}\n`;
      body += `${mid} 🌐 » Type "help -[category]"\n`;
      body += `${mid} 🔍 » Example: help -utility\n`;
      body += `${bottom}`;

      return message.reply({ 
        body, 
        attachment: await global.utils.getStreamFromURL(IMAGE_URL)
      });
    }

    // Category view
    if (arg.startsWith("-")) {
      const catName = arg.slice(1).toUpperCase();
      const cmdsInCat = [];

      for (const [name, cmd] of commands.entries()) {
        const cat = (cmd.config.category || "Uncategorized").trim().toUpperCase();
        if (cat === catName && cmd.config.role <= role) {
          cmdsInCat.push(name);
        }
      }

      if (!cmdsInCat.length) {
        return message.reply(`❌ No commands in "${catName}" category`);
      }

      let body = `${top}\n`;
      body += `${mid} 🗂️ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬 » ${catName}\n`;
      body += `${mid} ═══════════════════\n`;
      body += `${mid} ➠ Commands: ${cmdsInCat.length}\n`;
      body += `${sep}\n`;
      
      // Display in 3-column format
      const chunkSize = 3;
      for (let i = 0; i < cmdsInCat.length; i += chunkSize) {
        const chunk = cmdsInCat.slice(i, i + chunkSize);
        const cmdLine = chunk.map(cmd => `✦ ${cmd}`).join("  •  ");
        body += `${mid} ${cmdLine}\n`;
      }
      
      body += `${sep}\n`;
      body += `${mid} 🌐 » Type "help [command]" for details\n`;
      body += `${bottom}`;

      return message.reply(body);
    }

    // Single command view
    const cmdObj = commands.get(arg) || commands.get(global.GoatBot.aliases.get(arg));
    if (!cmdObj || cmdObj.config.role > role) {
      return message.reply(`❌ Command "${arg}" not available`);
    }

    const cfg = cmdObj.config;
    const shortDesc = cfg.shortDescription?.en || "No description";
    const longDesc = cfg.longDescription?.en || "No details available";
    const usage = cfg.guide?.en || "No usage provided";

    const details = 
      `${top}\n` +
      `${mid} 🛡️ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 » ${cfg.name.toUpperCase()}\n` +
      `${mid} ═══════════════════\n` +
      `${mid} ➠ Category: ${cfg.category || "General"}\n` +
      `${mid} ➠ Version: v${cfg.version}\n` +
      `${sep}\n` +
      `${mid} 📝 Description:\n` +
      `${mid}   ${shortDesc}\n\n` +
      `${mid} 📖 Details:\n` +
      `${mid}   ${longDesc.replace(/\n/g, `\n${mid}   `)}\n` +
      `${sep}\n` +
      `${mid} 🧩 Usage:\n` +
      `${mid}   ${usage.replace(/{p}/g, "-").replace(/{n}/g, cfg.name)}\n` +
      `${sep}\n` +
      `${mid} 👤 Author: ${cfg.author || "Anonymous"}\n` +
      `${bottom}`;

    return message.reply(details);
  },
};
