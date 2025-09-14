const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "kanna",
    aliases: ["kannachan", "kannaimg"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑟𝑎𝑛𝑑𝑜𝑚-𝑖𝑚𝑎𝑔𝑒𝑠",
    shortDescription: {
        en: "𝐾𝑎𝑛𝑛𝑎 𝑐ℎ𝑎𝑛'𝑠 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝐾𝑎𝑛𝑛𝑎 𝑐ℎ𝑎𝑛 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}kanna"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onLoad = function() {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        // Check dependencies
        if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        // Get random Kanna image data
        const response = await axios.get('https://apikanna.khoahoang2.repl.co');
        const imageUrl = response.data.data;
        const count = response.data.count;
        const ext = path.extname(imageUrl) || ".jpg";

        // Prepare local cache path
        const cachePath = path.join(__dirname, "cache", `kanna_${Date.now()}${ext}`);

        // Download image
        const imageResponse = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream"
        });

        const writer = fs.createWriteStream(cachePath);
        imageResponse.data.pipe(writer);

        // Wait for download to complete
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        // Send image to thread
        await message.reply({
            body: `🌸 𝐾𝑎𝑛𝑛𝑎 𝑐ℎ𝑎𝑛'𝑠 𝑖𝑚𝑎𝑔𝑒! <3\n🌸 𝑇𝑜𝑡𝑎𝑙 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒: ${count} 𝑖𝑚𝑎𝑔𝑒𝑠`,
            attachment: fs.createReadStream(cachePath)
        });

        // Clean up
        fs.unlinkSync(cachePath);

    } catch (error) {
        console.error("𝐾𝑎𝑛𝑛𝑎 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐾𝑎𝑛𝑛𝑎'𝑠 𝑖𝑚𝑎𝑔𝑒 𝑐𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑏𝑒 𝑓𝑒𝑡𝑐ℎ𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
