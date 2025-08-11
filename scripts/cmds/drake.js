const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

// Configuration
const TEMPLATE_URL = "https://i.imgur.com/qmkwLUx.png";
const FONT_URL = "https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download";
const CACHE_DIR = path.join(__dirname, 'cache');
const FONT_PATH = path.join(CACHE_DIR, 'SVN-Arial_2.ttf');
const OUTPUT_PATH = path.join(CACHE_DIR, 'drake_meme.png');

// Flag for font registration
let fontRegistered = false;

module.exports = {
  config: {
    name: "drake",
    version: "2.0.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Create Drake meme with custom text",
    category: "image",
    usages: "[text 1] | [text 2]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;
      
      // Validate input
      if (!args.length) {
        return api.sendMessage(
          "🦁 Drake Meme Generator 🦁\n\nℹ️ Usage: drake [text 1] | [text 2]\nExample: drake Good idea | Bad idea\n\n📌 Separate texts with | symbol",
          threadID,
          messageID
        );
      }
      
      // Create cache directory if needed
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      
      // Download font if missing
      if (!fs.existsSync(FONT_PATH)) {
        try {
          const fontData = (await axios.get(FONT_URL, { 
            responseType: 'arraybuffer',
            timeout: 30000
          })).data;
          fs.writeFileSync(FONT_PATH, Buffer.from(fontData));
        } catch (fontError) {
          console.error("Font download error:", fontError.message);
          return api.sendMessage(
            "❌ Failed to download required font. Please try again later.",
            threadID,
            messageID
          );
        }
      }
      
      // Register font only once
      if (!fontRegistered) {
        try {
          registerFont(FONT_PATH, { family: "DrakeFont" });
          fontRegistered = true;
        } catch (registerError) {
          console.error("Font registration error:", registerError.message);
          return api.sendMessage(
            "⚠️ Font registration failed. Using fallback font.",
            threadID,
            messageID
          );
        }
      }
      
      // Process text input
      const text = args.join(" ")
        .trim()
        .replace(/\s+/g, " ")
        .replace(/(\s+\|)/g, "|")
        .replace(/\|\s+/g, "|")
        .split("|")
        .slice(0, 2) // Only take first two parts
        .map(t => t.trim());
      
      if (text.length < 2 || !text[0] || !text[1]) {
        return api.sendMessage(
          "⚠️ Please provide two valid texts separated by |\nExample: drake Text 1 | Text 2",
          threadID,
          messageID
        );
      }
      
      // Download template image
      let templateResponse;
      try {
        templateResponse = await axios.get(TEMPLATE_URL, { 
          responseType: 'arraybuffer',
          timeout: 30000
        });
      } catch (error) {
        console.error("Template download error:", error.message);
        return api.sendMessage(
          "❌ Failed to download template image. Please try again later.",
          threadID,
          messageID
        );
      }
      
      fs.writeFileSync(OUTPUT_PATH, Buffer.from(templateResponse.data));
      
      // Load image and create canvas
      const baseImage = await loadImage(OUTPUT_PATH);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      
      // Draw template
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      
      // Configure text styling
      ctx.font = "bold 30px DrakeFont, Arial, sans-serif";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Text wrapping function
      const wrapText = async (ctx, text, maxWidth) => {
        return new Promise(resolve => {
          if (ctx.measureText(text).width < maxWidth) return resolve([text]);
          if (ctx.measureText("W").width > maxWidth) return resolve(null);
          
          const words = text.split(" ");
          const lines = [];
          let line = "";
          
          while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
              const temp = words[0];
              words[0] = temp.slice(0, -1);
              if (split) {
                words[1] = `${temp.slice(-1)}${words[1]}`;
              } else {
                split = true;
                words.splice(1, 0, temp.slice(-1));
              }
            }
            
            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
              line += `${words.shift()} `;
            } else {
              lines.push(line.trim());
              line = "";
            }
            
            if (words.length === 0) lines.push(line.trim());
          }
          resolve(lines);
        });
      };
      
      // Wrap and position text
      const topText = await wrapText(ctx, text[0], 464);
      const bottomText = await wrapText(ctx, text[1], 464);
      
      // Draw text on canvas
      ctx.fillText(topText.join("\n"), 464, 129);
      ctx.fillText(bottomText.join("\n"), 464, 339);
      
      // Save final image
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(OUTPUT_PATH, imageBuffer);
      
      // Send result
      api.sendMessage(
        { 
          body: "✅ Your Drake meme is ready!",
          attachment: fs.createReadStream(OUTPUT_PATH) 
        },
        threadID,
        messageID
      );
      
    } catch (error) {
      console.error("Drake command error:", error.message);
      api.sendMessage(
        "❌ An error occurred while creating your Drake meme. Please try again later.",
        threadID,
        messageID
      );
    } finally {
      // Clean up temporary files
      if (fs.existsSync(OUTPUT_PATH)) {
        try {
          fs.unlinkSync(OUTPUT_PATH);
        } catch (cleanError) {
          console.error("Cleanup error:", cleanError.message);
        }
      }
    }
  }
};
