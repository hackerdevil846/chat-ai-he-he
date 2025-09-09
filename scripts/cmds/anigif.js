const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "anigif",
    aliases: ["aigif"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹 𝑏𝑎𝑠𝑒𝑑 𝑜𝑛 𝑎 𝑡𝑒𝑥𝑡 𝑝𝑟𝑜𝑚𝑝𝑡"
    },
    category: "𝑚𝑒𝑑𝑖𝑎",
    guide: {
        en: "{p}anigif [𝑝𝑟𝑜𝑚𝑝𝑡]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        if (!args[0]) {
            return message.reply("🎨 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑝𝑟𝑜𝑚𝑝𝑡 𝑓𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹.\n\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}anigif 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑔𝑖𝑟𝑙 𝑑𝑎𝑛𝑐𝑖𝑛𝑔");
        }

        const userPrompt = args.join(" ");
        
        await message.reply("⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑛𝑖𝑚𝑒 𝐺𝐼𝐹... 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡, 𝑖𝑡 𝑚𝑎𝑦 𝑡𝑎𝑘𝑒 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡. ✨");

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const gifPath = path.join(cacheDir, `anime_${Date.now()}.gif`);
        const encodedPrompt = encodeURIComponent(userPrompt);
        const apiUrl = `https://t2i.onrender.com/kshitiz?prompt=${encodedPrompt}`;

        try {
            const response = await axios.get(apiUrl, { timeout: 30000 });
            
            if (!response.data || !response.data.imageUrl) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐺𝐼𝐹. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
            }

            const imageUrl = response.data.imageUrl;
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });

            fs.writeFileSync(gifPath, Buffer.from(imageResponse.data));

            await message.reply({
                body: `✅ 𝐴𝑛𝑖𝑚𝑒 𝐺𝐼𝐹 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!\n📝 𝑃𝑟𝑜𝑚𝑝𝑡: "${userPrompt}"`,
                attachment: fs.createReadStream(gifPath)
            });

            // Clean up
            fs.unlinkSync(gifPath);

        } catch (apiError) {
            console.error("𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", apiError);
            return message.reply("❌ 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 𝑜𝑟 𝑢𝑠𝑒 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑝𝑟𝑜𝑚𝑝𝑡.");
        }

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑔𝑖𝑓 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
