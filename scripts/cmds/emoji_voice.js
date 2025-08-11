const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Emoji to voice mapping
const emojiVoiceDB = {
    "🥺": {
        url: "https://drive.google.com/uc?export=download&id=1Gyi-zGUv5Yctk5eJRYcqMD2sbgrS_c1R",
        caption: "মিস ইউ বেপি...🥺"
    },
    "😍": {
        url: "https://drive.google.com/uc?export=download&id=1lIsUIvmH1GFnI-Uz-2WSy8-5u69yQ0By",
        caption: "তোমার প্রতি ভালোবাসা দিনকে দিন বাড়ছে... 😍"
    },
    "😭": {
        url: "https://drive.google.com/uc?export=download&id=1qU27pXIm5MV1uTyJVEVslrfLP4odHwsa",
        caption: "জান তুমি কান্না করতেছো কোনো... 😭"
    },
    "😡": {
        url: "https://drive.google.com/uc?export=download&id=1S_I7b3_f4Eb8znzm10vWn99Y7XHaSPYa",
        caption: "রাগ কমাও, মাফ করাই বড়ত্ব... 😡"
    },
    "🙄": {
        url: "https://drive.google.com/uc?export=download&id=1gtovrHXVmQHyhK2I9F8d2Xbu7nKAa5GD",
        caption: "এভাবে তাকিও না তুমি ভেবে লজ্জা লাগে ... 🙄"
    },
    "😑": {
        url: "https://drive.google.com/uc?export=download&id=1azElOD2QeaMbV2OdCY_W3tErD8JQ3T7P",
        caption: "লেবু খাও জান সব ঠিক হয়ে যাবে 😑"
    },
    "😒": {
        url: "https://drive.google.com/uc?export=download&id=1tbKe8yiU0RbINPlQgOwnig7KPXPDzjXv",
        caption: "বিরক্ত করো না জান... ❤"
    },
    "🤣": {
        url: "https://drive.google.com/uc?export=download&id=1Hvy_Xee8dAYp-Nul7iZtAq-xQt6-rNpU",
        caption: "হাসলে তোমাকে পাগল এর মতো লাগে... 🤣"
    },
    "💔": {
        url: "https://drive.google.com/uc?export=download&id=1jQDnFc5MyxRFg_7PsZXCVJisIIqTI8ZY",
        caption: "feel this song... 💔"
    },
    "🙂": {
        url: "https://drive.google.com/uc?export=download&id=1_sehHc-sDtzuqyB2kL_XGMuvm2Bv-Dqc",
        caption: "তুমি কি আধো আমাকে ভালোবাসো ... 🙂"
    }
};

module.exports = {
  config: {
    name: "emoji_voice",
    version: "1.2.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Emoji-based voice responses",
    category: "fun",
    usages: "Simply send one of these emojis: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂",
    cooldowns: 5,
    dependencies: {
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function() {
    try {
      // Initialize cache directory
      const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
      await fs.ensureDir(cacheDir);
      
      console.log("ℹ️ Pre-caching emoji voice files...");
      
      // Pre-cache all voice files
      for (const emoji in emojiVoiceDB) {
        const filePath = path.join(cacheDir, `${emoji}.mp3`);
        if (!fs.existsSync(filePath)) {
          try {
            const response = await axios.get(emojiVoiceDB[emoji].url, {
              responseType: 'arraybuffer',
              timeout: 30000
            });
            await fs.writeFile(filePath, Buffer.from(response.data));
            console.log(`✅ Cached voice for ${emoji}`);
          } catch (error) {
            console.error(`❌ Failed to cache ${emoji} voice:`, error.message);
          }
        }
      }
      
      console.log("✅ Emoji voice pre-caching completed");
    } catch (error) {
      console.error("Initialization error:", error);
    }
  },

  handleEvent: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    
    // Ignore if message is empty or contains more than 2 characters
    if (!body || body.length > 2) return;
    
    const emoji = body.trim();
    const audioData = emojiVoiceDB[emoji];
    
    // Ignore if emoji is not in our database
    if (!audioData) return;
    
    try {
      const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
      const filePath = path.join(cacheDir, `${emoji}.mp3`);
      
      // Create cache directory if it doesn't exist
      await fs.ensureDir(cacheDir);
      
      // If file doesn't exist in cache, download it
      if (!fs.existsSync(filePath)) {
        const response = await axios.get(audioData.url, {
          responseType: 'arraybuffer',
          timeout: 30000
        });
        await fs.writeFile(filePath, Buffer.from(response.data));
      }
      
      // Send the voice message with caption
      api.sendMessage({
        body: audioData.caption,
        attachment: fs.createReadStream(filePath)
      }, threadID, messageID);
      
    } catch (error) {
      console.error('Emoji Voice Error:', error);
      api.sendMessage(
        "⚠️ An error occurred while processing your emoji. Please try again later.", 
        threadID,
        messageID
      );
    }
  }
};
