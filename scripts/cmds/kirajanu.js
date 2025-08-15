module.exports.config = {
    name: "kirajanu",
    version: "4.3.10",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 (Fixed by Manus using DeepSeek AI API)",
    description: "Chat with AI using DeepSeek AI API.",
    commandCategory: "AI Chat",
    usages: "[on | off | [your message]]",
    cooldowns: 5,
    dependencies: { "axios": "" },
    envConfig: {
        DEEPSEEK_API_KEY: "sk-0c82a4df00704663a260cb3c71a4f718"
    }
};

async function deepseekChat(ask, apiKey) {
    const axios = require("axios");
    try {
        const response = await axios.post(
            "https://api.deepseek.com/chat/completions",
            {
                model: "deepseek-chat",
                messages: [{ role: "user", content: ask }],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );

        if (response.data?.choices?.[0]?.message?.content) {
            return { error: false, answer: response.data.choices[0].message.content };
        }
        return { error: true, answer: "No answer received from DeepSeek AI." };
    } catch (err) {
        console.error("DeepSeek AI API Error:", err.response?.data || err.message);
        return { error: true, answer: "Failed to connect to DeepSeek AI API or an error occurred." };
    }
}

module.exports.onLoad = async function () {
    if (!global.simsimi) global.simsimi = new Map();
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;

    if (global.simsimi.has(threadID)) {
        if (!body || senderID === api.getCurrentUserID() || messageID === global.simsimi.get(threadID)) return;

        const apiKey = global.configModule.kirajanu.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return api.sendMessage("Please set your DeepSeek AI API key in kirajanu's envConfig.", threadID, messageID);
        }

        const result = await deepseekChat(body, apiKey);
        api.sendMessage(result.answer, threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const command = args[0];

    if (!command) {
        return api.sendMessage("[ AI Chat ] - Please provide a message or use 'on'/'off'.", threadID, messageID);
    }

    switch (command.toLowerCase()) {
        case "on":
            if (global.simsimi.has(threadID)) {
                return api.sendMessage("[ AI Chat ] - AI chat is already enabled in this chat.", threadID, messageID);
            }
            global.simsimi.set(threadID, messageID);
            return api.sendMessage("[ AI Chat ] - AI chat has been turned on.", threadID, messageID);

        case "off":
            if (!global.simsimi.has(threadID)) {
                return api.sendMessage("[ AI Chat ] - AI chat is already disabled.", threadID, messageID);
            }
            global.simsimi.delete(threadID);
            return api.sendMessage("[ AI Chat ] - AI chat has been turned off.", threadID, messageID);

        default:
            const message = args.join(" ");
            const apiKey = global.configModule.kirajanu.DEEPSEEK_API_KEY;
            if (!apiKey) {
                return api.sendMessage("Please set your DeepSeek AI API key in kirajanu's envConfig.", threadID, messageID);
            }

            const result = await deepseekChat(message, apiKey);
            return api.sendMessage(result.answer, threadID, messageID);
    }
};
