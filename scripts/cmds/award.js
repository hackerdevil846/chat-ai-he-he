const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "award",
    aliases: ["certificate", "trophy"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑐𝑢𝑠𝑡𝑜𝑚 𝑎𝑤𝑎𝑟𝑑 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑎𝑤𝑎𝑟𝑑 𝑐𝑒𝑟𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑛𝑎𝑚𝑒 𝑎𝑛𝑑 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}award [𝑛𝑎𝑚𝑒] | [𝑡𝑒𝑥𝑡]"
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
        if (!createCanvas || !loadImage || !registerFont) {
            throw new Error("𝑐𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!fs.existsSync || !fs.mkdirSync) {
            throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!axios.get) {
            throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }

        // Check if user provided text
        if (!args[0]) {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟: 𝑛𝑎𝑚𝑒 | 𝑡𝑒𝑥𝑡\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝐴𝑠𝑖𝑓 | 𝐵𝑒𝑠𝑡 𝐷𝑒𝑣𝑒𝑙𝑜𝑝𝑒𝑟");
        }

        const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
        
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const pathImg = path.join(cacheDir, `award_${Date.now()}.png`);
        const fontPath = path.join(cacheDir, 'SVN-Arial 2.ttf');

        // Download award template
        const getImage = await axios.get("https://i.ibb.co/QC0hdpJ/Picsart-22-08-15-17-00-15-867.jpg", {
            responseType: 'arraybuffer'
        });
        fs.writeFileSync(pathImg, Buffer.from(getImage.data));

        // Download font if it doesn't exist
        if (!fs.existsSync(fontPath)) {
            try {
                const getfont = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(fontPath, Buffer.from(getfont.data));
            } catch (fontError) {
                console.log("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑠𝑦𝑠𝑡𝑒𝑚 𝑓𝑜𝑛𝑡:", fontError);
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
                ctx.font = "bold 30px 'SVN-Arial 2'";
            } else {
                ctx.font = "bold 30px Arial"; // Fallback font
            }
        } catch (fontError) {
            ctx.font = "bold 30px Arial"; // Fallback font
        }

        ctx.fillStyle = "#000000";
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
        const nameLine = wrapText(text[0], 464);
        const awardText = text[1] || "𝐴𝑤𝑎𝑟𝑑";
        const textLine = wrapText(awardText, 464);

        ctx.fillText(nameLine.join("\n"), 325, 250);
        ctx.fillText(textLine.join("\n"), 325, 280);

        // Save the modified image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // Send the result
        await message.reply({
            body: "✨ 𝑌𝑜𝑢𝑟 𝑎𝑤𝑎𝑟𝑑 𝑖𝑠 𝑟𝑒𝑎𝑑𝑦!",
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐴𝑤𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑎𝑤𝑎𝑟𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
