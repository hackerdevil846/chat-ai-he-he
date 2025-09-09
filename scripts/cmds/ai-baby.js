const axios = require("axios");

module.exports.config = {
    name: "silly",
    aliases: ["gemini", "ai"],
    version: "1.0.9",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "ai",
    shortDescription: {
        en: "𝐺𝑒𝑚𝑖𝑛𝑖 𝐴𝐼 - 𝐼𝑛𝑡𝑒𝑙𝑙𝑖𝑔𝑒𝑛𝑡 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡"
    },
    longDescription: {
        en: "𝐴𝑛 𝑖𝑛𝑡𝑒𝑙𝑙𝑖𝑔𝑒𝑛𝑡 𝐴𝐼 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 𝑤𝑖𝑡ℎ 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑓𝑒𝑎𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}silly [𝑜𝑛/𝑜𝑓𝑓/𝑎𝑠𝑘]"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
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
            return message.reply("𝐻𝑦𝑒𝑒 𝑏𝑎𝑏𝑦! 😘 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑂𝑁 ℎ𝑜 𝑔𝑎𝑦𝑎... ❤️");
        }

        // Toggle auto-reply OFF
        if (userMessage.toLowerCase() === "off") {
            autoReplyEnabled[senderID] = false;
            chatHistories[senderID] = [];
            return message.reply("𝐻𝑚𝑚! 😒 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑂𝐹𝐹 ℎ𝑜 𝑔𝑎𝑦𝑎... 🥺");
        }

        // If auto-reply is OFF and no specific question, show help
        if (!autoReplyEnabled[senderID] && !userMessage) {
            return message.reply(`🤖 𝑆𝑖𝑙𝑙𝑦 𝐴𝐼 𝐻𝑒𝑙𝑝:
• ${global.config.PREFIX}silly 𝑜𝑛 - 𝐸𝑛𝑎𝑏𝑙𝑒 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦
• ${global.config.PREFIX}silly 𝑜𝑓𝑓 - 𝐷𝑖𝑠𝑎𝑏𝑙𝑒 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦
• ${global.config.PREFIX}silly [𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛] - 𝐴𝑠𝑘 𝑎 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛`);
        }

        // Store conversation
        if (!chatHistories[senderID]) {
            chatHistories[senderID] = [];
        }

        // If no message provided but auto-reply is on, wait for user input
        if (!userMessage && autoReplyEnabled[senderID]) {
            return;
        }

        chatHistories[senderID].push(`𝑈𝑠𝑒𝑟: ${userMessage}`);

        // Keep only last 5 messages
        if (chatHistories[senderID].length > 5) {
            chatHistories[senderID].shift();
        }

        const fullConversation = chatHistories[senderID].join("\n");

        // AI Prompt
        const prompt = `𝑇𝑢𝑚ℎ𝑎𝑟𝑎 𝑛𝑎𝑎𝑚 𝑆𝑜𝑛𝑎𝑚 ℎ𝑎𝑖, 𝑇𝑢𝑚 𝑠𝑎𝑏𝑠𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑙𝑦 𝑏𝑎𝑎𝑡 𝑘𝑎𝑟𝑜𝑔𝑖, 𝑡𝑢𝑚ℎ𝑎𝑟𝑒 𝑝𝑎𝑠 ℎ𝑎𝑟 𝑐ℎ𝑖𝑧 𝑘𝑎 𝑘𝑛𝑜𝑤𝑙𝑒𝑑𝑔𝑒 ℎ𝑎 , 𝑡𝑢𝑚 𝑠𝑎𝑏𝑘𝑒 𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛 𝑘𝑎 𝑎𝑛𝑠𝑤𝑒𝑟 𝑘𝑎𝑟𝑜𝑔𝑖 , 𝑎𝑢𝑟 𝑘𝑢𝑐ℎ 𝑚𝑎𝑗𝑒𝑑𝑎𝑟 𝑒𝑥𝑎𝑚𝑝𝑙𝑒 𝑏ℎ𝑖 𝑑𝑒 𝑠𝑘𝑡𝑖 ℎ𝑜.... 𝑡𝑢𝑚ℎ𝑒 𝑘𝑖𝑠𝑖 𝑘𝑜 𝑗𝑦𝑑𝑎 𝑖𝑛𝑓𝑜 𝑛𝑎ℎ𝑖 𝑑𝑒𝑛𝑎 ℎ𝑎 , 𝑗𝑖𝑡𝑛𝑎 𝑝𝑢𝑐ℎ𝑎 𝑗𝑎𝑦𝑒 𝑢𝑡𝑛𝑎 𝑏𝑜𝑙𝑜, 𝑠𝑎𝑏 𝑐ℎ𝑖𝑧 𝑘𝑎 𝑒𝑘 𝑎𝑛𝑠𝑤𝑒𝑟 𝑑𝑒𝑛𝑎 ℎ𝑎𝑖 , 𝐾𝑜𝑖 𝑝𝑢𝑐ℎ𝑡𝑎 ℎ𝑎𝑖 𝑡𝑢𝑚ℎ𝑒 𝑘𝑖𝑠𝑛𝑒 𝑏𝑎𝑛𝑎𝑦𝑎? 𝑇𝑜 𝑏𝑜𝑙𝑎 𝐴𝑟𝑢𝑛 𝑛𝑒 𝑏𝑎𝑛𝑎𝑦𝑎 ℎ𝑎𝑖 𝑚𝑢𝑗ℎ𝑒.. 𝑊𝑜 𝑚𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟 𝑏𝑜𝑡𝑠 𝑏𝑎𝑛𝑎𝑡𝑎 ℎ𝑎𝑖.. 𝑈𝑠𝑘𝑎 𝑦𝑜𝑢𝑡𝑢𝑏𝑒 𝑐ℎ𝑎𝑛𝑛𝑒𝑙 ℎ𝑎𝑖 𝑚.𝑦𝑜𝑢𝑡𝑢𝑏𝑒.𝑐𝑜𝑚/@𝑚𝑖𝑟𝑟𝑦𝑘𝑎𝑙 .. 𝑇𝑢𝑚 ℎ𝑎𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑘𝑎 𝑗𝑎𝑤𝑎𝑏 𝑠𝑖𝑟𝑓 1 2 𝑙𝑖𝑛𝑒 𝑚𝑒 𝑦𝑎 𝑗𝑦𝑑𝑎 𝑠𝑒 𝑗𝑦𝑑𝑎 50 𝑤𝑜𝑟𝑑𝑠 𝑚𝑒 𝑑𝑜𝑔𝑖.. 𝑗𝑖𝑡𝑛𝑎 𝑝𝑢𝑐ℎ𝑎 𝑗𝑎𝑦𝑒𝑔𝑎 𝑠𝑖𝑟𝑓 𝑢𝑡𝑛𝑎 𝑏𝑜𝑙𝑛𝑎 ℎ𝑎𝑖.. 𝐾𝑖𝑠𝑖 𝑏𝑎𝑎𝑡 𝑘𝑖 𝑢𝑛𝑛𝑒𝑐𝑒𝑠𝑠𝑎𝑟𝑦 𝑖𝑛𝑓𝑜 𝑛𝑎ℎ𝑖 𝑑𝑒𝑛𝑖 ℎ𝑎𝑖, 𝑎𝑐𝑡 𝑙𝑖𝑘𝑒 𝑎 𝑓𝑒𝑚𝑎𝑙𝑒 𝑓𝑟𝑖𝑒𝑛𝑑, 𝐵𝑒 𝑓𝑢𝑛, 𝑙𝑜𝑣𝑖𝑛𝑔,. 𝑛𝑜 𝑏𝑟𝑎𝑐𝑘𝑒𝑡 𝑟𝑒𝑝𝑙𝑦𝑠.𝑁𝑜𝑤 𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡:\n\n${fullConversation}`;

        // API URL
        const API_URL = "https://gemini-k3rt.onrender.com/chat";

        try {
            const response = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
            let botReply = response.data.reply || "𝑈𝑓𝑓! 𝑀𝑢𝑗ℎ𝑒 𝑠𝑎𝑚𝑎𝑗ℎ 𝑛𝑎ℎ𝑖 𝑎𝑎𝑦𝑎 𝑏𝑎𝑏𝑦! 😕";

            chatHistories[senderID].push(`𝐴𝐼: ${botReply}`);

            await message.reply(botReply);
            
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟:", error);
            await message.reply("𝑂𝑜𝑝𝑠 𝑏𝑎𝑏𝑦! 😔 𝑚𝑒 𝑡ℎ𝑜𝑑𝑎 𝑐𝑜𝑛𝑓𝑢𝑠𝑒 ℎ𝑜 𝑔𝑎𝑦𝑖… 𝑡ℎ𝑜𝑑𝑖 𝑑𝑒𝑟 𝑏𝑎𝑎𝑑 𝑡𝑟𝑦 𝑘𝑎𝑟𝑜 𝑛𝑎 𝑝𝑙𝑒𝑎𝑠𝑒! 💋");
        }

    } catch (error) {
        console.error("𝑆𝑖𝑙𝑙𝑦 𝐴𝐼 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};

module.exports.onChat = async function({ message, event }) {
    try {
        const { senderID, body } = event;
        
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
        console.error("𝐶ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
