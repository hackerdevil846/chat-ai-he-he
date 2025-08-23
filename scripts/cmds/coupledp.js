const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Enhanced security with immutable credits
const lockedCredits = Object.freeze("𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅");
const lockedTagline = Object.freeze("💚 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅");

// 🔐 Tamper-proof verification
function verifyTagline(text) {
  if (!text.includes(lockedTagline)) {
    throw new Error("🚫 𝑼𝒏𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒎𝒐𝒅𝒊𝒇𝒊𝒄𝒂𝒕𝒊𝒐𝒏 𝒅𝒆𝒕𝒆𝒄𝒕𝒆𝒅");
  }
}

module.exports.config = {
  name: "pintrest",
  version: "2.0.0",
  hasPermssion: 0,
  credits: lockedCredits,
  description: "📸 𝑭𝒆𝒕𝒄𝒉 𝒄𝒐𝒖𝒑𝒍𝒆 𝒅𝒑 𝒊𝒎𝒂𝒈𝒆𝒔 𝒇𝒓𝒐𝒎 𝑷𝒊𝒏𝒕𝒆𝒓𝒆𝒔𝒕",
  category: "𝗙𝗨𝗡",
  usages: "[query] - [number]",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query.includes("-")) {
      return api.sendMessage(`✨ 𝗨𝘀𝗮𝗴𝗲 𝗚𝘂𝗶𝗱𝗲:\n${this.config.name} [query] - [number]\n📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${this.config.name} cute couple - 5`, event.threadID);
    }

    const [searchTerm, countStr] = query.split("-").map(str => str.trim());
    const count = Math.min(parseInt(countStr) || 1, 10);

    const cacheDir = path.join(__dirname, "cache", "pintrest");
    await fs.ensureDir(cacheDir);
    
    const apiUrl = `https://rudra-pintrest-server-wg55.onrender.com/dp?q=${encodeURIComponent(searchTerm)}&n=${count}`;
    const response = await axios.get(apiUrl, { timeout: 15000 });

    if (!response.data?.data?.length) {
      return api.sendMessage("❌ 𝗡𝗼 𝗶𝗺𝗮𝗴𝗲𝘀 𝗳𝗼𝘂𝗻𝗱. 𝗧𝗿𝘆 𝗮 𝗱𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝘁 𝘀𝗲𝗮𝗿𝗰𝗵 𝘁𝗲𝗿𝗺!", event.threadID);
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
        console.error(`Error downloading image ${index + 1}:`, error.message);
      }
    }

    const successMessage = `✅ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗳𝗲𝘁𝗰𝗵𝗲𝗱 ${attachments.length} 𝗶𝗺𝗮𝗴𝗲(𝘀) 𝘂𝘀𝗶𝗻𝗴 "${searchTerm}"\n${lockedTagline}`;
    verifyTagline(successMessage);

    await api.sendMessage({
      body: successMessage,
      attachment: attachments
    }, event.threadID);

    // Cleanup
    for (const file of attachments) {
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError.message);
      }
    }

  } catch (error) {
    console.error("Command error:", error.message);
    api.sendMessage("⚠️ 𝗘𝗿𝗿𝗼𝗿 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗿𝗲𝗾𝘂𝗲𝘀𝘁. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿!", event.threadID);
  }
};
