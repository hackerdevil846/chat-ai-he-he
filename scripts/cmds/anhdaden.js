const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
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
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
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

            // Download the base image
            const imageResponse = await axios.get("https://i.imgur.com/2ggq8wM.png", {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(pathImg, Buffer.from(imageResponse.data));

            // Load and process the image with jimp
            const image = await jimp.read(pathImg);
            const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

            // Simple text wrapping function for jimp
            function wrapText(text, maxWidth) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const word = words[i];
                    const width = jimp.measureText(font, currentLine + " " + word);
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

            // Draw the text on image
            const line1 = wrapText(text[0], 464);
            const line2 = wrapText(text[1], 464);

            // First text position
            line1.forEach((line, index) => {
                image.print(font, 170 - (jimp.measureText(font, line) / 2), 100 + (index * 40), line);
            });

            // Second text position
            line2.forEach((line, index) => {
                image.print(font, 170 - (jimp.measureText(font, line) / 2), 410 + (index * 40), line);
            });

            // Save the modified image
            await image.writeAsync(pathImg);

            // Send the result
            await message.reply({
                body: "𝑀𝑒𝑚𝑒 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! 🎨",
                attachment: fs.createReadStream(pathImg)
            });

            // Clean up
            fs.unlinkSync(pathImg);

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑎𝑛ℎ𝑑𝑎𝑑𝑒𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
            // Don't send error message to avoid spam
        }
    }
};
