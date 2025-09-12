const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const emojiVoiceDB = {
    "🥺": {
        url: "https://drive.google.com/uc?export=download&id=1Gyi-zGUv5Yctk5eJRYcqMD2sbgrS_c1R",
        caption: "✨ 𝑀𝑖𝑠 𝑌𝑜𝑢 𝐵𝑒𝑝𝑖... 🥺"
    },
    "😍": {
        url: "https://drive.google.com/uc?export=download&id=1lIsUIvmH1GFnI-Uz-2WSy8-5u69yQ0By",
        caption: "💖 𝑇𝑜𝑚𝑎𝑟 𝑝𝑟𝑜𝑡𝑖 𝑏ℎ𝑎𝑙𝑜𝑏𝑎𝑠𝑎 𝑑𝑖𝑛𝑘𝑒 𝑑𝑖𝑛 𝑏𝑎𝑟𝑐ℎ𝑒... 😍"
    },
    "😭": {
        url: "https://drive.google.com/uc?export=download&id=1qU27pXIm5MV1uTyJVEVslrfLP4odHwsa",
        caption: "😢 𝐽𝑎𝑛 𝑡𝑢𝑚𝑖 𝑘𝑎𝑛𝑛𝑎 𝑘𝑜𝑟𝑡𝑒𝑐ℎ𝑜 𝐾𝑜𝑛𝑜... 😭"
    },
    "😡": {
        url: "https://drive.google.com/uc?export=download&id=1S_I7b3_f4Eb8znzm10vWn99Y7XHaSPYa",
        caption: "⚡ 𝑅𝑎𝑔 𝑘𝑜𝑚𝑎𝑜, 𝑚𝑎𝑓 𝑘𝑜𝑟𝑎𝑖 𝑏𝑜𝑟𝑜𝑡𝑜𝑏... 😡"
    },
    "🙄": {
        url: "https://drive.google.com/uc?export=download&id=1gtovrHXVmQHyhK2I9F8d2Xbu7nKAa5GD",
        caption: "🎭 𝐸𝑏ℎ𝑎𝑏𝑒 𝑡𝑎𝑘𝑖𝑜 𝑛𝑎 𝑡𝑢𝑚𝑖 𝑏ℎ𝑒𝑏𝑒 𝑙𝑜𝑗𝑗𝑎 𝑙𝑎𝑔𝑒 ... 🙄"
    },
    "😑": {
        url: "https://drive.google.com/uc?export=download&id=1azElOD2QeaMbV2OdCY_W3tErD8JQ3T7P",
        caption: "🍋 𝐿𝑒𝑏𝑢 𝑘ℎ𝑎𝑜 𝑗𝑎𝑛 𝑠𝑜𝑏 𝑡ℎ𝑖𝑘 ℎ𝑜𝑦𝑒 𝑗𝑎𝑏𝑒 😑"
    },
    "😒": {
        url: "https://drive.google.com/uc?export=download&id=1tbKe8yiU0RbINPlQgOwnig7KPXPDzjXv",
        caption: "❌ 𝐵𝑖𝑟𝑜𝑘𝑡 𝑘𝑜𝑟𝑜 𝑛𝑎 𝑗𝑎𝑛... ❤"
    },
    "🤣": {
        url: "https://drive.google.com/uc?export=download&id=1Hvy_Xee8dAYp-Nul7iZtAq-xQt6-rNpU",
        caption: "😂 𝐻𝑎𝑠𝑙𝑒 𝑡𝑜𝑚𝑎𝑘𝑒 𝑝𝑎𝑔𝑜𝑙 𝐸𝑟 𝑚𝑜𝑡𝑜 𝑙𝑎𝑔𝑒... 🤣"
    },
    "💔": {
        url: "https://drive.google.com/uc?export=download&id=1jQDnFc5MyxRFg_7PsZXCVJisIIqTI8ZY",
        caption: "🎵 𝑓𝑒𝑒𝑙 𝑡ℎ𝑖𝑠 𝑠𝑜𝑛𝑔... 💔"
    },
    "🙂": {
        url: "https://drive.google.com/uc?export=download&id=1_sehHc-sDtzuqyB2kL_XGMuvm2Bv-Dqc",
        caption: "💫 𝑇𝑢𝑚𝑖 𝑘𝑖 𝑎𝑑ℎ𝑜 𝑎𝑚𝑎𝑘𝑒 𝑏ℎ𝑎𝑙𝑜𝑏𝑎𝑠𝑜 ... 🙂"
    }
};

