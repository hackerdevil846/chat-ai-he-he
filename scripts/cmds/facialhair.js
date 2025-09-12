const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const axios = require("axios");

module.exports.config = {
    name: "facialhair",
    aliases: ["beard", "mustache"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑏𝑒𝑎𝑟𝑑 𝑠𝑡𝑦𝑙𝑒 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑟𝑎𝑛𝑑𝑜𝑚𝑙𝑦 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑚𝑎𝑠𝑐𝑢𝑙𝑖𝑛𝑒 𝑓𝑎𝑐𝑖𝑎𝑙 ℎ𝑎𝑖𝑟 𝑖𝑚𝑎𝑔𝑒"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}facialhair"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "https": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        // Check dependencies
        if (!fs.existsSync || !axios || !https) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const imgUrl = "https://placebeard.it/400x400";
        const filePath = path.join(__dirname, "cache/beard.jpg");
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.dirname(filePath);
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const file = fs.createWriteStream(filePath);

        https.get(imgUrl, response => {
            response.pipe(file);
            file.on("finish", () => {
                file.close(() => {
                    message.reply({
                        body: "🧔 𝑅𝑎𝑛𝑑𝑜𝑚 𝐹𝑎𝑐𝑖𝑎𝑙 𝐻𝑎𝑖𝑟 𝐴𝑣𝑎𝑡𝑎𝑟",
                        attachment: fs.createReadStream(filePath)
                    }).then(() => {
                        // Clean up after sending
                        fs.unlinkSync(filePath);
                    }).catch(error => {
                        console.error("𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                    });
                });
            });
        }).on("error", (error) => {
            console.error("𝐻𝑇𝑇𝑃𝑆 𝑒𝑟𝑟𝑜𝑟:", error);
            message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑓𝑎𝑐𝑖𝑎𝑙 ℎ𝑎𝑖𝑟 𝑎𝑣𝑎𝑡𝑎𝑟.");
        });

    } catch (error) {
        console.error("𝐹𝑎𝑐𝑖𝑎𝑙𝐻𝑎𝑖𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒.");
    }
};
