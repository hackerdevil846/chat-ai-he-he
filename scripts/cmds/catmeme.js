const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports.config = {
    name: "kittymeme",
    aliases: ["catmeme", "kittytext"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑐𝑎𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑎 𝑐𝑢𝑡𝑒 𝑐𝑎𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑖𝑡."
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "{p}kittymeme 𝑦𝑜𝑢𝑟 𝑓𝑢𝑛𝑛𝑦 𝑡𝑒𝑥𝑡 ℎ𝑒𝑟𝑒"
    },
    dependencies: {
        "fs-extra": "",
        "path": "",
        "https": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        if (args.length === 0) {
            return message.reply("❗ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡. 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: `{p}kittymeme 𝐼 𝑙𝑜𝑣𝑒 𝑐𝑎𝑡𝑠`");
        }

        const text = encodeURIComponent(args.join(" "));
        const imageUrl = `https://cataas.com/cat/says/${text}`;
        const fileName = `kittymeme_${Date.now()}.jpg`;
        const cacheDir = path.join(__dirname, "cache");
        const filePath = path.join(cacheDir, fileName);

        // Ensure cache directory exists
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const fileStream = fs.createWriteStream(filePath);
        
        https.get(imageUrl, (response) => {
            if (response.statusCode !== 200) {
                throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑖𝑚𝑎𝑔𝑒");
            }
            
            response.pipe(fileStream);
            
            fileStream.on('finish', async () => {
                try {
                    await message.reply({
                        body: `🐱 𝐶𝑎𝑡 𝑚𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑:\n📝 *${decodeURIComponent(text)}*`,
                        attachment: fs.createReadStream(filePath)
                    });
                    
                    // Clean up file after sending
                    setTimeout(() => {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }, 5000);
                    
                } catch (error) {
                    console.error("𝑀𝑒𝑠𝑠𝑎𝑔𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                    message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑖𝑚𝑎𝑔𝑒.");
                }
            });
            
        }).on('error', (error) => {
            console.error("𝐻𝑇𝑇𝑃𝑆 𝑒𝑟𝑟𝑜𝑟:", error);
            message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑐𝑎𝑡 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒.");
        });

    } catch (error) {
        console.error("𝐾𝑖𝑡𝑡𝑦𝑀𝑒𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("⚠️ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑎𝑡 𝑚𝑒𝑚𝑒.");
    }
};
