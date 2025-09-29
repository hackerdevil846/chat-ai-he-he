const axios = require("axios");

module.exports = {
    config: {
        name: "alime",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑎𝑛𝑖𝑚𝑒",
        shortDescription: {
            en: "𝐴𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 - 𝑏𝑜𝑡ℎ 𝑆𝐹𝑊 𝑎𝑛𝑑 𝑁𝑆𝐹𝑊"
        },
        longDescription: {
            en: "𝐺𝑒𝑡 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑣𝑎𝑟𝑖𝑜𝑢𝑠 𝑐𝑎𝑡𝑒𝑔𝑜𝑟𝑖𝑒𝑠"
        },
        guide: {
            en: "{p}alime [𝑡𝑎𝑔]\n{p}alime 𝑙𝑖𝑠𝑡 - 𝑆ℎ𝑜𝑤 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡𝑎𝑔𝑠"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
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
                
                const tagList = `🎨 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐴𝑛𝑖𝑚𝑒 𝑇𝑎𝑔𝑠:\n\n` +
                               `🌈 𝑆𝐹𝑊 𝑇𝑎𝑔𝑠:\n${sfwTags}\n\n` +
                               `🔞 𝑁𝑆𝐹𝑊 𝑇𝑎𝑔𝑠:\n${nsfwTags}\n\n` +
                               `💡 𝑈𝑠𝑒: ${global.config.PREFIX || '-'}alime [𝑡𝑎𝑔]`;
                
                return message.reply(tagList);
            }

            const tag = args[0].toLowerCase();
            let apiUrl;

            // Check if tag exists in either category
            if (apiEndpoints.sfw.hasOwnProperty(tag)) {
                apiUrl = apiEndpoints.sfw[tag];
            } else if (apiEndpoints.nsfw.hasOwnProperty(tag)) {
                apiUrl = apiEndpoints.nsfw[tag];
            } else {
                // If no valid tag provided, choose random from all categories
                const allTags = { ...apiEndpoints.sfw, ...apiEndpoints.nsfw };
                const randomTags = Object.keys(allTags);
                const randomTag = randomTags[Math.floor(Math.random() * randomTags.length)];
                apiUrl = allTags[randomTag];
            }

            // Show processing message
            const processingMsg = await message.reply("🔄 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒...");

            try {
                const response = await axios.get(apiUrl, { timeout: 10000 });
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
                    throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑢𝑟𝑙 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒");
                }

                const imageStream = await global.utils.getStreamFromURL(imageUrl);

                await message.reply({
                    body: `🎨 𝐴𝑛𝑖𝑚𝑒 𝐼𝑚𝑎𝑔𝑒\n━━━━━━━━━━━━━━\n✨ 𝑇𝑎𝑔: ${tag || '𝑟𝑎𝑛𝑑𝑜𝑚'}\n💫 𝑆𝑜𝑢𝑟𝑐𝑒: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`,
                    attachment: imageStream
                });

                // Clean up processing message
                if (processingMsg && processingMsg.messageID) {
                    await message.unsendMessage(processingMsg.messageID);
                }

            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            }

        } catch (error) {
            console.error("𝐴𝑙𝑖𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
