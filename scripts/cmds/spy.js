const axios = require("axios");

module.exports = {
  config: {
    name: "spy",
    version: "1.1",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    countDown: 60,
    role: 0,
    shortDescription: "User info + avatar",
    longDescription: "Get user info (name, gender, avatar, etc) by mention, reply, or UID.",
    category: "image",
    guide: "{pn} [mention/reply/uid/profile-link]"
  },

  onStart: async function ({ event, message, api, args }) {
    try {
      const senderID = event.senderID;
      let targetUID;

      // Extract UID from args
      if (args[0]) {
        if (/^\d+$/.test(args[0])) {
          targetUID = args[0];
        } else {
          const match = args[0].match(/profile\.php\?id=(\d+)/);
          if (match) targetUID = match[1];
        }
      }

      // Fallback: reply or mention
      if (!targetUID) {
        targetUID = event.type === "message_reply"
          ? event.messageReply.senderID
          : Object.keys(event.mentions || {})[0] || senderID;
      }

      // Fetch user info
      const userInfo = await api.getUserInfo(targetUID);
      const user = userInfo[targetUID];
      if (!user) return message.reply("❌ User info paoya jay nai.");

      // Avatar and gender
      const avatarUrl = `https://graph.facebook.com/${targetUID}/picture?width=512&height=512`;
      const genderText = user.gender === 1 ? "👧 Girl" : user.gender === 2 ? "👦 Boy" : "❓ Unknown";

      // Prepare info message
      const info = `🔍 USER INFO
━━━━━━━━━━━━━━━
👤 Name: ${user.name}
🔗 Profile: https://facebook.com/${targetUID}
⚥ Gender: ${genderText}
🤝 Is Friend: ${user.isFriend ? "Yes" : "No"}
🎂 Birthday Today: ${user.isBirthday ? "Yes" : "No"}`;

      // Get avatar stream and send
      const imgStream = await global.utils.getStreamFromURL(avatarUrl);
      message.reply({ body: info, attachment: imgStream });

    } catch (e) {
      console.error(e);
      message.reply("❌ User data load korte somossa hoise. Try again later.");
    }
  }
};
