const axios = require("axios");

module.exports.config = {
  name: "nhentai",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Asif",
  description: "Search for information about hentai manga on nhentai",
  category: "nsfw",
  usages: "[ID]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  try {
    const { threadID, messageID } = event;
    
    // Generate random code if no ID is provided
    if (!args[0] || isNaN(parseInt(args[0]))) {
      const randomCode = Math.floor(Math.random() * 99999);
      return api.sendMessage(
        `🔞 The ideal code for you: ${randomCode}`,
        threadID,
        messageID
      );
    }

    const code = parseInt(args[0]);
    
    // Send processing message
    const processingMsg = await api.sendMessage(
      "🔍 Searching nhentai...",
      threadID
    );

    try {
      // Fetch manga data from nhentai API
      const response = await axios.get(`https://nhentai.net/api/gallery/${code}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const codeData = response.data;
      
      const title = codeData.title.pretty;
      let tags = [];
      let artists = [];
      let characters = [];

      // Process tags
      codeData.tags.forEach(item => {
        switch(item.type) {
          case "tag":
            tags.push(item.name);
            break;
          case "artist":
            artists.push(item.name);
            break;
          case "character":
            characters.push(item.name);
            break;
        }
      });

      const tagList = tags.join(', ') || "None";
      const artistList = artists.join(', ') || "Unknown";
      const characterList = characters.join(', ') || "Original";
      
      // Format and send result
      const resultMessage = 
        `🎨 Title: ${title}\n` +
        `👩‍🎨 Artist: ${artistList}\n` +
        `👤 Characters: ${characterList}\n` +
        `🏷️ Tags: ${tagList}\n` +
        `🔗 Link: https://nhentai.net/g/${code}/`;
      
      // Unsend processing message and send result
      api.unsendMessage(processingMsg.messageID);
      return api.sendMessage(resultMessage, threadID, messageID);
      
    } catch (apiError) {
      // Handle API errors
      api.unsendMessage(processingMsg.messageID);
      return api.sendMessage(
        "❌ Can't find your hentai manga! Please check the ID and try again.",
        threadID,
        messageID
      );
    }
  } catch (error) {
    console.error('nhentai command error:', error);
    api.sendMessage(
      "❌ An error occurred while processing your request. Please try again later.",
      threadID,
      messageID
    );
  }
};
