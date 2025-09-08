const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "obama",
    aliases: ["obamatweet"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝑶𝒃𝒂𝒎𝒂'𝒔 𝒕𝒘𝒆𝒆𝒕 𝒄𝒓𝒆𝒂𝒕𝒐𝒓"
    },
    longDescription: {
        en: "𝑪𝒓𝒆𝒂𝒕𝒆𝒔 𝒂 𝒕𝒘𝒆𝒆𝒕 𝒊𝒎𝒂𝒈𝒆 𝒘𝒊𝒕𝒉 𝑶𝒃𝒂𝒎𝒂'𝒔 𝒑𝒊𝒄𝒕𝒖𝒓𝒆"
    },
    guide: {
        en: "{p}obama [text]"
    },
    dependencies: {
        "canvas": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function ({ message, event, args }) {
    try {
        // Check dependencies
        if (!createCanvas || !loadImage) throw new Error("𝒄𝒂𝒏𝒗𝒂𝒔 𝒎𝒐𝒅𝒖𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅");
        if (!fs.existsSync) throw new Error("𝒇𝒔-𝒆𝒙𝒕𝒓𝒂 𝒎𝒐𝒅𝒖𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅");
        if (!axios) throw new Error("𝒂𝒙𝒊𝒐𝒔 𝒎𝒐𝒅𝒖𝒍𝒆 𝒏𝒐𝒕 𝒇𝒐𝒖𝒏𝒅");

        const text = args.join(" ");
        
        if (!text) {
            return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝑶𝒃𝒂𝒎𝒂'𝒔 𝒕𝒘𝒆𝒆𝒕!");
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

        // Load the image and create canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Set font properties
        ctx.font = "28px Arial";
        ctx.fillStyle = "#000000";
        
        // Calculate text positioning
        const maxWidth = 500;
        const x = 80;
        const y = 180;
        
        // Wrap text if needed
        const lines = this.wrapText(ctx, text, maxWidth);
        
        // Draw each line of text
        const lineHeight = 32;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + (i * lineHeight));
        }

        // Save the modified image
        const out = fs.createWriteStream(pathImg);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        out.on('finish', () => {
            // Send the image
            message.reply({
                body: "✅ 𝑶𝒃𝒂𝒎𝒂'𝒔 𝒕𝒘𝒆𝒆𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅!",
                attachment: fs.createReadStream(pathImg)
            });
            
            // Clean up after sending
            setTimeout(() => {
                if (fs.existsSync(pathImg)) {
                    fs.unlinkSync(pathImg);
                }
            }, 5000);
        });
        
    } catch (error) {
        console.error("𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝑶𝒃𝒂𝒎𝒂 𝒕𝒘𝒆𝒆𝒕:", error);
        message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒕𝒘𝒆𝒆𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏.");
    }
};

module.exports.wrapText = function(ctx, text, maxWidth) {
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
