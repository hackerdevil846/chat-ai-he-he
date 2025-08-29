module.exports = {
  config: {
    name: "levelup",
    version: "0.0.2",
    author: "𝐴𝑠𝑖𝑓",
    role: 1,
    category: "system",
    shortDescription: {
      en: "Level up alerts"
    },
    longDescription: {
      en: "Notifies when users level up"
    },
    guide: {
      en: "{p}levelup on/off"
    }
  },

  onStart: async function({ api, event, args, threadsData }) {
    const { threadID, messageID } = event;

    if (args[0] === "on" || args[0] === "off") {
      const data = await threadsData.get(event.threadID) || {};
      
      if (args[0] === "on") {
        data.levelup = true;
        await threadsData.set(event.threadID, data);
        await api.sendMessage("✅ Level alerts on!", threadID, messageID);
      } else {
        data.levelup = false;
        await threadsData.set(event.threadID, data);
        await api.sendMessage("✅ Level alerts off!", threadID, messageID);
      }
    } else {
      await api.sendMessage("❌ Use: {p}levelup on/off", threadID, messageID);
    }
  },

  onChat: async function({ event, api, usersData, threadsData }) {
    const { threadID, senderID } = event;
    
    // Get thread data
    const threadData = await threadsData.get(threadID) || {};
    
    // If levelup alerts are disabled for this thread, return
    if (threadData.levelup === false) {
      const userExp = (await usersData.get(senderID)).exp || 0;
      await usersData.set(senderID, { exp: userExp + 1 });
      return;
    }

    const { createReadStream, existsSync, mkdirSync } = require("fs-extra");

    let userData = await usersData.get(senderID);
    let exp = parseInt(userData.exp) || 0;
    exp += 1;

    if (isNaN(exp)) return;

    const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

    if (level > curLevel && level != 1) {
      let userInfo;
      try {
        userInfo = await api.getUserInfo(senderID);
      } catch (error) {
        console.error("Error getting user info:", error);
        userInfo = { [senderID]: { name: "User" } };
      }
      
      const name = userInfo[senderID]?.name || "User";
      
      let message = threadData.customLevelup || "{name} reached level {level}!";
      
      message = message
        .replace(/\{name}/g, name)
        .replace(/\{level}/g, level);

      let attachment = null;
      
      // Check if levelup GIF exists
      const gifPath = __dirname + "/cache/levelup/levelup.gif";
      if (existsSync(gifPath)) {
        if (!existsSync(__dirname + "/cache/levelup/")) {
          mkdirSync(__dirname + "/cache/levelup/", { recursive: true });
        }
        attachment = createReadStream(gifPath);
      }

      try {
        if (attachment) {
          await api.sendMessage({
            body: message,
            attachment: attachment,
            mentions: [{ tag: name, id: senderID }]
          }, threadID);
        } else {
          await api.sendMessage({
            body: message,
            mentions: [{ tag: name, id: senderID }]
          }, threadID);
        }
      } catch (error) {
        console.error("Levelup error:", error);
      }
    }

    await usersData.set(senderID, { exp });
  }
};
