const axios = require("axios");

module.exports = {
  config: {
    name: "setavt",
    aliases: [],
    version: "1.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "owner",
    shortDescription: {
      en: "🖼️ Change bot avatar (URL or reply image)"
    },
    longDescription: {
      en: "🖼️ Change bot avatar with URL or replied image. Supports optional caption and temporary avatar expiration."
    },
    guide: {
      en: "{p}setavt [image URL | reply image] [caption] [expirationAfter (seconds)]"
    },
    dependencies: {
      "axios": ""
    }
  },

  onStart: async function ({ message, event, args, api }) {
    try {
      // Enhanced dependency check
      let axiosAvailable = true;
      try {
        if (typeof axios !== 'object' || typeof axios.get !== 'function') {
          axiosAvailable = false;
        }
      } catch (err) {
        axiosAvailable = false;
      }

      if (!axiosAvailable) {
        return message.reply("❌ | Required dependency 'axios' is missing or corrupted. Please reinstall it.");
      }

      // Build comprehensive usage guide
      const usageText = `📖 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n${this.config.guide.en}\n\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n• ${this.config.name} https://example.com/image.jpg\n• ${this.config.name} https://example.com/image.jpg "My Caption" 3600\n• Reply to an image with: ${this.config.name}\n• Reply to image with caption: ${this.config.name} "My Caption" 7200`;

      // Parse arguments and extract image URL
      let imageURL = null;
      let caption = "";
      let expirationAfter = null;
      
      // Check if first argument is a URL
      if (args[0] && (args[0].startsWith("http://") || args[0].startsWith("https://"))) {
        imageURL = args.shift();
      }
      
      // Check for attachments in current message
      if (!imageURL && event.attachments && event.attachments.length > 0) {
        const imageAttachment = event.attachments.find(att => 
          att.type === "photo" || att.type === "animated_image" || 
          (att.url && att.url.match(/\.(jpg|jpeg|png|gif|webp)/i))
        );
        if (imageAttachment) {
          imageURL = imageAttachment.url;
        }
      }
      
      // Check for attachments in replied message
      if (!imageURL && event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const imageAttachment = event.messageReply.attachments.find(att => 
          att.type === "photo" || att.type === "animated_image" || 
          (att.url && att.url.match(/\.(jpg|jpeg|png|gif|webp)/i))
        );
        if (imageAttachment) {
          imageURL = imageAttachment.url;
        }
      }

      // If still no image found, show usage
      if (!imageURL) {
        return message.reply(`❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡ℎ𝑎𝑡 𝑐𝑜𝑛𝑡𝑎𝑖𝑛𝑠 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒.\n\n${usageText}`);
      }

      // Validate URL format
      try {
        new URL(imageURL);
      } catch (urlError) {
        return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑈𝑅𝐿 𝑓𝑜𝑟𝑚𝑎𝑡: ${imageURL}\n\n${usageText}`);
      }

      // Parse remaining arguments for caption and expiration
      const remainingArgs = [...args];
      
      // Check if last argument is a number (expiration)
      if (remainingArgs.length > 0) {
        const lastArg = remainingArgs[remainingArgs.length - 1];
        if (!isNaN(lastArg) && lastArg.trim() !== "") {
          expirationAfter = parseInt(lastArg);
          if (expirationAfter > 0) {
            remainingArgs.pop(); // Remove expiration from args
          } else {
            expirationAfter = null;
          }
        }
      }

      // Remaining args become caption
      caption = remainingArgs.join(" ").trim();

      // Validate expiration value
      if (expirationAfter !== null && (expirationAfter < 60 || expirationAfter > 2592000)) {
        return message.reply("❌ 𝐸𝑥𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛 𝑡𝑖𝑚𝑒 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑏𝑒𝑡𝑤𝑒𝑒𝑛 60 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 (1 𝑚𝑖𝑛𝑢𝑡𝑒) 𝑎𝑛𝑑 2592000 𝑠𝑒𝑐𝑜𝑛𝑑𝑠 (30 𝑑𝑎𝑦𝑠).");
      }

      // Send processing message
      const processingMsg = await message.reply("⏳ 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 𝑎𝑛𝑑 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔...");

      // Fetch image with comprehensive error handling
      let response;
      try {
        response = await axios.get(imageURL, { 
          responseType: "stream", 
          timeout: 30000,
          maxContentLength: 10 * 1024 * 1024, // 10MB limit
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/jpeg,image/png,image/gif,image/webp,*/*'
          }
        });
      } catch (fetchError) {
        await message.unsend(processingMsg.messageID);
        
        if (fetchError.code === 'ECONNREFUSED') {
          return message.reply("❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑟𝑣𝑒𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑈𝑅𝐿.");
        } else if (fetchError.code === 'ETIMEDOUT') {
          return message.reply("❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑇ℎ𝑒 𝑖𝑚𝑎𝑔𝑒 𝑠𝑒𝑟𝑣𝑒𝑟 𝑖𝑠 𝑡𝑎𝑘𝑖𝑛𝑔 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔 𝑡𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑑.");
        } else if (fetchError.response) {
          return message.reply(`❌ 𝐻𝑇𝑇𝑃 𝐸𝑟𝑟𝑜𝑟: ${fetchError.response.status} - ${fetchError.response.statusText}`);
        } else {
          return message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒: ${fetchError.message}`);
        }
      }

      // Validate content-type header
      const contentType = response.headers['content-type'] || response.headers['Content-Type'] || '';
      if (!contentType.includes('image/')) {
        await message.unsend(processingMsg.messageID);
        return message.reply(`❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑓𝑜𝑟𝑚𝑎𝑡. 𝑅𝑒𝑐𝑒𝑖𝑣𝑒𝑑: ${contentType}. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑖𝑚𝑎𝑔𝑒 𝑈𝑅𝐿.`);
      }

      // Validate file size
      const contentLength = response.headers['content-length'];
      if (contentLength && parseInt(contentLength) > 8 * 1024 * 1024) {
        await message.unsend(processingMsg.messageID);
        return message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑖𝑠 𝑡𝑜𝑜 𝑙𝑎𝑟𝑔𝑒. 𝑀𝑎𝑥𝑖𝑚𝑢𝑚 𝑠𝑖𝑧𝑒 𝑖𝑠 8𝑀𝐵.");
      }

      // Set path for stream compatibility
      try {
        if (response.data && typeof response.data === 'object') {
          response.data.path = "avatar.jpg";
        }
      } catch (pathError) {
        console.warn("𝑊𝑎𝑟𝑛𝑖𝑛𝑔: 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑠𝑒𝑡 𝑝𝑎𝑡ℎ 𝑜𝑛 𝑠𝑡𝑟𝑒𝑎𝑚:", pathError.message);
      }

      // Update processing message
      await message.unsend(processingMsg.messageID);
      const updatingMsg = await message.reply("🔄 𝑈𝑝𝑑𝑎𝑡𝑖𝑛𝑔 𝑏𝑜𝑡 𝑎𝑣𝑎𝑡𝑎𝑟...");

      // Attempt to change avatar
      try {
        // Convert expiration to milliseconds if provided
        const expirationMs = expirationAfter ? expirationAfter * 1000 : null;
        
        // Use global API method for changing avatar
        if (typeof global.utils.changeAvatar === 'function') {
          await global.utils.changeAvatar(response.data, caption, expirationMs);
        } else {
          // Fallback method if changeAvatar is not available
          await api.changeAvatar(response.data);
        }
        
        await message.unsend(updatingMsg.messageID);
        
        let successMessage = "✅ 𝐵𝑜𝑡 𝑎𝑣𝑎𝑡𝑎𝑟 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!";
        if (caption) {
          successMessage += `\n📝 𝐶𝑎𝑝𝑡𝑖𝑜𝑛: ${caption}`;
        }
        if (expirationAfter) {
          const hours = Math.floor(expirationAfter / 3600);
          const minutes = Math.floor((expirationAfter % 3600) / 60);
          successMessage += `\n⏰ 𝐸𝑥𝑝𝑖𝑟𝑒𝑠 𝑖𝑛: ${hours}ℎ ${minutes}𝑚`;
        }
        
        return message.reply(successMessage);
        
      } catch (avatarError) {
        await message.unsend(updatingMsg.messageID);
        
        console.error("𝐴𝑣𝑎𝑡𝑎𝑟 𝐶ℎ𝑎𝑛𝑔𝑒 𝐸𝑟𝑟𝑜𝑟:", avatarError);
        
        let errorMessage = "❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐ℎ𝑎𝑛𝑔𝑖𝑛𝑔 𝑎𝑣𝑎𝑡𝑎𝑟.";
        
        if (avatarError.message.includes('permission')) {
          errorMessage += "\n🔒 𝐼𝑛𝑠𝑢𝑓𝑓𝑖𝑐𝑖𝑒𝑛𝑡 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛𝑠 𝑡𝑜 𝑐ℎ𝑎𝑛𝑔𝑒 𝑎𝑣𝑎𝑡𝑎𝑟.";
        } else if (avatarError.message.includes('rate limit')) {
          errorMessage += "\n⏳ 𝑅𝑎𝑡𝑒 𝑙𝑖𝑚𝑖𝑡 𝑒𝑥𝑐𝑒𝑒𝑑𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
        } else if (avatarError.message) {
          errorMessage += `\n📄 ${avatarError.message}`;
        }
        
        return message.reply(errorMessage);
      }

    } catch (error) {
      console.error("💥 𝑆𝑒𝑡𝑎𝑣𝑡 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
      
      let errorMessage = "❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡.";
      
      if (error.code === 'ENOTFOUND') {
        errorMessage = "❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑠𝑜𝑙𝑣𝑒 𝑡ℎ𝑒 𝑑𝑜𝑚𝑎𝑖𝑛 𝑛𝑎𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑈𝑅𝐿.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "❌ 𝑂𝑝𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
      }
      
      return message.reply(errorMessage);
    }
  }
};
