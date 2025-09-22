const limit = 20;

module.exports = {
  config: {
    name: "count",
    aliases: ["grouprank", "msgrank"],
    version: "1.8.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "group",
    shortDescription: {
      en: "📊 𝐶ℎ𝑒𝑐𝑘 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑖𝑛𝑡𝑒𝑟𝑎𝑐𝑡𝑖𝑜𝑛 𝑟𝑎𝑛𝑘𝑖𝑛𝑔𝑠"
    },
    longDescription: {
      en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑖𝑛𝑡𝑒𝑟𝑎𝑐𝑡𝑖𝑜𝑛 𝑟𝑎𝑛𝑘𝑖𝑛𝑔𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑢𝑛𝑡"
    },
    guide: {
      en: "{p}count [𝑎𝑙𝑙|@𝑡𝑎𝑔]"
    },
    dependencies: {},
    envConfig: {}
  },

  onStart: async function({ message, args, event, usersData, threadsData, currenciesData }) {
    try {
      if (args[0] === "all") {
        const threadInfo = await threadsData.get(event.threadID);
        const { participantIDs } = threadInfo.threadInfo;
        const expData = [];

        for (const userID of participantIDs) {
          try {
            const userData = await usersData.get(userID);
            const currencyData = await currenciesData.get(userID);
            expData.push({
              name: userData.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟",
              exp: currencyData.exp || 0,
              uid: userID
            });
          } catch (error) {
            console.error(`𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 ${userID}:`, error);
          }
        }

        expData.sort((a, b) => b.exp - a.exp);
        
        const page = Math.max(1, parseInt(args[1]) || 1);
        const numPage = Math.ceil(expData.length / limit);
        const currentPage = Math.min(page, numPage);
        const startIdx = (currentPage - 1) * limit;
        const endIdx = Math.min(startIdx + limit, expData.length);

        let msg = `📊 𝐺𝑅𝑂𝑈𝑃 𝐼𝑁𝑇𝐸𝑅𝐴𝐶𝑇𝐼𝑂𝑁 𝐿𝐸𝐴𝐷𝐸𝑅𝐵𝑂𝐴𝑅𝐷 📊\n━━━━━━━━━━━━━━━━━━\n\n`;
        
        for (let i = startIdx; i < endIdx; i++) {
          const rank = i + 1;
          const user = expData[i];
          let rankEmoji = "🔹";
          if (rank === 1) rankEmoji = "👑";
          else if (rank === 2) rankEmoji = "🥈";
          else if (rank === 3) rankEmoji = "🥉";
          
          msg += `${rankEmoji} 𝑅𝑎𝑛𝑘 ${rank}: ${user.name}\n   📝 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${user.exp}\n\n`;
        }

        msg += `━━━━━━━━━━━━━━━━━━\n📑 𝑃𝑎𝑔𝑒 ${currentPage}/${numPage}\n`;
        msg += `🔍 𝑈𝑠𝑒: ${global.config.PREFIX}count all <𝑝𝑎𝑔𝑒 𝑛𝑢𝑚𝑏𝑒𝑟>`;

        return message.reply(msg);

      } else {
        let targetID;
        if (event.type === "message_reply") {
          targetID = event.messageReply.senderID;
        } else if (Object.keys(event.mentions).length > 0) {
          targetID = Object.keys(event.mentions)[0];
        } else {
          targetID = event.senderID;
        }

        const threadInfo = await threadsData.get(event.threadID);
        const { participantIDs } = threadInfo.threadInfo;
        const expData = [];

        for (const userID of participantIDs) {
          try {
            const currencyData = await currenciesData.get(userID);
            expData.push({
              exp: currencyData.exp || 0,
              uid: userID
            });
          } catch (error) {
            console.error(`𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑢𝑠𝑒𝑟 ${userID}:`, error);
          }
        }

        expData.sort((a, b) => b.exp - a.exp);
        const rank = expData.findIndex(x => x.uid === targetID) + 1;
        
        if (rank === 0) {
          return message.reply("❌ 𝑈𝑠𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝");
        }
        
        const userExp = expData[rank - 1].exp;
        const userName = (await usersData.get(targetID)).name;

        let rankEmoji = "🔹";
        if (rank === 1) rankEmoji = "👑";
        else if (rank === 2) rankEmoji = "🥈";
        else if (rank === 3) rankEmoji = "🥉";
        
        return message.reply(
          `👤 𝑈𝑆𝐸𝑅: ${userName}\n${rankEmoji} 𝑅𝐴𝑁𝐾: #${rank}\n💬 𝑀𝐸𝑆𝑆𝐴𝐺𝐸𝑆: ${userExp}\n\n🏆 𝑇𝑜𝑝 𝐶𝑜𝑛𝑡𝑟𝑖𝑏𝑢𝑡𝑜𝑟𝑠 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!`
        );
      }
    } catch (error) {
      console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑐𝑜𝑢𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
      return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
  }
};
