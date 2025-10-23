const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "inappropriatefilter",
    aliases: [],
    version: "1.2",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 1,
    category: "protection",
    shortDescription: {
      en: "🛡️ Auto-detects inappropriate content"
    },
    longDescription: {
      en: "Automatically detects inappropriate words and sends warnings"
    },
    guide: {
      en: "{p}inappropriatefilter on/off"
    },
    dependencies: {
      "fs-extra": "",
      "axios": ""
    }
  },

  onStart: async function({ message, args, globalData }) {
    try {
      const key = "inappropriatefilter_enabled";
      const subCmd = args[0]?.toLowerCase();

      if (!subCmd) {
        const status = globalData[key] === true ? "🟢 ON" : "🔴 OFF";
        return message.reply(`🔐 Inappropriate Content Filter Mode is currently: ${status}`);
      }

      if (subCmd === "on") {
        globalData[key] = true;
        return message.reply("✅ Inappropriate content detection is now ON.");
      }

      if (subCmd === "off") {
        globalData[key] = false;
        return message.reply("❌ Inappropriate content detection is now OFF.");
      }

      return message.reply("⚠️ Invalid usage. Use: {p}inappropriatefilter on/off");

    } catch (error) {
      console.error("Filter OnStart Error:", error);
      message.reply("❌ Failed to process command.");
    }
  },

  onChat: async function({ event, message, globalData }) {
    try {
      // Check if filter is enabled
      if (globalData["inappropriatefilter_enabled"] !== true) return;
      
      // Check if message has body
      if (!event.body) return;

      // Image links for warnings
      const imageLinks = [
        "https://i.imgur.com/B6G3NlF.jpeg",
        "https://i.imgur.com/T7RtKlp.gif",
        "https://i.imgur.com/BmGxEFs.gif",
        "https://i.imgur.com/MEdpECT.jpeg",
        "https://i.imgur.com/KU8N4Ca.jpeg",
        "https://i.imgur.com/roBS6oX.gif",
        "https://i.imgur.com/SkfGapy.jpeg",
        "https://i.imgur.com/GGQv16z.jpeg",
        "https://i.imgur.com/VAf5Eue.gif",
        "https://i.imgur.com/ZZpapGi.jpeg",
        "https://i.imgur.com/4LvXywY.jpeg",
        "https://i.imgur.com/NZ5iyCh.jpeg",
        "https://i.imgur.com/BkrKZ8b.jpeg",
        "https://i.imgur.com/Yf1LRak.jpeg",
        "https://i.imgur.com/1fsJf6B.jpeg",
        "https://i.imgur.com/MR2h7jw.jpeg",
        "https://i.imgur.com/K9fFzgm.jpeg",
        "https://i.imgur.com/Se05IOn.jpeg",
        "https://i.imgur.com/h1Yhryc.jpeg",
        "https://i.imgur.com/sUgF4oQ.jpeg",
        "https://i.imgur.com/8oHuIf8.jpeg",
        "https://i.imgur.com/fiH5dUv.jpeg",
        "https://i.imgur.com/FSKnHZt.jpeg",
        "https://i.imgur.com/80YYI12.jpeg",
        "https://i.imgur.com/ibd1j8n.jpeg",
        "https://i.imgur.com/J8vbW7x.jpeg",
        "https://i.imgur.com/fOmuOKl.jpeg",
        "https://i.imgur.com/qDwypw6.jpeg",
        "https://i.imgur.com/9dVyEEe.gif",
        "https://i.imgur.com/d3yM7FX.jpeg",
        "https://i.imgur.com/JToFUJo.jpeg",
        "https://i.imgur.com/aJ5sbvo.jpeg",
        "https://i.imgur.com/09qesDj.gif",
        "https://i.imgur.com/HES8mee.jpeg",
        "https://i.imgur.com/ovETysm.jpeg",
        "https://i.imgur.com/mpCMAYQ.jpeg",
        "https://i.imgur.com/iQV82Jq.jpeg",
        "https://i.imgur.com/qkM2t0l.jpeg",
        "https://i.imgur.com/VAf5Eue.gif"
      ];

      // Warning messages in Bengali
      const warningMessages = [
        "বন্ধু😭 ভালো হয়ে যা!😞",
        "বোসে যা ভাই🥲 লজ্জা কর!🫣",
        "ভাই এটা কি বললি!😓 একটু শান্ত হও🙏",
        "তোকেই কি এসব শিখায় কেউ?😠 দয়া করে থামো🙏",
        "ভালো কথা বল 🙃 নইলে ব্লক করবো🚫",
        "ভাই প্লিজ এসব বাদ দাও😭 শান্তি রাখো😞",
        "তোকেই নিয়ে মায়া লাগে রে ভাই🥺 ভদ্র হও🥲",
        "দোস্ত, এসব বলা লাগে?😐 একটু ভদ্রতা শিখো🧠",
        "তুই কি রিয়েল লাইফেও এমন?😑",
        "বাহ! ভোকাবুলারি ১৮+ ছাড়া খালি?🤦",
        "দয়া করে একটু ভদ্র হও🙏 আমি কষ্ট পাই😢"
      ];

      // Inappropriate words list
      const badWords = [
        "fuck", "fuk", "f*ck", "phuck", "phuk", "fawk",
        "sex", "s3x", "s ex", "seggs", "sxx", "sx",
        "cum", "cumm", "masturbate", "mastubate", "masterbate",
        "ma5turbate", "mastabate", "dick", "dik", "dyke", "d!ck", "d1ck",
        "boobs", "boob", "b00bs", "bo0bs", "pussy", "pusy", "pussee", "puszi",
        "vagina", "vajina", "vaginaa", "v@gin@", "vajenaa", "penis", "p3nis",
        "pns", "pénis", "nipple", "nippl", "chod", "chud", "choda", "chudi",
        "chodon", "gud", "gudmara", "gudmaar", "bokachoda", "gandu", "gando",
        "bokachudi", "jewra", "joray", "dhan", "dhon", "vodai", "vodar", "bira",
        "biral", "kutta", "baccha", "shuyor", "bal", "shawa", "heda", "lawra",
        "putki", "pukki", "mara", "magi", "khanki", "bessha", "nunu", "tuntuni",
        "bang", "loda", "lora", "boner", "horny",
        "চোদ", "চুদ", "চুদা", "চুদি", "গুদের", "গুদ", "যোনি", "যৌন", "বাঁড়া",
        "ভোদা", "ভোদ", "ফাক", "ধন", "স্তন", "মাস্টারবেট", "মাল", "ভোদার", "দুধ",
        "কাম", "ঝার", "হস্তমৈথুন", "সেক্স", "চুষ"
      ];

      // Normalize text for better matching
      const normalize = (str) => str.toLowerCase().replace(/[^\w\s\u0980-\u09FF]/g, '');
      const text = normalize(event.body);

      // Check for inappropriate words
      const foundBadWord = badWords.some(word => {
        const normalizedWord = normalize(word);
        return text.includes(normalizedWord);
      });

      if (!foundBadWord) return;

      // Create cache directory
      const cacheFolder = path.join(__dirname, "cache", "inappropriatefilter");
      if (!fs.existsSync(cacheFolder)) {
        fs.mkdirSync(cacheFolder, { recursive: true });
      }

      // Select random image URL
      const randomImageUrl = imageLinks[Math.floor(Math.random() * imageLinks.length)];
      const fileName = path.basename(randomImageUrl);
      const imagePath = path.join(cacheFolder, fileName);

      let imageStream = null;

      // Try to use cached image first
      if (fs.existsSync(imagePath)) {
        try {
          imageStream = fs.createReadStream(imagePath);
        } catch (fileError) {
          console.error("Error reading cached image:", fileError.message);
        }
      }

      // If cached image not available, download it
      if (!imageStream) {
        try {
          console.log(`📥 Downloading warning image: ${randomImageUrl}`);
          const response = await axios({
            method: 'GET',
            url: randomImageUrl,
            responseType: 'stream',
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          // Save to cache for future use
          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          imageStream = fs.createReadStream(imagePath);
          console.log("✅ Image downloaded and cached successfully");

        } catch (downloadError) {
          console.error("❌ Failed to download image:", downloadError.message);
          // Try to use any existing cached image as fallback
          const cachedFiles = fs.readdirSync(cacheFolder).filter(file => 
            file.match(/\.(jpeg|jpg|gif|png)$/i)
          );
          
          if (cachedFiles.length > 0) {
            const randomCachedFile = cachedFiles[Math.floor(Math.random() * cachedFiles.length)];
            imageStream = fs.createReadStream(path.join(cacheFolder, randomCachedFile));
            console.log("🔄 Using cached image as fallback");
          } else {
            console.error("❌ No images available for warning");
            return;
          }
        }
      }

      // Select random warning message
      const randomWarning = warningMessages[Math.floor(Math.random() * warningMessages.length)];

      // Send warning message with image
      await message.reply({
        body: randomWarning,
        attachment: imageStream
      });

      console.log("✅ Warning sent for inappropriate content");

    } catch (error) {
      console.error("💥 Filter OnChat Error:", error);
    }
  }
};
