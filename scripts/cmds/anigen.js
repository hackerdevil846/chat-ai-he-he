const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "anigen",
    aliases: ["animegen", "animeai"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡"
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
        en: "{p}anigen [𝑝𝑟𝑜𝑚𝑝𝑡]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios || !path) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        if (!args[0]) {
            return message.reply("🎨 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡 𝑓𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒.\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}anigen 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑤𝑖𝑡ℎ 𝑝𝑖𝑛𝑘 ℎ𝑎𝑖𝑟");
        }

        const userPrompt = args.join(" ");
        
        await message.reply("⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒... 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡, 𝑖𝑡 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡. ✨");

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const imagePath = path.join(cacheDir, `anime_${Date.now()}.png`);
        const encodedPrompt = encodeURIComponent(userPrompt);
        const apiUrl = `https://t2i.onrender.com/kshitiz?prompt=${encodedPrompt}`;

        // Fetch the image from the API
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (!response.data || !response.data.imageUrl) {
            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
        }

        const imageUrl = response.data.imageUrl;

        // Download the image
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });

        // Save the image to cache
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));

        // Send the generated image
        await message.reply({
            body: `✅ 𝐴𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: ${userPrompt}`,
            attachment: fs.createReadStream(imagePath)
        });

        // Clean up the temporary file
        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑔𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        
        if (error.code === 'ECONNABORTED') {
            await message.reply("❌ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑠𝑖𝑚𝑝𝑙𝑒𝑟 𝑝𝑟𝑜𝑚𝑝𝑡.");
        } else if (error.response?.status === 404) {
            await message.reply("❌ 𝐴𝑃𝐼 𝑒𝑛𝑑𝑝𝑜𝑖𝑛𝑡 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        } else {
            await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
        }
    }
};
