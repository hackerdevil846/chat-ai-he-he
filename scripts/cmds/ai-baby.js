const axios = require("axios");

module.exports = {
  config: {
    name: "silly",
    version: "1.0.9",
    author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    role: 0,
    category: "ai",
    shortDescription: {
      en: "𝑮𝒆𝒎𝒊𝒏𝒊 𝑨𝑰 - 𝑰𝒏𝒕𝒆𝒍𝒍𝒊𝒈𝒆𝒏𝒕 𝒂𝒔𝒔𝒊𝒔𝒕𝒂𝒏𝒕"
    },
    longDescription: {
      en: "𝑨𝒏 𝒊𝒏𝒕𝒆𝒍𝒍𝒊𝒈𝒆𝒏𝒕 𝑨𝑰 𝒂𝒔𝒔𝒊𝒔𝒕𝒂𝒏𝒕 𝒘𝒊𝒕𝒉 𝒂𝒖𝒕𝒐-𝒓𝒆𝒑𝒍𝒚 𝒇𝒆𝒂𝒕𝒖𝒓𝒆𝒔"
    },
    guide: {
      en: "{p}silly [on/off/ask]"
    },
    cooldowns: 2
  },

  onStart: async function({ message, event, args }) {
    try {
      const { threadID, senderID } = event;
      let userMessage = args.join(" ");

      // User history and auto-reply state (stored in global for persistence)
      if (!global.sillyData) {
        global.sillyData = {
          chatHistories: {},
          autoReplyEnabled: {}
        };
      }

      const { chatHistories, autoReplyEnabled } = global.sillyData;

      // Toggle auto-reply ON
      if (userMessage.toLowerCase() === "on") {
        autoReplyEnabled[senderID] = true;
        return message.reply("Hyee baby! 😘 auto-reply mode **ON** ho gaya...  ❤️");
      }

      // Toggle auto-reply OFF
      if (userMessage.toLowerCase() === "off") {
        autoReplyEnabled[senderID] = false;
        chatHistories[senderID] = [];
        return message.reply("Hmm! 😒 auto-reply mode **OFF** ho gaya... 🥺");
      }

      // If auto-reply is OFF and no specific question, show help
      if (!autoReplyEnabled[senderID] && !userMessage) {
        return message.reply(`🤖 𝑺𝒊𝒍𝒍𝒚 𝑨𝑰 𝑯𝒆𝒍𝒑:
• ${global.config.PREFIX}silly on - 𝑬𝒏𝒂𝒃𝒍𝒆 𝒂𝒖𝒕𝒐-𝒓𝒆𝒑𝒍𝒚
• ${global.config.PREFIX}silly off - 𝑫𝒊𝒔𝒂𝒃𝒍𝒆 𝒂𝒖𝒕𝒐-𝒓𝒆𝒑𝒍𝒚
• ${global.config.PREFIX}silly [𝒒𝒖𝒆𝒔𝒕𝒊𝒐𝒏] - 𝑨𝒔𝒌 𝒂 𝒒𝒖𝒆𝒔𝒕𝒊𝒐𝒏`);
      }

      // Store conversation
      if (!chatHistories[senderID]) {
        chatHistories[senderID] = [];
      }

      // If no message provided but auto-reply is on, wait for user input
      if (!userMessage && autoReplyEnabled[senderID]) {
        return;
      }

      chatHistories[senderID].push(`User: ${userMessage}`);

      // Keep only last 5 messages
      if (chatHistories[senderID].length > 5) {
        chatHistories[senderID].shift();
      }

      const fullConversation = chatHistories[senderID].join("\n");

      // AI Prompt
      const prompt = `Tumhara naam Sonam hai, Tum sabse friendly baat karogi, tumhare pas har chiz ka knowledge ha , tum sabke question la answer karogi , aur kuch majedar example bhi de skti ho.... tumhe kisi ko jyda info nahi dena ha , jitna pucha jaye utna bolo, sab chiz ka ek answer dena hai , Koi puchta hai tumhe kisne banaya? To bola Arun ne banaya hai mujhe.. Wo messenger bots banata hai.. Uska youtube channel hai m.youtube.com/@mirrykal .. Tum har message ka jawab sirf 1 2 line me ya jyda se jyda  50 words me dogi.. jitna pucha jayega sirf utna bolna hai.. Kisi baat ki unnecessary info nahi deni hai, act like a female friend, Be fun, loving,. no bracket replys.Now continue the chat:\n\n${fullConversation}`;

      // API URL
      const API_URL = "https://gemini-k3rt.onrender.com/chat";

      try {
        const response = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
        let botReply = response.data.reply || "Uff! Mujhe samajh nahi aaya baby! 😕";

        chatHistories[senderID].push(`AI: ${botReply}`);

        await message.reply(botReply);
        
      } catch (error) {
        console.error("Error:", error);
        await message.reply("Oops baby! 😔 me thoda confuse ho gayi… thodi der baad try karo na please! 💋");
      }

    } catch (error) {
      console.error("Silly AI error:", error);
      await message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓.");
    }
  },

  onChat: async function({ message, event }) {
    try {
      const { senderID, body, messageReply } = event;
      
      if (!global.sillyData) {
        global.sillyData = {
          chatHistories: {},
          autoReplyEnabled: {}
        };
      }

      const { autoReplyEnabled } = global.sillyData;

      // Check if auto-reply is enabled for this user
      if (autoReplyEnabled[senderID] && body && !body.startsWith(global.config.PREFIX)) {
        // Process the message as if it was a command
        const args = body.split(" ");
        await this.onStart({ message, event, args });
      }
    } catch (error) {
      console.error("Chat handler error:", error);
    }
  }
};
