const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const axios = require("axios");

module.exports.config = {
    name: "ham",
    aliases: ["bacon", "meat"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 ℎ𝑎𝑚 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚 ℎ𝑎𝑚 𝑝𝑙𝑎𝑐𝑒ℎ𝑜𝑙𝑑𝑒𝑟 𝑖𝑚𝑎𝑔𝑒"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}ham"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        const imgUrl = "https://baconmockup.com/600/400";
        const filePath = path.join(__dirname, "cache", "ham.jpg");
        
        // Ensure cache directory exists
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        // Download image using axios for better error handling
        const response = await axios({
            method: 'GET',
            url: imgUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            await message.reply({
                body: "🍖 𝐻𝑎𝑚 𝑃𝑙𝑎𝑐𝑒ℎ𝑜𝑙𝑑𝑒𝑟 𝐼𝑚𝑎𝑔𝑒",
                attachment: fs.createReadStream(filePath)
            });
            
            // Clean up file after sending
            fs.unlinkSync(filePath);
        });

        writer.on('error', async () => {
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ℎ𝑎𝑚 𝑖𝑚𝑎𝑔𝑒.");
        });

    } catch (error) {
        console.error("𝐻𝑎𝑚 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 ℎ𝑎𝑚 𝑖𝑚𝑎𝑔𝑒.");
    }
};
