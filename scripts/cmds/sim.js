module.exports.config = {
    name: "sim",
    version: "4.3.8",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅 (DeepSeek AI Version)",
    description: "DeepSeek AI sathe chat korun.",
    category: "AI Chat",
    usages: "[on | off | message]",
    cooldowns: 5,
    dependencies: {
        axios: ""
    }
};

// API key direct code e set kora
const DEEPSEEK_API_KEY = "sk-0c82a4df00704663a260cb3c71a4f718";

// DeepSeek AI chat function
async function deepseekChat(ask) {
    const axios = require("axios");
    try {
        const res = await axios.post(
            "https://api.deepseek.com/chat/completions",
            {
                model: "deepseek-chat",
                messages: [{ role: "user", content: ask }],
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
                }
            }
        );

        if (res.data?.choices?.[0]?.message?.content) {
            return { error: false, answer: res.data.choices[0].message.content };
        }
        return { error: true, answer: "No answer received from DeepSeek AI." };
    } catch (err) {
        console.error("DeepSeek API Error:", err.response?.data || err.message);
        return { error: true, answer: "Failed to connect to DeepSeek AI API." };
    }
}

// On load
module.exports.onLoad = async function () {
    if (typeof global.simAI === "undefined") global.simAI = new Map();
};

// Auto reply when ON
module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (global.simAI.has(threadID)) {
        if (!body || senderID === api.getCurrentUserID() || messageID === global.simAI.get(threadID)) return;

        const result = await deepseekChat(body);
        api.sendMessage(result.answer, threadID, messageID);
    }
};

// Command handler
module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const send = msg => api.sendMessage(msg, threadID, messageID);

    if (!args[0]) return send("[ SIM ] - Apni kono message enter koren ni.");

    switch (args[0].toLowerCase()) {
        case "on":
            if (global.simAI.has(threadID)) return send("[ SIM ] - AI already on ache.");
            global.simAI.set(threadID, messageID);
            return send("[ SIM ] - AI chat on kora holo.");

        case "off":
            if (!global.simAI.has(threadID)) return send("[ SIM ] - AI already off ache.");
            global.simAI.delete(threadID);
            return send("[ SIM ] - AI chat off kora holo.");

        default:
            const result = await deepseekChat(args.join(" "));
            return send(result.answer);
    }
};
