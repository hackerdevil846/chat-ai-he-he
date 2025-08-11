const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "zodiac",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "Information about the 12 zodiac animals",
  category: "Utilities",
  usages: "zodiac",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

// Constants
const ZODIAC_DIR = path.join(__dirname, "cache", "zodiac_images");
const IMAGE_URLS = {
  "sửu": "https://i.ibb.co/2F8sV2Q/11-RFXQx.jpg",
  "tý": "https://i.ibb.co/0QrVkzF/5-Hx-GOz7.jpg",
  "dần": "https://i.ibb.co/6wY3S2Q/g-Sz-X7n-L.jpg",
  "mão": "https://i.ibb.co/6rWvWcG/SVcd-KJp.jpg",
  "thìn": "https://i.ibb.co/Ks1qQfq/ANd-QTeq.jpg",
  "tỵ": "https://i.ibb.co/0X5yD6X/lnx-S2-Xr.jpg",
  "ngọ": "https://i.ibb.co/KyXz8b6/Fn-KVUKI.jpg",
  "mùi": "https://i.ibb.co/rZ6N0H6/f-OSI3wz.jpg",
  "thân": "https://i.ibb.co/7nW4XJj/h-PTcp-V5.jpg",
  "dậu": "https://i.ibb.co/2KvTtXk/ch-W3-Tc1.jpg",
  "tuất": "https://i.ibb.co/VtLk2W0/7i7-GU1t.jpg",
  "hợi": "https://i.ibb.co/fDvFpGx/h-J5nf-Ua.jpg"
};

// Create cache directory if not exists
if (!fs.existsSync(ZODIAC_DIR)) {
  fs.mkdirSync(ZODIAC_DIR, { recursive: true });
}

// Improved image download with rate limit handling
async function downloadImage(url, filePath, retries = 3) {
  try {
    // Add random cache-buster to avoid rate limiting
    const cacheBuster = `?t=${Date.now()}`;
    const response = await axios.get(`${url}${cacheBuster}`, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    await fs.writeFile(filePath, Buffer.from(response.data, 'binary'));
    return true;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying download (${retries} left) for ${path.basename(filePath)}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      return downloadImage(url, filePath, retries - 1);
    }
    console.error("Image download failed:", url, error.message);
    return false;
  }
}

// Zodiac data
const ZODIAC_DATA = {
  1: {
    body: "🐭 Rat (Tý) - (23:00-01:00)\n\nPeople born in the year of the Rat are usually very smart, quick-witted and adaptable. They have strong observation skills and are good at seizing opportunities. Rats are thrifty and usually have savings. However, they can sometimes be timid and conservative in the face of major decisions.",
    image: "tý.jpg"
  },
  2: {
    body: "🐂 Ox (Sửu) - (01:00-03:00)\n\nPeople born in the year of the Ox are diligent, persistent, and simple. They are known for their strong sense of responsibility and patience. Oxen are dependable workers but can be stubborn at times. They value tradition and are usually family-oriented.",
    image: "sửu.jpg"
  },
  3: {
    body: "🐅 Tiger (Dần) - (03:00-05:00)\n\nTigers are brave, competitive, and confident. They have strong leadership qualities and are good at solving crises. Tigers are adventurous but can be impulsive. They are usually respected but need to be careful about being too authoritative.",
    image: "dần.jpg"
  },
  4: {
    body: "🐈 Cat (Mão) - (05:00-07:00)\n\nPeople born in the year of the Cat are gentle, elegant, and kind. They have artistic talents and appreciate beauty in life. Cats avoid conflict and seek harmonious relationships. They can be reserved and cautious in new situations.",
    image: "mão.jpg"
  },
  5: {
    body: "🐉 Dragon (Thìn) - (07:00-09:00)\n\nDragons are energetic, charismatic, and ambitious. They are natural leaders who inspire others. Dragons are confident but can be arrogant. They are lucky in wealth but need to control their temper.",
    image: "thìn.jpg"
  },
  6: {
    body: "🐍 Snake (Tỵ) - (09:00-11:00)\n\nSnakes are wise, intuitive, and mysterious. They have excellent analytical skills and are good at business. Snakes value privacy and can be suspicious of others. They are determined but need to avoid being overly jealous.",
    image: "tỵ.jpg"
  },
  7: {
    body: "🐎 Horse (Ngọ) - (11:00-13:00)\n\nHorses are cheerful, popular, and independent. They have strong communication skills and love freedom. Horses are hardworking but can be impatient. They need to be careful about acting before thinking.",
    image: "ngọ.jpg"
  },
  8: {
    body: "🐐 Goat (Mùi) - (13:00-15:00)\n\nGoats are gentle, calm, and compassionate. They have artistic talents and value relationships. Goats can be indecisive and overly sensitive. They need more confidence in decision-making and should avoid pessimism.",
    image: "mùi.jpg"
  },
  9: {
    body: "🐒 Monkey (Thân) - (15:00-17:00)\n\nMonkeys are clever, innovative, and playful. They are quick learners and problem solvers. Monkeys can be mischievous and manipulative if not careful. They need to focus their energy and avoid being opportunistic.",
    image: "thân.jpg"
  },
  10: {
    body: "🐓 Rooster (Dậu) - (17:00-19:00)\n\nRoosters are observant, hardworking, and courageous. They are detail-oriented and good at planning. Roosters can be critical and perfectionistic. They need to be more flexible and less demanding of others.",
    image: "dậu.jpg"
  },
  11: {
    body: "🐕 Dog (Tuất) - (19:00-21:00)\n\nDogs are loyal, honest, and responsible. They have strong morals and protect loved ones. Dogs can be anxious and pessimistic. They need to relax more and not worry excessively about problems.",
    image: "tuất.jpg"
  },
  12: {
    body: "🐖 Pig (Hợi) - (21:00-23:00)\n\nPigs are generous, diligent, and compassionate. They enjoy life's pleasures and are good companions. Pigs can be naive and over-trusting. They need to be more discerning with people and manage resources wisely.",
    image: "hợi.jpg"
  }
};

