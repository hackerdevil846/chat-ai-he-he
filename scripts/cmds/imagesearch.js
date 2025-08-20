module.exports.config = {
  name: "imagesearch",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
  description: "🖼️ | 𝑨𝒅𝒗𝒂𝒏𝒄𝒆𝒅 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑪𝒐𝒎𝒎𝒂𝒏𝒅",
  commandCategory: "𝗠𝗘𝗗𝗜𝗔",
  usages: "[𝒕𝒆𝒙𝒕] -[𝒏𝒖𝒎𝒃𝒆𝒓 𝒐𝒇 𝒊𝒎𝒂𝒈𝒆𝒔]",
  cooldowns: 10,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "googlethis": "",
    "cloudscraper": ""
  },
  envConfig: {
    maxResults: 12
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = global.nodemodule['axios'];
  const google = global.nodemodule["googlethis"];
  const cloudscraper = global.nodemodule["cloudscraper"];
  const fs = global.nodemodule["fs-extra"];
  
  try {
    // Parse arguments
    let query = "";
    let imageCount = 6; // Default number of images
    
    if (event.type === "message_reply") {
      query = event.messageReply.body;
    } else {
      const argsList = args.join(" ").split("-");
      query = argsList[0].trim();
      
      if (argsList.length > 1 && !isNaN(argsList[1])) {
        imageCount = parseInt(argsList[1]);
        // Limit to max 12 images to avoid performance issues
        imageCount = Math.min(imageCount, global.configModule[this.config.name].envConfig.maxResults);
      }
    }
    
    if (!query) {
      return api.sendMessage(`🔍 | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒔𝒆𝒂𝒓𝒄𝒉 𝒕𝒆𝒓𝒎\n\n📌 𝑬𝒙𝒂𝒎𝒑𝒍𝒆:\n• ${global.config.PREFIX}imagesearch cats\n• ${global.config.PREFIX}imagesearch beautiful scenery -8`, event.threadID, event.messageID);
    }
    
    // Send searching message
    api.sendMessage(`🔍 | 𝑺𝒆𝒂𝒓𝒄𝒉𝒊𝒏𝒈 𝒇𝒐𝒓 "${query}"...\n⏳ | 𝑷𝒍𝒆𝒂𝒔𝒆 𝒘𝒂𝒊𝒕...`, event.threadID, event.messageID);

    // Perform search
    let result = await google.image(query, { safe: false });
    
    if (result.length === 0) {
      return api.sendMessage(`❌ | 𝑵𝒐 𝒊𝒎𝒂𝒈𝒆𝒔 𝒇𝒐𝒖𝒏𝒅 𝒇𝒐𝒓 "${query}"\n\n💡 𝑻𝒓𝒚 𝒂 𝒅𝒊𝒇𝒇𝒆𝒓𝒆𝒏𝒕 𝒔𝒆𝒂𝒓𝒄𝒉 𝒕𝒆𝒓𝒎`, event.threadID, event.messageID);
    }

    let streams = [];
    let counter = 0;
    let downloadedImages = 0;
    
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(__dirname + '/cache')) {
      fs.mkdirSync(__dirname + '/cache');
    }

    // Download images
    for (let image of result) {
      if (counter >= imageCount) break;
      
      // Check if URL is valid image
      if (!/\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(image.url)) continue;
      
      let path = __dirname + `/cache/image-${Date.now()}-${counter}.jpg`;
      
      try {
        const response = await cloudscraper.get({
          uri: image.url,
          encoding: null,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        fs.writeFileSync(path, response);
        streams.push(fs.createReadStream(path));
        downloadedImages++;
        counter++;
      } catch (error) {
        console.log("Download error:", error);
        // Clean up failed download
        if (fs.existsSync(path)) fs.unlinkSync(path);
        continue;
      }
    }

    if (streams.length === 0) {
      return api.sendMessage("❌ | 𝑵𝒐 𝒊𝒎𝒂𝒈𝒆𝒔 𝒄𝒐𝒖𝒍𝒅 𝒃𝒆 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒆𝒅\n\n💡 𝑻𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓 𝒐𝒓 𝒖𝒔𝒆 𝒂 𝒅𝒊𝒇𝒇𝒆𝒓𝒆𝒏𝒕 𝒔𝒆𝒂𝒓𝒄𝒉 𝒕𝒆𝒓𝒎", event.threadID, event.messageID);
    }

    // Send results
    const message = {
      body: `🖼️ | 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕\n━━━━━━━━━━━━━━━━━━\n🔮 𝑸𝒖𝒆𝒓𝒚: "${query}"\n📊 𝑻𝒐𝒕𝒂𝒍 𝑭𝒐𝒖𝒏𝒅: ${result.length} 𝒊𝒎𝒂𝒈𝒆${result.length !== 1 ? '𝒔' : ''}\n📨 𝑺𝒆𝒏𝒅𝒊𝒏𝒈: ${streams.length} 𝒊𝒎𝒂𝒈𝒆${streams.length !== 1 ? '𝒔' : ''}\n\n💡 𝑻𝒊𝒑: 𝑹𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 "${global.config.PREFIX}imagesearch" 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒇𝒐𝒓 𝒊𝒎𝒂𝒈𝒆𝒔 𝒐𝒇 𝒕𝒉𝒂𝒕 𝒎𝒆𝒔𝒔𝒂𝒈𝒆\n━━━━━━━━━━━━━━━━━━`,
      attachment: streams
    };

    api.sendMessage(message, event.threadID, (err, info) => {
      if (err) console.error(err);
      
      // Clean up files after sending
      setTimeout(() => {
        streams.forEach((stream, index) => {
          let path = __dirname + `/cache/image-${Date.now()}-${index}.jpg`;
          if (fs.existsSync(path)) {
            fs.unlink(path, (err) => {
              if (err) console.error("Error deleting file:", err);
            });
          }
        });
      }, 5000);
    });

  } catch (error) {
    console.error("Image search error:", error);
    api.sendMessage("❌ | 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒓𝒆𝒒𝒖𝒆𝒔𝒕\n\n💡 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  // You can add functionality to handle replies to the search results if needed
};

module.exports.onLoad = function() {
  console.log('🖼️ | 𝑰𝒎𝒂𝒈𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑳𝒐𝒂𝒅𝒆𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚');
};
