const axios = require("axios");

module.exports = {
  config: {
    name: "flux",
    version: "2.0",
    role: 0,
    author: "Dipto",
    description: "Generate AI-powered images with Flux technology",
    category: "image",
    usage: "{pn} [prompt] --ratio [width:height]",
    example: "{pn} cyberpunk cityscape --ratio 16:9",
    cooldown: 15
  },

  onStart: async function ({ api, event, args }) {
    const apiUrl = "https://www.noobs-api.rf.gd/dipto/flux";
    
    try {
      // Check if no prompt provided
      if (args.length === 0) {
        return api.sendMessage(
          "ℹ️ Usage: flux [prompt] --ratio [dimensions]\nExample: flux magical forest at sunset --ratio 16:9", 
          event.threadID, 
          event.messageID
        );
      }

      const fullPrompt = args.join(" ");
      let prompt, ratio = "1:1";

      // Extract prompt and ratio
      if (fullPrompt.includes("--ratio")) {
        const parts = fullPrompt.split("--ratio");
        prompt = parts[0].trim();
        ratio = parts[1] ? parts[1].trim() : "1:1";
      } else {
        prompt = fullPrompt;
      }

      // Validate ratio format
      if (!ratio.match(/^\d+:\d+$/)) {
        return api.sendMessage(
          "⚠️ Invalid ratio format! Please use format like 16:9 or 1:1", 
          event.threadID, 
          event.messageID
        );
      }

      // Send waiting message
      const waitMsg = await api.sendMessage(
        "🔄 Generating your Flux image... Please wait 10-20 seconds", 
        event.threadID
      );

      const startTime = Date.now();

      // Generate image from API
      const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`, {
        responseType: "stream",
        timeout: 60000 // 60 seconds timeout
      });

      // Calculate generation time
      const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
      
      // Delete waiting message
      await api.unsendMessage(waitMsg.messageID);

      // Send result with image
      return api.sendMessage(
        {
          body: `✨ Successfully generated in ${generationTime} seconds\n📝 Prompt: "${prompt}"\n📐 Aspect Ratio: ${ratio}`,
          attachment: response.data
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error("Flux Command Error:", error);
      
      let errorMessage = "⚠️ Image generation failed! ";
      
      // Handle specific error cases
      if (error.response) {
        errorMessage += `(API Error: ${error.response.status})`;
      } else if (error.code === "ECONNABORTED") {
        errorMessage += "Request timed out. Please try again later.";
      } else if (error.message.includes("timeout")) {
        errorMessage += "The request took too long. Please try a simpler prompt.";
      } else {
        errorMessage += error.message;
      }
      
      return api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  }
};
