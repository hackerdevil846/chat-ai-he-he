const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "alime",
        aliases: ["animeimg", "aimg"],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "anime",
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
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Backup API endpoints
            const backupApis = {
                "nsfw": {
                    "anal": "https://api.fluxpoint.dev/nsfw/img/anal",
                    "anus": "https://api.fluxpoint.dev/nsfw/img/anus",
                    "ass": "https://api.fluxpoint.dev/nsfw/img/ass",
                    "azurlane": "https://api.fluxpoint.dev/nsfw/img/azurlane",
                    "bdsm": "https://api.fluxpoint.dev/nsfw/img/bdsm",
                    "blowjob": "https://api.fluxpoint.dev/nsfw/img/blowjob",
                    "boobs": "https://api.fluxpoint.dev/nsfw/img/boobs",
                    "cosplay": "https://api.fluxpoint.dev/nsfw/img/cosplay",
                    "cum": "https://api.fluxpoint.dev/nsfw/img/cum",
                    "feet": "https://api.fluxpoint.dev/nsfw/img/feet",
                    "femdom": "https://api.fluxpoint.dev/nsfw/img/femdom",
                    "futa": "https://api.fluxpoint.dev/nsfw/img/futa",
                    "gasm": "https://api.fluxpoint.dev/nsfw/img/gasm",
                    "holo": "https://api.fluxpoint.dev/nsfw/img/holo",
                    "kitsune": "https://api.fluxpoint.dev/nsfw/img/kitsune",
                    "lewd": "https://api.fluxpoint.dev/nsfw/img/lewd",
                    "neko": "https://api.fluxpoint.dev/nsfw/img/neko",
                    "nekopara": "https://api.fluxpoint.dev/nsfw/img/nekopara",
                    "pantyhose": "https://api.fluxpoint.dev/nsfw/img/pantyhose",
                    "peeing": "https://api.fluxpoint.dev/nsfw/img/peeing",
                    "petplay": "https://api.fluxpoint.dev/nsfw/img/petplay",
                    "pussy": "https://api.fluxpoint.dev/nsfw/img/pussy",
                    "slimes": "https://api.fluxpoint.dev/nsfw/img/slimes",
                    "solo": "https://api.fluxpoint.dev/nsfw/img/solo",
                    "swimsuit": "https://api.fluxpoint.dev/nsfw/img/swimsuit",
                    "tentacle": "https://api.fluxpoint.dev/nsfw/img/tentacle",
                    "thighs": "https://api.fluxpoint.dev/nsfw/img/thighs",
                    "trap": "https://api.fluxpoint.dev/nsfw/img/trap",
                    "yaoi": "https://api.fluxpoint.dev/nsfw/img/yaoi",
                    "yuri": "https://api.fluxpoint.dev/nsfw/img/yuri",
                    "waifu_im_ero": "https://api.waifu.im/search?is_nsfw=true&included_tags=ero",
                    "waifu_im_ass": "https://api.waifu.im/search?is_nsfw=true&included_tags=ass",
                    "waifu_im_hentai": "https://api.waifu.im/search?is_nsfw=true&included_tags=hentai",
                    "waifu_im_milf": "https://api.waifu.im/search?is_nsfw=true&included_tags=milf",
                    "waifu_im_oral": "https://api.waifu.im/search?is_nsfw=true&included_tags=oral",
                    "waifu_im_paizuri": "https://api.waifu.im/search?is_nsfw=true&included_tags=paizuri",
                    "waifu_im_ecchi": "https://api.waifu.im/search?is_nsfw=true&included_tags=ecchi",
                    "purrbot_anal": "https://api.purrbot.site/v2/img/nsfw/anal/gif",
                    "purrbot_cum": "https://api.purrbot.site/v2/img/nsfw/cum/gif",
                    "purrbot_fuck": "https://api.purrbot.site/v2/img/nsfw/fuck/gif",
                    "purrbot_neko": "https://api.purrbot.site/v2/img/nsfw/neko/gif",
                    "purrbot_pussy": "https://api.purrbot.site/v2/img/nsfw/pussy/gif",
                    "purrbot_solo": "https://api.purrbot.site/v2/img/nsfw/solo/gif",
                    "purrbot_threesome_fff": "https://api.purrbot.site/v2/img/nsfw/threesome_fff/gif",
                    "purrbot_threesome_ffm": "https://api.purrbot.site/v2/img/nsfw/threesome_ffm/gif",
                    "purrbot_threesome_mmf": "https://api.purrbot.site/v2/img/nsfw/threesome_mmf/gif",
                    "purrbot_yuri": "https://api.purrbot.site/v2/img/nsfw/yuri/gif"
                },
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
                }
            };

            if (!args[0] || args[0].toLowerCase() === 'list') {
                // Show available tags
                const sfwTags = Object.keys(backupApis.sfw).join(", ");
                const nsfwTags = Object.keys(backupApis.nsfw).join(", ");
                
                const tagList = `🎨 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐴𝑛𝑖𝑚𝑒 𝑇𝑎𝑔𝑠:\n\n` +
                               `🌈 𝑆𝐹𝑊 𝑇𝑎𝑔𝑠:\n${sfwTags}\n\n` +
                               `🔞 𝑁𝑆𝐹𝑊 𝑇𝑎𝑔𝑠:\n${nsfwTags}\n\n` +
                               `💡 𝑈𝑠𝑒: ${global.config.PREFIX}alime [𝑡𝑎𝑔]`;
                
                return message.reply(tagList);
            }

            const tag = args[0].toLowerCase();
            let apiUrl;

            if (backupApis.sfw.hasOwnProperty(tag)) {
                apiUrl = backupApis.sfw[tag];
            } else if (backupApis.nsfw.hasOwnProperty(tag)) {
                apiUrl = backupApis.nsfw[tag];
            } else {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡𝑎𝑔. 𝑈𝑠𝑒 '" + global.config.PREFIX + "alime 𝑙𝑖𝑠𝑡' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡𝑎𝑔𝑠.");
            }

            // Show processing message
            const processingMsg = await message.reply("🔄 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒...");

            try {
                const response = await axios.get(apiUrl);
                let imageUrl;
                
                // Handle different API response formats
                if (apiUrl.includes('waifu.im')) {
                    imageUrl = response.data?.images?.[0]?.url;
                } else if (apiUrl.includes('purrbot.site')) {
                    imageUrl = response.data?.data?.link;
                } else if (apiUrl.includes('fluxpoint.dev')) {
                    imageUrl = response.data?.file;
                } else if (apiUrl.includes('waifu.pics')) {
                    imageUrl = response.data?.url;
                } else {
                    imageUrl = response.data?.url || response.data?.file || response.data?.images?.[0]?.url || response.data?.data?.link;
                }
                
                if (!imageUrl) {
                    throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑢𝑟𝑙 𝑓𝑜𝑢𝑛𝑑");
                }

                const imageStream = await global.utils.getStreamFromURL(imageUrl);

                await message.reply({
                    body: `🎨 𝐴𝑛𝑖𝑚𝑒 𝐼𝑚𝑎𝑔𝑒 - 𝑇𝑎𝑔: ${tag}`,
                    attachment: imageStream
                });

                // Clean up processing message
                if (processingMsg && processingMsg.messageID) {
                    await message.unsendMessage(processingMsg.messageID);
                }

            } catch (error) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                // Don't send error message to avoid spam
            }

        } catch (error) {
            console.error("𝐴𝑙𝑖𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            // Don't send error message to avoid spam
        }
    }
};
