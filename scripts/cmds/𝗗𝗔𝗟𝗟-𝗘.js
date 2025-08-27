const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "𝗗𝗔𝗟𝗟-𝗘",
    aliases: ["dalle", "aiimage", "genimage"],
    version: "1.0",
    author: "𝗔𝘀𝗶𝗳",
    countDown: 50,
    role: 0,
    longDescription: {
      vi: '',
      en: "𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗵𝗶𝗴𝗵-𝗾𝘂𝗮𝗹𝗶𝘁𝘆 𝗶𝗺𝗮𝗴𝗲𝘀 𝘂𝘀𝗶𝗻𝗴 𝗗𝗔𝗟𝗟-𝗘 𝗔𝗜"
    },
    category: "𝗔𝗜 & 𝗚𝗣𝗧",
    guide: {
      vi: '',
      en: "{pn} <𝗽𝗿𝗼𝗺𝗽𝘁>"
    }
  },

  onStart: async function ({ api, commandName, event, args }) {
    try {
      api.setMessageReaction("🦆", event.messageID, (a) => {}, true);
      
      if (!args[0]) {
        return api.sendMessage("⚠️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝘁𝗲𝘅𝘁 𝗽𝗿𝗼𝗺𝗽𝘁 𝘁𝗼 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲.", event.threadID, event.messageID);
      }

      const prompt = args.join(' ');

      const response = await axios.get(`https://dall-e-tau-steel.vercel.app/kshitiz?prompt=${encodeURIComponent(prompt)}`);
      
      if (!response.data || !response.data.response) {
        throw new Error("Invalid API response");
      }

      const imageUrl = response.data.response;

      const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imgPath = path.join(__dirname, 'cache', 'dalle_image.jpg');
      await fs.outputFile(imgPath, imgResponse.data);
      const imgData = fs.createReadStream(imgPath);

      await api.sendMessage({ 
        body: `✅ 𝗗𝗔𝗟𝗟-𝗘 𝗜𝗺𝗮𝗴𝗲 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱\n━━━━━━━━━━━━━━\n🖼️ 𝗣𝗿𝗼𝗺𝗽𝘁: "${prompt}"\n━━━━━━━━━━━━━━\n✨ 𝗘𝗻𝗷𝗼𝘆 𝘆𝗼𝘂𝗿 𝗔𝗜-𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 𝗶𝗺𝗮𝗴𝗲!`, 
        attachment: imgData 
      }, event.threadID, event.messageID);

      await fs.remove(imgPath);
      
    } catch (error) {
      console.error("𝗘𝗿𝗿𝗼𝗿:", error);
      api.sendMessage("❌ 𝗘𝗿𝗿𝗼𝗿 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.", event.threadID, event.messageID);
    }
  }
};
