const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "admin",
    version: "1.0.5",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑩𝒐𝒕 𝒌𝒆 𝑨𝒅𝒎𝒊𝒏 𝒎𝒂𝒏𝒂𝒈𝒆 𝒌𝒐𝒓𝒖𝒏"
    },
    longDescription: {
      en: "𝑴𝒂𝒏𝒂𝒈𝒆 𝒃𝒐𝒕 𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒕𝒐𝒓𝒔"
    },
    guide: {
      en: "{p}admin [list/add/remove] [userID]"
    },
    cooldowns: 5
  },

  langs: {
    en: {
      listAdmin: '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑨𝒅𝒎𝒊𝒏 𝒍𝒊𝒔𝒕: \n\n%1',
      notHavePermssion: '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑨𝒑𝒏𝒂𝒓 "%1" 𝒖𝒔𝒆 𝒌𝒐𝒓𝒂𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊 😿',
      addedNewAdmin: '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑨𝒅𝒅𝒆𝒅 %1 𝑨𝒅𝒎𝒊𝒏 :\n\n%2',
      removedAdmin: '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 %1 𝑨𝒅𝒎𝒊𝒏:\n\n%2'
    }
  },

  onStart: async function({ message, event, args, Users, getLang }) {
    try {
      const configPath = path.join(__dirname, '..', '..', 'config.json');
      
      // Load config safely
      let config = {};
      try {
        if (fs.existsSync(configPath)) {
          config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
      } catch (e) {
        console.error("Config load error:", e);
        return message.reply("❌ 𝑪𝒐𝒏𝒇𝒊𝒈 𝒇𝒊𝒍𝒆 𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓");
      }

      // Ensure ADMINBOT array exists
      if (!config.ADMINBOT) config.ADMINBOT = [];
      if (!global.config.ADMINBOT) global.config.ADMINBOT = [];

      const { mentions } = event;
      const mention = Object.keys(mentions);

      switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
          const listAdmin = config.ADMINBOT || [];
          const msg = [];

          for (const idAdmin of listAdmin) {
            if (idAdmin) {
              try {
                const userInfo = await Users.getData(idAdmin);
                const name = userInfo.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
                msg.push(`- ${name} (${idAdmin})`);
              } catch (error) {
                msg.push(`- 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓 (${idAdmin})`);
              }
            }
          }

          return message.reply(getLang("listAdmin", msg.join("\n") || "𝑵𝒐 𝒂𝒅𝒎𝒊𝒏𝒔 𝒇𝒐𝒖𝒏𝒅"));
        }

        case "add": {
          // Check if user is bot admin
          if (!config.ADMINBOT.includes(event.senderID.toString())) {
            return message.reply(getLang("notHavePermssion", "𝒂𝒅𝒅"));
          }

          if (mention.length > 0) {
            const listAdd = [];

            for (const id of mention) {
              if (!config.ADMINBOT.includes(id)) {
                config.ADMINBOT.push(id);
                global.config.ADMINBOT.push(id);
                const userName = mentions[id] || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
                listAdd.push(`[ ${id} ] » ${userName}`);
              }
            }

            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            return message.reply(getLang("addedNewAdmin", mention.length, listAdd.join("\n")));
          }
          else if (args[1] && !isNaN(args[1])) {
            const targetID = args[1];
            if (!config.ADMINBOT.includes(targetID)) {
              config.ADMINBOT.push(targetID);
              global.config.ADMINBOT.push(targetID);
              
              try {
                const userInfo = await Users.getData(targetID);
                const name = userInfo.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return message.reply(getLang("addedNewAdmin", 1, `[ ${targetID} ] » ${name}`));
              } catch (error) {
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return message.reply(getLang("addedNewAdmin", 1, `[ ${targetID} ] » 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓`));
              }
            } else {
              return message.reply("❌ 𝑼𝒔𝒆𝒓 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏");
            }
          }
          else {
            return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆. 𝑼𝒔𝒆: 𝒂𝒅𝒎𝒊𝒏 𝒂𝒅𝒅 [𝒖𝒔𝒆𝒓𝑰𝑫/@𝒕𝒂𝒈]");
          }
        }

        case "remove":
        case "rm":
        case "delete": {
          // Check if user is bot admin
          if (!config.ADMINBOT.includes(event.senderID.toString())) {
            return message.reply(getLang("notHavePermssion", "𝒅𝒆𝒍𝒆𝒕𝒆"));
          }
          
          if (mention.length > 0) {
            const listRemove = [];

            for (const id of mention) {
              const index = config.ADMINBOT.indexOf(id);
              if (index !== -1) {
                config.ADMINBOT.splice(index, 1);
                global.config.ADMINBOT.splice(index, 1);
                const userName = mentions[id] || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
                listRemove.push(`[ ${id} ] » ${userName}`);
              }
            }

            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            return message.reply(getLang("removedAdmin", mention.length, listRemove.join("\n")));
          }
          else if (args[1] && !isNaN(args[1])) {
            const targetID = args[1];
            const index = config.ADMINBOT.indexOf(targetID);
            if (index !== -1) {
              config.ADMINBOT.splice(index, 1);
              global.config.ADMINBOT.splice(index, 1);
              
              try {
                const userInfo = await Users.getData(targetID);
                const name = userInfo.name || "𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓";
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return message.reply(getLang("removedAdmin", 1, `[ ${targetID} ] » ${name}`));
              } catch (error) {
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return message.reply(getLang("removedAdmin", 1, `[ ${targetID} ] » 𝑼𝒏𝒌𝒏𝒐𝒘𝒏 𝑼𝒔𝒆𝒓`));
              }
            } else {
              return message.reply("❌ 𝑼𝒔𝒆𝒓 𝒊𝒔 𝒏𝒐𝒕 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏");
            }
          }
          else {
            return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆. 𝑼𝒔𝒆: 𝒂𝒅𝒎𝒊𝒏 𝒓𝒆𝒎𝒐𝒗𝒆 [𝒖𝒔𝒆𝒓𝑰𝑫/@𝒕𝒂𝒈]");
          }
        }

        default: {
          const helpMessage = `🤖 𝑨𝒅𝒎𝒊𝒏 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑯𝒆𝒍𝒑:
━━━━━━━━━━━━━━━━
📋 𝒂𝒅𝒎𝒊𝒏 𝒍𝒊𝒔𝒕 - 𝑺𝒉𝒐𝒘 𝒂𝒍𝒍 𝒂𝒅𝒎𝒊𝒏𝒔
👥 𝒂𝒅𝒎𝒊𝒏 𝒂𝒅𝒅 [@𝒕𝒂𝒈/𝑰𝑫] - 𝑨𝒅𝒅 𝒏𝒆𝒘 𝒂𝒅𝒎𝒊𝒏
🗑️ 𝒂𝒅𝒎𝒊𝒏 𝒓𝒆𝒎𝒐𝒗𝒆 [@𝒕𝒂𝒈/𝑰𝑫] - 𝑹𝒆𝒎𝒐𝒗𝒆 𝒂𝒅𝒎𝒊𝒏`;
            
          return message.reply(helpMessage);
        }
      }

    } catch (error) {
      console.error("Admin command error:", error);
      return message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  }
};
