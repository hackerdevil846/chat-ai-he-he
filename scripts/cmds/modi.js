const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    config: {
        name: "modi",
        aliases: ["modimeme"],
        version: "1.1.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
        shortDescription: {
            en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑀𝑜𝑑𝑖-𝑡ℎ𝑒𝑚𝑒𝑑 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑀𝑜𝑑𝑖-𝑠𝑡𝑦𝑙𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑐𝑎𝑝𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}modi [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑎𝑛𝑑 𝑐𝑎𝑛𝑣𝑎𝑠.");
            }

            if (!args[0]) {
                return message.reply("🌟 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑐𝑎𝑝𝑡𝑖𝑜𝑛 𝑡𝑒𝑥𝑡!\n💡 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑚𝑜𝑑𝑖 𝐼𝑛𝑑𝑖𝑎 𝑤𝑖𝑙𝑙 𝑏𝑒𝑐𝑜𝑚𝑒 𝑉𝑖𝑠ℎ𝑤𝑎𝑔𝑢𝑟𝑢");
            }
            
            const text = args.join(" ");
            const imgURL = "https://i.ibb.co/98GsJJM/image.jpg";
            const imgPath = __dirname + "/cache/modi_meme.png";
            
            // Download base image
            const { data } = await axios.get(imgURL, { responseType: "arraybuffer" });
            await fs.ensureDir(__dirname + "/cache");
            await fs.writeFile(imgPath, Buffer.from(data, 'binary'));
            
            // Create canvas
            const baseImage = await loadImage(imgPath);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            
            // Draw background
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            
            // Text styling
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            
            // Font configuration
            const applyTextStyle = (size) => {
                ctx.font = `𝑏𝑜𝑙𝑑 ${size}𝑝𝑥 "𝐴𝑟𝑖𝑎𝑙"`;
                return ctx.measureText(text).width;
            };
            
            // Dynamic font sizing
            let fontSize = 28;
            while (applyTextStyle(fontSize) > 600 && fontSize > 10) {
                fontSize--;
            }
            ctx.font = `𝑏𝑜𝑙𝑑 ${fontSize}𝑝𝑥 𝐴𝑟𝑖𝑎𝑙`;
            
            // Text wrapping
            const wrapText = (text, maxWidth) => {
                const words = text.split(" ");
                const lines = [];
                let currentLine = words[0];
                
                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const { width } = ctx.measureText(currentLine + " " + word);
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
            
            // Apply text to image
            const lines = wrapText(text, 600);
            const lineHeight = fontSize + 10;
            const startY = 120;
            
            // Text shadow effect
            ctx.shadowColor = "𝑟𝑔𝑏𝑎(0, 0, 0, 0.8)";
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Render lines
            lines.forEach((line, i) => {
                ctx.fillText(line, 48, startY + (i * lineHeight));
            });
            
            // Save final image
            const outBuffer = canvas.toBuffer("image/png");
            await fs.writeFile(imgPath, outBuffer);
            
            // Send result
            await message.reply({
                body: "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑!\n🗳️ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑀𝑜𝑑𝑖 𝑚𝑒𝑚𝑒:",
                attachment: fs.createReadStream(imgPath)
            });
            
            // Cleanup
            fs.unlinkSync(imgPath);
            
        } catch (err) {
            console.error("𝑀𝑜𝑑𝑖 𝑚𝑒𝑚𝑒 𝑒𝑟𝑟𝑜𝑟:", err);
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        }
    }
};
