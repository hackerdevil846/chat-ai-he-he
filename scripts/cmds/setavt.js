const axios = require("axios");

module.exports = {
  config: {
    name: "setavt",
    aliases: ["setavatar", "changeavt"],
    version: "1.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "owner",
    shortDescription: {
      en: "🖼️ Change bot avatar (URL or reply image)"
    },
    longDescription: {
      en: "🖼️ Change bot avatar with URL or replied image. Supports optional caption and temporary avatar expiration."
    },
    guide: {
      en: "{p}setavt [image URL | reply image] [caption] [expirationAfter (seconds)]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message, event, args }) {
    try {
      // Check dependencies
      try {
        if (!axios) {
          throw new Error("Missing required dependencies");
        }
      } catch (err) {
        return message.reply("❌ | Required dependencies are missing. Please install axios.");
      }

      // Build usage string
      const usageText = `${this.config.guide.en}\nExamples:\n  ${this.config.guide.en}\n  ${this.config.guide.en} Hello 3600\n  Reply to an image with: ${this.config.guide.en}`;

      // Resolve image URL
      const maybeUrlArg = (args[0] || "");
      let imageURL = null;
      
      if (maybeUrlArg.startsWith("http")) {
        imageURL = args.shift();
      }
      
      // Check attachments in current event or replied message
      if (!imageURL) {
        imageURL = event.attachments?.[0]?.url || event.messageReply?.attachments?.[0]?.url || null;
      }

      // If still no image, send usage/error
      if (!imageURL) {
        return message.reply(`❌ Please provide an image URL or reply to a message that contains an image.\nUsage: ${usageText}`);
      }

      // expirationAfter: if last arg is a number, treat as expiration in seconds
      let expirationAfter = null;
      if (args.length > 0) {
        const last = args[args.length - 1];
        if (!isNaN(last) && last !== "") {
          expirationAfter = parseInt(args.pop());
          if (expirationAfter < 0) expirationAfter = null;
        }
      }

      // caption: remaining args joined
      const caption = args.join(" ").trim() || "";

      // Fetch image as stream
      let response;
      try {
        response = await axios.get(imageURL, { responseType: "stream", timeout: 20000 });
      } catch (err) {
        return message.reply("❌ Error occurred while querying the image URL");
      }

      // Validate content-type header
      const contentType = (response.headers && (response.headers["content-type"] || response.headers["Content-Type"])) || "";
      if (!contentType.includes("image")) {
        return message.reply("❌ Invalid image format");
      }

      // Set path for framework compatibility
      try {
        response.data.path = "avatar.jpg";
      } catch (e) {
        // Ignore if response.data is a stream object
      }

      // Attempt to change avatar
      try {
        // Use global API method for changing avatar
        await global.utils.changeAvatar(response.data, caption, expirationAfter ? expirationAfter * 1000 : null);
        
        return message.reply("✅ Changed bot avatar successfully!");
        
      } catch (err) {
        const errText = (err && err.message) ? ` ${err.message}` : "";
        return message.reply(`❌ Error occurred while changing avatar:${errText}`);
      }

    } catch (error) {
      console.error("Setavt Command Error:", error);
      return message.reply("❌ | An error occurred while processing your request");
    }
  }
};
