const axios = require("axios");

module.exports.config = {
    name: "kirajanu",
    aliases: ["ai", "deepseek"],
    version: "4.3.10",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "🤖| 𝐴𝐼 𝐶ℎ𝑎𝑡",
    shortDescription: {
        en: "✨ 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑐ℎ𝑎𝑡𝑏𝑜𝑡 𝑢𝑠𝑖𝑛𝑔 𝐷𝑒𝑒𝑝𝑆𝑒𝑒𝑘 𝐴𝑃𝐼"
    },
    longDescription: {
        en: "✨ 𝐴𝐼-𝑝𝑜𝑤𝑒𝑟𝑒𝑑 𝑐ℎ𝑎𝑡𝑏𝑜𝑡 𝑢𝑠𝑖𝑛𝑔 𝐷𝑒𝑒𝑝𝑆𝑒𝑒𝑘 𝐴𝑃𝐼"
    },
    guide: {
        en: "{p}kirajanu [𝑜𝑛 | 𝑜𝑓𝑓 | 𝑦𝑜𝑢𝑟_𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    dependencies: {
        "axios": ""
    },
    envConfig: {
        "DEEPSEEK_API_KEY": "𝑠𝑘-0𝑐82𝑎4𝑑𝑓00704663𝑎260𝑐𝑏3𝑐71𝑎4𝑓718"
    }
};

module.exports.languages = {
    "en": {
        "onMessage": "🧠 | 𝐴𝐼 𝐶ℎ𝑎𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑂𝑁 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛",
        "offMessage": "⭕ | 𝐴𝐼 𝐶ℎ𝑎𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑂𝐹𝐹 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛",
        "alreadyOn": "ℹ️ | 𝐴𝐼 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑐ℎ𝑎𝑡",
        "alreadyOff": "ℹ️ | 𝐴𝐼 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑐𝑡𝑖𝑣𝑒 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑐ℎ𝑎𝑡",
        "errorMessage": "❌ | 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟: 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑜𝑤𝑛𝑒𝑟",
        "usage": "💡 | 𝑈𝑠𝑎𝑔𝑒: 𝑘𝑖𝑟𝑎𝑗𝑎𝑛𝑢 [𝑜𝑛/𝑜𝑓𝑓/𝑦𝑜𝑢𝑟_𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    }
};

module.exports.onLoad = function() {
    if (!global.kirajanu) global.kirajanu = new Map();
    console.log("🤖 𝐾𝑖𝑟𝑎𝑗𝑎𝑛𝑢 𝐴𝐼 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑");
};

module.exports.onChat = async function({ api, event, getText }) {
    const { threadID, messageID, senderID, body } = event;
    const { DEEPSEEK_API_KEY } = global.configModule[this.config.name].envConfig;

    if (global.kirajanu.has(threadID) && 
        senderID != api.getCurrentUserID() && 
        body && 
        messageID != global.kirajanu.get(threadID)) {
        
        try {
            const response = await axios.post(
                "https://api.deepseek.com/chat/completions",
                {
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: body }],
                    temperature: 0.7
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `𝐵𝑒𝑎𝑟𝑒𝑟 ${DEEPSEEK_API_KEY}`
                    }
                }
            );

            if (response.data?.choices?.[0]?.message?.content) {
                api.sendMessage(`🤖 ${response.data.choices[0].message.content}`, threadID, messageID);
            }
        } catch (error) {
            console.error("𝐴𝐼 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
            api.sendMessage(getText("errorMessage"), threadID, messageID);
        }
    }
};

module.exports.onStart = async function({ api, event, args, getText }) {
    const { threadID, messageID } = event;
    const { DEEPSEEK_API_KEY } = global.configModule[this.config.name].envConfig;

    if (!args[0]) {
        return api.sendMessage(getText("usage"), threadID, messageID);
    }

    switch (args[0].toLowerCase()) {
        case "on":
            if (global.kirajanu.has(threadID)) {
                return api.sendMessage(getText("alreadyOn"), threadID, messageID);
            }
            global.kirajanu.set(threadID, true);
            return api.sendMessage(getText("onMessage"), threadID, messageID);

        case "off":
            if (!global.kirajanu.has(threadID)) {
                return api.sendMessage(getText("alreadyOff"), threadID, messageID);
            }
            global.kirajanu.delete(threadID);
            return api.sendMessage(getText("offMessage"), threadID, messageID);

        default:
            try {
                const prompt = args.join(" ");
                
                const response = await axios.post(
                    "https://api.deepseek.com/chat/completions",
                    {
                        model: "deepseek-chat",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `𝐵𝑒𝑎𝑟𝑒𝑟 ${DEEPSEEK_API_KEY}`
                        }
                    }
                );

                if (response.data?.choices?.[0]?.message?.content) {
                    api.sendMessage(`🤖 ${response.data.choices[0].message.content}`, threadID, messageID);
                }
            } catch (error) {
                console.error("𝐴𝐼 𝑅𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
                api.sendMessage(getText("errorMessage"), threadID, messageID);
            }
    }
};
