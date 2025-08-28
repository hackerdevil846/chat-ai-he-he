const fs = require("fs-extra");
const path = require("path");

// keep the same path you provided
const activeGroupsFilePath = path.join(__dirname, "..", "events", "Nayan", "groupSettings.json");
let activeGroups = {};

// load persisted settings if exists
if (fs.existsSync(activeGroupsFilePath)) {
  try {
    const fileData = fs.readFileSync(activeGroupsFilePath, "utf-8");
    activeGroups = JSON.parse(fileData);
    if (typeof activeGroups !== "object" || activeGroups === null) {
      console.warn("activeGroups data is not an object. Initializing to empty object.");
      activeGroups = {};
    }
  } catch (error) {
    console.error("Error loading active groups:", error);
    activeGroups = {};
  }
}

const saveActiveGroups = () => {
  try {
    // ensure folder exists
    fs.ensureDirSync(path.dirname(activeGroupsFilePath));
    fs.writeFileSync(activeGroupsFilePath, JSON.stringify(activeGroups, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving active groups:", error);
  }
};

module.exports = {
  config: {
    name: "antichange",
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    role: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    description: "Prevents unauthorized group changes",
    prefix: false,
    category: "box",
    usages: "antichange [on/off]",
    cooldowns: 5
  },

  onStart: async function ({ message, args, event, threadsData, api, global }) {
    try {
      const threadID = event.threadID;
      const senderID = String(event.senderID);

      // get bot admins from global config (make sure it's an array)
      const botAdmins = Array.isArray(global.config?.ADMINBOT) ? global.config.ADMINBOT.map(id => String(id)) : [];

      // fetch thread info
      const threadInfo = await api.getThreadInfo(threadID).catch(() => null);
      if (!threadInfo) {
        return await message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑡ℎ𝑟𝑒𝑎𝑑 𝑖𝑛𝑓𝑜.");
      }

      // build admin list
      const adminIDs = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs.map(a => String(a.id)) : [];
      const isAdmin = adminIDs.includes(senderID) || botAdmins.includes(senderID);

      if (!isAdmin) {
        return await message.reply("⚠️ 𝑂𝑛𝑙𝑦 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛𝑠 𝑜𝑟 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑠 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
      }

      const subCommand = (args[0] || "").toLowerCase();

      if (subCommand === "on") {
        // if not already active, save initial info
        if (!activeGroups[threadID]) {
          const initialName = threadInfo.threadName || "";
          const initialImage = threadInfo.imageSrc || "";

          activeGroups[threadID] = {
            name: initialName,
            image: initialImage,
            enabledBy: senderID,
            enabledAt: Date.now()
          };

          // persist to file
          saveActiveGroups();

          // store to threadsData for in-app usage (if threadsData available)
          try {
            if (threadsData && typeof threadsData.set === "function") {
              await threadsData.set(threadID, { antichange: activeGroups[threadID] });
            }
          } catch (err) {
            console.warn("Failed to set threadsData:", err);
          }

          return await message.reply("✅ 𝐀𝐧𝐭𝐢-𝐜𝐡𝐚𝐧𝐠𝐞 𝐟𝐞𝐚𝐭𝐮𝐫𝐞 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩.");
        } else {
          return await message.reply("⚠️ 𝐀𝐧𝐭𝐢-𝐜𝐡𝐚𝐧𝐠𝐞 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐚𝐜𝐭𝐢𝐯𝐞 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩.");
        }
      } else if (subCommand === "off") {
        if (activeGroups[threadID]) {
          delete activeGroups[threadID];
          saveActiveGroups();

          // remove from threadsData
          try {
            if (threadsData && typeof threadsData.del === "function") {
              await threadsData.del(threadID);
            } else if (threadsData && typeof threadsData.delete === "function") {
              await threadsData.delete(threadID);
            }
          } catch (err) {
            console.warn("Failed to delete threadsData:", err);
          }

          return await message.reply("🚫 𝐀𝐧𝐭𝐢-𝐜𝐡𝐚𝐧𝐠𝐞 𝐟𝐞𝐚𝐭𝐮𝐫𝐞 𝐡𝐚𝐬 𝐛𝐞𝐞𝐧 𝐝𝐞𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩.");
        } else {
          return await message.reply("⚠️ 𝐀𝐧𝐭𝐢-𝐜𝐡𝐚𝐧𝐠𝐞 𝐢𝐬 𝐧𝐨𝐭 𝐚𝐜𝐭𝐢𝐯𝐞 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩.");
        }
      } else {
        return await message.reply("⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐩𝐭𝐢𝐨𝐧. 𝐔𝐬𝐞: `antichange on` 𝐨𝐫 `antichange off`.");
      }
    } catch (error) {
      console.error("Antichange Command Error:", error);
      try {
        await message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
      } catch (e) {
        console.error("Failed to send error reply:", e);
      }
    }
  }
};
