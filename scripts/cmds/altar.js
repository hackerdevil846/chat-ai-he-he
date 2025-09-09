const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "altar",
    aliases: ["worship", "holy"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐴𝑙𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑎𝑙𝑡𝑎𝑟 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑎𝑣𝑎𝑡𝑎𝑟"
    },
    guide: {
        en: "{p}altar [@𝑡𝑎𝑔]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Check dependencies
        if (!createCanvas || !loadImage) {
            throw new Error("𝑐𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!axios) {
            throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!fs.existsSync || !path) {
            throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑜𝑟 𝑝𝑎𝑡ℎ 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const outputPath = path.join(cacheDir, 'altar.png');
        
        // Get user ID from mention or use sender's ID
        const targetID = Object.keys(event.mentions)[0] || event.senderID;
        
        // Create canvas
        const canvas = createCanvas(960, 634);
        const ctx = canvas.getContext('2d');

        // Load background image
        try {
            const background = await loadImage('https://i.imgur.com/brK0Hbb.jpg');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒:", error);
            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑏𝑎𝑐𝑘𝑔𝑟𝑜𝑢𝑛𝑑 𝑖𝑚𝑎𝑔𝑒");
        }

        // Get user avatar
        try {
            const avatarResponse = await axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512`, {
                responseType: 'arraybuffer'
            });
            
            // Create circular avatar
            const avatarImage = await loadImage(Buffer.from(avatarResponse.data));
            
            // Draw circular avatar (manual circle cropping)
            ctx.save();
            ctx.beginPath();
            ctx.arc(353 + 102.5, 158 + 102.5, 102.5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImage, 353, 158, 205, 205);
            ctx.restore();

        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑎𝑣𝑎𝑡𝑎𝑟:", error);
            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟");
        }

        // Save the image
        const buffer = canvas.toBuffer();
        fs.writeFileSync(outputPath, buffer);

        // Send the result
        await message.reply({
            body: "𝐻𝑒𝑦, ℎ𝑜𝑤 𝑎𝑟𝑒 𝑦𝑜𝑢? :))",
            attachment: fs.createReadStream(outputPath)
        });

        // Clean up
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error("𝐴𝑙𝑡𝑎𝑟 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒");
    }
};
