const axios = require("axios");
const fs = require("fs-extra");
const execSync = require("child_process").execSync;
const dirBootLogTemp = `${__dirname}/tmp/rebootUpdated.txt`;

module.exports = {
  config: {
    name: "update",
    aliases: ["upgrade", "gitpull"],
    version: "1.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 2,
    category: "system",
    shortDescription: {
      en: "🔄 𝐶ℎ𝑒𝑐𝑘 𝑓𝑜𝑟 𝑎𝑛𝑑 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑢𝑝𝑑𝑎𝑡𝑒𝑠 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡𝑏𝑜𝑡"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑐ℎ𝑒𝑐𝑘 𝑓𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑒𝑠 𝑎𝑛𝑑 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑡ℎ𝑒 𝑙𝑎𝑡𝑒𝑠𝑡 𝑣𝑒𝑟𝑠𝑖𝑜𝑛 𝑓𝑟𝑜𝑚 𝐺𝑖𝑡𝐻𝑢𝑏"
    },
    guide: {
      en: "{p}update"
    },
    countDown: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  langs: {
    "en": {
      "noUpdates": "✅ | 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑙𝑎𝑡𝑒𝑠𝑡 𝑣𝑒𝑟𝑠𝑖𝑜𝑛 𝑜𝑓 𝑡ℎ𝑒 𝑏𝑜𝑡 (𝑣%1).",
      "updatePrompt": "💫 | 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑢𝑠𝑖𝑛𝑔 𝑣𝑒𝑟𝑠𝑖𝑜𝑛 %1. 𝑇ℎ𝑒𝑟𝑒 𝑖𝑠 𝑎 𝑛𝑒𝑤 𝑣𝑒𝑟𝑠𝑖𝑜𝑛 %2. 𝐷𝑜 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑢𝑝𝑑𝑎𝑡𝑒?\n\n⬆️ | 𝑇ℎ𝑒 𝑓𝑜𝑙𝑙𝑜𝑤𝑖𝑛𝑔 𝑓𝑖𝑙𝑒𝑠 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑢𝑝𝑑𝑎𝑡𝑒𝑑:\n%3%4\n\nℹ️ | 𝑆𝑒𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑎𝑡 𝐺𝑖𝑡𝐻𝑢𝑏\n💡 | 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐𝑜𝑛𝑓𝑖𝑟𝑚.",
      "fileWillDelete": "\n🗑️ | 𝑇ℎ𝑒 𝑓𝑜𝑙𝑙𝑜𝑤𝑖𝑛𝑔 𝑓𝑖𝑙𝑒𝑠/𝑓𝑜𝑙𝑑𝑒𝑟𝑠 𝑤𝑖𝑙𝑙 𝑏𝑒 𝑑𝑒𝑙𝑒𝑡𝑒𝑑:\n%1",
      "andMore": " ...𝑎𝑛𝑑 %1 𝑚𝑜𝑟𝑒 𝑓𝑖𝑙𝑒𝑠",
      "updateConfirmed": "🚀 | 𝐶𝑜𝑛𝑓𝑖𝑟𝑚𝑒𝑑, 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔...",
      "updateComplete": "✅ | 𝑈𝑝𝑑𝑎𝑡𝑒 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒, 𝑑𝑜 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 𝑛𝑜𝑤? (𝑟𝑒𝑝𝑙𝑦 \"𝑦𝑒𝑠\" 𝑜𝑟 \"𝑦\")",
      "updateTooFast": "⭕ 𝑈𝑝𝑑𝑎𝑡𝑒 𝑡𝑜𝑜 𝑠𝑜𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 %1 𝑚𝑖𝑛𝑢𝑡𝑒𝑠 %2 𝑠𝑒𝑐𝑜𝑛𝑑𝑠.",
      "botWillRestart": "🔄 | 𝐵𝑜𝑡 𝑤𝑖𝑙𝑙 𝑟𝑒𝑠𝑡𝑎𝑟𝑡 𝑛𝑜𝑤!"
    }
  },

  onLoad: async function ({ api }) {
    if (fs.existsSync(dirBootLogTemp)) {
      const threadID = fs.readFileSync(dirBootLogTemp, "utf-8");
      fs.removeSync(dirBootLogTemp);
      api.sendMessage("✅ 𝐵𝑜𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑠𝑡𝑎𝑟𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦.", threadID);
    }
  },

  onStart: async function ({ message, getLang, event }) {
    try {
      const { data: pkg } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json");
      const version = pkg.version;
      const { data: versions } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/versions.json");

      const currentVersion = require("../../package.json").version;
      
      if (compareVersion(version, currentVersion) < 1) {
        return message.reply(getLang("noUpdates", currentVersion));
      }

      const idx = versions.findIndex(v => v.version == currentVersion);
      const newVersions = versions.slice(idx + 1);

      let fileWillUpdate = [...new Set(newVersions.map(v => Object.keys(v.files || {})).flat())]
        .sort()
        .filter(f => f?.length);
      
      const totalUpdate = fileWillUpdate.length;
      fileWillUpdate = fileWillUpdate
        .slice(0, 10)
        .map(file => ` - ${file}`).join("\n");

      let fileWillDelete = [...new Set(newVersions.map(v => Object.keys(v.deleteFiles || {})).flat())]
        .sort()
        .filter(f => f?.length);
      
      const totalDelete = fileWillDelete.length;
      fileWillDelete = fileWillDelete
        .slice(0, 10)
        .map(file => ` - ${file}`).join("\n");

      const msg = await message.reply(
        getLang(
          "updatePrompt",
          currentVersion,
          version,
          fileWillUpdate + (totalUpdate > 10 ? "\n" + getLang("andMore", totalUpdate - 10) : ""),
          totalDelete > 0 ? "\n" + getLang(
            "fileWillDelete",
            fileWillDelete + (totalDelete > 10 ? "\n" + getLang("andMore", totalDelete - 10) : "")
          ) : ""
        )
      );

      global.updateData = global.updateData || {};
      global.updateData[msg.messageID] = {
        threadID: event.threadID,
        authorID: event.senderID
      };

    } catch (e) {
      console.error("Update error:", e);
      return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑐ℎ𝑒𝑐𝑘𝑖𝑛𝑔 𝑓𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑒𝑠.");
    }
  },

  onReaction: async function ({ message, getLang, event }) {
    if (!global.updateData || !global.updateData[event.messageID]) return;
    
    const updateInfo = global.updateData[event.messageID];
    if (event.userID !== updateInfo.authorID) return;

    try {
      const { data: lastCommit } = await axios.get('https://api.github.com/repos/ntkhang03/Goat-Bot-V2/commits/main');
      const lastCommitDate = new Date(lastCommit.commit.committer.date);
      
      if (new Date().getTime() - lastCommitDate.getTime() < 5 * 60 * 1000) {
        const diff = new Date().getTime() - lastCommitDate.getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor(diff / 1000 % 60);
        const remaining = 5 * 60 * 1000 - diff;
        const minutesCooldown = Math.floor(remaining / 1000 / 60);
        const secondsCooldown = Math.floor(remaining / 1000 % 60);
        
        return message.reply(getLang("updateTooFast", minutesCooldown, secondsCooldown));
      }

      await message.reply(getLang("updateConfirmed"));
      
      execSync("node update", { stdio: "inherit" });
      fs.writeFileSync(dirBootLogTemp, event.threadID);

      const restartMsg = await message.reply(getLang("updateComplete"));
      
      global.restartData = global.restartData || {};
      global.restartData[restartMsg.messageID] = {
        threadID: event.threadID,
        authorID: event.senderID
      };

    } catch (e) {
      console.error("Update error:", e);
      return message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑢𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑏𝑜𝑡.");
    }
  },

  onReply: async function ({ message, getLang, event }) {
    if (!global.restartData) return;
    
    const replyMsgID = Object.keys(global.restartData).find(id => 
      global.restartData[id].threadID === event.threadID && 
      global.restartData[id].authorID === event.senderID
    );
    
    if (!replyMsgID) return;

    if (['yes', 'y'].includes(event.body?.toLowerCase())) {
      await message.reply(getLang("botWillRestart"));
      delete global.restartData[replyMsgID];
      process.exit(2);
    }
  }
};

function compareVersion(version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  for (let i = 0; i < 3; i++) {
    const n1 = parseInt(v1[i] || 0);
    const n2 = parseInt(v2[i] || 0);
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  return 0;
}
