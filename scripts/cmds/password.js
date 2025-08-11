const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "password",
    version: "1.2.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Generate stylish password images with custom text",
    category: "game",
    usages: "[text1] | [text2]",
    cooldowns: 10,
    dependencies: {
      "canvas": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  // Add required onStart function
  onStart: async function() {
    // Cache paths
    const cacheDir = path.join(__dirname, 'cache');
    const fontPath = path.join(cacheDir, 'SVN-Arial.ttf');
    const baseImagePath = path.join(cacheDir, 'password_base.png');

    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    try {
      // Download font if missing
      if (!fs.existsSync(fontPath)) {
        const fontUrl = "https://drive.google.com/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download";
        const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(fontPath, Buffer.from(fontResponse.data));
        console.log("Password font downloaded successfully!");
      }
      
      // Download base image if missing
      if (!fs.existsSync(baseImagePath)) {
        const imageUrl = "https://i.imgur.com/QkddlpG.png";
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(baseImagePath, Buffer.from(imageResponse.data));
        console.log("Password base image downloaded successfully!");
      }
      
      // Register font
      registerFont(fontPath, { family: "SVN-Arial" });
      console.log("Password resources initialized!");
      
    } catch (error) {
      console.error("Password command initialization error:", error);
    }
  },

  run: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    // Help message if no arguments
    if (args.length === 0) {
      return api.sendMessage(
        "🔑 Password Image Generator\n\n" +
        "Usage: password [text1] | [text2]\n" +
        "Example: password I love you | 3000\n\n" +
        "Note: Use the | symbol to separate the two text parts",
        threadID,
        messageID
      );
    }

    // Process arguments
    const text = args.join(" ")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/(\s+\|)/g, "|")
      .replace(/\|\s+/g, "|")
      .split("|")
      .map(t => t.trim());
    
    // Validate input
    if (text.length < 2 || !text[0] || !text[1]) {
      return api.sendMessage(
        "⚠️ Invalid format! Please use:\npassword text1 | text2\n\n" +
        "Example: password secure | 123456",
        threadID,
        messageID
      );
    }

    try {
      // Create canvas
      const cacheDir = path.join(__dirname, 'cache');
      const baseImagePath = path.join(cacheDir, 'password_base.png');
      const baseImage = await loadImage(baseImagePath);
      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0);
      
      // Setup text styling
      ctx.font = "bold 30px SVN-Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Text wrapping function with word breaking
      const wrapText = (text, maxWidth) => {
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = "";
        
        for (const word of words) {
          // Handle long words by breaking them
          if (ctx.measureText(word).width > maxWidth) {
            let tempWord = "";
            for (const char of word) {
              if (ctx.measureText(currentLine + tempWord + char).width <= maxWidth) {
                tempWord += char;
              } else {
                if (currentLine) lines.push(currentLine);
                currentLine = tempWord;
                tempWord = char;
              }
            }
            currentLine = tempWord;
          } else {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (ctx.measureText(testLine).width <= maxWidth) {
              currentLine = testLine;
            } else {
              if (currentLine) lines.push(currentLine);
              currentLine = word;
            }
          }
        }
        
        if (currentLine) lines.push(currentLine);
        return lines;
      };

      // Render top text
      const topText = wrapText(text[0], 464);
      ctx.fillText(topText.join("\n"), canvas.width / 2, 129);
      
      // Render bottom text
      const bottomText = wrapText(text[1], 464);
      ctx.fillText(bottomText.join("\n"), canvas.width / 2, 380);

      // Generate unique output path
      const outputPath = path.join(cacheDir, `password_${senderID}_${Date.now()}.png`);
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      
      // Save image
      await new Promise((resolve, reject) => {
        stream.pipe(out);
        out.on('finish', resolve);
        out.on('error', reject);
      });

      // Send result
      await api.sendMessage({
        body: "🔑 Your Password Image:",
        attachment: fs.createReadStream(outputPath)
      }, threadID, () => {
        // Cleanup after sending
        try {
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, messageID);
      
    } catch (error) {
      console.error("Password command error:", error);
      api.sendMessage(
        "❌ Failed to generate password image. Please try again later.",
        threadID,
        messageID
      );
    }
  }
};
