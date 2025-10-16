const axios = require("axios");

module.exports = {
    config: {
        name: "alime",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "𝖺𝗇𝗂𝗆𝖾",
        shortDescription: {
            en: "𝖠𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾𝗌 - 𝖻𝗈𝗍𝗁 𝖲𝖥𝖶 𝖺𝗇𝖽 𝖭𝖲𝖥𝖶"
        },
        longDescription: {
            en: "𝖦𝖾𝗍 𝖺𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾𝗌 𝖿𝗋𝗈𝗆 𝗏𝖺𝗋𝗂𝗈𝗎𝗌 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂𝖾𝗌"
        },
        guide: {
            en: "{p}alime [𝗍𝖺𝗀]\n{p}alime 𝗅𝗂𝗌𝗍 - 𝖲𝗁𝗈𝗐 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝗍𝖺𝗀𝗌"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            // All API endpoints
            const apiEndpoints = {
                "sfw": {
                    "waifu": "https://api.waifu.pics/sfw/waifu",
                    "neko": "https://api.waifu.pics/sfw/neko",
                    "shinobu": "https://api.waifu.pics/sfw/shinobu",
                    "megumin": "https://api.waifu.pics/sfw/megumin",
                    "bully": "https://api.waifu.pics/sfw/bully",
                    "cuddle": "https://api.waifu.pics/sfw/cuddle",
                    "cry": "https://api.waifu.pics/sfw/cry",
                    "hug": "https://api.waifu.pics/sfw/hug",
                    "awoo": "https://api.waifu.pics/sfw/awoo",
                    "kiss": "https://api.waifu.pics/sfw/kiss",
                    "lick": "https://api.waifu.pics/sfw/lick",
                    "pat": "https://api.waifu.pics/sfw/pat",
                    "smug": "https://api.waifu.pics/sfw/smug",
                    "bonk": "https://api.waifu.pics/sfw/bonk",
                    "yeet": "https://api.waifu.pics/sfw/yeet",
                    "blush": "https://api.waifu.pics/sfw/blush",
                    "smile": "https://api.waifu.pics/sfw/smile",
                    "wave": "https://api.waifu.pics/sfw/wave",
                    "highfive": "https://api.waifu.pics/sfw/highfive",
                    "handhold": "https://api.waifu.pics/sfw/handhold",
                    "nom": "https://api.waifu.pics/sfw/nom",
                    "bite": "https://api.waifu.pics/sfw/bite",
                    "glomp": "https://api.waifu.pics/sfw/glomp",
                    "slap": "https://api.waifu.pics/sfw/slap",
                    "kill": "https://api.waifu.pics/sfw/kill",
                    "kick": "https://api.waifu.pics/sfw/kick",
                    "happy": "https://api.waifu.pics/sfw/happy",
                    "wink": "https://api.waifu.pics/sfw/wink",
                    "poke": "https://api.waifu.pics/sfw/poke",
                    "dance": "https://api.waifu.pics/sfw/dance",
                    "cringe": "https://api.waifu.pics/sfw/cringe"
                },
                "nsfw": {
                    "neko": "https://api.waifu.pics/nsfw/neko",
                    "waifu": "https://api.waifu.pics/nsfw/waifu",
                    "blowjob": "https://api.waifu.pics/nsfw/blowjob",
                    "hentai": "https://nekobot.xyz/api/image?type=hentai",
                    "pgif": "https://nekobot.xyz/api/image?type=pgif"
                }
            };

            // Show tag list if requested
            if (!args[0] || args[0].toLowerCase() === 'list') {
                const sfwTags = Object.keys(apiEndpoints.sfw).join(", ");
                const nsfwTags = Object.keys(apiEndpoints.nsfw).join(", ");
                
                const tagList = `🎨 𝖠𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖠𝗇𝗂𝗆𝖾 𝖳𝖺𝗀𝗌:\n\n` +
                               `🌈 𝖲𝖥𝖶 𝖳𝖺𝗀𝗌:\n${sfwTags}\n\n` +
                               `🔞 𝖭𝖲𝖥𝖶 𝖳𝖺𝗀𝗌:\n${nsfwTags}\n\n` +
                               `💡 𝖴𝗌𝖾: ${global.config.PREFIX || '/'}alime [𝗍𝖺𝗀]`;
                
                return message.reply(tagList);
            }

            const tag = args[0].toLowerCase().trim();
            let apiUrl;
            let selectedTag = tag;

            // Check if tag exists in either category
            if (apiEndpoints.sfw.hasOwnProperty(tag)) {
                apiUrl = apiEndpoints.sfw[tag];
            } else if (apiEndpoints.nsfw.hasOwnProperty(tag)) {
                apiUrl = apiEndpoints.nsfw[tag];
            } else {
                // If no valid tag provided, choose random from all categories
                const allTags = { ...apiEndpoints.sfw, ...apiEndpoints.nsfw };
                const randomTags = Object.keys(allTags);
                selectedTag = randomTags[Math.floor(Math.random() * randomTags.length)];
                apiUrl = allTags[selectedTag];
            }

            console.log(`🎨 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝗂𝗇𝗀 𝖺𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾: ${selectedTag} (${apiUrl})`);

            // Show processing message
            let processingMsg;
            try {
                processingMsg = await message.reply("🔄 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾...");
            } catch (msgError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", msgError.message);
            }

            try {
                const response = await axios.get(apiUrl, { 
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                let imageUrl;
                
                // Handle different API response formats
                if (apiUrl.includes('nekobot.xyz')) {
                    imageUrl = response.data.message;
                } else if (apiUrl.includes('waifu.pics')) {
                    imageUrl = response.data.url;
                } else {
                    imageUrl = response.data?.url || response.data?.message;
                }
                
                if (!imageUrl) {
                    throw new Error("𝖭𝗈 𝗂𝗆𝖺𝗀𝖾 𝖴𝖱𝖫 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖠𝖯𝖨 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                }

                console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾: ${imageUrl}`);

                // Get image stream with error handling
                let imageStream;
                try {
                    imageStream = await global.utils.getStreamFromURL(imageUrl);
                    if (!imageStream) {
                        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
                    }
                } catch (streamError) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError.message);
                    throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾");
                }

                const messageBody = `🎨 𝖠𝗇𝗂𝗆𝖾 𝖨𝗆𝖺𝗀𝖾\n━━━━━━━━━━━━━━\n✨ 𝖳𝖺𝗀: ${selectedTag}\n💫 𝖲𝗈𝗎𝗋𝖼𝖾: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽`;

                await message.reply({
                    body: messageBody,
                    attachment: imageStream
                });

                console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖺𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾: ${selectedTag}`);

                // Clean up processing message with correct function name
                if (processingMsg && processingMsg.messageID) {
                    try {
                        await api.unsendMessage(processingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                }

            } catch (error) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error.message);
                
                // Clean up processing message on error
                if (processingMsg && processingMsg.messageID) {
                    try {
                        await api.unsendMessage(processingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                    }
                }
                
                const errorMessages = [
                    "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.",
                    "❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖿𝖾𝗍𝖼𝗁 𝖺𝗇𝗂𝗆𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖳𝗋𝗒 𝖺 𝗂𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝖺𝗀.",
                    "❌ 𝖨𝗆𝖺𝗀𝖾 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝗅𝖺𝗍𝖾𝗋."
                ];
                
                const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                await message.reply(randomError);
            }

        } catch (error) {
            console.error("💥 𝖠𝗅𝗂𝗆𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
