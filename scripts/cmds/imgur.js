const axios = require('axios');

module.exports = {
  config: {
    name: "imgur",
    aliases: ["imagehost", "imgupload"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
      en: "🖼️ 𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟"
    },
    longDescription: {
      en: "𝑈𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟 𝑎𝑛𝑑 𝑔𝑒𝑡 𝑑𝑖𝑟𝑒𝑐𝑡 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
      en: "{p}imgur [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒] 𝑜𝑟 𝑡𝑦𝑝𝑒 '𝑖𝑚𝑔𝑢𝑟' 𝑤𝑖𝑡ℎ 𝑎𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡"
    }
  },

  onStart: async function ({ message, event }) {
    await this.uploadImage(message, event);
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase().trim() === "imgur") {
      await this.uploadImage(message, event);
    }
  },

  uploadImage: async function (message, event) {
    const csbApi = async () => {
      try {
        const base = await axios.get(
          "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json",
          { timeout: 10000 }
        );
        
        if (!base.data || !base.data.csb) {
          throw new Error("Invalid API response structure");
        }
        
        return base.data.csb;
      } catch (error) {
        console.error("𝐴𝑃𝐼 𝐹𝑒𝑡𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡");
      }
    };

    let imageUrl;
    
    // Check for replied image
    if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
      const attachment = event.messageReply.attachments[0];
      if (attachment.type === "photo" || attachment.type === "image") {
        imageUrl = attachment.url;
      }
    } 
    // Check for attached image in current message
    else if (event.attachments && event.attachments.length > 0) {
      const attachment = event.attachments[0];
      if (attachment.type === "photo" || attachment.type === "image") {
        imageUrl = attachment.url;
      }
    }

    if (!imageUrl) {
      return message.reply('❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑟 𝑎𝑡𝑡𝑎𝑐ℎ 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒!');
    }

    try {
      // Validate image URL
      if (!imageUrl.startsWith('http')) {
        throw new Error("Invalid image URL");
      }

      const apiEndpoint = await csbApi();
      const apiUrl = `${apiEndpoint}/nazrul/imgur?link=${encodeURIComponent(imageUrl)}`;
      
      const response = await axios.get(apiUrl, { 
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      // Validate API response
      if (!response.data) {
        throw new Error("Empty response from Imgur API");
      }

      if (!response.data.uploaded || !response.data.uploaded.image) {
        throw new Error("Invalid response structure from Imgur API");
      }

      const imgurLink = response.data.uploaded.image;
      
      // Validate the Imgur link
      if (!imgurLink.startsWith('http')) {
        throw new Error("Invalid Imgur link received");
      }

      return message.reply(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑢𝑝𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n\n🖼️ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑙𝑖𝑛𝑘: ${imgurLink}`);

    } catch (error) {
      console.error("𝐼𝑚𝑔𝑢𝑟 𝑈𝑝𝑙𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑢𝑝𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒 𝑡𝑜 𝐼𝑚𝑔𝑢𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
      
      if (error.message.includes("timeout")) {
        errorMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage = "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
      } else if (error.message.includes("Invalid image URL")) {
        errorMessage = "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑.";
      } else if (error.message.includes("API endpoint")) {
        errorMessage = "🔧 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑙𝑎𝑡𝑒𝑟.";
      }
      
      return message.reply(errorMessage);
    }
  }
};
