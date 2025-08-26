module.exports.config = {
  name: "gsearch",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🔍 Perform Google text searches or reverse image searches",
  category: "info",
  usages: "[query] or reply to image",
  cooldowns: 5,
  dependencies: {},
  envConfig: {}
};

module.exports.languages = {
  "en": {
    "guideTitle": "GOOGLE SEARCH",
    "textSearch": "Text Search",
    "imageSearch": "Image Search (Reverse)",
    "exampleText": 'Example: search how to bake a cake',
    "exampleImage": 'Reply to an image with: search',
    "invalid": "INVALID REQUEST",
    "clickToOpen": "Click the link above to view results",
    "failed": "SEARCH FAILED"
  },
  "bn": {
    // Optional Bangla translations can be added here
  }
};

module.exports.onLoad = function () {
  // Runs when module loads (optional)
  // You can put initialization code here if needed
};

/**
 * Helper to create a beautiful boxed message.
 * type: "search" (default) or "error"
 */
function createBox(text, type = "search") {
  // Choose emoji and corner decorations by type
  const decor = type === "error"
    ? { left: "❌┏", right: "❌┗", midEmoji: "❌" }
    : { left: "🔍┏", right: "🔍┗", midEmoji: "🔍" };

  // Calculate a nice fixed width for the decorative line
  const line = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
  const top = `${decor.left}${line}${decor.left.replace("┏", "┓")}`;
  const bottom = `${decor.right}${line}${decor.right.replace("┗", "┛")}`;

  return `${top}\n${text}\n${bottom}`;
}

module.exports.onStart = async function ({ api, event, args, permssion, Threads, Users, Currencies }) {
  try {
    // If no args and no reply -> show usage guide
    if ((!args || args.length === 0) && !event.messageReply) {
      const guideText =
        `🌐  𝐆𝐎𝐎𝐆𝐋𝐄 𝐒𝐄𝐀𝐑𝐂𝐇\n` +
        `🌐  Version: ${this.config.version}\n\n` +
        `📚  𝐔𝐬𝐚𝐠𝐞 𝐆𝐮𝐢𝐝𝐞:\n\n` +
        `  • 𝐓𝐞𝐱𝐭 𝐒𝐞𝐚𝐫𝐜𝐡:\n` +
        `    ${this.config.name} <your query>\n` +
        `    Example: ${this.config.name} how to bake a cake\n\n` +
        `  • 𝐈𝐦𝐚𝐠𝐞 𝐒𝐞𝐚𝐫𝐜𝐡 (𝐑𝐞𝐯𝐞𝐫𝐬𝐞):\n` +
        `    Reply to an image with: ${this.config.name}\n` +
        `    Example: [reply to image] ${this.config.name}`;

      return api.sendMessage(createBox(guideText), event.threadID, event.messageID);
    }

    // If the user replied to a message with an attachment -> try reverse image search
    if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
      const attachment = event.messageReply.attachments[0];

      // Common image-like attachment types used by FB messenger wrappers
      const imageTypes = ["photo", "animated_image", "image", "sticker"];

      if (attachment && attachment.type && imageTypes.includes(attachment.type)) {
        // Do not change any Google link or path — keep exactly as required
        const imageUrl = encodeURIComponent(attachment.url);
        const searchURL = `https://www.google.com/searchbyimage?&image_url=${imageUrl}`;

        const resultText =
          `🖼️  𝐑𝐄𝐕𝐄𝐑𝐒𝐄 𝐈𝐌𝐀𝐆𝐄 𝐒𝐄𝐀𝐑𝐂𝐇\n\n` +
          `🌐  Search Results:\n` +
          `🔗 ${searchURL}\n\n` +
          `ℹ️ ${this.languages.en.clickToOpen}`;

        return api.sendMessage(createBox(resultText), event.threadID, event.messageID);
      }
      // If attachment exists but is not an image, fall through to handle text or show error
    }

    // Handle text search (args present)
    const searchQuery = args.join(" ").trim();
    if (!searchQuery) {
      const invalidText =
        `⚠️  𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐑𝐄𝐐𝐔𝐄𝐒𝐓\n\n` +
        `Please provide search text or reply to an image\n\n` +
        `ℹ️ Type "${this.config.name}" without arguments for usage guide`;

      return api.sendMessage(createBox(invalidText, "error"), event.threadID, event.messageID);
    }

    // Build Google search link (do not alter link structure)
    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

    const resultMsg =
      `🌐  𝐓𝐄𝐗𝐓 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓𝐒\n\n` +
      `🔎 Query: "${searchQuery}"\n\n` +
      `🔗 Search URL: ${searchURL}\n\n` +
      `ℹ️ ${this.languages.en.clickToOpen}`;

    return api.sendMessage(createBox(resultMsg), event.threadID, event.messageID);

  } catch (error) {
    // Log error for debugging, but send friendly error box to user
    console.error("Search Command Error:", error);

    const errorMsg =
      `⚠️  𝐒𝐄𝐀𝐑𝐂𝐇 𝐅𝐀𝐈𝐋𝐄𝐃!\n\n` +
      `🔧 Error: ${error && error.message ? error.message : "Unknown error"}\n\n` +
      `ℹ️ Please try again later or check your input`;

    return api.sendMessage(createBox(errorMsg, "error"), event.threadID, event.messageID);
  }
};
