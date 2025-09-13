const Scraper = require('mal-scraper');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "animeinfo",
    aliases: ["mal", "anime"],
    version: "3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 20,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑡 𝑎𝑛𝑖𝑚𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑓𝑟𝑜𝑚 𝑀𝑦𝐴𝑛𝑖𝑚𝑒𝐿𝑖𝑠𝑡"
    },
    longDescription: {
        en: "𝐹𝑒𝑡𝑐ℎ 𝑐𝑜𝑚𝑝𝑟𝑒ℎ𝑒𝑛𝑠𝑖𝑣𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑓𝑟𝑜𝑚 𝑀𝑦𝐴𝑛𝑖𝑚𝑒𝐿𝑖𝑠𝑡"
    },
    category: "𝑎𝑛𝑖𝑚𝑒",
    guide: {
        en: "{p}animeinfo [𝑎𝑛𝑖𝑚𝑒 𝑡𝑖𝑡𝑙𝑒]"
    },
    dependencies: {
        "mal-scraper": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        // Check dependencies
        if (!Scraper || !axios || !fs) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const animeTitle = args.join(" ");
        if (!animeTitle) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑡𝑖𝑡𝑙𝑒!");
        }

        await message.reply(`🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑀𝑦𝐴𝑛𝑖𝑚𝑒𝐿𝑖𝑠𝑡 𝑓𝑜𝑟 "${animeTitle}"...`);

        const animeData = await Scraper.getInfoFromName(animeTitle);
        if (!animeData) {
            return message.reply("❌ 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑡𝑖𝑡𝑙𝑒!");
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const imagePath = path.join(cacheDir, `mal_${Date.now()}.jpg`);
        const imageUrl = animeData.picture;

        // Download image
        try {
            const imageResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 10000
            });
            await fs.writeFile(imagePath, Buffer.from(imageResponse.data, 'binary'));
        } catch (imageError) {
            console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", imageError);
        }

        // Format data
        const genres = animeData.genres?.join(", ") || "𝑁/𝐴";
        const studios = animeData.studios?.join(", ") || "𝑁/𝐴";
        const producers = animeData.producers?.join(", ") || "𝑁/𝐴";

        const messageBody = `
🎬 𝑇𝑖𝑡𝑙𝑒: ${animeData.title || "𝑁/𝐴"}
🇯🇵 𝐽𝑎𝑝𝑎𝑛𝑒𝑠𝑒 𝑇𝑖𝑡𝑙𝑒: ${animeData.japaneseTitle || "𝑁/𝐴"}
📺 𝑇𝑦𝑝𝑒: ${animeData.type || "𝑁/𝐴"}
📊 𝑆𝑡𝑎𝑡𝑢𝑠: ${animeData.status || "𝑁/𝐴"}
🗓️ 𝑃𝑟𝑒𝑚𝑖𝑒𝑟𝑒𝑑: ${animeData.premiered || "𝑁/𝐴"}
⏰ 𝐵𝑟𝑜𝑎𝑑𝑐𝑎𝑠𝑡: ${animeData.broadcast || "𝑁/𝐴"}
📡 𝐴𝑖𝑟𝑒𝑑: ${animeData.aired || "𝑁/𝐴"}
🏭 𝑃𝑟𝑜𝑑𝑢𝑐𝑒𝑟𝑠: ${producers}
🎥 𝑆𝑡𝑢𝑑𝑖𝑜𝑠: ${studios}
📚 𝑆𝑜𝑢𝑟𝑐𝑒: ${animeData.source || "𝑁/𝐴"}
📈 𝐸𝑝𝑖𝑠𝑜𝑑𝑒𝑠: ${animeData.episodes || "𝑁/𝐴"}
⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${animeData.duration || "𝑁/𝐴"}
🏷️ 𝐺𝑒𝑛𝑟𝑒𝑠: ${genres}
🌟 𝑃𝑜𝑝𝑢𝑙𝑎𝑟𝑖𝑡𝑦: #${animeData.popularity || "𝑁/𝐴"}
🏆 𝑅𝑎𝑛𝑘𝑒𝑑: #${animeData.ranked || "𝑁/𝐴"}
⭐ 𝑆𝑐𝑜𝑟𝑒: ${animeData.score || "𝑁/𝐴"}
🔞 𝑅𝑎𝑡𝑖𝑛𝑔: ${animeData.rating || "𝑁/𝐴"}
📝 𝑆𝑦𝑛𝑜𝑝𝑠𝑖𝑠:
${animeData.synopsis?.substring(0, 500) + (animeData.synopsis?.length > 500 ? "..." : "") || "𝑁𝑜 𝑠𝑦𝑛𝑜𝑝𝑠𝑖𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒"}
🔗 𝑉𝑖𝑒𝑤 𝑓𝑢𝑙𝑙 𝑑𝑒𝑡𝑎𝑖𝑙𝑠: ${animeData.url}
`;

        // Send result with or without image
        if (fs.existsSync(imagePath)) {
            await message.reply({
                body: messageBody,
                attachment: fs.createReadStream(imagePath)
            });
            
            // Clean up after sending
            await fs.unlink(imagePath);
        } else {
            await message.reply(messageBody);
        }

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑚𝑒𝐼𝑛𝑓𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
