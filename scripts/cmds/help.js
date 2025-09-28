const { commands } = global.GoatBot;
const ADMIN_UID = "61571630409265";
const ITEMS_PER_PAGE = 10;

// Random image array from original version
const data = [
  "https://i.imgur.com/XetbfAe.jpg", 
  "https://i.imgur.com/4dwdpG9.jpg", 
  "https://i.imgur.com/9My3K5w.jpg", 
  "https://i.imgur.com/vK67ofl.jpg", 
  "https://i.imgur.com/fGwlsFL.jpg",
  "https://i.imgur.com/a3JShJK.jpeg"
];

module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "1.4",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑠ℎ𝑎𝑑𝑜𝑤 𝑔𝑎𝑟𝑑𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑎𝑛𝑑 𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒𝑠"
    },
    longDescription: {
      en: "𝑅𝑒𝑣𝑒𝑎𝑙𝑠 𝑡ℎ𝑒 𝑠𝑒𝑐𝑟𝑒𝑡 𝑎𝑟𝑠𝑒𝑛𝑎𝑙 𝑜𝑓 𝑠ℎ𝑎𝑑𝑜𝑤 𝑔𝑎𝑟𝑑𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑎𝑛𝑑 𝑡ℎ𝑒𝑖𝑟 ℎ𝑖𝑑𝑑𝑒𝑛 𝑝𝑜𝑤𝑒𝑟𝑠"
    },
    guide: {
      en: "{p}help\n{p}help [𝑝𝑎𝑔𝑒]\n{p}help -[𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑦]\n{p}help [𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒 𝑛𝑎𝑚𝑒]"
    }
  },

  onChat: async function ({ event, message }) {
    try {
      let text = (event.body || "").trim();
      if (!text) return;
      
      const parts = text.toLowerCase().split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);

      if (cmd !== "help" && cmd !== "menu" && cmd !== "h") return;
      
      // Check if user is admin or has permission
      let userRole = 0;
      if (event.senderID === ADMIN_UID) {
        userRole = 2; // Admin role
      }

      return this.onStart({ message, args, event, role: userRole });
    } catch (error) {
      console.error("𝐻𝑒𝑙𝑝 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
  },

  onStart: async function ({ message, args, event, role = 0 }) {
    try {
      // Validate global commands exists
      if (!commands || typeof commands !== 'object') {
        return message.reply("❌ 𝑆ℎ𝑎𝑑𝑜𝑤 𝑎𝑟𝑐ℎ𝑖𝑣𝑒𝑠 𝑎𝑟𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.");
      }

      const top = "╭──═━┈ { 🗡️  𝑻𝑯𝑬 𝑬𝑴𝑰𝑵𝑬𝑵𝑪𝑬 𝑰𝑵 𝑺𝑯𝑨𝑫𝑶𝑾  🗡️} ┈━═──╮";
      const mid = "┃";
      const sep = "┠──────────────────────────────";
      const bottom = "╰──═━┈  [  𝑺𝑯𝑨𝑫𝑶𝑾 𝑮𝑨𝑹𝑫𝑬𝑵 𝑨𝑹𝑪𝑯𝑰𝑽𝑬𝑺  ]  ┈━═──╯";

      const arg = args[0]?.toLowerCase();

      const categories = {};
      for (const [name, cmd] of commands.entries()) {
        if (cmd.config && cmd.config.role <= role) {
          const cat = (cmd.config.category || "Uncategorized").trim().toUpperCase();
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(name);
        }
      }

      // If no commands found
      if (Object.keys(categories).length === 0) {
        return message.reply("❌ 𝑁𝑜 𝑠ℎ𝑎𝑑𝑜𝑤 𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑟𝑎𝑛𝑘.");
      }

      if (!arg || /^\d+$/.test(arg)) {
        const page = arg ? Math.max(1, parseInt(arg)) : 1;
        const catNames = Object.keys(categories).sort((a, b) => a.localeCompare(b));
        const totalPages = Math.ceil(catNames.length / ITEMS_PER_PAGE);

        if (page > totalPages) {
          return message.reply(`❌ 𝑆ℎ𝑎𝑑𝑜𝑤 𝑝𝑎𝑔𝑒 ${page} 𝑑𝑜𝑒𝑠 𝑛𝑜𝑡 𝑒𝑥𝑖𝑠𝑡. 𝑇𝑜𝑡𝑎𝑙 𝑠𝑐𝑟𝑜𝑙𝑙𝑠: ${totalPages}`);
        }

        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const selectedCats = catNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        // Use random image from original data array
        const randomImage = data[Math.floor(Math.random() * data.length)];

        let body = `${top}\n${mid} 📜 𝑺𝑯𝑨𝑫𝑶𝑾 𝑨𝑹𝑪𝑯𝑰𝑽𝑬𝑺 (𝑆𝑐𝑟𝑜𝑙𝑙 ${page}/${totalPages})\n${sep}\n`;
        body += `${mid} 🗝️  𝑺𝒉𝒂𝒅𝒐𝒘 𝑺𝒊𝒈𝒏: -\n${mid} ⚔️  𝑻𝒐𝒕𝒂𝒍 𝑻𝒆𝒄𝒉𝒏𝒊𝒒𝒖𝒆𝒔: ${commands.size}\n${sep}\n`;

        selectedCats.forEach((cat) => {
          const cmds = categories[cat];
          body += `${mid} 🏛️  ${cat} [${cmds.length}]\n`;
          // Limit commands per category for better display
          cmds.slice(0, 15).forEach((n) => {
            body += `${mid} ✦ ${n}\n`;
          });
          if (cmds.length > 15) {
            body += `${mid} ... 𝑎𝑛𝑑 ${cmds.length - 15} 𝑚𝑜𝑟𝑒\n`;
          }
          body += `${sep}\n`;
        });

        body += `${mid} 💀 "𝑰 𝒂𝒎 𝒂𝒕𝒐𝒎𝒊𝒄..."\n`;
        body += `${bottom}`;

        try {
          const imageStream = await global.utils.getStreamFromURL(randomImage);
          return message.reply({ 
            body, 
            attachment: imageStream 
          });
        } catch (imageError) {
          // If image fails, send text only
          return message.reply(body);
        }
      }

      if (arg.startsWith("-")) {
        const catName = arg.slice(1).toUpperCase();
        const cmdsInCat = [];

        for (const [name, cmd] of commands.entries()) {
          if (cmd.config) {
            const cat = (cmd.config.category || "Uncategorized").trim().toUpperCase();
            if (cat === catName && cmd.config.role <= role) {
              cmdsInCat.push(`${mid} ✦ ${name}`);
            }
          }
        }

        if (!cmdsInCat.length) {
          return message.reply(`❌ 𝑁𝑜 𝑠ℎ𝑎𝑑𝑜𝑤 𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑎𝑟𝑐ℎ𝑖𝑣𝑒 "${catName}"`);
        }

        return message.reply(
          `${top}\n${mid} 🏛️  𝑺𝑯𝑨𝑫𝑶𝑾 𝑨𝑹𝑪𝑯𝑰𝑽𝑬: ${catName}\n${sep}\n` +
          `${cmdsInCat.join("\n")}\n${sep}\n` +
          `${mid} 🌑 "𝑃𝑜𝑤𝑒𝑟 𝑖𝑠 𝑒𝑣𝑒𝑟𝑦𝑡ℎ𝑖𝑛𝑔..."\n` +
          bottom
        );
      }

      const cmdObj = commands.get(arg) || (global.GoatBot.aliases && global.GoatBot.aliases.get(arg) ? commands.get(global.GoatBot.aliases.get(arg)) : null);
      
      if (!cmdObj || !cmdObj.config || cmdObj.config.role > role) {
        return message.reply(`❌ 𝑆ℎ𝑎𝑑𝑜𝑤 𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒 "${arg}" 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑜𝑟 𝑦𝑜𝑢 𝑙𝑎𝑐𝑘 𝑡ℎ𝑒 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑎𝑟𝑘𝑛𝑒𝑠𝑠.`);
      }

      const cfg = cmdObj.config;
      const shortDesc = cfg.shortDescription?.en || "𝑁𝑜 𝑠ℎ𝑎𝑑𝑜𝑤 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛 𝑟𝑒𝑐𝑜𝑟𝑑𝑒𝑑.";
      const longDesc = cfg.longDescription?.en || "𝑇ℎ𝑒 𝑡𝑟𝑢𝑒 𝑛𝑎𝑡𝑢𝑟𝑒 𝑜𝑓 𝑡ℎ𝑖𝑠 𝑡𝑒𝑐ℎ𝑛𝑖𝑞𝑢𝑒 𝑟𝑒𝑚𝑎𝑖𝑛𝑠 ℎ𝑖𝑑𝑑𝑒𝑛 𝑖𝑛 𝑠ℎ𝑎𝑑𝑜𝑤𝑠.";
      const usage = cfg.guide?.en || "𝑁𝑜 𝑖𝑛𝑐𝑎𝑛𝑡𝑎𝑡𝑖𝑜𝑛 𝑓𝑜𝑟𝑚𝑢𝑙𝑎 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.";

      // Format long description to fit in box
      const formattedLongDesc = longDesc.replace(/\n/g, `\n${mid} `);
      
      // Format usage properly
      const formattedUsage = usage
        .replace(/{p}/g, global.GoatBot.config.prefix || "-")
        .replace(/{n}/g, cfg.name);

      const details =
        `${top}\n` +
        `${mid} 🔮 𝑺𝑯𝑨𝑫𝑶𝑾 𝑻𝑬𝑪𝑯𝑵𝑰𝑸𝑼𝑬 𝑫𝑬𝑻𝑨𝑰𝑳𝑺\n${sep}\n` +
        `${mid} 🏛️  𝑨𝒓𝒄𝒉𝒊𝒗𝒆: ${cfg.category || "Uncategorized"}\n` +
        `${mid} 📜 𝑻𝒆𝒄𝒉𝒏𝒊𝒒𝒖𝒆: ${cfg.name}\n` +
        `${mid} ⚡ 𝑺𝒉𝒐𝒓𝒕: ${shortDesc}\n` +
        `${mid} 📖 𝑫𝒆𝒆𝒑 𝑲𝒏𝒐𝒘𝒍𝒆𝒅𝒈𝒆:\n${mid} ${formattedLongDesc}\n` +
        `${mid} 🧪 𝑰𝒏𝒄𝒂𝒏𝒕𝒂𝒕𝒊𝒐𝒏: ${formattedUsage}\n` +
        `${mid} 👤 𝑺𝒉𝒂𝒅𝒐𝒘 𝑾𝒆𝒊𝒍𝒅𝒆𝒓: ${cfg.author || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐸𝑚𝑖𝑛𝑒𝑛𝑐𝑒"}\n` +
        `${sep}\n` +
        `${mid} 🌑 "𝐼 𝑎𝑚 𝑎𝑡𝑜𝑚𝑖𝑐..."\n` +
        bottom;

      return message.reply(details);
    } catch (error) {
      console.error("𝑆ℎ𝑎𝑑𝑜𝑤 𝐴𝑟𝑐ℎ𝑖𝑣𝑒𝑠 𝐸𝑟𝑟𝑜𝑟:", error);
      await message.reply("❌ 𝑇ℎ𝑒 𝑠ℎ𝑎𝑑𝑜𝑤𝑠 𝑟𝑒𝑓𝑢𝑠𝑒 𝑡𝑜 𝑟𝑒𝑣𝑒𝑎𝑙 𝑡ℎ𝑒𝑖𝑟 𝑠𝑒𝑐𝑟𝑒𝑡𝑠. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
