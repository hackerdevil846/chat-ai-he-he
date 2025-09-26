const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "obama",
        aliases: ["obamatweet"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝑂𝑏𝑎𝑚𝑎'𝑠 𝑡𝑤𝑒𝑒𝑡 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
        },
        longDescription: {
            en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑡𝑤𝑒𝑒𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑂𝑏𝑎𝑚𝑎'𝑠 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
        },
        guide: {
            en: "{p}obama [𝑡𝑒𝑥𝑡]"
        },
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        try {
            const text = args.join(" ");
            
            if (!text) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝑂𝑏𝑎𝑚𝑎'𝑠 𝑡𝑤𝑒𝑒𝑡!");
            }

            // Create cache directory if it doesn't exist
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            
            const pathImg = path.join(cacheDir, 'obama_tweet.png');
            
            // Download the Obama tweet template
            const { data } = await axios.get("https://i.imgur.com/6fOxdex.png", {
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(pathImg, Buffer.from(data, 'binary'));

            // Load the image with jimp
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

            // Wrap text and draw on image
            const lines = wrapText(text, 500);
            const x = 80;
            const y = 180;
            const lineHeight = 32;

            // Draw each line of text
            lines.forEach((line, index) => {
                image.print(font, x, y + (index * lineHeight), line);
            });

            // Save the modified image
            await image.writeAsync(pathImg);

            // Send the image
            await message.reply({
                body: "✅ 𝑂𝑏𝑎𝑚𝑎'𝑠 𝑡𝑤𝑒𝑒𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑!",
                attachment: fs.createReadStream(pathImg)
            });

            // Clean up
            fs.unlinkSync(pathImg);
            
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑂𝑏𝑎𝑚𝑎 𝑡𝑤𝑒𝑒𝑡:", error);
            // Don't send error message to avoid spam
        }
    }
};
