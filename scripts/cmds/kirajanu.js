module.exports.config = {
    name: "kirajanu",
    version: "4.3.10",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ AI-powered chatbot using DeepSeek API",
    category: "🤖| AI Chat",
    usages: "[on | off | your_message]",
    cooldowns: 5,
    dependencies: { 
        "axios": "" 
    },
    envConfig: {
        DEEPSEEK_API_KEY: "sk-0c82a4df00704663a260cb3c71a4f718"
    }
};

module.exports.languages = {
    "en": {
        "onMessage": "🧠 | AI Chat has been turned ON for this conversation",
        "offMessage": "⭕ | AI Chat has been turned OFF for this conversation",
        "alreadyOn": "ℹ️ | AI is already active in this chat",
        "alreadyOff": "ℹ️ | AI is not active in this chat",
        "errorMessage": "❌ | API Error: Please contact the bot owner"
    }
};

module.exports.onLoad = function() {
    if (!global.kirajanu) global.kirajanu = new Map();
    console.log("🤖 Kirajanu AI initialized");
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    const { DEEPSEEK_API_KEY } = global.configModule.kirajanu;

    if (global.kirajanu.has(threadID) && 
        senderID != api.getCurrentUserID() && 
        body && 
        messageID != global.kirajanu.get(threadID)) {
        
        try {
            const axios = require("axios");
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
                        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                    }
                }
            );

            if (response.data?.choices?.[0]?.message?.content) {
                api.sendMessage(`🤖 ${response.data.choices[0].message.content}`, threadID, messageID);
            }
        } catch (error) {
            api.sendMessage(this.languages.en.errorMessage, threadID, messageID);
        }
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const { DEEPSEEK_API_KEY } = global.configModule.kirajanu;

    if (!args[0]) {
        return api.sendMessage("💡 | Usage: kirajanu [on/off/your_message]", threadID, messageID);
    }

    switch (args[0].toLowerCase()) {
        case "on":
            if (global.kirajanu.has(threadID)) {
                return api.sendMessage(this.languages.en.alreadyOn, threadID, messageID);
            }
            global.kirajanu.set(threadID, true);
            return api.sendMessage(this.languages.en.onMessage, threadID, messageID);

        case "off":
            if (!global.kirajanu.has(threadID)) {
                return api.sendMessage(this.languages.en.alreadyOff, threadID, messageID);
            }
            global.kirajanu.delete(threadID);
            return api.sendMessage(this.languages.en.offMessage, threadID, messageID);

        default:
            try {
                const axios = require("axios");
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
                            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                        }
                    }
                );

                if (response.data?.choices?.[0]?.message?.content) {
                    api.sendMessage(`🤖 ${response.data.choices[0].message.content}`, threadID, messageID);
                }
            } catch (error) {
                api.sendMessage(this.languages.en.errorMessage, threadID, messageID);
            }
    }
};
