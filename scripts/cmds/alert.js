const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "alert",
    aliases: ["warning", "notify"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "image",
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑎𝑙𝑒𝑟𝑡 𝑠𝑡𝑦𝑙𝑒 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}alert [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs.existsSync) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        // Combine arguments and replace commas with double spaces
        let text = args.join(" ").replace(/,/g, "  ");
        
        if (!text) {
            return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑎𝑙𝑒𝑟𝑡 (𝑒.𝑔., '𝑎𝑙𝑒𝑟𝑡 𝐻𝑒𝑙𝑙𝑜 𝑊𝑜𝑟𝑙𝑑')");
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const imagePath = path.join(cacheDir, `alert_${event.senderID}.png`);
        const encodedText = encodeURIComponent(text);
        const url = `https://api.popcat.xyz/alert?text=${encodedText}`;

        // Download the image
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send the generated image
        await message.reply({
            body: "𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒:",
            attachment: fs.createReadStream(imagePath)
        });

        // Clean up temporary file
        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑎𝑙𝑒𝑟𝑡 𝑖𝑚𝑎𝑔𝑒.");
    }
};
