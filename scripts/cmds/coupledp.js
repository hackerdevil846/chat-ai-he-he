const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Enhanced security with immutable credits
const lockedCredits = Object.freeze("𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑");
const lockedTagline = Object.freeze("💚 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑");

// 🔐 Tamper-proof verification
function verifyTagline(text) {
  if (!text.includes(lockedTagline)) {
    throw new Error("🚫 𝑈𝑛𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑒𝑑 𝑚𝑜𝑑𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑");
  }
}

module.exports.config = {
  name: "pintrest",
  aliases: ["pinterest", "dpsearch"],
  version: "2.0.0",
  author: lockedCredits,
  countDown: 3,
  role: 0,
  category: "𝑓𝑢𝑛",
  shortDescription: {
    en: "𝐹𝑒𝑡𝑐ℎ 𝑐𝑜𝑢𝑝𝑙𝑒 𝑑𝑝 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
  },
  longDescription: {
    en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐𝑜𝑢𝑝𝑙𝑒 𝑑𝑝 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑃𝑖𝑛𝑡𝑒𝑟𝑒𝑠𝑡"
  },
  guide: {
    en: "{p}pintrest [𝑞𝑢𝑒𝑟𝑦] - [𝑛𝑢𝑚𝑏𝑒𝑟]"
  },
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onStart = async function({ message, event, args }) {
  try {
    // Check dependencies
    if (!axios || !fs || !path) {
      throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
    }

    const query = args.join(" ");
    if (!query.includes("-")) {
      return message.reply(`✨ 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${this.config.name} [𝑞𝑢𝑒𝑟𝑦] - [𝑛𝑢𝑚𝑏𝑒𝑟]\n📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: ${this.config.name} 𝑐𝑢𝑡𝑒 𝑐𝑜𝑢𝑝𝑙𝑒 - 5`, event.threadID);
    }

    const [searchTerm, countStr] = query.split("-").map(str => str.trim());
    const count = Math.min(parseInt(countStr) || 1, 10);

    const cacheDir = path.join(__dirname, "cache", "pintrest");
    await fs.ensureDir(cacheDir);
    
    const apiUrl = `https://rudra-pintrest-server-wg55.onrender.com/dp?q=${encodeURIComponent(searchTerm)}&n=${count}`;
    const response = await axios.get(apiUrl, { timeout: 15000 });

    if (!response.data?.data?.length) {
      return message.reply("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑. 𝑇𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚!", event.threadID);
    }

    const images = response.data.data.slice(0, count);
    const attachments = [];

    for (const [index, imageUrl] of images.entries()) {
      try {
        const imagePath = path.join(cacheDir, `pinterest_${Date.now()}_${index}.jpg`);
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 20000
        });
        
        await fs.writeFile(imagePath, imageResponse.data);
        attachments.push(fs.createReadStream(imagePath));
      } catch (error) {
        console.error(`𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 ${index + 1}:`, error.message);
      }
    }

    if (attachments.length === 0) {
      return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝑖𝑚𝑎𝑔𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.", event.threadID);
    }

    const successMessage = `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑓𝑒𝑡𝑐ℎ𝑒𝑑 ${attachments.length} 𝑖𝑚𝑎𝑔𝑒(𝑠) 𝑢𝑠𝑖𝑛𝑔 "${searchTerm}"\n${lockedTagline}`;
    verifyTagline(successMessage);

    await message.reply({
      body: successMessage,
      attachment: attachments
    }, event.threadID);

    // Cleanup
    setTimeout(async () => {
      try {
        const files = await fs.readdir(cacheDir);
        for (const file of files) {
          if (file.includes('pinterest_')) {
            await fs.unlink(path.join(cacheDir, file));
          }
        }
      } catch (cleanupError) {
        console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError.message);
      }
    }, 5000);

  } catch (error) {
    console.error("𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error.message);
    message.reply("⚠️ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!", event.threadID);
  }
};
