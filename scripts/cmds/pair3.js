const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pair3",
    aliases: [],
    version: "1.0.0",
    author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "✨ 𝖯𝖺𝗂𝗋 𝗎𝗉 𝗎𝗌𝖾𝗋𝗌 ✨"
    },
    longDescription: {
      en: "𝖱𝖺𝗇𝖽𝗈𝗆𝗅𝗒 𝗉𝖺𝗂𝗋 𝗎𝗌𝖾𝗋𝗌 𝖺𝗇𝖽 𝗌𝗁𝗈𝗐 𝖼𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒"
    },
    category: "𝗅𝗈𝗏𝖾",
    guide: {
      en: "{p}pair3"
    }
  },

  onStart: async function({ api, event, usersData }) {
    try {
      const { threadID, senderID } = event;
      
      // Get thread participants
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs;
      
      // Calculate compatibility
      const tle = Math.floor(Math.random() * 101);
      const namee = (await usersData.get(senderID)).name;
      
      const botID = api.getCurrentUserID();
      const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);
      
      if (listUserID.length === 0) {
        return api.sendMessage("😢 𝖭𝗈 𝖾𝗅𝗂𝗀𝗂𝖻𝗅𝖾 𝗉𝖺𝗋𝗍𝗇𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽!", threadID);
      }
      
      // Select random user
      const id = listUserID[Math.floor(Math.random() * listUserID.length)];
      const name = (await usersData.get(id)).name;
      
      // Background selection
      const backgrounds = [
        "https://i.postimg.cc/wjJ29HRB/background1.png",
        "https://i.postimg.cc/zf4Pnshv/background2.png", 
        "https://i.postimg.cc/5tXRQ46D/background3.png"
      ];
      const selectedBG = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // Download and save images
      const Avatar1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: "arraybuffer" 
      })).data;
      fs.writeFileSync(__dirname + "/cache/avt1.png", Buffer.from(Avatar1, "utf-8"));

      const Background = (await axios.get(selectedBG, { 
        responseType: "arraybuffer" 
      })).data;
      fs.writeFileSync(__dirname + "/cache/bg.png", Buffer.from(Background, "utf-8"));

      const Avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
        responseType: "arraybuffer" 
      })).data;
      fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

      // Send message with attachments
      const msg = {
        body: `💌 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅 𝗉𝖺𝗂𝗋𝗂𝗇𝗀!\n\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒: ${tle}%\n${namee} 💓 ${name}`,
        mentions: [
          { id: senderID, tag: namee },
          { id: id, tag: name }
        ],
        attachment: [
          fs.createReadStream(__dirname + "/cache/avt1.png"),
          fs.createReadStream(__dirname + "/cache/bg.png"),
          fs.createReadStream(__dirname + "/cache/avt2.png")
        ]
      };

      await api.sendMessage(msg, threadID);

    } catch (error) {
      console.error("𝖯𝖺𝗂𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
      api.sendMessage("❌ 𝖤𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇!", event.threadID);
    }
  }
};
