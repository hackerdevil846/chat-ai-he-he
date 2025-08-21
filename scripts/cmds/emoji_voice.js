const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const emojiVoiceDB = {
    "🥺": {
        url: "https://drive.google.com/uc?export=download&id=1Gyi-zGUv5Yctk5eJRYcqMD2sbgrS_c1R",
        caption: "✨ মিস ইউ বেপি... 🥺"
    },
    "😍": {
        url: "https://drive.google.com/uc?export=download&id=1lIsUIvmH1GFnI-Uz-2WSy8-5u69yQ0By",
        caption: "💖 তোমার প্রতি ভালোবাসা দিনকে দিন বাড়ছে... 😍"
    },
    "😭": {
        url: "https://drive.google.com/uc?export=download&id=1qU27pXIm5MV1uTyJVEVslrfLP4odHwsa",
        caption: "😢 জান তুমি কান্না করতেছো কোনো... 😭"
    },
    "😡": {
        url: "https://drive.google.com/uc?export=download&id=1S_I7b3_f4Eb8znzm10vWn99Y7XHaSPYa",
        caption: "⚡ রাগ কমাও, মাফ করাই বড়ত্ব... 😡"
    },
    "🙄": {
        url: "https://drive.google.com/uc?export=download&id=1gtovrHXVmQHyhK2I9F8d2Xbu7nKAa5GD",
        caption: "🎭 এভাবে তাকিও না তুমি ভেবে লজ্জা লাগে ... 🙄"
    },
    "😑": {
        url: "https://drive.google.com/uc?export=download&id=1azElOD2QeaMbV2OdCY_W3tErD8JQ3T7P",
        caption: "🍋 লেবু খাও জান সব ঠিক হয়ে যাবে 😑"
    },
    "😒": {
        url: "https://drive.google.com/uc?export=download&id=1tbKe8yiU0RbINPlQgOwnig7KPXPDzjXv",
        caption: "❌ বিরক্ত করো না জান... ❤"
    },
    "🤣": {
        url: "https://drive.google.com/uc?export=download&id=1Hvy_Xee8dAYp-Nul7iZtAq-xQt6-rNpU",
        caption: "😂 হাসলে তোমাকে পাগল এর মতো লাগে... 🤣"
    },
    "💔": {
        url: "https://drive.google.com/uc?export=download&id=1jQDnFc5MyxRFg_7PsZXCVJisIIqTI8ZY",
        caption: "🎵 feel this song... 💔"
    },
    "🙂": {
        url: "https://drive.google.com/uc?export=download&id=1_sehHc-sDtzuqyB2kL_XGMuvm2Bv-Dqc",
        caption: "💫 তুমি কি আধো আমাকে ভালোবাসো ... 🙂"
    }
};

module.exports.config = {
    name: "emoji_voice",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎵 Emoji-based voice responses with Bengali captions",
    commandCategory: "entertainment",
    usages: "Send any supported emoji: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂",
    cooldowns: 3,
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "missingEmoji": "❌ Please send a valid emoji: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂",
        "error": "⚠️ An error occurred while processing your request"
    },
    "bn": {
        "missingEmoji": "❌ দয়া করে একটি সঠিক ইমোজি পাঠান: 🥺 😍 😭 😡 🙄 😑 😒 🤣 💔 🙂",
        "error": "⚠️ আপনার অনুরোধ প্রক্রিয়া করার সময় একটি ত্রুটি ঘটেছে"
    }
};

module.exports.onLoad = async function() {
    const cacheDir = path.join(__dirname, 'cache', 'emoji_voice');
    await fs.ensureDir(cacheDir);
    
    console.log("🔄 Pre-caching emoji voice files...");
    
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
                console.log(`✅ Successfully cached: ${emoji}`);
            } catch (error) {
                console.error(`❌ Failed to cache ${emoji}:`, error.message);
            }
        }
    }));
    
    console.log("✅ Pre-caching completed");
};

module.exports.handleEvent = async function({ api, event }) {
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

        api.sendMessage({
            body: emojiVoiceDB[emoji].caption,
            attachment: fs.createReadStream(filePath)
        }, threadID, messageID);
        
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(
            this.languages?.en?.error || "❌ An error occurred",
            threadID,
            messageID
        );
    }
};

module.exports.run = function({ api, event }) {
    api.sendMessage(
        `🎵 Send one of these emojis to get voice response:\n${Object.keys(emojiVoiceDB).join(' ')}`,
        event.threadID,
        event.messageID
    );
};
