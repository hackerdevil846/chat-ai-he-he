module.exports = {
  config: {
    name: "search",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "🔍 Perform Google text searches or reverse image searches",
    category: "info",
    usages: "[query] or reply to image",
    cooldowns: 5,
    dependencies: {}
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Create formatted headers
      const createBox = (text, type = "search") => {
        const boxChars = type === "error" ? ["❌┏", "❌┗", "❌"] : ["🔍┏", "🔍┗", "🔍"];
        const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━";
        return `${boxChars[0]}${line}${boxChars[0].replace('┏', '┓')}\n${text}\n${boxChars[1]}${line}${boxChars[1].replace('┗', '┛')}`;
      };
      
      // Show guide if no arguments and not replying to image
      if (args.length === 0 && !event.messageReply) {
        const searchGuide = createBox(
          `🌐  𝐆𝐎𝐎𝐆𝐋𝐄 𝐒𝐄𝐀𝐑𝐂𝐇\n` +
          `🌐  Version: ${this.config.version}\n\n` +
          `📚 𝐔𝐬𝐚𝐠𝐞 𝐆𝐮𝐢𝐝𝐞:\n` +
          `  • 𝐓𝐞𝐱𝐭 𝐒𝐞𝐚𝐫𝐜𝐡: \n` +
          `    search <your query>\n` +
          `    Example: search how to bake a cake\n\n` +
          `  • 𝐈𝐦𝐚𝐠𝐞 𝐒𝐞𝐚𝐫𝐜𝐡 (𝐑𝐞𝐯𝐞𝐫𝐬𝐞 𝐒𝐞𝐚𝐫𝐜𝐡):\n` +
          `    Reply to an image with: search\n` +
          `    Example: [reply to image] search`
        );
        return api.sendMessage(searchGuide, event.threadID, event.messageID);
      }

      // Handle image search
      if (event.type === "message_reply" && 
          event.messageReply.attachments && 
          event.messageReply.attachments.length > 0) {
        
        const attachment = event.messageReply.attachments[0];
        const imageTypes = ["photo", "animated_image"];
        
        if (imageTypes.includes(attachment.type)) {
          const imageUrl = encodeURIComponent(attachment.url);
          const searchURL = `https://www.google.com/searchbyimage?&image_url=${imageUrl}`;
          
          const resultMessage = createBox(
            `🖼️  𝐑𝐄𝐕𝐄𝐑𝐒𝐄 𝐈𝐌𝐀𝐆𝐄 𝐒𝐄𝐀𝐑𝐂𝐇\n\n` +
            `🌐  Search Results:\n` +
            `🔗 ${searchURL}\n\n` +
            `ℹ️ Click the link above to view reverse image search results`
          );
          return api.sendMessage(resultMessage, event.threadID, event.messageID);
        }
      }

      // Handle text search
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        const errorMsg = createBox(
          `⚠️  𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐑𝐄𝐐𝐔𝐄𝐒𝐓\n\n` +
          `Please provide search text or reply to an image\n\n` +
          `ℹ️ Type "search" without arguments for usage guide`,
          "error"
        );
        return api.sendMessage(errorMsg, event.threadID, event.messageID);
      }

      const searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      
      const resultMessage = createBox(
        `🌐  𝐓𝐄𝐗𝐓 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓𝐒\n\n` +
        `🔎 Query: "${searchQuery}"\n\n` +
        `🔗 Search URL: ${searchURL}\n\n` +
        `ℹ️ Click the link above to view search results`
      );
      return api.sendMessage(resultMessage, event.threadID, event.messageID);

    } catch (error) {
      console.error("Search Command Error:", error);
      
      const errorMsg = createBox(
        `⚠️  𝐒𝐄𝐀𝐑𝐂𝐇 𝐅𝐀𝐈𝐋𝐄𝐃!\n\n` +
        `🔧 Error: ${error.message || "Unknown error"}\n\n` +
        `ℹ️ Please try again later or check your input`,
        "error"
      );
      api.sendMessage(errorMsg, event.threadID, event.messageID);
    }
  }
};
