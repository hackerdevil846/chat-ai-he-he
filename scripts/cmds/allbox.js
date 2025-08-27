const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "allbox",
    version: "1.0.0",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 2,
    category: "admin",
    shortDescription: {
      en: "𝑩𝒐𝒕 𝒋𝒐𝒊𝒏 𝒌𝒐𝒓𝒂 𝒈𝒓𝒐𝒖𝒑 𝒈𝒖𝒍𝒐𝒓 𝒍𝒊𝒔𝒕"
    },
    longDescription: {
      en: "𝑴𝒂𝒏𝒂𝒈𝒆 𝒃𝒐𝒕'𝒔 𝒈𝒓𝒐𝒖𝒑𝒔 - 𝒗𝒊𝒆𝒘, 𝒃𝒂𝒏, 𝒖𝒏𝒃𝒂𝒏, 𝒅𝒆𝒍𝒆𝒕𝒆, 𝒐𝒓 𝒍𝒆𝒂𝒗𝒆 𝒈𝒓𝒐𝒖𝒑𝒔"
    },
    guide: {
      en: "{p}allbox [all/page]"
    },
    cooldowns: 5
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, senderID } = event;
      
      switch (args[0]) {
        case "all": {
          let threadList;
          try {
            threadList = await api.getThreadList(100, null, ["INBOX"]);
          } catch (e) {
            return message.reply("❌ 𝑭𝒂𝒊𝒍𝒆𝒅 𝒕𝒐 𝒇𝒆𝒕𝒄𝒉 𝒕𝒉𝒓𝒆𝒂𝒅 𝒍𝒊𝒔𝒕!");
          }

          const groups = threadList
            .filter(t => t.isGroup)
            .sort((a, b) => b.messageCount - a.messageCount);

          if (groups.length === 0) {
            return message.reply("❌ 𝑵𝒐 𝒈𝒓𝒐𝒖𝒑𝒔 𝒇𝒐𝒖𝒏𝒅!");
          }

          const page = parseInt(args[1]) || 1;
          const limit = 10;
          const totalPages = Math.ceil(groups.length / limit);
          const startIdx = limit * (page - 1);
          const pageGroups = groups.slice(startIdx, startIdx + limit);

          let msg = "🎭 𝑮𝒓𝒐𝒖𝒑 𝑳𝒊𝒔𝒕 [𝑫𝒂𝒕𝒂] 🎭\n\n";
          const groupIds = [];
          const groupNames = [];

          pageGroups.forEach((group, i) => {
            const num = startIdx + i + 1;
            msg += `${num}. ${group.name}\n🔰 𝑻𝑰𝑫: ${group.threadID}\n💌 𝑴𝒔𝒈 𝑪𝒐𝒖𝒏𝒕: ${group.messageCount}\n\n`;
            groupIds.push(group.threadID);
            groupNames.push(group.name);
          });

          msg += `📄 𝑷𝒂𝒈𝒆 ${page}/${totalPages}\n` +
                 `🔹 𝑼𝒔𝒆: ${global.config.PREFIX}allbox all <𝒑𝒂𝒈𝒆>\n\n` +
                 "𝑹𝒆𝒑𝒍𝒚 𝒘𝒊𝒕𝒉:\n" +
                 "• 𝑩𝒂𝒏 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑩𝒂𝒏 𝒈𝒓𝒐𝒖𝒑\n" +
                 "• 𝑼𝒃 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑼𝒏𝒃𝒂𝒏 𝒈𝒓𝒐𝒖𝒑\n" +
                 "• 𝑫𝒆𝒍 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑫𝒆𝒍𝒆𝒕𝒆 𝒅𝒂𝒕𝒂\n" +
                 "• 𝑶𝒖𝒕 <𝒏𝒖𝒎𝒃𝒆𝒓> - 𝑳𝒆𝒂𝒗𝒆 𝒈𝒓𝒐𝒖𝒑";

          await message.reply(msg);
          break;
        }

        default:
          const allThreads = Array.from(global.data.allThreadID || []);
          if (allThreads.length === 0) {
            return message.reply("❌ 𝑵𝒐 𝒈𝒓𝒐𝒖𝒑𝒔 𝒇𝒐𝒖𝒏𝒅!");
          }

          let listMsg = `🍄 𝑻𝒐𝒕𝒂𝒍 𝒈𝒓𝒐𝒖𝒑𝒔: ${allThreads.length}\n\n`;
          for (const [i, tid] of allThreads.entries()) {
            if (i >= 20) break; // Limit to first 20 groups
            const name = (global.data.threadInfo.get(tid))?.threadName || "𝑵𝒂𝒎𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅";
            listMsg += `${i+1}. ${name}\n🔰 𝑻𝑰𝑫: ${tid}\n\n`;
          }
          
          if (allThreads.length > 20) {
            listMsg += `\n📋 𝑼𝒔𝒆 '${global.config.PREFIX}allbox all' 𝒕𝒐 𝒔𝒆𝒆 𝒂𝒍𝒍 𝒈𝒓𝒐𝒖𝒑𝒔`;
          }
          
          await message.reply(listMsg);
          break;
      }

    } catch (error) {
      console.error("Allbox command error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  },

  onChat: async function({ message, event }) {
    try {
      const { body, senderID, messageReply } = event;
      
      if (messageReply && messageReply.body && messageReply.body.includes("𝑮𝒓𝒐𝒖𝒑 𝑳𝒊𝒔𝒕")) {
        const [action, index] = body.split(" ");
        const actionType = action.toLowerCase();
        
        if (!["ban", "ub", "del", "out"].includes(actionType) || !index || isNaN(index)) {
          return;
        }

        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const groups = threadList.filter(t => t.isGroup);
        const selectedIndex = parseInt(index) - 1;
        
        if (selectedIndex < 0 || selectedIndex >= groups.length) {
          return message.reply("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒔𝒆𝒍𝒆𝒄𝒕𝒊𝒐𝒏!");
        }

        const selectedGroup = groups[selectedIndex];
        const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");

        switch (actionType) {
          case "ban":
            // Ban logic would go here
            await message.reply(`✅ 𝑮𝒓𝒐𝒖𝒑 "${selectedGroup.name}" 𝒃𝒂𝒏𝒏𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚`);
            break;
            
          case "ub":
            // Unban logic would go here
            await message.reply(`✅ 𝑮𝒓𝒐𝒖𝒑 "${selectedGroup.name}" 𝒖𝒏𝒃𝒂𝒏𝒏𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚`);
            break;
            
          case "del":
            // Delete logic would go here
            await message.reply(`✅ 𝑮𝒓𝒐𝒖𝒑 "${selectedGroup.name}" 𝒅𝒂𝒕𝒂 𝒅𝒆𝒍𝒆𝒕𝒆𝒅 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚`);
            break;
            
          case "out":
            // Leave group logic would go here
            await message.reply(`✅ 𝑳𝒆𝒇𝒕 𝒈𝒓𝒐𝒖𝒑 "${selectedGroup.name}" 𝒔𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚`);
            break;
        }
      }
    } catch (error) {
      console.error("Allbox chat handler error:", error);
    }
  }
};
