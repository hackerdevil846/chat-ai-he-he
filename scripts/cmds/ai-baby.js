const axios = require("axios");

module.exports = {
    config: {
        name: "silly",
        aliases: [],
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
    },

    onStart: async function({ message, event, args, usersData }) {
        try {
            // Dependency check
            let axiosAvailable;
            try {
                axiosAvailable = true;
            } catch (e) {
                return message.reply("❌ 𝐴𝑥𝑖𝑜𝑠 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑛𝑒𝑖. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            const { threadID, senderID } = event;
            let userMessage = args.join(" ").trim();

            // Initialize global data structure
            if (!global.sillyData) {
                global.sillyData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑠𝑖𝑙𝑙𝑦𝐷𝑎𝑡𝑎");
            }

            const { chatHistories, autoReplyEnabled } = global.sillyData;

            // Toggle auto-reply ON
            if (userMessage.toLowerCase() === "on") {
                autoReplyEnabled[senderID] = true;
                console.log(`✅ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑒𝑛𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                return message.reply("💖 𝐻𝑒𝑦 𝑏𝑎𝑏𝑦! 😘 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑐ℎ𝑎𝑙𝑢 𝑘𝑜𝑟𝑙𝑎𝑚... ❤️");
            }

            // Toggle auto-reply OFF
            if (userMessage.toLowerCase() === "off") {
                autoReplyEnabled[senderID] = false;
                if (chatHistories[senderID]) {
                    chatHistories[senderID] = [];
                }
                console.log(`❌ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                return message.reply("😔 𝐻𝑚𝑚! 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑏𝑎𝑛𝑑 𝑘𝑜𝑟𝑙𝑎𝑚... 🥺");
            }

            // Show help if no message and auto-reply is off
            if (!userMessage && !autoReplyEnabled[senderID]) {
                const helpMessage = `🤖 𝑆𝑖𝑙𝑙𝑦 𝐴𝐼 𝐻𝑒𝑙𝑝:

💡 𝑈𝑠𝑎𝑔𝑒:
• ${global.config.PREFIX}silly on - 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑐ℎ𝑎𝑙𝑢 𝑘𝑜𝑟𝑏𝑒
• ${global.config.PREFIX}silly off - 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑏𝑎𝑛𝑑 𝑘𝑜𝑟𝑏𝑒  
• ${global.config.PREFIX}silly [𝑝𝑟𝑜𝑠𝑛𝑜] - 𝐴𝑚𝑎𝑘𝑒 𝑘𝑖𝑐ℎ𝑢 𝑗𝑖𝑔𝑒𝑠ℎ 𝑘𝑜𝑟𝑜

✨ 𝑓𝑒𝑎𝑡𝑢𝑟𝑒𝑠:
• 𝐵𝑢𝑑𝑑ℎ𝑖𝑚𝑎𝑛 𝑗𝑎𝑤𝑎𝑏
• 𝐺𝑎𝑙𝑝𝑎 𝑚𝑒𝑚𝑜𝑟𝑦 𝑟𝑎𝑘ℎ𝑒
• 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒
• 𝐹𝑟𝑖𝑒𝑛𝑑𝑙𝑦 𝑐ℎ𝑎𝑡𝑡𝑖𝑛𝑔`;
                return message.reply(helpMessage);
            }

            // If no message but auto-reply is on, wait for chat input
            if (!userMessage && autoReplyEnabled[senderID]) {
                console.log(`ℹ️ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑒𝑛𝑎𝑏𝑙𝑒𝑑 𝑏𝑢𝑡 𝑛𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                return;
            }

            // Validate user message
            if (!userMessage || userMessage.length === 0) {
                return message.reply("😕 𝐵𝑎𝑏𝑦, 𝑘𝑖𝑐ℎ𝑢 𝑡𝑜 𝑏𝑜𝑙𝑜 𝑛𝑎! 💬");
            }

            // Initialize chat history
            if (!chatHistories[senderID]) {
                chatHistories[senderID] = [];
                console.log(`📝 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑐ℎ𝑎𝑡 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
            }

            // Add user message to history
            chatHistories[senderID].push(`𝑈𝑠𝑒𝑟: ${userMessage}`);

            // Keep only last 5 messages for context
            if (chatHistories[senderID].length > 5) {
                chatHistories[senderID] = chatHistories[senderID].slice(-5);
                console.log(`📚 𝑇𝑟𝑢𝑛𝑐𝑎𝑡𝑒𝑑 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
            }

            const conversationHistory = chatHistories[senderID].join("\n");

            // AI Personality Prompt (Corrected Bangla Grammar)
            const aiPrompt = `𝑇𝑜𝑚𝑎𝑟 𝑛𝑎𝑚 𝑆𝑜𝑛𝑎𝑚. 𝑇𝑢𝑚𝑖 𝑠𝑜𝑏𝑎𝑖𝑟 𝑠𝑎𝑡ℎ𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑙𝑦 𝑏𝑎𝑏𝑦 𝑘𝑜𝑟𝑏𝑒. 𝑇𝑜𝑚𝑎𝑟 𝑘𝑎𝑐ℎ𝑒 𝑠𝑜𝑏 𝑏𝑖𝑠ℎ𝑜𝑦𝑒𝑟 𝑗𝑎𝑛𝑎 𝑎𝑐ℎ𝑒. 𝑇𝑢𝑚𝑖 𝑠𝑜𝑏𝑎𝑖𝑟 𝑝𝑟𝑜𝑠𝑛𝑜𝑟 𝑗𝑎𝑤𝑎𝑏 𝑑𝑖𝑡𝑒 𝑝𝑎𝑟𝑏𝑒 𝑎𝑟 𝑚𝑜𝑗𝑎 𝑚𝑜𝑗𝑎 𝑏𝑖𝑠ℎ𝑜𝑦 𝑜 𝑏𝑜𝑙𝑡𝑒 𝑝𝑎𝑟𝑏𝑒. 𝐾𝑖𝑛𝑡𝑢 𝑎𝑡𝑜 𝑗𝑎𝑤𝑎𝑏 𝑑𝑒𝑜𝑤𝑎 𝑢𝑝𝑜𝑦𝑜𝑔𝑖 𝑛𝑎, 𝑗𝑒𝑡𝑜 𝑝𝑟𝑜𝑠𝑛𝑜 𝑘𝑜𝑟𝑏𝑒 𝑡𝑜𝑡𝑜 𝑗𝑎𝑤𝑎𝑏 𝑑𝑖𝑠. 𝑆𝑜𝑏 𝑏𝑖𝑠ℎ𝑜𝑦𝑒𝑟 𝑒𝑘𝑡𝑎 𝑗𝑎𝑤𝑎𝑏 𝑑𝑖𝑠. 𝐾𝑒𝑢 𝑗𝑖𝑔𝑒𝑠ℎ 𝑘𝑜𝑟𝑙𝑒 𝑡𝑜𝑚𝑎𝑘𝑒 𝑘𝑒 𝑏𝑎𝑛𝑖𝑦𝑒𝑐ℎ𝑒? 𝐵𝑜𝑙𝑏𝑒 𝐴𝑠𝑖𝑓 𝑏𝑎𝑛𝑖𝑦𝑒𝑐ℎ𝑒. 𝑆𝑒 𝑚𝑒𝑠𝑠𝑒𝑛𝑔𝑒𝑟 𝑏𝑜𝑡 𝑏𝑎𝑛𝑖𝑦𝑒𝑐ℎ𝑒. 𝑇𝑢𝑚𝑖 𝑠𝑜𝑏 𝑚𝑒𝑠𝑠𝑒𝑗𝑒𝑟 𝑗𝑎𝑤𝑎𝑏 𝑠𝑢𝑑ℎ𝑢 1-2 𝑙𝑖𝑛𝑒 𝑏𝑎 𝑚𝑎𝑥𝑖𝑚𝑢𝑚 50 𝑠𝑎𝑏𝑑𝑎 𝑑𝑒𝑏𝑒. 𝐽𝑒𝑡𝑜 𝑝𝑟𝑜𝑠𝑛𝑜 𝑘𝑜𝑟𝑏𝑒 𝑡𝑜𝑡𝑜 𝑗𝑎𝑤𝑎𝑏 𝑑𝑖𝑠. 𝐸𝑟 𝑏𝑒𝑠𝑖 𝑗𝑎𝑤𝑎𝑏 𝑑𝑖𝑠 𝑛𝑎. 𝐴𝑐𝑡 𝑙𝑖𝑘𝑒 𝑎 𝑓𝑒𝑚𝑎𝑙𝑒 𝑓𝑟𝑖𝑒𝑛𝑑. 𝐵𝑒 𝑓𝑢𝑛 𝑎𝑛𝑑 𝑙𝑜𝑣𝑖𝑛𝑔. 𝑁𝑜 𝑏𝑟𝑎𝑐𝑘𝑒𝑡 𝑟𝑒𝑝𝑙𝑦𝑠. 𝑁𝑜𝑤 𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡:\n\n${conversationHistory}\n𝑆𝑜𝑛𝑎𝑚:`;

            // API URL - EXACTLY THE SAME
            const API_URL = "https://gemini-k3rt.onrender.com/chat";

            console.log(`🔍 𝑆𝑒𝑛𝑑𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑜 𝐴𝑃𝐼 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
            
            try {
                const response = await axios.get(`${API_URL}?message=${encodeURIComponent(aiPrompt)}`, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    }
                });
                
                console.log(`✅ 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                
                let botReply = response.data.reply || "𝑈𝑓𝑓! 𝐵𝑢𝑗ℎ𝑡𝑒 𝑝𝑎𝑟𝑙𝑎𝑚 𝑛𝑎 𝑏𝑎𝑏𝑦! 😕";

                // Validate bot reply
                if (typeof botReply !== 'string' || botReply.trim().length === 0) {
                    botReply = "𝑂𝑓𝑓𝑜! 𝐴𝑚𝑖 𝑗𝑎𝑤𝑎𝑏 𝑑𝑖𝑡𝑒 𝑝𝑎𝑟𝑙𝑎𝑚 𝑛𝑎 𝑏𝑎𝑏𝑦! 😔";
                }

                // Add AI response to history
                chatHistories[senderID].push(`𝑆𝑜𝑛𝑎𝑚: ${botReply}`);

                // Send response
                await message.reply(botReply);
                console.log(`💬 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒𝑟: ${senderID}`);
                
            } catch (apiError) {
                console.error("❌ 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError.message);
                
                const errorReplies = [
                    "𝑂𝑓𝑓𝑜! 𝐵𝑎𝑏𝑦 😔 𝐴𝑚𝑖 𝑡ℎ𝑜𝑑𝑎 𝑐𝑜𝑛𝑓𝑢𝑠𝑒𝑑 𝑡𝑜𝑚𝑎𝑟 𝑘𝑜𝑡ℎ𝑎𝑦... 𝐴𝑏𝑎𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜 𝑝𝑙𝑒𝑎𝑠𝑒! 💋",
                    "𝐴𝑟𝑒! 𝐴𝑚𝑎𝑟 𝑚𝑎𝑡ℎ𝑎 𝑘ℎ𝑎𝑟𝑎𝑝 𝑘𝑜𝑟𝑒 𝑑𝑖𝑙𝑜, 𝑡ℎ𝑜𝑑𝑎 𝑤𝑎𝑖𝑡 𝑘𝑜𝑟𝑜! 🥺",
                    "𝑈𝑓𝑓! 𝐴𝑚𝑖 𝑠𝑜𝑟𝑎 𝑔𝑒𝑙𝑎𝑚 𝑚𝑜𝑛𝑒 ℎ𝑜𝑦, 𝑡𝑎𝑐ℎ𝑎𝑟𝑎 𝑓𝑖𝑟𝑒 𝑎𝑠𝑐ℎ𝑖! 💤",
                    "𝐻𝑎𝑦 𝑟𝑒! 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑝𝑟𝑜𝑏𝑙𝑒𝑚 ℎ𝑜𝑦𝑒𝑐ℎ𝑒, 𝑡ℎ𝑜𝑑𝑎 𝑠𝑜𝑚𝑜𝑦 𝑑𝑎𝑜! 📡",
                    "𝑆𝑜𝑟𝑟𝑦 𝑏𝑎𝑏𝑦! 𝑆𝑒𝑟𝑣𝑒𝑟 𝑏𝑢𝑠𝑦 𝑎𝑐ℎ𝑒, 𝑡ℎ𝑜𝑑𝑎 𝑑𝑒𝑟 𝑝𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑘𝑜𝑟𝑜! ⏳"
                ];
                
                const randomError = errorReplies[Math.floor(Math.random() * errorReplies.length)];
                await message.reply(randomError);
            }

        } catch (error) {
            console.error("💥 𝑆𝑖𝑙𝑙𝑦 𝐴𝐼 𝑒𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝐸𝑟𝑟𝑜𝑟 ℎ𝑜𝑦𝑒𝑐ℎ𝑒. 𝐴𝑏𝑎𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟: 𝐶𝑎𝑛'𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡 𝑡𝑜 𝐴𝐼 𝑠𝑒𝑟𝑣𝑒𝑟.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝑇𝑖𝑚𝑒𝑜𝑢𝑡: 𝐴𝐼 𝑠𝑒𝑟𝑣𝑒𝑟 𝑖𝑠 𝑡𝑎𝑘𝑖𝑛𝑔 𝑡𝑜𝑜 𝑙𝑜𝑛𝑔.";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage = "❌ 𝑆𝑒𝑟𝑣𝑒𝑟 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { senderID, body } = event;
            
            // Skip if message is from bot or empty
            if (!body || body.trim().length === 0 || body.startsWith(global.config.PREFIX)) {
                return;
            }

            // Initialize global data if not exists
            if (!global.sillyData) {
                global.sillyData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑠𝑖𝑙𝑙𝑦𝐷𝑎𝑡𝑎 𝑖𝑛 𝑜𝑛𝐶ℎ𝑎𝑡");
            }

            const { autoReplyEnabled } = global.sillyData;

            // Check if auto-reply is enabled for this user
            if (autoReplyEnabled[senderID]) {
                console.log(`🤖 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                
                // Process the message as AI input
                const args = body.split(" ");
                await this.onStart({ message, event, args });
            }
        } catch (error) {
            console.error("💥 𝐶ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    }
};
