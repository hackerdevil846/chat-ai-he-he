const axios = require("axios");

module.exports = {
  config: {
    name: "numinfo",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "Get detailed information about any phone number",
    category: "information",
    usages: "numinfo [international phone number]",
    cooldowns: 10,
    dependencies: {
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (!args[0]) {
      return api.sendMessage("⚠️ Please provide an international phone number!\nExample: numinfo +12124561234", threadID, messageID);
    }

    try {
      // Set loading indicator
      api.setMessageReaction("⌛", messageID, (err) => {
        if (err) console.error("Reaction error:", err);
      }, true);

      // Clean and validate number
      let number = args[0].trim().replace(/[^\d+]/g, '');
      
      if (!number.startsWith('+') || number.length < 8) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage("❌ Invalid format! Please use international format:\nExample: numinfo +12124561234", threadID, messageID);
      }

      // Prepare API request
      const apiUrl = `https://telephone-number-info.p.rapidapi.com/rapidapi/telephone-number-info/index.php?phoneNumber=${encodeURIComponent(number)}`;
      
      const response = await axios.get(apiUrl, {
        headers: {
          'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
          'x-rapidapi-host': 'telephone-number-info.p.rapidapi.com'
        },
        timeout: 15000
      });

      // Process response
      let resultText = `📱 Phone Number Information for ${number}:\n\n`;
      const data = response.data;
      
      for (const [key, value] of Object.entries(data)) {
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        resultText += `• ${formattedKey}: ${value}\n`;
      }

      // Add disclaimer
      resultText += "\nℹ️ Information provided by Telephone Number Info API";

      // Send result
      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(resultText, threadID, messageID);
    } 
    catch (error) {
      console.error("Numinfo Error:", error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      
      let errorMsg = "❌ Failed to fetch number information\n\n";
      
      if (error.response) {
        errorMsg += `🔧 Server Error: ${error.response.status}\n`;
        errorMsg += `📄 Response: ${error.response.data ? JSON.stringify(error.response.data).substring(0, 100) : 'No data'}`;
      } else if (error.request) {
        errorMsg += "⏱️ Request timed out. Please try again later.";
      } else {
        errorMsg += `⚠️ Error: ${error.message}`;
      }
      
      return api.sendMessage(errorMsg, threadID, messageID);
    }
  }
};
