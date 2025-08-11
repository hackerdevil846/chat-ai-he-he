module.exports.config = {
  name: "xpic",
  version: "1.0.0",
  hasPermission: 0, // Fixed spelling error (was hasPermssion)
  credits: "Asif",
  description: "Search for images on Pinterest",
  category: "Search",
  usages: "[query] - [number of images]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage(
      `🔍 Please enter a search query!\nExample: ${global.config.PREFIX}pic cute cats - 5`,
      threadID,
      messageID
    );
  }

  const fullQuery = args.join(" ");
  
  if (!fullQuery.includes("-")) {
    return api.sendMessage(
      `⚠️ Format: ${global.config.PREFIX}pic [search query] - [number of images]\nExample: ${global.config.PREFIX}pic landscape sunset - 4`,
      threadID,
      messageID
    );
  }

  const [query, numInput] = fullQuery.split("-").map(item => item.trim());
  let numberSearch = parseInt(numInput) || 4;
  
  if (numberSearch > 20) numberSearch = 20;
  if (numberSearch < 1) numberSearch = 1;

  try {
    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json', {
      timeout: 5000
    });
    
    if (!apis.data || !apis.data.noobs) {
      throw new Error("API configuration not found");
    }
    
    const apiUrl = apis.data.noobs;
    const res = await axios.get(`${apiUrl}/pinterest?search=${encodeURIComponent(query)}`, {
      timeout: 10000
    });
    
    if (!res.data || !res.data.data || !Array.isArray(res.data.data)) {
      throw new Error("Invalid API response format");
    }
    
    const imageUrls = res.data.data.slice(0, numberSearch);

    if (imageUrls.length === 0) {
      return api.sendMessage(
        `❌ No images found for "${query}"`,
        threadID,
        messageID
      );
    }

    const imgData = [];
    const cacheFiles = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const path = __dirname + `/cache/pic_${i}_${Date.now()}.jpg`;
        const response = await axios.get(imageUrls[i], { 
          responseType: 'arraybuffer',
          timeout: 15000
        });
        
        fs.writeFileSync(path, Buffer.from(response.data, 'binary'));
        imgData.push(fs.createReadStream(path));
        cacheFiles.push(path);
      } catch (err) {
        console.log(`Skipping image ${i+1}: ${err.message}`);
      }
    }

    if (imgData.length === 0) {
      return api.sendMessage(
        "❌ All images failed to download. Please try again later.",
        threadID,
        messageID
      );
    }

    await api.sendMessage({
      body: `✅ Found ${imgData.length} image(s) for: "${query}"`,
      attachment: imgData
    }, threadID);

    cacheFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

  } catch (error) {
    console.error('Command execution error:', error);
    api.sendMessage(
      `⚠️ Error: ${error.message || "Failed to process your request"}`,
      threadID,
      messageID
    );
  }
};
