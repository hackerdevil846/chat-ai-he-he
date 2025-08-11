const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "catsay",
    version: "1.2.0",
    author: "ASIF",
    category: "image-edit",
    shortDescription: "Create cat images with custom text",
    longDescription: "Generate adorable cat images with your custom text message and customization options",
    guide: {
      en: "{p}catsay [text]\n{p}catsay [text] --color [color]\n{p}catsay [text] --font [font]"
    },
    cooldowns: 7,
    dependencies: {
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID, senderID } = event;
      
      // Display help if no arguments
      if (args.length === 0) {
        return api.sendMessage(
          "🐱 CATSAY COMMAND 🐱\n\n" +
          "Create cat images with custom text!\n\n" +
          "Usage:\n" +
          "• {p}catsay [text] - Basic usage\n" +
          "• {p}catsay [text] --color [color] - Custom text color\n" +
          "• {p}catsay [text] --font [font] - Custom font\n\n" +
          "Examples:\n" +
          "• {p}catsay Hello World!\n" +
          "• {p}catsay Good morning! --color purple\n" +
          "• {p}catsay Meow! --font Impact\n\n" +
          "🎨 Available colors: white, black, red, blue, green, yellow, purple, orange, pink, brown\n" +
          "✒️ Available fonts: Arial, Verdana, Impact, Comic Sans MS, Georgia, Courier",
          threadID, 
          messageID
        );
      }

      // Parse arguments
      let text = args.join(" ");
      let color = "white";
      let font = "Arial";
      let size = 50;

      // Extract color parameter
      const colorMatch = text.match(/--color\s+(\w+)/i);
      if (colorMatch) {
        color = colorMatch[1].toLowerCase();
        text = text.replace(colorMatch[0], '').trim();
      }

      // Extract font parameter
      const fontMatch = text.match(/--font\s+([\w\s]+)/i);
      if (fontMatch) {
        font = fontMatch[1];
        text = text.replace(fontMatch[0], '').trim();
      }

      // Validate color
      const validColors = ["white", "black", "red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"];
      if (!validColors.includes(color)) {
        color = "white";
      }

      // Create cache directory
      const cacheDir = path.join(__dirname, "catsay-cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const imagePath = path.join(cacheDir, `catsay_${senderID}_${Date.now()}.png`);
      
      // Generate API URL with options
      const apiUrl = new URL(`https://cataas.com/cat/cute/says/${encodeURIComponent(text)}`);
      apiUrl.searchParams.append("fontSize", size);
      apiUrl.searchParams.append("fontColor", color);
      apiUrl.searchParams.append("height", 500);
      apiUrl.searchParams.append("font", font);
      
      // Download cat image
      const response = await axios.get(apiUrl.toString(), {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        },
        timeout: 30000
      });
      
      // Save image to cache
      await fs.writeFile(imagePath, Buffer.from(response.data, "binary"));
      
      // Send result
      await api.sendMessage({
        body: `😺 Cat says: "${text}"\n🎨 Color: ${color} | ✒️ Font: ${font}`,
        attachment: fs.createReadStream(imagePath)
      }, threadID, messageID);
      
      // Clean up after sending
      try {
        await fs.unlink(imagePath);
      } catch (cleanupError) {
        console.log("⚠️ Cleanup error:", cleanupError);
      }
      
    } catch (error) {
      console.error("❌ CatSay Error:", error);
      api.sendMessage(
        "😿 Failed to generate cat image. Please try:\n" +
        "• Shorter text (under 100 characters)\n" +
        "• Different color or font\n" +
        "• Waiting a moment before trying again",
        threadID, 
        messageID
      );
    }
  }
};
