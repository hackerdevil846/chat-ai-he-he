const SPAM_LIMIT = 4;
const TIME_FRAME = 80000;

module.exports = {
  config: {
    name: "spamkick",
    aliases: ["antispam", "autokick"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 1,
    category: "group",
    shortDescription: {
      en: "🛡️ 𝐴𝑢𝑡𝑜-𝑘𝑖𝑐𝑘 𝑠𝑝𝑎𝑚𝑚𝑒𝑟 𝑓𝑟𝑜𝑚 𝑔𝑟𝑜𝑢𝑝"
    },
    longDescription: {
      en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑒𝑡𝑒𝑐𝑡 𝑎𝑛𝑑 𝑘𝑖𝑐𝑘 𝑠𝑝𝑎𝑚𝑚𝑒𝑟𝑠 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝"
    },
    guide: {
      en: "{p}spamkick 𝑜𝑛/𝑜𝑓𝑓"
    },
    countDown: 5
  },

  onChat: async function ({ api, event, usersData, message }) {
    try {
      const { senderID, threadID } = event;

      if (!global.antispam) global.antispam = new Map();
      const thread = global.antispam.get(threadID) || { users: {} };

      const user = thread.users[senderID] || { count: 0, time: Date.now() };
      user.count++;

      const timePassed = Date.now() - user.time;
      if (timePassed > TIME_FRAME) {
        user.count = 1;
        user.time = Date.now();
      } else if (user.count > SPAM_LIMIT) {
        // Skip if user is bot admin
        if (global.client && global.client.config && global.client.config.adminBot?.includes(senderID)) {
          return;
        }

        // Remove user from group
        await api.removeUserFromGroup(senderID, threadID);
        
        const userName = await usersData.getName(senderID);
        const msg = await message.reply({
          body: `🚫 ${userName} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑑𝑢𝑒 𝑡𝑜 𝑠𝑝𝑎𝑚𝑚𝑖𝑛𝑔.\n📩 𝑅𝑒𝑎𝑐𝑡 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑎𝑑𝑑 𝑏𝑎𝑐𝑘.`
        });

        // Store reaction info
        if (msg && msg.messageID) {
          if (!global.client.onReaction) global.client.onReaction = new Map();
          global.client.onReaction.set(msg.messageID, {
            uid: senderID,
            messageID: msg.messageID,
            threadID: threadID
          });
        }

        user.count = 1;
        user.time = Date.now();
      }

      thread.users[senderID] = user;
      global.antispam.set(threadID, thread);

    } catch (error) {
      console.error("SpamKick error:", error);
    }
  },

  onReaction: async function ({ api, event, Reaction, threadsData, usersData }) {
    try {
      const { uid, messageID, threadID } = Reaction;
      
      // Check if user has permission to add back (admin or bot owner)
      const threadInfo = await threadsData.get(threadID);
      const userID = event.userID;
      
      if (!threadInfo.adminIDs.includes(userID) && userID !== api.getCurrentUserID()) {
        return;
      }

      let msg = "";
      try {
        await api.addUserToGroup(uid, threadID);
        const userName = await usersData.getName(uid);
        msg = `✅ ${userName} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑎𝑑𝑑𝑒𝑑 𝑏𝑎𝑐𝑘 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.`;
        await api.unsendMessage(messageID);
      } catch (err) {
        const userName = await usersData.getName(uid);
        msg = `❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑎𝑑𝑑 ${userName} 𝑏𝑎𝑐𝑘 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.`;
      }

      await message.reply(msg);

    } catch (error) {
      console.error("Reaction handler error:", error);
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const { threadID } = event;

      if (!global.antispam) global.antispam = new Map();

      const action = (args[0] || '').toLowerCase();
      
      switch (action) {
        case "on":
          global.antispam.set(threadID, { users: {} });
          await message.reply("✅ 𝑆𝑝𝑎𝑚𝐾𝑖𝑐𝑘 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑒𝑛𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.");
          break;
          
        case "off":
          if (global.antispam.has(threadID)) {
            global.antispam.delete(threadID);
            await message.reply("❌ 𝑆𝑝𝑎𝑚𝐾𝑖𝑐𝑘 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.");
          } else {
            await message.reply("⚠️ 𝑆𝑝𝑎𝑚𝐾𝑖𝑐𝑘 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.");
          }
          break;
          
        default:
          await message.reply("📌 𝑈𝑠𝑎𝑔𝑒: 𝑠𝑝𝑎𝑚𝑘𝑖𝑐𝑘 𝑜𝑛/𝑜𝑓𝑓\n\n🔒 𝑃𝑟𝑜𝑡𝑒𝑐𝑡𝑠 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑓𝑟𝑜𝑚 𝑠𝑝𝑎𝑚𝑚𝑒𝑟𝑠 𝑏𝑦 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑘𝑖𝑐𝑘𝑖𝑛𝑔 𝑢𝑠𝑒𝑟𝑠 𝑤ℎ𝑜 𝑠𝑒𝑛𝑑 𝑡𝑜𝑜 𝑚𝑎𝑛𝑦 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑖𝑛 𝑎 𝑠ℎ𝑜𝑟𝑡 𝑡𝑖𝑚𝑒.");
          break;
      }

    } catch (error) {
      console.error("SpamKick command error:", error);
      await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
  }
};
