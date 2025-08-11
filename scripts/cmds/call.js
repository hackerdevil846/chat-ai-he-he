const axios = require('axios');

module.exports = {
  config: {
    name: "call",
    author: "Asif",
    version: "1.0.1",
    category: "utility",
    shortDescription: "Call bomber (Educational use only)",
    longDescription: "Simulates call bombing for Bangladeshi numbers. Use responsibly.",
    guide: {
      en: "{prefix}call [01xxxxxxxxx]"
    },
    priority: 0,
    cooldowns: 30
  },

  onStart: async function ({ api, event, args }) {
    const { messageID, threadID } = event;
    const input = args[0];

    // Help message if no input
    if (!input) {
      return api.sendMessage(
        `📞 Call Command Usage:\n» .call [phone number]\n\nExample: .call 01712345678\n\nℹ️ This tool is for educational purposes only. Misuse for harassment is illegal.`,
        threadID,
        messageID
      );
    }

    // Validate Bangladeshi phone number format
    if (!/^01[0-9]{9}$/.test(input)) {
      return api.sendMessage(
        "❌ Invalid format! Please provide a valid Bangladeshi number (11 digits starting with '01')\n\nExample: 01712345678",
        threadID,
        messageID
      );
    }

    try {
      const processingMsg = await api.sendMessage(
        `📞 Initiating call sequence to: ${input}\n⏱️ Please wait 90 seconds...\n\n⚠️ Reminder: Use responsibly. Unethical use violates laws.`,
        threadID
      );

      // Make API request to call service
      await axios.get(`https://tbblab.shop/callbomber.php?mobile=${input}`);

      // Delete processing message after 90 seconds and send result
      setTimeout(async () => {
        try {
          await api.unsendMessage(processingMsg.messageID);
          api.sendMessage(
            `✅ Successfully completed call sequence to: ${input}\n\n📢 Educational reminder:\nThis simulation demonstrates security vulnerabilities. Always respect privacy laws and use knowledge ethically.`,
            threadID,
            messageID
          );
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }, 90000);

    } catch (error) {
      console.error("Call Command Error:", error);
      api.sendMessage(
        `❌ Failed to initiate calls: ${error.message}\n\nPossible reasons:\n• Service temporarily unavailable\n• Invalid number format\n• Server connection failed\n\nPlease try again later.`,
        threadID,
        messageID
      );
    }
  }
};
