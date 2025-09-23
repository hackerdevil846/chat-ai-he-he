const axios = require("axios");

module.exports = {
    config: {
        name: "kirajanu",
        aliases: ["deepseekai", "dsai", "kjanu"],
        version: "4.3.10",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        category: "𝑎𝑖",
        shortDescription: {
            en: "🤖 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑐ℎ𝑎𝑡𝑏𝑜𝑡 𝑢𝑠𝑖𝑛𝑔 𝐷𝑒𝑒𝑝𝑆𝑒𝑒𝑘 𝐴𝑃𝐼"
        },
        longDescription: {
            en: "🤖 𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝐴𝐼 𝑐ℎ𝑎𝑡𝑏𝑜𝑡 𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐷𝑒𝑒𝑝𝑆𝑒𝑒𝑘 𝐴𝑃𝐼"
        },
        guide: {
            en: "{p}kirajanu [𝑜𝑛 | 𝑜𝑓𝑓 | 𝑦𝑜𝑢𝑟_𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
        },
        countDown: 5,
        dependencies: {
            "axios": ""
        }
    },

    onLoad: function() {
        if (!global.kirajanu) global.kirajanu = new Map();
        console.log("🤖 𝐾𝑖𝑟𝑎𝑗𝑎𝑛𝑢 𝐴𝐼 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑");
    },

    onStart: async function({ message, event, args }) {
        try {
            const { threadID, messageID } = event;
            const DEEPSEEK_API_KEY = "𝑠𝑘-0𝑐82𝑎4𝑑𝑓00704663𝑎260𝑐𝑏3𝑐71𝑎4𝑓718";

            if (!args[0]) {
                return message.reply("💡 𝑈𝑠𝑎𝑔𝑒: 𝑘𝑖𝑟𝑎𝑗𝑎𝑛𝑢 [𝑜𝑛/𝑜𝑓𝑓/𝑦𝑜𝑢𝑟_𝑚𝑒𝑠𝑠𝑎𝑔𝑒]");
            }

            switch (args[0].toLowerCase()) {
                case "on":
                    if (global.kirajanu.has(threadID)) {
                        return message.reply("ℹ️ 𝐴𝐼 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑐ℎ𝑎𝑡");
                    }
                    global.kirajanu.set(threadID, true);
                    return message.reply("🧠 𝐴𝐼 𝐶ℎ𝑎𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑂𝑁 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛");

                case "off":
                    if (!global.kirajanu.has(threadID)) {
                        return message.reply("ℹ️ 𝐴𝐼 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑐ℎ𝑎𝑡");
                    }
                    global.kirajanu.delete(threadID);
                    return message.reply("⭕ 𝐴𝐼 𝐶ℎ𝑎𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑂𝐹𝐹 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛");

                default:
                    try {
                        const prompt = args.join(" ");
                        
                        const response = await axios.post(
                            "https://api.deepseek.com/chat/completions",
                            {
                                model: "deepseek-chat",
                                messages: [{ role: "user", content: prompt }],
                                temperature: 0.7,
                                max_tokens: 2000
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                                },
                                timeout: 30000
                            }
                        );

                        if (response.data?.choices?.[0]?.message?.content) {
                            await message.reply(`🤖 ${response.data.choices[0].message.content}`);
                        } else {
                            await message.reply("❌ 𝑁𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑 𝑓𝑟𝑜𝑚 𝐴𝐼");
                        }
                    } catch (error) {
                        console.error("𝐴𝐼 𝑅𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
                        await message.reply("❌ 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
                    }
            }
        } catch (error) {
            console.error("𝐾𝑖𝑟𝑎𝑗𝑎𝑛𝑢 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    },

    onChat: async function({ message, event }) {
        try {
            const { threadID, senderID, body } = event;
            const DEEPSEEK_API_KEY = "𝑠𝑘-0𝑐82𝑎4𝑑𝑓00704663𝑎260𝑐𝑏3𝑐71𝑎4𝑓718";

            if (global.kirajanu.has(threadID) && 
                senderID !== message.api.getCurrentUserID() && 
                body && body.trim().length > 0) {
                
                try {
                    const response = await axios.post(
                        "https://api.deepseek.com/chat/completions",
                        {
                            model: "deepseek-chat",
                            messages: [{ role: "user", content: body }],
                            temperature: 0.7,
                            max_tokens: 1500
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                            },
                            timeout: 25000
                        }
                    );

                    if (response.data?.choices?.[0]?.message?.content) {
                        await message.reply(`🤖 ${response.data.choices[0].message.content}`);
                    }
                } catch (error) {
                    console.error("𝐴𝐼 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
                    // Don't send error message for auto-chat to avoid spam
                }
            }
        } catch (error) {
            console.error("𝐾𝑖𝑟𝑎𝑗𝑎𝑛𝑢 𝑜𝑛𝐶ℎ𝑎𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
        }
    }
};
