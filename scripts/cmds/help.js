const { commands } = global.GoatBot;
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
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: "𝖣𝗂𝗌𝗉𝗅𝖺𝗒𝗌 𝖺𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌"
    },
    longDescription: {
      en: "𝖲𝗁𝗈𝗐𝗌 𝖺𝗅𝗅 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝗐𝗂𝗍𝗁 𝖽𝖾𝗍𝖺𝗂𝗅𝗌 𝖺𝗇𝖽 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝖾𝗌"
    },
    guide: {
      en: "{p}help\n{p}help [𝗉𝖺𝗀𝖾]\n{p}help -[𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗒]\n{p}help [𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗇𝖺𝗆𝖾]"
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
      
      // Everyone has role 0 (user) - no admin restrictions
      return this.onStart({ message, args, event, role: 0 });
    } catch (error) {
      console.error("𝖧𝖾𝗅𝗉 𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
    }
  },

  onStart: async function ({ message, args, event, role = 0 }) {
    try {
      // Validate global commands exists
      if (!commands || typeof commands !== 'object') {
        return message.reply("❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖺𝗋𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾.");
      }

      const top = "╭──═━┈ { 📖 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖫𝖨𝖲𝖳 📖 } ┈━═──╮";
      const mid = "┃";
      const sep = "┠──────────────────────────────";
      const bottom = "╰──═━┈  [ 𝖡𝖮𝖳 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲 ]  ┈━═──╯";

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
        return message.reply("❌ 𝖭𝗈 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖿𝗈𝗋 𝗒𝗈𝗎.");
      }

      if (!arg || /^\d+$/.test(arg)) {
        const page = arg ? Math.max(1, parseInt(arg)) : 1;
        const catNames = Object.keys(categories).sort((a, b) => a.localeCompare(b));
        const totalPages = Math.ceil(catNames.length / ITEMS_PER_PAGE);

        if (page > totalPages) {
          return message.reply(`❌ 𝖯𝖺𝗀𝖾 ${page} 𝖽𝗈𝖾𝗌 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍. 𝖳𝗈𝗍𝖺𝗅 𝗉𝖺𝗀𝖾𝗌: ${totalPages}`);
        }

        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const selectedCats = catNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        // Use random image from original data array
        const randomImage = data[Math.floor(Math.random() * data.length)];

        let body = `${top}\n${mid} 📜 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖫𝖨𝖲𝖳 (𝖯𝖺𝗀𝖾 ${page}/${totalPages})\n${sep}\n`;
        body += `${mid} 🔑 𝖯𝗋𝖾𝖿𝗂𝗑: ${global.GoatBot.config.prefix || "-"}\n${mid} 📊 𝖳𝗈𝗍𝖺𝗅 𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌: ${commands.size}\n${sep}\n`;

        selectedCats.forEach((cat) => {
          const cmds = categories[cat];
          body += `${mid} 📁 ${cat} [${cmds.length}]\n`;
          // Limit commands per category for better display
          cmds.slice(0, 15).forEach((n) => {
            body += `${mid} ✦ ${n}\n`;
          });
          if (cmds.length > 15) {
            body += `${mid} ... 𝖺𝗇𝖽 ${cmds.length - 15} 𝗆𝗈𝗋𝖾\n`;
          }
          body += `${sep}\n`;
        });

        body += `${mid} 💡 "𝖳𝗒𝗉𝖾 ${global.GoatBot.config.prefix}help [𝖼𝗈𝗆𝗆𝖺𝗇𝖽] 𝖿𝗈𝗋 𝖽𝖾𝗍𝖺𝗂𝗅𝗌"\n`;
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
          return message.reply(`❌ 𝖭𝗈 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗒 "${catName}"`);
        }

        return message.reply(
          `${top}\n${mid} 📁 𝖢𝖠𝖳𝖤𝖦𝖮𝖱𝖸: ${catName}\n${sep}\n` +
          `${cmdsInCat.join("\n")}\n${sep}\n` +
          `${mid} 📊 𝖳𝗈𝗍𝖺𝗅: ${cmdsInCat.length} 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌\n` +
          bottom
        );
      }

      const cmdObj = commands.get(arg) || (global.GoatBot.aliases && global.GoatBot.aliases.get(arg) ? commands.get(global.GoatBot.aliases.get(arg)) : null);
      
      if (!cmdObj || !cmdObj.config || cmdObj.config.role > role) {
        return message.reply(`❌ 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 "${arg}" 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗈𝗋 𝗒𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖺𝖼𝖼𝖾𝗌𝗌.`);
      }

      const cfg = cmdObj.config;
      const shortDesc = cfg.shortDescription?.en || "𝖭𝗈 𝖽𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾.";
      const longDesc = cfg.longDescription?.en || "𝖭𝗈 𝖽𝖾𝗍𝖺𝗂𝗅𝖾𝖽 𝖽𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾.";
      const usage = cfg.guide?.en || "𝖭𝗈 𝗎𝗌𝖺𝗀𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾.";

      // Format long description to fit in box
      const formattedLongDesc = longDesc.replace(/\n/g, `\n${mid} `);
      
      // Format usage properly
      const formattedUsage = usage
        .replace(/{p}/g, global.GoatBot.config.prefix || "-")
        .replace(/{n}/g, cfg.name);

      const details =
        `${top}\n` +
        `${mid} 📖 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖣𝖤𝖳𝖠𝖨𝖫𝖲\n${sep}\n` +
        `${mid} 📁 𝖢𝖺𝗍𝖾𝗀𝗈𝗋𝗒: ${cfg.category || "Uncategorized"}\n` +
        `${mid} 📝 𝖭𝖺𝗆𝖾: ${cfg.name}\n` +
        `${mid} ⚡ 𝖲𝗁𝗈𝗋𝗍: ${shortDesc}\n` +
        `${mid} 📋 𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇:\n${mid} ${formattedLongDesc}\n` +
        `${mid} 🎯 𝖴𝗌𝖺𝗀𝖾: ${formattedUsage}\n` +
        `${mid} 👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${cfg.author || "Unknown"}\n` +
        `${mid} ⏱️ 𝖢𝗈𝗎𝗇𝗍𝖣𝗈𝗐𝗇: ${cfg.countDown || 5}𝗌\n` +
        `${sep}\n` +
        `${mid} 💡 "𝖳𝗒𝗉𝖾 ${global.GoatBot.config.prefix}help 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌"\n` +
        bottom;

      return message.reply(details);
    } catch (error) {
      console.error("𝖧𝖾𝗅𝗉 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
      await message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
    }
  }
};
