const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports.config = {
    name: "trump",
    aliases: ["trumptweet"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑇𝑟𝑢𝑚𝑝 𝑡𝑤𝑒𝑒𝑡 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝑖𝑚𝑎𝑔𝑒 𝑜𝑓 𝑎 𝑇𝑟𝑢𝑚𝑝 𝑡𝑤𝑒𝑒𝑡 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}trump [text]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "canvas": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Check if canvas is available
        if (typeof createCanvas === 'undefined') {
            return message.reply("❌ 𝐶𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑖𝑡 𝑢𝑠𝑖𝑛𝑔: 𝑛𝑝𝑚 𝑖 𝑐𝑎𝑛𝑣𝑎𝑠");
        }

        const text = args.join(" ");
        
        if (!text) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑇𝑟𝑢𝑚𝑝'𝑠 𝑡𝑤𝑒𝑒𝑡 📝");
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const pathImg = path.join(cacheDir, 'trump.png');
        
        // Download the Trump tweet template
        try {
            const { data } = await axios.get("https://i.imgur.com/ZtWfHHx.png", {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(pathImg, Buffer.from(data, 'binary'));
        } catch (downloadError) {
            return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }

        // Load the image and create canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Set font properties
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        
        // Calculate text positioning
        const maxWidth = 500;
        const x = 60;
        const y = 165;
        
        // Wrap text if needed
        const lines = wrapText(ctx, text, maxWidth);
        
        // Draw each line of text
        const lineHeight = 35;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + (i * lineHeight));
        }

        // Save the modified image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // Send the image
        await message.reply({
            body: "✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑇𝑟𝑢𝑚𝑝 𝑚𝑒𝑠𝑠𝑎𝑔𝑒! 🇺🇸",
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up
        fs.unlinkSync(pathImg);
        
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑡𝑟𝑢𝑚𝑝 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!");
    }
};

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
