module.exports = {
  config: {
    name: "hugging",
    aliases: ["embrace", "cuddle", "squeeze"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send virtual hug to someone"
    },
    longDescription: {
      en: "Send a virtual hug to a friend with a random hug image"
    },
    category: "fun",
    guide: {
      en: "{p}hug [tag someone]"
    }
  },

  onStart: async function ({ message, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    
    try {
      if (!args[0]) {
        return message.reply("Please tag someone to hug 🤗");
      }

      // Get the mentioned user
      const mention = Object.keys(event.mentions)[0];
      if (!mention) {
        return message.reply("You need to tag someone to hug 🎯");
      }

      const tag = event.mentions[mention].replace("@", "");
      
      // Get hug image from API
      const response = await axios.get('https://nekos.life/api/v2/img/hug');
      const imageUrl = response.data.url;
      
      // Get user name for personalized message
      const userName = await getUserName(global.api, mention);
      
      // Download image
      const imagePath = __dirname + `/cache/hug_${event.senderID}_${mention}.jpg`;
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, 'binary'));
      
      // Send message with attachment
      message.reply({
        body: `${userName}, ${await getUserName(global.api, event.senderID)} sent you a warm hug! ❤️`,
        mentions: [
          {
            tag: userName,
            id: mention
          },
          {
            tag: await getUserName(global.api, event.senderID),
            id: event.senderID
          }
        ],
        attachment: fs.createReadStream(imagePath)
      });
      
      // Delete the image after sending
      fs.unlinkSync(imagePath);
      
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ Sorry, I couldn't send a hug right now. Please try again later.");
    }
  }
};

// Helper function to get user name
async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo[userID].name || "friend";
  } catch {
    return "friend";
  }
}
