const axios = require('axios');

if (!global.temp) global.temp = {};
if (!global.temp.openAIUsing) global.temp.openAIUsing = {};
if (!global.temp.openAIHistory) global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

module.exports.config = {
    name: "gpt",
    aliases: ["ai", "assistant"],
    version: "1.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "ai",
    shortDescription: {
        en: "🤖 𝐴𝐼 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 𝑤𝑖𝑡ℎ 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑝𝑎𝑏𝑖𝑙𝑖𝑡𝑦 (𝐹𝑟𝑒𝑒 𝑉𝑒𝑟𝑠𝑖𝑜𝑛)"
    },
    longDescription: {
        en: "𝐴𝐼 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 𝑤𝑖𝑡ℎ 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑝𝑎𝑏𝑖𝑙𝑖𝑡𝑖𝑒𝑠 𝑢𝑠𝑖𝑛𝑔 𝑓𝑟𝑒𝑒 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠"
    },
    guide: {
        en: "{p}gpt [𝑑𝑟𝑎𝑤] [𝑝𝑟𝑜𝑚𝑝𝑡] | [𝑐𝑙𝑒𝑎𝑟] | [𝑝𝑟𝑜𝑚𝑝𝑡]"
    },
    dependencies: {
        "axios": ""
    },
    envConfig: {
        maxStorageMessage: 4,
        unsplashAccessKey: "𝐻1𝑃1𝑡9𝐾𝑃𝑧𝐻𝑈𝑃𝑊𝑄𝐼-𝑅𝑥𝐻𝑔6𝑒8𝑘𝑎𝐾𝑑𝐿𝐴ℎ𝑌𝑅0𝐿𝑅𝑠𝑦5𝑆𝑝-𝑡𝑘"
    }
};

module.exports.languages = {
    en: {
        invalidContentDraw: "🖼️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑡𝑖𝑜𝑛 𝑓𝑜𝑟 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛.",
        yourAreUsing: "⏳ 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑎𝑛 𝑜𝑛𝑔𝑜𝑖𝑛𝑔 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 𝑓𝑜𝑟 𝑖𝑡 𝑡𝑜 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒.",
        processingRequest: "⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒... 𝑇ℎ𝑖𝑠 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡.",
        invalidContent: "💬 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑐ℎ𝑎𝑡 𝑤𝑖𝑡ℎ 𝐴𝐼.",
        error: "❌ 𝐸𝑟𝑟𝑜𝑟: %1",
        clearHistory: "🗑️ 𝐶𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛 ℎ𝑖𝑠𝑡𝑜𝑟𝑦 𝑐𝑙𝑒𝑎𝑟𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦.",
        noApiKey: "🔑 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑢𝑠𝑒𝑠 𝑓𝑟𝑒𝑒 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑡ℎ𝑎𝑡 𝑚𝑎𝑦 ℎ𝑎𝑣𝑒 𝑙𝑖𝑚𝑖𝑡𝑎𝑡𝑖𝑜𝑛𝑠.",
        attribution: "📸 𝐼𝑚𝑎𝑔𝑒 𝑓𝑟𝑜𝑚 𝑈𝑛𝑠𝑝𝑙𝑎𝑠ℎ - 𝐷𝑜𝑛'𝑡 𝑓𝑜𝑟𝑔𝑒𝑡 𝑡𝑜 𝑠𝑢𝑝𝑝𝑜𝑟𝑡 𝑝ℎ𝑜𝑡𝑜𝑔𝑟𝑎𝑝ℎ𝑒𝑟𝑠!"
    }
};

