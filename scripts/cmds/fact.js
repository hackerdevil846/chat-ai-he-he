const axios = require('axios');

module.exports = {
  config: {
    name: "fact",
    version: "1.3.0",
    hasPermission: 0,
    credits: "Asif",
    description: "Get random interesting facts from various categories",
    category: "education",
    usages: "fact [category]",
    cooldowns: 5,
    dependencies: {
      "axios": ""
    }
  },

  categories: ["science", "history", "animals", "space", "tech", "random"],

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;
    
    try {
      // Get category from arguments or use random
      let category = args[0]?.toLowerCase();
      const validCategories = this.categories;
      
      // Show available categories if user requests help
      if (args[0] === "help") {
        const categoryList = validCategories.map(cat => `• ${cat.charAt(0).toUpperCase() + cat.slice(1)}`).join("\n");
        return api.sendMessage(
          `📚 Fact Command Usage\n━━━━━━━━━━━━━━\nUsage: fact [category]\n\nAvailable Categories:\n${categoryList}\n\nExample: fact space`,
          threadID,
          messageID
        );
      }
      
      if (category && !validCategories.includes(category)) {
        return api.sendMessage(
          `⚠️ Invalid category! Available categories:\n${validCategories.join(", ")}\n\nUse "fact help" for more info.`,
          threadID,
          messageID
        );
      }
      
      category = category || "random";
      
      // Send processing message
      const processingMsg = await api.sendMessage(
        "🔍 Searching for an interesting fact...",
        threadID
      );
      
      // Get fact from API with timeout
      const response = await axios.get(
        `https://api.popcat.xyz/fact?category=${category}`, 
        { timeout: 5000 }
      );
      
      const factData = response.data;
      
      if (!factData || !factData.fact) {
        throw new Error("Invalid API response");
      }
      
      // Format response with attractive styling
      const formattedFact = `🧠 𝗙𝗔𝗖𝗧 𝗢𝗙 𝗧𝗛𝗘 𝗗𝗔𝗬\n━━━━━━━━━━━━━━\n${factData.fact}\n\n📦 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${category.toUpperCase()}`;
      
      // Unsend processing message and send fact
      await api.unsendMessage(processingMsg.messageID);
      api.sendMessage(formattedFact, threadID, messageID);
      
    } catch (error) {
      console.error("Fact command error:", error);
      
      let errorMessage;
      if (error.code === 'ECONNABORTED') {
        errorMessage = "⌛ Request timed out. Please try again!";
      } else if (error.response) {
        errorMessage = "⚠️ Fact API is currently unavailable. Please try again later.";
      } else {
        errorMessage = "❌ Failed to retrieve a fact. Please try again!";
      }
      
      api.sendMessage(errorMessage, threadID, messageID);
    }
  }
};
