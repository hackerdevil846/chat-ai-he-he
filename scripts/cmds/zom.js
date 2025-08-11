const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "zom",
    aliases: [],
    author: "asif",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Zombie filter",
    },
    longDescription: {
      en: "Applies a zombie effect to an image",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [reply to image or provide image URL]",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let imageUrl = null;

    // Check if reply with image
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === "photo" || attachment.contentType.startsWith("image")) {
        imageUrl = attachment.url;
      } else {
        return api.sendMessage("Please reply to an image.", threadID, messageID);
      }
    } 
    // Else, check if URL provided
    else if (args.length > 0) {
      imageUrl = args[0];
    } 
    else {
      return api.sendMessage("Please reply to an image or provide an image URL.", threadID, messageID);
    }

    try {
      // Notify user
      api.sendMessage("Applying zombie filter...", threadID, messageID);

      // Generate zombie image
      const buffer = await new DIG.Zombie().getImage(imageUrl);

      // Prepare temp directory and file
      const tempDir = path.join(__dirname, "cache");
      await fs.ensureDir(tempDir);
      const tempFilePath = path.join(tempDir, `zombie_${Date.now()}.png`);

      // Save image to temp file
      await fs.writeFile(tempFilePath, buffer);

      // Send the image
      await api.sendMessage(
        { attachment: fs.createReadStream(tempFilePath) },
        threadID,
        () => {
          // Cleanup after sending
          fs.unlink(tempFilePath, () => {});
        },
        messageID
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred: " + error.message, threadID, messageID);
    }
  }
};
