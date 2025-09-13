const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "animeart",
    aliases: ["animepic", "animeimage"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑠𝑎𝑓𝑒 𝑐𝑢𝑡𝑒 𝑎𝑛𝑖𝑚𝑒 𝑖𝑙𝑙𝑢𝑠𝑡𝑟𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐹𝑒𝑡𝑐ℎ𝑒𝑠 𝑠𝑎𝑓𝑒 (𝑛𝑜𝑛-𝑅18) 𝑎𝑛𝑖𝑚𝑒 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑙𝑜𝑙𝑖𝑐𝑜𝑛 𝐴𝑃𝐼"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}animeart"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const res = await axios.post("https://api.lolicon.app/setu/v2", {
            r18: 0,
            num: 1
        });

        if (!res.data || !res.data.data || res.data.data.length === 0) {
            return message.reply("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 𝑡ℎ𝑖𝑠 𝑡𝑖𝑚𝑒.");
        }

        const imageUrl = res.data.data[0].urls.original || res.data.data[0].urls.regular;
        const filePath = path.join(__dirname, "cache", "animeart.jpg");

        // Ensure cache directory exists
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        // Download image using axios
        const imageResponse = await axios({
            method: "GET",
            url: imageUrl,
            responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);
        imageResponse.data.pipe(writer);

        writer.on("finish", async () => {
            const caption = `
✨ 𝐴𝑛𝑖𝑚𝑒 𝐴𝑟𝑡 𝐺𝑎𝑙𝑙𝑒𝑟𝑦 ✨

🌸 𝐴𝑃𝐼 𝑐𝑟𝑒𝑑𝑖𝑡: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
            `;
            
            await message.reply({
                body: caption.trim(),
                attachment: fs.createReadStream(filePath)
            });

            // Clean up
            fs.unlinkSync(filePath);
        });

        writer.on("error", async () => {
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒.");
        });

    } catch (error) {
        console.error("𝐴𝑛𝑖𝑚𝑒𝐴𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒: " + error.message);
    }
};
