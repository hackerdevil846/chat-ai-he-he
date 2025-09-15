const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const encodedUrl = "aHR0cHM6Ly9yYXNpbi1hcGlzLm9ucmVuZGVyLmNvbQ==";
const encodedKey = "cnNfaGVpNTJjbTgtbzRvai11Y2ZjLTR2N2MtZzE=";

function decode(b64) {
    return Buffer.from(b64, "base64").toString("utf-8");
}

function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        https.get(url, res => {
            if (res.statusCode !== 200) return reject(new Error(`❌ 𝐼𝑚𝑎𝑔𝑒 𝑓𝑒𝑡𝑐ℎ 𝑓𝑎𝑖𝑙𝑒𝑑 𝑤𝑖𝑡ℎ 𝑠𝑡𝑎𝑡𝑢𝑠: ${res.statusCode}`));
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
        }).on("error", err => {
            fs.unlinkSync(filePath);
            reject(err);
        });
    });
}

module.exports = {
    config: {
        name: "needgf",
        aliases: ["girlfriend", "gf"],
        version: "1.0.4",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "💝 𝑆𝑖𝑛𝑔𝑙𝑒 𝑝𝑒𝑜𝑝𝑙𝑒'𝑠 𝑙𝑎𝑠𝑡 ℎ𝑜𝑝𝑒 𝑓𝑖𝑙𝑒"
        },
        longDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑟𝑎𝑛𝑑𝑜𝑚 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑟 𝑠𝑖𝑛𝑔𝑙𝑒 𝑝𝑒𝑜𝑝𝑙𝑒"
        },
        category: "𝑓𝑢𝑛",
        guide: {
            en: "{p}needgf"
        },
        countDown: 20,
        dependencies: {
            "axios": "",
            "https": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ message, event }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("https");
                require("fs-extra");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, ℎ𝑡𝑡𝑝𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            const apiUrl = decode(encodedUrl);
            const apiKey = decode(encodedKey);
            const fullUrl = `${apiUrl}/api/rasin/gf?apikey=${apiKey}`;

            await message.reply("💖 𝑌𝑜𝑢𝑟 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝑖𝑚𝑎𝑔𝑒 𝑖𝑠 𝑏𝑒𝑖𝑛𝑔 𝑐𝑟𝑒𝑎𝑡𝑒𝑑...");

            const res = await axios.get(fullUrl);
            const title = res.data.data.title;
            const imgUrl = res.data.data.url;

            const imgPath = path.join(__dirname, "cache", `gf_${event.senderID}.jpg`);
            await downloadImage(imgUrl, imgPath);

            await message.reply({
                body: `💝 ${title}\n\n✨ 𝑌𝑜𝑢𝑟 𝑔𝑖𝑟𝑙𝑓𝑟𝑖𝑒𝑛𝑑 𝑖𝑠 𝑐𝑜𝑚𝑖𝑛𝑔...`,
                attachment: fs.createReadStream(imgPath)
            });

            // Clean up
            fs.unlinkSync(imgPath);

        } catch (err) {
            console.error("❌ 𝐸𝑟𝑟𝑜𝑟:", err.message);
            await message.reply("⚠️ 𝐼𝑚𝑎𝑔𝑒 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑝𝑟𝑜𝑏𝑙𝑒𝑚, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
        }
    }
};
