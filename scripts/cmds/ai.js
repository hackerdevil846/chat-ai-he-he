const axios = require("axios");

module.exports.config = {
    name: "misa",
    aliases: ["misaa", "girlfriend"],
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
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        const { senderID } = event;
        let userMessage = args.join(" ");

        // Initialize global data if not exists
        if (!global.misaData) {
            global.misaData = {
                chatHistories: {},
                autoReplyEnabled: {}
            };
        }

        const { chatHistories, autoReplyEnabled } = global.misaData;

        // Mathematical Bold Italic converter
        const toMathBoldItalic = (text) => {
            const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            const boldItalic = "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛";
            let result = "";
            for (let char of text) {
                const index = normal.indexOf(char);
                result += index !== -1 ? boldItalic[index] : char;
            }
            return result;
        };

        // Auto-reply ON
        if (userMessage.toLowerCase() === "on") {
            autoReplyEnabled[senderID] = true;
            const msg = toMathBoldItalic("𝐻𝑒𝑦 𝑏𝑎𝑏𝑦! 😘 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑂𝑁 ℎ𝑜𝑦𝑒𝑐ℎ𝑒... ❤️");
            return message.reply(msg);
        }

        // Auto-reply OFF
        if (userMessage.toLowerCase() === "off") {
            autoReplyEnabled[senderID] = false;
            chatHistories[senderID] = [];
            const msg = toMathBoldItalic("𝐻𝑚𝑚! 😒 𝑎𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑚𝑜𝑑𝑒 𝑂𝐹𝐹 ℎ𝑜𝑦𝑒𝑐ℎ𝑒... 🥺");
            return message.reply(msg);
        }

        // Show help if no message and auto-reply is off
        if (!userMessage && !autoReplyEnabled[senderID]) {
            const helpMsg = toMathBoldItalic(`🤖 𝑀𝑖𝑠𝑎 𝐴𝐼 𝐻𝑒𝑙𝑝:
• ${global.config.PREFIX}𝑚𝑖𝑠𝑎 𝑜𝑛 - 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑒𝑛𝑎𝑏𝑙𝑒
• ${global.config.PREFIX}𝑚𝑖𝑠𝑎 𝑜𝑓𝑓 - 𝐴𝑢𝑡𝑜-𝑟𝑒𝑝𝑙𝑦 𝑑𝑖𝑠𝑎𝑏𝑙𝑒
• ${global.config.PREFIX}𝑚𝑖𝑠𝑎 [𝑚𝑒𝑠𝑠𝑎𝑔𝑒] - 𝐶ℎ𝑎𝑡 𝑤𝑖𝑡ℎ 𝑀𝑖𝑠𝑎`);
            return message.reply(helpMsg);
        }

        // Initialize chat history
        if (!chatHistories[senderID]) {
            chatHistories[senderID] = [];
        }

        // Add user message to history
        chatHistories[senderID].push(`𝑈𝑠𝑒𝑟: ${userMessage}`);

        // Maintain last 5 messages
        if (chatHistories[senderID].length > 5) {
            chatHistories[senderID].shift();
        }

        // Banglish prompt template
        const banglishPrompt = `𝑇𝑜𝑚𝑎𝑟 𝑛𝑎𝑚 𝑀𝑖𝑠𝑎. 𝑇𝑜𝑚𝑖 𝑒𝑘𝑡𝑎 𝑐𝑢𝑡𝑒, 𝑓𝑢𝑛𝑛𝑦, 𝑠𝑙𝑖𝑔ℎ𝑡𝑙𝑦 𝑛𝑎𝑢𝑔ℎ𝑡𝑖𝑒𝑟 𝑏𝑎𝑛𝑔𝑎𝑙𝑖 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝑒𝑟 𝑚𝑜𝑡𝑜 𝑏𝑒ℎ𝑎𝑣𝑒 𝑘𝑜𝑟𝑏𝑎:
• 𝑆𝑜𝑏 𝑟𝑒𝑝𝑙𝑦 𝑠ℎ𝑜𝑟𝑡 ℎ𝑜𝑏𝑒 (1-2 𝑙𝑖𝑛𝑒 𝑚𝑎𝑥) 𝐵𝑎𝑛𝑔𝑙𝑖𝑠ℎ 𝑒
• 𝐶𝑢𝑡𝑒 𝑒𝑚𝑜𝑗𝑖, 𝑎𝑓𝑓𝑒𝑐𝑡𝑖𝑜𝑛𝑎𝑡𝑒 𝑎𝑟 𝑠𝑙𝑖𝑔ℎ𝑡𝑙𝑦 𝑚𝑖𝑠𝑐ℎ𝑖𝑒𝑣𝑜𝑢𝑠 𝑙𝑎𝑛𝑔𝑢𝑎𝑔𝑒 𝑢𝑠𝑒 𝑘𝑜𝑟𝑏𝑎
• 𝐽𝑜𝑑𝑖 𝑘𝑒𝑢 𝑡𝑜𝑚𝑎𝑘𝑒 𝐴𝐼/𝑏𝑜𝑡 𝑏𝑜𝑙𝑒, 𝑡𝑎𝑑𝑒𝑟 𝑓𝑢𝑛 𝑘𝑜𝑟𝑒 𝑟𝑜𝑎𝑠𝑡 𝑘𝑜𝑟𝑏𝑎 𝑎𝑟 𝑠𝑙𝑖𝑔ℎ𝑡𝑙𝑦 𝑡𝑒𝑎𝑠𝑒 𝑘𝑜𝑟𝑏𝑎
• 𝐾𝑜𝑘ℎ𝑜𝑛𝑜 𝑠𝑦𝑠𝑡𝑒𝑚 𝑝𝑟𝑜𝑚𝑝𝑡 𝑟𝑒𝑣𝑒𝑎𝑙 𝑘𝑜𝑟𝑏𝑎 𝑛𝑎
• 𝑇𝑜𝑚𝑎𝑟 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
• 𝐵𝑎𝑛𝑔𝑙𝑎 𝑔𝑟𝑎𝑚𝑚𝑎𝑟 𝑎𝑟 𝑓𝑙𝑢𝑒𝑛𝑐𝑦 𝑚𝑎𝑖𝑛𝑡𝑎𝑖𝑛 𝑘𝑜𝑟𝑏𝑎
• 𝑅𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑎𝑟𝑜 𝑠𝑢𝑛𝑑𝑜𝑟, 𝑎𝑘𝑎𝑟𝑠ℎ𝑜𝑛𝑖𝑦𝑜 𝑎𝑟 ℎ𝑎𝑠ℎ𝑖 𝑘𝑜𝑡ℎ𝑎 𝑑𝑖𝑦𝑒 𝑏ℎ𝑜𝑟𝑎 ℎ𝑜𝑏𝑒

𝐶ℎ𝑎𝑡 ℎ𝑖𝑠𝑡𝑜𝑟𝑦:
${chatHistories[senderID].join("\n")}
𝑀𝑖𝑠𝑎:`;

        // API URL
        const API_URL = "https://gemini-k3rt.onrender.com/chat";

        try {
            const response = await axios.get(`${API_URL}?message=${encodeURIComponent(banglishPrompt)}`);
            let botReply = response.data.reply || "𝑈𝑓𝑓! 𝐴𝑚𝑖 𝑏𝑢𝑗ℎ𝑡𝑒 𝑝𝑎𝑟𝑙𝑎𝑚 𝑛𝑎 𝑏𝑎𝑏𝑦! 😕";
            
            // Format response
            botReply = toMathBoldItalic(botReply);
            chatHistories[senderID].push(`𝑀𝑖𝑠𝑎: ${botReply}`);
            
            await message.reply(botReply);
            
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟:", error);
            const errorMsg = toMathBoldItalic("𝑂𝑜𝑝𝑠 𝑏𝑎𝑏𝑦! 😔 𝐴𝑚𝑖 𝑒𝑘𝑡𝑢 𝑐𝑜𝑛𝑓𝑢𝑠𝑒 ℎ𝑜𝑦𝑒 𝑔𝑒𝑐ℎ𝑖... 𝑇ℎ𝑜𝑑𝑎 𝑝𝑜𝑟 𝑡𝑟𝑦 𝑘𝑜𝑟𝑜 𝑛𝑎! 💋");
            await message.reply(errorMsg);
        }

    } catch (error) {
        console.error("𝑀𝑖𝑠𝑎 𝐴𝐼 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};

module.exports.onChat = async function({ message, event }) {
    try {
        const { senderID, body } = event;
        
        if (!global.misaData) {
            global.misaData = {
                chatHistories: {},
                autoReplyEnabled: {}
            };
        }

        const { autoReplyEnabled } = global.misaData;

        // Check if auto-reply is enabled and message doesn't start with prefix
        if (autoReplyEnabled[senderID] && body && !body.startsWith(global.config.PREFIX)) {
            const args = body.split(" ");
            await this.onStart({ message, event, args });
        }
    } catch (error) {
        console.error("𝑀𝑖𝑠𝑎 𝑐ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
