const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "elon",
    aliases: [],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-image",
    shortDescription: {
        en: "𝖤𝗅𝗈𝗇 𝖬𝗎𝗌𝗄 𝗌𝗍𝗒𝗅𝖾 𝖻𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗈𝗋"
    },
    longDescription: {
        en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺𝗇 𝖤𝗅𝗈𝗇 𝖬𝗎𝗌𝗄 𝗌𝗍𝗒𝗅𝖾 𝖻𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋 𝗍𝖾𝗑𝗍"
    },
    guide: {
        en: "{p}elon [𝗍𝖾𝗑𝗍]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    let pathImg = '';
    
    try {
        // Dependency check
        let dependenciesAvailable = true;
        try {
            require("canvas");
            require("axios");
            require("fs-extra");
        } catch (e) {
            dependenciesAvailable = false;
        }

        if (!dependenciesAvailable) {
            return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌, 𝖺𝗑𝗂𝗈𝗌, 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
        }

        const text = args.join(" ");

        if (!text) {
            return message.reply("✨ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝖤𝗅𝗈𝗇'𝗌 𝖻𝗈𝖺𝗋𝖽!");
        }

        // Validate text length
        if (text.length > 200) {
            return message.reply("❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 200 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
        }

        pathImg = __dirname + `/cache/elon_${Date.now()}.png`;
        
        // Download the Elon board template with error handling
        let response;
        try {
            response = await axios.get("https://i.imgur.com/GGmRov3.png", { 
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
        } catch (downloadError) {
            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖤𝗅𝗈𝗇 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾:", downloadError.message);
            return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
        
        await fs.writeFile(pathImg, Buffer.from(response.data, 'utf-8'));
        
        // Load and process the image
        let baseImage;
        try {
            baseImage = await loadImage(pathImg);
        } catch (loadError) {
            console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾:", loadError.message);
            return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
        }
        
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Set font properties
        ctx.font = "𝖻𝗈𝗅𝖽 30𝗉𝗑 𝖠𝗋𝗂𝖺𝗅";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        
        // Adjust font size to fit the text
        let fontSize = 30;
        const maxWidth = 1160;
        const minFontSize = 10;
        
        while (ctx.measureText(text).width > maxWidth && fontSize > minFontSize) {
            fontSize--;
            ctx.font = `𝖻𝗈𝗅𝖽 ${fontSize}𝗉𝗑 𝖠𝗋𝗂𝖺𝗅, 𝗌𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿`;
        }
        
        // Wrap text to fit within the board
        const lines = wrapText(ctx, text, maxWidth);
        
        // Draw text on the board
        const lineHeight = fontSize * 1.2;
        const startY = 115;
        const maxLines = 8;
        
        // Check if text fits within the board
        if (lines.length > maxLines) {
            await fs.unlink(pathImg);
            return message.reply(`❌ 𝖳𝖾𝗑𝗍 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗁𝗈𝗋𝗍𝖾𝗇 𝗒𝗈𝗎𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾.`);
        }
        
        lines.forEach((line, index) => {
            if (index < maxLines) {
                ctx.fillText(line, 40, startY + (index * lineHeight));
            }
        });
        
        // Save the image
        const imageBuffer = canvas.toBuffer();
        await fs.writeFile(pathImg, imageBuffer);

        // Send the result
        await message.reply({ 
            body: "🚀 𝖤𝗅𝗈𝗇 𝖬𝗎𝗌𝗄'𝗌 𝖻𝗈𝖺𝗋𝖽 𝖼𝗈𝗆𝗆𝖾𝗇𝗍!",
            attachment: fs.createReadStream(pathImg) 
        });

    } catch (error) {
        console.error("💥 𝖤𝗅𝗈𝗇 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        
        let errorMessage = "❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾";
        
        if (error.code === 'ECONNREFUSED') {
            errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
        }
        
        await message.reply(errorMessage);
    } finally {
        // Clean up
        try {
            if (pathImg && await fs.pathExists(pathImg)) {
                await fs.unlink(pathImg);
            }
        } catch (cleanupError) {
            console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
        }
    }
};

function wrapText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width < maxWidth) return [text];
    
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
