const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "anhdaden",
    aliases: ["whitememe", "daden"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝑊ℎ𝑖𝑡𝑒 𝑏𝑟𝑜𝑡ℎ𝑒𝑟 𝑚𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑤ℎ𝑖𝑡𝑒 𝑏𝑟𝑜𝑡ℎ𝑒𝑟 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}anhdaden [𝑡𝑒𝑥𝑡 1] | [𝑡𝑒𝑥𝑡 2]"
    },
    dependencies: {
        "canvas": "",
        "fs-extra": "",
        "axios": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Check dependencies
        if (!createCanvas || !loadImage) {
            throw new Error("𝑐𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!fs.existsSync) {
            throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }

        const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
        
        if (!text[0] || !text[1]) {
            return message.reply("𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑤𝑜 𝑡𝑒𝑥𝑡𝑠 𝑠𝑒𝑝𝑎𝑟𝑎𝑡𝑒𝑑 𝑏𝑦 \"|\" 𝑠𝑦𝑚𝑏𝑜𝑙\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: {p}anhdaden 𝑇𝑒𝑥𝑡 1 | 𝑇𝑒𝑥𝑡 2");
        }

        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
        
        const pathImg = path.join(cacheDir, 'anhdaden.png');
        const fontPath = path.join(cacheDir, 'SVN-Arial 2.ttf');

        // Download the base image
        const imageResponse = await axios.get("https://i.imgur.com/2ggq8wM.png", {
            responseType: 'arraybuffer'
        });
        fs.writeFileSync(pathImg, Buffer.from(imageResponse.data));

        // Download the font if it doesn't exist
        if (!fs.existsSync(fontPath)) {
            try {
                const fontResponse = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(fontPath, Buffer.from(fontResponse.data));
            } catch (fontError) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡, 𝑢𝑠𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘:", fontError);
                // Use system font as fallback
            }
        }

        // Load and process the image
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Register and use the font
        try {
            if (fs.existsSync(fontPath)) {
                registerFont(fontPath, { family: "SVN-Arial 2" });
                ctx.font = "𝑖𝑡𝑎𝑙𝑖𝑐 𝑏𝑜𝑙𝑑 35𝑝𝑥 '𝑆𝑉𝑁-𝐴𝑟𝑖𝑎𝑙 2'";
            } else {
                ctx.font = "𝑖𝑡𝑎𝑙𝑖𝑐 𝑏𝑜𝑙𝑑 35𝑝𝑥 𝐴𝑟𝑖𝑎𝑙"; // Fallback font
            }
        } catch (fontError) {
            ctx.font = "𝑖𝑡𝑎𝑙𝑖𝑐 𝑏𝑜𝑙𝑑 35𝑝𝑥 𝐴𝑟𝑖𝑎𝑙"; // Fallback font
        }

        ctx.fillStyle = "#000077";
        ctx.textAlign = "center";

        // Text wrapping function
        const wrapText = (text, maxWidth) => {
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
        };

        // Draw the text
        const line1 = wrapText(text[0], 464);
        const line2 = wrapText(text[1], 464);

        ctx.fillText(line1.join("\n"), 170, 129);
        ctx.fillText(line2.join("\n"), 170, 440);

        // Save the modified image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // Send the result
        await message.reply({
            body: "𝑀𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! 🎨",
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑎𝑛ℎ𝑑𝑎𝑑𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒.");
    }
};