module.exports.config = {
    name: "emoji_voice",
    aliases: ["evoice", "ev"],
    version: "1.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    category: "entertainment",
    shortDescription: {
        en: "🎵 𝐸𝑚𝑜𝑗𝑖-𝑏𝑎𝑠𝑒𝑑 𝑣𝑜𝑖𝑐𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒𝑠 𝑤𝑖𝑡ℎ 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 𝑐𝑎𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
        en: "𝑃𝑙𝑎𝑦𝑠 𝑣𝑜𝑖𝑐𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑒𝑚𝑜𝑗𝑖𝑠 𝑤𝑖𝑡ℎ 𝐵𝑒𝑛𝑔𝑎𝑙𝑖 𝑐𝑎𝑝𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
        en: "𝑆𝑒𝑛𝑑 𝑎𝑛𝑦 𝑠𝑢𝑝𝑝𝑜𝑟𝑡𝑒𝑑 𝑒𝑚𝑜𝑗𝑖: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.languages = {
    "en": {
        "missingEmoji": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑠𝑒𝑛𝑑 𝑎 𝑣𝑎𝑙𝑖𝑑 𝑒𝑚𝑜𝑗𝑖: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂",
        "error": "⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡"
    },
    "bn": {
        "missingEmoji": "❌ 𝐷𝑎𝑦𝑎 𝑘𝑎𝑟𝑒𝑛 𝑒𝑘𝑡𝑖 𝑠𝑜𝑡ℎ𝑖𝑘 𝑒𝑚𝑜𝑗𝑖 𝑝𝑎𝑡ℎ𝑎𝑛: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂",
        "error": "⚠️ 𝐴𝑝𝑛𝑎𝑟 𝑎𝑛𝑢𝑟𝑜𝑑ℎ 𝑝𝑟𝑜𝑘𝑟𝑖𝑦𝑎 𝑘𝑎𝑟𝑎𝑟 𝑠𝑜𝑚𝑜𝑦 𝑒𝑘𝑡𝑖 𝑡𝑟𝑢𝑡𝑖 𝑔ℎ𝑜𝑡𝑒𝑐ℎ𝑒"
    }
};

module.exports.onLoad = async function() {
    try {
        const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
        await fs.ensureDir(cacheDir);
        
        console.log("🔄 𝑃𝑟𝑒-𝑐𝑎𝑐ℎ𝑖𝑛𝑔 𝑒𝑚𝑜𝑗𝑖 𝑣𝑜𝑖𝑐𝑒 𝑓𝑖𝑙𝑒𝑠...");
        
        await Promise.all(Object.keys(emojiVoiceDB).map(async emoji => {
            const filePath = path.join(cacheDir, `${emoji}.mp3`);
            if (!await fs.pathExists(filePath)) {
                try {
                    const response = await axios({
                        method: 'GET',
                        url: emojiVoiceDB[emoji].url,
                        responseType: 'arraybuffer',
                        timeout: 45000
                    });
                    await fs.writeFile(filePath, response.data);
                    console.log(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑐𝑎𝑐ℎ𝑒𝑑: ${emoji}`);
                } catch (error) {
                    console.error(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑎𝑐ℎ𝑒 ${emoji}:`, error.message);
                }
            }
        }));
        
        console.log("✅ 𝑃𝑟𝑒-𝑐𝑎𝑐ℎ𝑖𝑛𝑔 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑");
    } catch (error) {
        console.error("𝑂𝑛𝐿𝑜𝑎𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onChat = async function({ event, api }) {
    const { threadID, messageID, body } = event;
    
    if (!body || body.length > 2) return;
    
    const emoji = body.trim();
    if (!emojiVoiceDB[emoji]) return;
    
    try {
        const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
        const filePath = path.join(cacheDir, `${emoji}.mp3`);
        
        await fs.ensureDir(cacheDir);
        
        if (!await fs.pathExists(filePath)) {
            const response = await axios({
                method: 'GET',
                url: emojiVoiceDB[emoji].url,
                responseType: 'arraybuffer',
                timeout: 30000
            });
            await fs.writeFile(filePath, response.data);
        }

        await api.sendMessage({
            body: emojiVoiceDB[emoji].caption,
            attachment: fs.createReadStream(filePath)
        }, threadID, messageID);
        
    } catch (error) {
        console.error('𝐸𝑟𝑟𝑜𝑟:', error);
        await api.sendMessage(
            this.languages?.en?.error || "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑",
            threadID,
            messageID
        );
    }
};

module.exports.onStart = async function({ api, event }) {
    await api.sendMessage(
        `🎵 𝑆𝑒𝑛𝑑 𝑜𝑛𝑒 𝑜𝑓 𝑡ℎ𝑒𝑠𝑒 𝑒𝑚𝑜𝑗𝑖𝑠 𝑡𝑜 𝑔𝑒𝑡 𝑣𝑜𝑖𝑐𝑒 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒:\n${Object.keys(emojiVoiceDB).join(' ')}`,
        event.threadID,
        event.messageID
    );
};
