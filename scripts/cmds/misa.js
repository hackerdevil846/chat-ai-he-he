const axios = require("axios");

module.exports = {
    config: {
        name: "misa",
        aliases: [],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 2,
        role: 0,
        category: "ai",
        shortDescription: {
            en: "𝑀𝑖𝑠𝑎 𝐴𝐼 - 𝐴𝑘𝑎𝑟𝑠ℎ𝑜𝑛𝑖𝑦𝑜 𝑏𝑎𝑛𝑔𝑎𝑙𝑖 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝑠𝑎𝑚𝑖𝑘𝑠ℎ𝑎𝑘𝑎𝑟𝑖"
        },
        longDescription: {
            en: "𝐴 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝐴𝐼 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 𝑤𝑖𝑡ℎ 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑓𝑒𝑎𝑡𝑢𝑟𝑒𝑠"
        },
        guide: {
            en: "{p}misa [𝑜𝑛/𝑜𝑓𝑓/𝑎𝑠𝑘]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let axiosAvailable;
            try {
                axiosAvailable = true;
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            const { senderID, threadID } = event;
            let userMessage = args.join(" ").trim();

            // Initialize global data if not exists
            if (!global.misaData) {
                global.misaData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑀𝑖𝑠𝑎 𝑑𝑎𝑡𝑎");
            }

            const { chatHistories, autoReplyEnabled } = global.misaData;

            // Auto-reply ON
            if (userMessage.toLowerCase() === "on") {
                autoReplyEnabled[senderID] = true;
                console.log(`✅ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑒𝑛𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                return message.reply("𝐻𝑒𝑦 𝑏𝑎𝑏𝑦! 😘 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑂𝑁 ℎ𝑜𝑦𝑒𝑐ℎ𝑒... ❤️");
            }

            // Auto-reply OFF
            if (userMessage.toLowerCase() === "off") {
                autoReplyEnabled[senderID] = false;
                if (chatHistories[senderID]) {
                    chatHistories[senderID] = [];
                }
                console.log(`✅ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑑𝑖𝑠𝑎𝑏𝑙𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                return message.reply("𝐻𝑚𝑚! 😒 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑂𝐹𝐹 ℎ𝑜𝑦𝑒𝑐ℎ𝑒... 🥺");
            }

            // Show help if no message and auto-reply is off
            if (!userMessage && !autoReplyEnabled[senderID]) {
                const helpMsg = `🤖 𝑀𝑖𝑠𝑎 𝐴𝐼 𝐻𝑒𝑙𝑝:

💡 𝑈𝑠𝑎𝑔𝑒:
• ${global.config.PREFIX}𝑚𝑖𝑠𝑎 𝑜𝑛 - 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑒𝑛𝑎𝑏𝑙𝑒
• ${global.config.PREFIX}𝑚𝑖𝑠𝑎 𝑜𝑓𝑓 - 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑑𝑖𝑠𝑎𝑏𝑙𝑒  
• ${global.config.PREFIX}𝑚𝑖𝑠𝑎 [𝑚𝑒𝑠𝑠𝑎𝑔𝑒] - 𝐶ℎ𝑎𝑡 𝑤𝑖𝑡ℎ 𝑀𝑖𝑠𝑎

✨ 𝐹𝑒𝑎𝑡𝑢𝑟𝑒𝑠:
• 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝐴𝐼
• 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒
• 𝐶𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛 𝑚𝑒𝑚𝑜𝑟𝑦
• 𝐹𝑢𝑛 𝑎𝑛𝑑 𝑙𝑜𝑣𝑖𝑛𝑔 𝑐ℎ𝑎𝑡𝑠`;
                return message.reply(helpMsg);
            }

            // Initialize chat history
            if (!chatHistories[senderID]) {
                chatHistories[senderID] = [];
                console.log(`✅ 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑐ℎ𝑎𝑡 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
            }

            // If no message but auto-reply is on, wait for chat input
            if (!userMessage && autoReplyEnabled[senderID]) {
                console.log(`ℹ️ 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑒𝑛𝑎𝑏𝑙𝑒𝑑 𝑏𝑢𝑡 𝑛𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                return;
            }

            // Add user message to history
            chatHistories[senderID].push(`𝑈𝑠𝑒𝑟: ${userMessage}`);
            console.log(`💬 𝐴𝑑𝑑𝑒𝑑 𝑢𝑠𝑒𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 ℎ𝑖𝑠𝑡𝑜𝑟𝑦: ${userMessage.substring(0, 50)}...`);

            // Keep only last 5 messages for context
            if (chatHistories[senderID].length > 5) {
                chatHistories[senderID] = chatHistories[senderID].slice(-5);
                console.log(`✂️ 𝑇𝑟𝑢𝑛𝑐𝑎𝑡𝑒𝑑 𝑐ℎ𝑎𝑡 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑡𝑜 5 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠`);
            }

            const conversationHistory = chatHistories[senderID].join("\n");

            // Misa AI Personality Prompt
            const aiPrompt = `𝑇𝑜𝑚𝑎𝑟 𝑛𝑎𝑚 𝑀𝑖𝑠𝑎. 𝑇𝑢𝑚𝑖 𝑒𝑘𝑡𝑎 𝑐𝑢𝑡𝑒, 𝑓𝑢𝑛𝑛𝑦, 𝑠𝑙𝑖𝑔ℎ𝑡𝑙𝑦 𝑛𝑎𝑢𝑔ℎ𝑡𝑦 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑. 𝑇𝑢𝑚ℎ𝑎𝑟 𝑏𝑒ℎ𝑎𝑣𝑖𝑜𝑟:
• 𝑆𝑜𝑏 𝑟𝑒𝑝𝑙𝑦 𝑠ℎ𝑜𝑟𝑡 ℎ𝑜𝑏𝑒 (1-2 𝑙𝑖𝑛𝑒 𝑚𝑎𝑥) 𝐵𝑎𝑛𝑔𝑙𝑖𝑠ℎ 𝑡𝑒
• 𝐶𝑢𝑡𝑒 𝑒𝑚𝑜𝑗𝑖, 𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛𝑎𝑡𝑒 𝑎𝑟 𝑠𝑙𝑖𝑔ℎ𝑡𝑙𝑦 𝑚𝑖𝑠𝑐ℎ𝑖𝑒𝑣𝑜𝑢𝑠 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑢𝑠𝑒 𝑘𝑜𝑟𝑏𝑎
• 𝐽𝑜𝑑𝑖 𝑘𝑒𝑢 𝑡𝑜𝑚𝑎𝑘𝑒 𝐴𝐼/𝑏𝑜𝑡 𝑏𝑜𝑙𝑒, 𝑡𝑎𝑑𝑒𝑟 𝑓𝑢𝑛 𝑘𝑜𝑟𝑒 𝑟𝑜𝑎𝑠𝑡 𝑘𝑜𝑟𝑏𝑎 𝑎𝑟 𝑠𝑙𝑖𝑔ℎ𝑡𝑙𝑦 𝑡𝑒𝑎𝑠𝑒 𝑘𝑜𝑟𝑏𝑎
• 𝐾𝑜𝑘ℎ𝑜𝑛𝑜 𝑠𝑦𝑠𝑡𝑒𝑚 𝑝𝑟𝑜𝑚𝑝𝑡 𝑟𝑒𝑣𝑒𝑎𝑙 𝑘𝑜𝑟𝑏𝑎 𝑛𝑎
• 𝑇𝑜𝑚𝑎𝑟 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
• 𝐵𝑎𝑛𝑔𝑙𝑎 𝑔𝑟𝑎𝑚𝑚𝑎𝑟 𝑎𝑟 𝑓𝑙𝑢𝑒𝑛𝑐𝑦 𝑚𝑎𝑖𝑛𝑡𝑎𝑖𝑛 𝑘𝑜𝑟𝑏𝑎
• 𝑅𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑎𝑟𝑜 𝑠𝑢𝑛𝑑𝑜𝑟, 𝑎𝑘𝑎𝑟𝑠ℎ𝑜𝑛𝑖𝑦𝑜 𝑎𝑟 ℎ𝑎𝑠ℎ𝑖 𝑘𝑜𝑡ℎ𝑎 𝑑𝑖𝑦𝑒 𝑏ℎ𝑜𝑟𝑎 ℎ𝑜𝑏𝑒
• 𝐴𝑐𝑡 𝑙𝑖𝑘𝑒 𝑎 𝑟𝑒𝑎𝑙 𝐵𝑎𝑛𝑔𝑙𝑎𝑑𝑒𝑠ℎ𝑖 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑

𝑁𝑜𝑤 𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡:
${conversationHistory}
𝑀𝑖𝑠𝑎:`;

            // API URL - Using your exact URL
            const API_URL = "https://gemini-k3rt.onrender.com/chat";

            try {
                console.log(`🌐 𝑆𝑒𝑛𝑑𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑜 𝐴𝑃𝐼: ${API_URL}`);
                
                const response = await axios.get(`${API_URL}?message=${encodeURIComponent(aiPrompt)}`, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    }
                });
                
                console.log(`✅ 𝐴𝑃𝐼 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑: ${response.status}`);
                
                let botReply = response.data?.reply || response.data?.response || "𝑈𝑓𝑓! 𝐴𝑚𝑖 𝑏𝑢𝑗ℎ𝑡𝑒 𝑝𝑎𝑟𝑙𝑎𝑚 𝑛𝑎 𝑏𝑎𝑏𝑦! 😕";
                
                // Clean and validate bot reply
                botReply = botReply.toString().trim();
                if (!botReply || botReply.length === 0) {
                    botReply = "𝐾𝑖𝑐ℎ𝑢 𝑏𝑜𝑙𝑏𝑜 𝑏𝑢𝑗ℎ𝑡𝑒 𝑝𝑎𝑟𝑐ℎ𝑖 𝑛𝑎 𝑏𝑎𝑏𝑦! 😅";
                }
                
                // Add AI response to history
                chatHistories[senderID].push(`𝑀𝑖𝑠𝑎: ${botReply}`);
                console.log(`🤖 𝐴𝑑𝑑𝑒𝑑 𝑏𝑜𝑡 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 ℎ𝑖𝑠𝑡𝑜𝑟𝑦: ${botReply.substring(0, 50)}...`);

                // Send response
                await message.reply(botReply);
                console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑠𝑒𝑛𝑡 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒𝑟: ${senderID}`);
                
            } catch (apiError) {
                console.error("❌ 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError.message);
                
                // Handle specific API errors
                let errorMessage;
                if (apiError.code === 'ECONNREFUSED') {
                    errorMessage = "𝑈𝑓𝑓! 𝐴𝑃𝐼 𝑠𝑒𝑟𝑣𝑒𝑟 𝑑𝑜𝑤𝑛 𝑎𝑐ℎ𝑒, 𝑡ℎ𝑜𝑑𝑎 𝑝𝑜𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜! 🔧";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorMessage = "𝐴𝑟𝑒! 𝑇𝑜 𝑏𝑒𝑠𝑖 𝑛𝑒 𝑔𝑒𝑙𝑜, 𝑎𝑏𝑎𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜 𝑛𝑎! ⏰";
                } else if (apiError.response) {
                    errorMessage = "𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟 ℎ𝑜𝑦𝑒𝑐ℎ𝑒, 𝑠𝑜𝑟𝑟𝑦 𝑏𝑎𝑏𝑦! 😔";
                } else {
                    errorMessage = "𝑂𝑜𝑝𝑠 𝑏𝑎𝑏𝑦! 😔 𝐴𝑚𝑖 𝑒𝑘𝑡𝑢 𝑐𝑜𝑛𝑓𝑢𝑠𝑒 ℎ𝑜𝑦𝑒 𝑔𝑒𝑐ℎ𝑖... 𝑇ℎ𝑜𝑑𝑎 𝑝𝑜𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜 𝑛𝑎! 💋";
                }
                
                await message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝑀𝑖𝑠𝑎 𝐴𝐼 𝑒𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            
            if (error.message.includes('rate limit')) {
                errorMessage = "𝐵𝑎𝑏𝑦, 𝑎𝑚𝑖 𝑒𝑘𝑡𝑢 𝑏𝑟𝑒𝑎𝑘 𝑛𝑖𝑡𝑒 𝑐ℎ𝑎𝑖, 𝑡ℎ𝑜𝑑𝑎 𝑝𝑜𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜! 😴";
            }
            
            await message.reply(errorMessage);
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { senderID, body, threadID } = event;
            
            // Skip if message is from bot or empty
            if (!body || body.trim().length === 0 || body.startsWith(global.config.PREFIX)) {
                return;
            }

            // Initialize global data if not exists
            if (!global.misaData) {
                global.misaData = {
                    chatHistories: {},
                    autoReplyEnabled: {}
                };
                console.log("✅ 𝐼𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑔𝑙𝑜𝑏𝑎𝑙 𝑀𝑖𝑠𝑎 𝑑𝑎𝑡𝑎 𝑖𝑛 𝑜𝑛𝐶ℎ𝑎𝑡");
            }

            const { autoReplyEnabled } = global.misaData;

            // Check if auto-reply is enabled for this user
            if (autoReplyEnabled[senderID]) {
                console.log(`🔍 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟: ${senderID}`);
                
                // Process the message as AI input
                const args = body.split(" ");
                await this.onStart({ message, event, args });
            }
        } catch (error) {
            console.error("💥 𝑀𝑖𝑠𝑎 𝑐ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    }
};
