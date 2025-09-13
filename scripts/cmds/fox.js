const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports.config = {
    name: "fox",
    aliases: ["randomfox", "foxpic"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑓𝑜𝑥 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑓𝑜𝑥 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑟𝑎𝑛𝑑𝑜𝑚𝑓𝑜𝑥.𝑐𝑎 𝐴𝑃𝐼"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}fox"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        const res = await axios.get("https://randomfox.ca/floof/");
        const img = res.data.image;
        const file = path.join(__dirname, "cache/fox.jpg");
        
        const response = await axios({
            method: 'GET',
            url: img,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(file);
        response.data.pipe(writer);

        writer.on('finish', () => {
            message.reply({
                body: "🦊 𝑅𝑎𝑛𝑑𝑜𝑚 𝐹𝑜𝑥:",
                attachment: fs.createReadStream(file)
            });
        });

        writer.on('error', (error) => {
            console.error("𝐹𝑜𝑥 𝐸𝑟𝑟𝑜𝑟:", error);
            message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑥 𝑖𝑚𝑎𝑔𝑒.");
        });

    } catch (error) {
        console.error("𝐹𝑜𝑥 𝐴𝑃𝐼 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑓𝑜𝑥 𝑖𝑚𝑎𝑔𝑒.");
    }
};