// Initialize global objects safely
if (!global.goatBot) global.goatBot = {};
if (!global.goatBot.onReply) global.goatBot.onReply = new Map();

module.exports.onStart = async function() {
  // Initialization if needed
};

module.exports.run = async ({ api, event }) => {
  const menuMessage = `
🐐 Zodiac Animals Information 🐐
━━━━━━━━━━━━━━━━━━━━━

Choose a zodiac animal:
1. Rat (Tý) 🐭
2. Ox (Sửu) 🐂
3. Tiger (Dần) 🐅
4. Cat (Mão) 🐈
5. Dragon (Thìn) 🐉
6. Snake (Tỵ) 🐍
7. Horse (Ngọ) 🐎
8. Goat (Mùi) 🐐
9. Monkey (Thân) 🐒
10. Rooster (Dậu) 🐓
11. Dog (Tuất) 🐕
12. Pig (Hợi) 🐖

Reply with the number of your choice (1-12)`;

  api.sendMessage(menuMessage, event.threadID, (error, info) => {
    if (!error) {
      global.goatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    } else {
      console.error("Error sending zodiac menu:", error);
    }
  });
};

module.exports.onReply = async ({ api, event, handleReply }) => {
  const { threadID, messageID, body } = event;
  const choice = parseInt(body);

  if (isNaN(choice) || choice < 1 || choice > 12) {
    return api.sendMessage("⚠️ Invalid choice! Please select a number between 1-12", threadID, messageID);
  }

  try {
    const zodiac = ZODIAC_DATA[choice];
    const imagePath = path.join(ZODIAC_DIR, zodiac.image);
    const animal = zodiac.image.split('.')[0];
    
    if (!fs.existsSync(imagePath)) {
      api.sendMessage("⏳ Downloading zodiac image...", threadID, messageID);
      
      const url = IMAGE_URLS[animal];
      if (url) {
        const success = await downloadImage(url, imagePath);
        if (!success) {
          return api.sendMessage("❌ Failed to download zodiac image. Please try again later.", threadID, messageID);
        }
      } else {
        return api.sendMessage("⚠️ Image URL not found for this zodiac sign", threadID, messageID);
      }
    }

    api.sendMessage({
      body: zodiac.body,
      attachment: fs.createReadStream(imagePath)
    }, threadID, messageID);
    
  } catch (error) {
    console.error("Zodiac command error:", error);
    api.sendMessage("❌ Error processing zodiac information. Please try again later.", threadID, messageID);
  }
};
