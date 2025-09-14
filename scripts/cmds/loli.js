const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "loli",
    aliases: ["cute", "kawaii"],
    version: "4.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑙𝑜𝑙𝑖 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝑙𝑜𝑙𝑖 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤ℎ𝑒𝑛 𝑢𝑠𝑒𝑟 𝑡𝑦𝑝𝑒𝑠 '𝑙𝑜𝑙𝑖'"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑙𝑜𝑙𝑖' 𝑡𝑜 𝑔𝑒𝑡 𝑐𝑢𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function ({ message }) {
    await message.reply(`𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑙𝑜𝑙𝑖' 𝑎𝑛𝑑 𝐼'𝑙𝑙 𝑠𝑒𝑛𝑑 𝑦𝑜𝑢 𝑠𝑜𝑚𝑒 𝑐𝑢𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠! 📸`);
};

module.exports.onChat = async function ({ event, message }) {
    try {
        const { body } = event;

        if (body.toLowerCase() === "loli") {
            // Updated path - using the same path you provided
            const loliDataPath = path.resolve(__dirname, '../scripts/cmds/datajson/loli.json');
            
            // Check if the file exists
            if (!fs.existsSync(loliDataPath)) {
                console.error("𝐿𝑜𝑙𝑖 𝑑𝑎𝑡𝑎 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡:", loliDataPath);
                return await message.reply("❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛.");
            }

            // Read and parse the JSON file
            const rawData = fs.readFileSync(loliDataPath, 'utf8');
            const imageData = JSON.parse(rawData);
            const imageUrls = Array.isArray(imageData) ? imageData : [imageData];

            if (imageUrls.length === 0) {
                return await message.reply("❌ 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑖𝑛 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒.");
            }

            const numImages = Math.min(Math.floor(Math.random() * 5) + 1, 5); // 1-5 images
            const attachments = [];

            for (let i = 0; i < numImages; i++) {
                try {
                    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)].trim();
                    if (!randomImage) continue;

                    const imagePath = path.join(__dirname, `cache/loli_${Date.now()}_${i}.jpg`);
                    
                    // Download image using axios
                    const response = await axios({
                        method: 'GET',
                        url: randomImage,
                        responseType: 'stream'
                    });

                    const writer = fs.createWriteStream(imagePath);
                    response.data.pipe(writer);

                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });

                    attachments.push(fs.createReadStream(imagePath));

                } catch (error) {
                    console.error(`𝐸𝑟𝑟𝑜𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒 ${i + 1}:`, error);
                }
            }

            if (attachments.length > 0) {
                await message.reply({
                    body: `𝐸𝑛𝑗𝑜𝑦 𝑡ℎ𝑒𝑠𝑒 𝑐𝑢𝑡𝑒 𝑖𝑚𝑎𝑔𝑒𝑠! 💕 (${attachments.length} 𝑖𝑚𝑎𝑔𝑒𝑠)`,
                    attachment: attachments
                });

                // Clean up temporary files
                attachments.forEach(attachment => {
                    try {
                        if (fs.existsSync(attachment.path)) {
                            fs.unlinkSync(attachment.path);
                        }
                    } catch (e) {
                        console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑡𝑒𝑚𝑝 𝑓𝑖𝑙𝑒:", e);
                    }
                });
            } else {
                await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑦 𝑖𝑚𝑎𝑔𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }
        }
    } catch (error) {
        console.error("𝐿𝑜𝑙𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒𝑠! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
