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

      // Validate UID
      if (!targetUID || !/^\d+$/.test(targetUID)) {
        return message.reply("❌ Invalid user ID provided.");
      }

      // Fetch user info
      const userInfo = await api.getUserInfo(targetUID);
      const user = userInfo[targetUID];
      if (!user) return message.reply("❌ User info paoya jay nai.");

      // Avatar URL with better parameters
      const avatarUrl = `https://graph.facebook.com/${targetUID}/picture?width=1500&height=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      // Gender detection
      let genderText = "❓ Unknown";
      if (user.gender === 1) genderText = "👧 Girl";
      else if (user.gender === 2) genderText = "👦 Boy";

      // Prepare info message
      const info = `🔍 USER INFO
━━━━━━━━━━━━━━━
👤 Name: ${user.name || "N/A"}
🔗 Profile: https://facebook.com/${targetUID}
⚥ Gender: ${genderText}
🤝 Is Friend: ${user.isFriend ? "Yes" : "No"}
🎂 Birthday Today: ${user.isBirthday ? "Yes" : "No"}
🆔 UID: ${targetUID}`;

      // Download and send image properly
      try {
        const response = await axios.get(avatarUrl, { 
          responseType: 'stream',
          timeout: 30000 
        });
        
        // Send message with image attachment
        await message.reply({
          body: info,
          attachment: response.data
        });

      } catch (imgError) {
        console.error("Image download error:", imgError);
        // Fallback: send info without image
        await message.reply(`${info}\n\n⚠️ Avatar load korte somossa hoise, but user info dekhano holo.`);
      }

    } catch (e) {
      console.error("Spy command error:", e);
      message.reply("❌ User data load korte somossa hoise. Try again later.");
    }
  }
};