// Free text generation API (Gemini API proxy)
async function askGpt(event, prompt) {
    try {
        const response = await axios.get(`https://gemini-api.replit.app/gemini?prompt=${encodeURIComponent(prompt)}`);
        return { data: { choices: [{ message: { content: response.data.answer } }] } };
    } catch (error) {
        // Fallback to another free API
        try {
            const response = await axios.get(`https://api.kenaisq.rocks/api/gpt4?q=${encodeURIComponent(prompt)}`);
            return { data: { choices: [{ message: { content: response.data.response } }] } };
        } catch (error2) {
            throw new Error("𝐴𝑙𝑙 𝑡𝑒𝑥𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑎𝑟𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
        }
    }
}

// Free image generation API with Unsplash integration
async function generateFreeImage(prompt, unsplashAccessKey) {
    try {
        // First try pollinations.ai
        const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
            responseType: 'stream'
        });
        // Add a path property that GoatBot expects for attachments
        response.data.path = `${Date.now()}.png`;
        return [response.data];
    } catch (error) {
        // Fallback to Unsplash if pollinations fails
        try {
            const unsplashResponse = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&client_id=${unsplashAccessKey}`);

            if (unsplashResponse.data.results && unsplashResponse.data.results.length > 0) {
                const imageUrl = unsplashResponse.data.results[0].urls.regular;
                const image = await axios.get(imageUrl, { responseType: 'stream' });
                image.data.path = `${Date.now()}.jpg`;
                return [image.data];
            } else {
                throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑝𝑟𝑜𝑚𝑝𝑡");
            }
        } catch (unsplashError) {
            throw new Error("𝐴𝑙𝑙 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑠𝑒𝑟𝑣𝑖𝑐𝑒𝑠 𝑎𝑟𝑒 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
        }
    }
}

module.exports.onStart = async function({ api, event, args, getText }) {
    const { maxStorageMessage, unsplashAccessKey } = this.config.envConfig;

    switch ((args[0] || "").toLowerCase()) {
        case 'img':
        case 'image':
        case 'draw': {
            if (!args[1]) return api.sendMessage(getText('invalidContentDraw'), event.threadID, event.messageID);
            if (openAIUsing[event.senderID]) return api.sendMessage(getText("yourAreUsing"), event.threadID, event.messageID);

            openAIUsing[event.senderID] = true;
            let sending;

            try {
                sending = await api.sendMessage(getText('processingRequest'), event.threadID, event.messageID);
                const images = await generateFreeImage(args.slice(1).join(' '), unsplashAccessKey);

                await api.sendMessage({
                    body: "🎨 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑖𝑚𝑎𝑔𝑒 (𝐹𝑟𝑒𝑒 𝑆𝑒𝑟𝑣𝑖𝑐𝑒):\n" + getText('attribution'),
                    attachment: images
                }, event.threadID, event.messageID);
            }
            catch (err) {
                const errorMessage = err.message || "";
                await api.sendMessage(getText('error', errorMessage), event.threadID, event.messageID);
            }
            finally {
                delete openAIUsing[event.senderID];
                if (sending) {
                    try {
                        await api.unsendMessage(sending.messageID);
                    } catch (e) { /* ignore unsend errors */ }
                }
            }
            break;
        }

        case 'clear': {
            openAIHistory[event.senderID] = [];
            await api.sendMessage(getText('clearHistory'), event.threadID, event.messageID);
            break;
        }

        default: {
            if (!args[0]) return api.sendMessage(getText('invalidContent'), event.threadID, event.messageID);

            await api.sendMessage(getText('noApiKey'), event.threadID, event.messageID);

            try {
                openAIUsing[event.senderID] = true;

                if (!openAIHistory[event.senderID] || !Array.isArray(openAIHistory[event.senderID])) {
                    openAIHistory[event.senderID] = [];
                }

                if (openAIHistory[event.senderID].length >= maxStorageMessage) {
                    openAIHistory[event.senderID].shift();
                }

                // Build the prompt with conversation history
                let fullPrompt = openAIHistory[event.senderID].map(msg =>
                    `${msg.role}: ${msg.content}`
                ).join('\n');

                fullPrompt += `\nuser: ${args.join(' ')}`;

                const response = await askGpt(event, fullPrompt);
                const text = response.data.choices[0].message.content;

                openAIHistory[event.senderID].push({
                    role: 'user',
                    content: args.join(' ')
                });

                openAIHistory[event.senderID].push({
                    role: 'assistant',
                    content: text
                });

                await api.sendMessage(text, event.threadID, (err, info) => {
                    if (!err && info && info.messageID && global.GoatBot && global.GoatBot.onReply) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            author: event.senderID,
                            messageID: info.messageID
                        });
                    }
                });
            }
            catch (err) {
                const errorMessage = err.message || "";
                await api.sendMessage(getText('error', errorMessage), event.threadID, event.messageID);
            }
            finally {
                delete openAIUsing[event.senderID];
            }
        }
    }
};

module.exports.onReply = async function({ api, event, Reply, getText }) {
    const { maxStorageMessage } = this.config.envConfig;
    const { author } = Reply;

    if (author != event.senderID) return;

    try {
        openAIUsing[event.senderID] = true;

        if (!openAIHistory[event.senderID] || !Array.isArray(openAIHistory[event.senderID])) {
            openAIHistory[event.senderID] = [];
        }

        if (openAIHistory[event.senderID].length >= maxStorageMessage) {
            openAIHistory[event.senderID].shift();
        }

        // Build the prompt with conversation history
        let fullPrompt = openAIHistory[event.senderID].map(msg =>
            `${msg.role}: ${msg.content}`
        ).join('\n');

        fullPrompt += `\nuser: ${event.body}`;

        const response = await askGpt(event, fullPrompt);
        const text = response.data.choices[0].message.content;

        openAIHistory[event.senderID].push({
            role: 'user',
            content: event.body
        });

        openAIHistory[event.senderID].push({
            role: 'assistant',
            content: text
        });

        await api.sendMessage(text, event.threadID, (err, info) => {
            if (!err && info && info.messageID && global.GoatBot && global.GoatBot.onReply) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID
                });
            }
        });
    }
    catch (err) {
        const errorMessage = err.message || "";
        await api.sendMessage(getText('error', errorMessage), event.threadID, event.messageID);
    }
    finally {
        delete openAIUsing[event.senderID];
    }
};
