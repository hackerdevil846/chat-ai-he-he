const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports = {
  config: {
    name: "dogmeme",
    version: "3.3.0",
    author: "Asif",
    category: "fun",
    shortDescription: "Create personalized dog memes",
    longDescription: "Generate custom dog memes with tagged users' names on random dog pictures",
    guide: {
      en: "{p}dogmeme [@mention]"
    },
    cooldowns: 15,
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "jimp": ""
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    
    try {
      // Get mentioned user or default to sender
      const targetID = Object.keys(event.mentions)[0] || event.senderID;
      const userName = await this.getUserName(api, targetID);
      
      // Show processing message
      const processingMsg = await api.sendMessage(
        `🐾 Creating a dog meme for ${userName}...\n⏱️ This may take 10-15 seconds`, 
        threadID
      );

      // Create meme
      const memePath = await this.createDogMeme(targetID, userName);
      
      // Send result
      await api.sendMessage({
        body: `🐶 ${userName}, you've been doggo-fied!`,
        mentions: [{
          tag: userName,
          id: targetID
        }],
        attachment: fs.createReadStream(memePath)
      }, threadID, messageID);
      
      // Clean up meme file
      fs.unlinkSync(memePath);
      
      // Delete processing message
      api.unsendMessage(processingMsg.messageID);
      
    } catch (error) {
      console.error("❌ DogMeme command error:", error);
      api.sendMessage(
        "😿 Woof! Something went wrong...\n• Dog API might be down\n• Try again later\n• Mention someone else",
        threadID,
        messageID
      );
    }
  },

  getUserName: async function(api, userID) {
    try {
      const userInfo = await api.getUserInfo(userID);
      return userInfo[userID]?.name || "Friend";
    } catch {
      return "Friend";
    }
  },

  createDogMeme: async function(userID, userName) {
    const cacheDir = path.join(__dirname, 'dogmeme-cache');
    
    // Create cache directory
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    const memePath = path.join(cacheDir, `meme_${userID}_${Date.now()}.jpg`);
    
    try {
      // Get random dog image
      const dogResponse = await axios.get('https://dog.ceo/api/breeds/image/random', {
        timeout: 15000
      });
      
      const dogImage = dogResponse.data.message;
      if (!dogImage) throw new Error("No dog image found");
      
      // Download dog image
      const dogPath = path.join(cacheDir, `dog_${Date.now()}.jpg`);
      const imageResponse = await axios.get(dogImage, {
        responseType: 'arraybuffer',
        timeout: 15000
      });
      
      await fs.writeFile(dogPath, Buffer.from(imageResponse.data, 'binary'));
      
      // Process image
      const image = await jimp.read(dogPath);
      
      // Load fonts
      const titleFont = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
      const watermarkFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
      
      // Prepare text
      const titleText = `${userName} as a doggo!`;
      const watermarkText = "Created with DogMeme Command";
      
      // Calculate positions
      const titleWidth = jimp.measureText(titleFont, titleText);
      const titleX = image.bitmap.width / 2 - titleWidth / 2;
      const titleY = image.bitmap.height - 70;
      
      const watermarkX = 20;
      const watermarkY = 20;
      
      // Add text background for better readability
      const bgHeight = 50;
      const textBg = new jimp(image.bitmap.width, bgHeight, 0xFFFFFFFF);
      
      // Add title text to background
      textBg.print(titleFont, titleX, 10, titleText);
      
      // Composite text background onto image
      image.composite(textBg, 0, image.bitmap.height - bgHeight);
      
      // Add watermark
      image.print(watermarkFont, watermarkX, watermarkY, watermarkText);
      
      // Save meme
      await image.writeAsync(memePath);
      
      // Clean up dog image
      fs.unlinkSync(dogPath);
      
      return memePath;
      
    } catch (error) {
      console.error("Meme creation error:", error);
      
      // Fallback to local dog image if available
      const fallbackPath = path.join(__dirname, 'assets', 'dog_fallback.jpg');
      if (fs.existsSync(fallbackPath)) {
        // Create a copy to avoid deletion issues
        const fallbackCopy = path.join(cacheDir, `fallback_${Date.now()}.jpg`);
        fs.copyFileSync(fallbackPath, fallbackCopy);
        return fallbackCopy;
      }
      
      throw error;
    }
  }
};
