module.exports = {
  config: {
    name: "unsend",
    aliases: [],
    version: "1.0.1",
    author: "Asif Mahmud",
    role: 0,
    category: "system",
    shortDescription: {
      en: "🗑️ Bot will unsend its own messages"
    },
    longDescription: {
      en: "Allows users to make the bot delete its own messages by replying to them"
    },
    guide: {
      en: "{p}unsend [reply to bot's message]"
    },
    countDown: 0
  },

  onStart: async function ({ api, event, message }) {
    try {
      // Check if it's a reply message
      if (event.type !== "message_reply" || !event.messageReply) {
        return message.reply("❌ Please reply to a message to unsend it");
      }

      // Get the bot's user ID
      const botUserID = api.getCurrentUserID();
      
      // Check if the replied message was sent by the bot
      if (event.messageReply.senderID.toString() !== botUserID.toString()) {
        return message.reply("❌ I can only unsend my own messages");
      }

      // Get the message ID to unsend
      const messageIDToUnsend = event.messageReply.messageID;

      // Verify the message exists and belongs to bot before unsending
      if (!messageIDToUnsend) {
        return message.reply("❌ Invalid message ID");
      }

      // Perform unsend operation
      await api.unsendMessage(messageIDToUnsend);
      
      console.log(`✅ Successfully unsent message: ${messageIDToUnsend}`);
      
    } catch (error) {
      console.error("💥 Unsend Command Error:", error);
      
      // Don't send error message to avoid spam if unsend fails
      // The error is already logged for debugging
    }
  }
};
