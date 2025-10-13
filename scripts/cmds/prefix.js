const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "prefix",
    aliases: [],
    version: "1.8",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    description: "𝖡𝗈𝗍𝖾𝗋 𝗉𝗋𝖾𝖿𝗂𝗑 𝗉𝖺𝗋𝗂𝖻𝖺𝗋𝗍𝖺𝗇 𝗄𝗈𝗋𝗎𝗇 𝗌𝗎𝗇𝖽𝗈𝗋 𝖽𝖾𝗌𝗂𝗀𝗇",
    category: "⚙️ 𝖢𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇",
    guide: {
      en: `
╭───────『 ✧  𝖯𝖱𝖤𝖥𝖨𝖷 𝖦𝖴𝖨𝖣𝖤  ✧ 』───────╮
│
│ ✦ {𝗉} <𝗇𝖾𝗐 𝗉𝗋𝖾𝖿𝗂𝗑>
│     𝖤𝗂 𝖼𝗁𝖺𝗍 𝖾𝗋 𝗃𝗈𝗇𝗇𝗈 𝗉𝗋𝖾𝖿𝗂𝗑 𝗌𝖾𝗍 𝗄𝗈𝗋𝗎𝗇
│     𝖴𝖽𝖺𝗁𝖺𝗋𝖺𝗇: {𝗉} $
│
│ ✦ {𝗉} <𝗇𝖾𝗐 𝗉𝗋𝖾𝖿𝗂𝗑> -𝗀
│     𝖦𝗅𝗈𝖻𝖺𝗅 𝗉𝗋𝖾𝖿𝗂𝗑 𝗌𝖾𝗍 𝗄𝗈𝗋𝗎𝗇 (𝖠𝖽𝗆𝗂𝗇 𝖽𝖾𝗋 𝗃𝗈𝗇𝗇𝗈)
│     𝖴𝖽𝖺𝗁𝖺𝗋𝖺𝗇: {𝗉} $ -𝗀
│
│ ♻️ {𝗉} 𝗋𝖾𝗌𝖾𝗍
│     𝖣𝖾𝖿𝖺𝗎𝗅𝗍 𝗉𝗋𝖾𝖿𝗂𝗑 𝖾 𝗋𝖾𝗌𝖾𝗍 𝗄𝗈𝗋𝗎𝗇
│
╰───────────────────────╯`
    },
    dependencies: {
      "fs-extra": ""
    }
  },

  onStart: async function ({ message, event, args, threadsData, role, api }) {
    try {
      // Dependency check
      let fsAvailable = true;
      try {
        require("fs-extra");
      } catch (e) {
        fsAvailable = false;
      }

      if (!fsAvailable) {
        return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
      }

      const { threadID } = event;
      
      if (!args[0]) {
        return this.showPrefix(message, threadID, threadsData);
      }

      if (args[0] === "reset") {
        try {
          await threadsData.set(threadID, "", "data.prefix");
          console.log(`✅ 𝖯𝗋𝖾𝖿𝗂𝗑 𝗋𝖾𝗌𝖾𝗍 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
          return message.reply(this.getLang("reset", global.config.PREFIX));
        } catch (resetError) {
          console.error("𝖯𝗋𝖾𝖿𝗂𝗑 𝗋𝖾𝗌𝖾𝗍 𝖾𝗋𝗋𝗈𝗋:", resetError);
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝖾𝗍 𝗉𝗋𝖾𝖿𝗂𝗑. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }
      }

      const newPrefix = args[0].trim();
      const setGlobal = args[1] === "-g";

      // Validate prefix
      if (newPrefix.length > 5) {
        return message.reply("❌ 𝖯𝗋𝖾𝖿𝗂𝗑 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 5 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.");
      }

      if (newPrefix.includes(' ') || newPrefix.includes('\n')) {
        return message.reply("❌ 𝖯𝗋𝖾𝖿𝗂𝗑 𝖼𝖺𝗇𝗇𝗈𝗍 𝖼𝗈𝗇𝗍𝖺𝗂𝗇 𝗌𝗉𝖺𝖼𝖾𝗌 𝗈𝗋 𝗇𝖾𝗐 𝗅𝗂𝗇𝖾𝗌.");
      }

      if (setGlobal) {
        if (role < 2) {
          return message.reply(this.getLang("onlyAdmin"));
        }
        
        try {
          // Backup current config
          const configBackup = JSON.stringify(global.config, null, 2);
          
          // Update global config
          global.config.PREFIX = newPrefix;
          
          // Write to config file
          fs.writeFileSync(global.client.configPath, JSON.stringify(global.config, null, 2));
          
          // Verify the write was successful
          const verifyConfig = fs.readFileSync(global.client.configPath, 'utf8');
          const parsedConfig = JSON.parse(verifyConfig);
          
          if (parsedConfig.PREFIX !== newPrefix) {
            // Restore backup if write failed
            fs.writeFileSync(global.client.configPath, configBackup);
            throw new Error("𝖢𝗈𝗇𝖿𝗂𝗀 𝗐𝗋𝗂𝗍𝖾 𝗏𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽");
          }
          
          console.log(`✅ 𝖦𝗅𝗈𝖻𝖺𝗅 𝗉𝗋𝖾𝖿𝗂𝗑 𝗌𝖾𝗍 𝗍𝗈: ${newPrefix}`);
          return message.reply(this.getLang("successGlobal", newPrefix));
        } catch (globalError) {
          console.error("𝖦𝗅𝗈𝖻𝖺𝗅 𝗉𝗋𝖾𝖿𝗂𝗑 𝖾𝗋𝗋𝗈𝗋:", globalError);
          return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗀𝗅𝗈𝖻𝖺𝗅 𝗉𝗋𝖾𝖿𝗂𝗑. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }
      }

      try {
        await threadsData.set(threadID, newPrefix, "data.prefix");
        console.log(`✅ 𝖳𝗁𝗋𝖾𝖺𝖽 𝗉𝗋𝖾𝖿𝗂𝗑 𝗌𝖾𝗍 𝗍𝗈: ${newPrefix} 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
        return message.reply(this.getLang("successThisThread", newPrefix));
      } catch (threadError) {
        console.error("𝖳𝗁𝗋𝖾𝖺𝖽 𝗉𝗋𝖾𝖿𝗂𝗑 𝖾𝗋𝗋𝗈𝗋:", threadError);
        return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗉𝗋𝖾𝖿𝗂𝗑. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
      }
    } catch (error) {
      console.error("💥 𝖯𝗋𝖾𝖿𝗂𝗑 𝖤𝗋𝗋𝗈𝗋:", error);
      
      let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
      
      if (error.message.includes('threadsData')) {
        errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
      } else if (error.message.includes('permission')) {
        errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
      }
      
      await message.reply(errorMessage);
    }
  },

  onChat: async function ({ event, message, threadsData }) {
    try {
      if (event.body && event.body.toLowerCase() === "prefix") {
        await this.showPrefix(message, event.threadID, threadsData);
      }
    } catch (error) {
      console.error("💥 𝖯𝗋𝖾𝖿𝗂𝗑 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
      // Silent fail to avoid spam
    }
  },

  showPrefix: async function (message, threadID, threadsData) {
    try {
      const globalPrefix = global.config.PREFIX;
      let threadPrefix;
      
      try {
        threadPrefix = await threadsData.get(threadID, "data.prefix") || globalPrefix;
      } catch (dataError) {
        console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗉𝗋𝖾𝖿𝗂𝗑:", dataError);
        threadPrefix = globalPrefix;
      }

      try {
        const imageStream = await global.utils.getStreamFromURL("https://files.catbox.moe/e7bozl.jpg");
        await message.reply({
          body: this.getLang("myPrefix", globalPrefix, threadPrefix),
          attachment: imageStream
        });
      } catch (imageError) {
        // If image fails, send text only
        console.warn("𝖨𝗆𝖺𝗀𝖾 𝗅𝗈𝖺𝖽 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝗍𝖾𝗑𝗍 𝗈𝗇𝗅𝗒:", imageError);
        await message.reply(this.getLang("myPrefix", globalPrefix, threadPrefix));
      }
    } catch (error) {
      console.error("💥 𝖲𝗁𝗈𝗐 𝖯𝗋𝖾𝖿𝗂𝗑 𝖤𝗋𝗋𝗈𝗋:", error);
      // Silent fail to avoid spam
    }
  },

  getLang: function (key, ...values) {
    const lang = {
      reset: 
`╭───────『 ✧  𝖯𝖱𝖤𝖥𝖨𝖷 𝖱𝖤𝖲𝖤𝖳  ✧ 』───────╮
│
│ ✅ » 𝖣𝖾𝖿𝖺𝗎𝗅𝗍 𝖾 𝗋𝖾𝗌𝖾𝗍 𝗄𝗈𝗋𝖺 𝗁𝗈𝗅𝗈: %1
│
╰───────────────────────╯`,
      onlyAdmin: 
`╭───────『 ✧  𝖯𝖤𝖱𝖬𝖨𝖲𝖲𝖨𝖮𝖭  ✧ 』───────╮
│
│ ⛔ » 𝖲𝗎𝖽𝗁𝗎 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇𝗋𝖺 𝗀𝗅𝗈𝖻𝖺𝗅 𝗉𝗋𝖾𝖿𝗂𝗑 𝗉𝖺𝗋𝗂𝖻𝖺𝗋𝗍𝖺𝗇 𝗄𝗈𝗋𝗍𝖾 𝗉𝖺𝗋𝖻𝖾𝗇!
│
╰───────────────────────╯`,
      successGlobal: 
`╭───────『 ✧  𝖲𝖴𝖢𝖢𝖤𝖲𝖲  ✧ 』───────╮
│
│ ✅ » 𝖦𝗅𝗈𝖻𝖺𝗅 𝗉𝗋𝖾𝖿𝗂𝗑: %1
│
╰───────────────────────╯`,
      successThisThread: 
`╭───────『 ✧  𝖲𝖴𝖢𝖢𝖤𝖲𝖲  ✧ 』───────╮
│
│ ✅ » 𝖢𝗁𝖺𝗍 𝗉𝗋𝖾𝖿𝗂𝗑: %1
│
╰───────────────────────╯`,
      myPrefix: 
`╭───────『 ✧  𝖠𝗍𝗈𝗆𝗂𝖼𝖡𝗈𝗍  ✧ 』───────╮
│
│ ✨ 𝖠𝖲𝖲𝖠𝖫𝖠𝖬𝖴𝖠𝖫𝖠𝖨𝖪𝖴𝖬 ✨
│
│ ❄️ » 𝖲𝗒𝗌𝗍𝖾𝗆 𝖯𝗋𝖾𝖿𝗂𝗑: 【%1】
│ 💬 » 𝖢𝗁𝖺𝗍 𝖯𝗋𝖾𝖿𝗂𝗑: 【%2】
│
│ 📜 » 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖽𝖾𝗄𝗁𝗍𝖾 『%2𝗁𝖾𝗅𝗉』 𝗅𝗂𝗄𝗁𝗎𝗇
│
│ 🌟 » 𝖮𝗐𝗇𝖾𝗋: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽
│
╰───────────────────────╯`
    };

    return lang[key].replace(/%(\d+)/g, (_, index) => values[parseInt(index) - 1]);
  }
};
