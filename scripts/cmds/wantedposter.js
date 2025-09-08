const axios = require('axios');
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "wantedposter",
    aliases: ["wantedcmd"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Create a wanted poster"
    },
    longDescription: {
      en: "Generate a wanted poster with user's profile picture"
    },
    category: "utility",
    guide: {
      en: "{p}wantedposter [@mention|reply]"
    }
  },

  onStart: async function ({ api, event, args, Users }) {
    try {
      // Check for dependencies
      if (!axios) throw new Error("Missing axios dependency");
      if (!fs) throw new Error("Missing fs-extra dependency");
      if (!createCanvas || !loadImage) throw new Error("Missing canvas dependency");
      
      const { senderID, threadID, messageID } = event;
      let targetID = senderID;

      // Determine target user
      if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }

      const pathImg = __dirname + "/cache/wanted_poster.png";
      const pathAva = __dirname + "/cache/avatar.png";

      // Download user avatar
      const Avatar = (
        await axios.get(
          `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;
      
      fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

      // Download wanted template
      const getWanted = (
        await axios.get(`https://api.popcat.xyz/wanted?image=https://1.bp.blogspot.com/-nj8ADXnM8Ec/X0Ht4-TFU9I/AAAAAAAAw8k/lcoTu5I8alQra8zvzHIaRpA5pQ3La3i7ACLcBGAsYHQ/s1600/Hinh-Nen-Den%2B%252818%2529.jpg`, {
          responseType: "arraybuffer",
        })
      ).data;
      
      fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

      // Process images
      const baseImage = await loadImage(pathImg);
      const baseAva = await loadImage(pathAva);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      // Draw images
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseAva, 144, 281, 448, 448);

      // Save final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      
      // Clean up temporary files
      fs.removeSync(pathAva);

      // Get target user name for message
      const userName = await Users.getNameUser(targetID);

      // Send result
      return api.sendMessage(
        { 
          body: `⚠️ WANTED: ${userName} ⚠️\nThis person is wanted for being too awesome!`,
          attachment: fs.createReadStream(pathImg) 
        },
        threadID,
        () => fs.unlinkSync(pathImg),
        messageID
      );

    } catch (error) {
      console.error("Wanted poster command error:", error);
      api.sendMessage("❌ An error occurred while creating the wanted poster. Please try again later.", event.threadID, event.messageID);
    }
  }
};
