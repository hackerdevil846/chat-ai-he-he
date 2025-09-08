module.exports = {
  config: {
    name: "bgremove",
    version: "1.1.1",
    role: 0,
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    category: "utility",
    shortDescription: {
      en: "𝑅𝑒𝑚𝑜𝑣𝑒 𝑖𝑚𝑎𝑔𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑"
    },
    longDescription: {
      en: "𝑅𝑒𝑚𝑜𝑣𝑒 𝑡ℎ𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑜𝑓 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
      en: "{p}bgremove [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒]"
    },
    dependencies: {
      "form-data": "",
      "image-downloader": "",
      "axios": "",
      "fs-extra": ""
    }
  },

  onStart: async function ({ api, event }) {
    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs-extra');
    const path = require('path');
    const { image } = require('image-downloader');

    try {
      if (!event.messageReply) {
        return api.sendMessage("📸 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑!", event.threadID, event.messageID);
      }
      
      if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒!", event.threadID, event.messageID);
      }
      
      if (event.messageReply.attachments[0].type !== "photo") {
        return api.sendMessage("❌ 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑛𝑜𝑡 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒!", event.threadID, event.messageID);
      }

      const content = event.messageReply.attachments[0].url;
      const KeyApi = [
        "t4Jf1ju4zEpiWbKWXxoSANn4", "CTWSe4CZ5AjNQgR8nvXKMZBd", 
        "PtwV35qUq557yQ7ZNX1vUXED", "wGXThT64dV6qz3C6AhHuKAHV", 
        "82odzR95h1nRp97Qy7bSRV5M", "4F1jQ7ZkPbkQ6wEQryokqTmo", 
        "sBssYDZ8qZZ4NraJhq7ySySR", "NuZtiQ53S2F5CnaiYy4faMek", 
        "f8fujcR1G43C1RmaT4ZSXpwW"
      ];
      
      const inputPath = path.resolve(__dirname, 'cache', `photo_${Date.now()}.png`);
      
      // Download the image
      await image({
        url: content,
        dest: inputPath
      });

      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
      
      // Process with remove.bg API
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
        },
        encoding: null
      });

      if (response.status !== 200) {
        throw new Error(`𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟: ${response.status}`);
      }

      // Save processed image
      fs.writeFileSync(inputPath, response.data);
      
      // Send result
      await api.sendMessage({
        body: "🖼️ 𝗕𝗔𝗖𝗞𝗚𝗥𝗢𝗨𝗡𝗗 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬!\n━━━━━━━━━━━━━━━━━━\n✅ 𝐵𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑟𝑒𝑚𝑜𝑣𝑒𝑑 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑙𝑦!",
        attachment: fs.createReadStream(inputPath)
      }, event.threadID);
      
      // Clean up
      fs.unlinkSync(inputPath);
      
    } catch (error) {
      console.error("𝐵𝑔𝑟𝑒𝑚𝑜𝑣𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
      api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!", event.threadID, event.messageID);
    }
  }
};
