const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
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
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        const { threadID } = event;
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const dataPath = path.join(cacheDir, 'alime.json');
        
        // Download or update the data file
        if (!fs.existsSync(dataPath)) {
            try {
                const response = await axios.get("https://raw.githubusercontent.com/ProCoderMew/Module-Miraiv2/main/data/alime.json");
                fs.writeFileSync(dataPath, JSON.stringify(response.data, null, 2));
            } catch (error) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑙𝑖𝑚𝑒 𝑑𝑎𝑡𝑎:", error);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }
        }

        // Load the data
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const { sfw, nsfw } = data;

        if (!args[0] || args[0].toLowerCase() === 'list') {
            // Show available tags
            const sfwTags = Object.keys(sfw).join(", ");
            const nsfwTags = Object.keys(nsfw).join(", ");
            
            const tagList = `🎨 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝐴𝑛𝑖𝑚𝑒 𝑇𝑎𝑔𝑠:\n\n` +
                           `🌈 𝑆𝐹𝑊 𝑇𝑎𝑔𝑠:\n${sfwTags}\n\n` +
                           `🔞 𝑁𝑆𝐹𝑊 𝑇𝑎𝑔𝑠:\n${nsfwTags}\n\n` +
                           `💡 𝑈𝑠𝑒: ${global.config.PREFIX}alime [𝑡𝑎𝑔]`;
            
            return message.reply(tagList);
        }

        const tag = args[0].toLowerCase();
        let apiUrl;

        if (sfw.hasOwnProperty(tag)) {
            apiUrl = sfw[tag];
        } else if (nsfw.hasOwnProperty(tag)) {
            apiUrl = nsfw[tag];
        } else {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑡𝑎𝑔. 𝑈𝑠𝑒 '" + global.config.PREFIX + "alime 𝑙𝑖𝑠𝑡' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑡𝑎𝑔𝑠.");
        }

        // Show processing message
        await message.reply("🔄 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒...");

        try {
            const response = await axios.get(apiUrl);
            const imageUrl = response.data?.response?.url || response.data?.url;
            
            if (!imageUrl) {
                throw new Error("𝑁𝑜 𝑖𝑚𝑎𝑔𝑒 𝑢𝑟𝑙 𝑓𝑜𝑢𝑛𝑑");
            }

            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            const imagePath = path.join(cacheDir, `alime_${tag}_${Date.now()}.jpg`);
            fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

            await message.reply({
                body: `🎨 𝐴𝑛𝑖𝑚𝑒 𝐼𝑚𝑎𝑔𝑒 - 𝑇𝑎𝑔: ${tag}`,
                attachment: fs.createReadStream(imagePath)
            });

            // Clean up
            fs.unlinkSync(imagePath);

        } catch (error) {
            console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑡𝑎𝑔.");
        }

    } catch (error) {
        console.error("𝐴𝑙𝑖𝑚𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
