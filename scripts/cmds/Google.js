const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "googlebar",
    aliases: ["googlesearch", "gbar"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝑇𝑎𝑘𝑒𝑠 𝑡𝑒𝑥𝑡 𝑎𝑛𝑑 𝑟𝑒𝑛𝑑𝑒𝑟𝑠 𝑖𝑡 𝑜𝑛 𝑎 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}googlebar [text]"
    },
    dependencies: {
        "canvas": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function ({ api, event, args }) {
    try {
        // Check dependencies
        if (!createCanvas || !loadImage) throw new Error("𝑐𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!fs.existsSync) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        const text = args.join(" ");
        
        if (!text) {
            return api.sendMessage("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑠𝑜𝑚𝑒 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑝𝑢𝑡 𝑜𝑛 𝑡ℎ𝑒 𝐺𝑜𝑜𝑔𝑙𝑒 𝑏𝑎𝑟.", event.threadID, event.messageID);
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const pathImg = path.join(cacheDir, 'google.png');
        
        // Download the Google bar template
        try {
            const { data } = await axios.get("https://i.imgur.com/GXPQYtT.png", {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(pathImg, Buffer.from(data, 'binary'));
        } catch (downloadError) {
            return api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐺𝑜𝑜𝑔𝑙𝑒 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒.", event.threadID, event.messageID);
        }

        // Load the image and create canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Set font properties
        ctx.font = "18px Arial";
        ctx.fillStyle = "#000000";
        
        // Calculate text positioning
        const maxWidth = 400;
        const x = 140;
        const y = 70;
        
        // Wrap text if needed
        const lines = wrapText(ctx, text, maxWidth);
        
        // Draw each line of text
        const lineHeight = 25;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + (i * lineHeight));
        }

        // Save the modified image
        const outputPath = path.join(cacheDir, 'google_result.png');
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        
        await new Promise((resolve, reject) => {
            stream.pipe(out);
            out.on('finish', resolve);
            out.on('error', reject);
        });

        // Send the image
        await api.sendMessage({
            body: "✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟!",
            attachment: fs.createReadStream(outputPath)
        }, event.threadID, event.messageID);

        // Clean up temporary files
        try {
            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.log("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
        }
        
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝐺𝑜𝑜𝑔𝑙𝑒 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒.", event.threadID, event.messageID);
    }
};

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    
    if (words.length === 0) return lines;
    
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + " " + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
