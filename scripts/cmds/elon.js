const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "elon",
    aliases: ["elonmusk", "muskboard"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-image",
    shortDescription: {
        en: "𝐸𝑙𝑜𝑛 𝑀𝑢𝑠𝑘 𝑠𝑡𝑦𝑙𝑒 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎𝑛 𝐸𝑙𝑜𝑛 𝑀𝑢𝑠𝑘 𝑠𝑡𝑦𝑙𝑒 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}elon [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args }) {
    try {
        const text = args.join(" ");

        if (!text) {
            return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝐸𝑙𝑜𝑛'𝑠 𝑏𝑜𝑎𝑟𝑑!");
        }

        const pathImg = __dirname + '/cache/elon.png';
        
        // Download the Elon board template
        const response = await axios.get("https://i.imgur.com/GGmRov3.png", { 
            responseType: 'arraybuffer' 
        });
        
        await fs.writeFile(pathImg, Buffer.from(response.data, 'utf-8'));
        
        // Load and process the image
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.font = "320 30px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        
        // Adjust font size to fit the text
        let fontSize = 220;
        while (ctx.measureText(text).width > 2600) {
            fontSize--;
            ctx.font = `320 ${fontSize}px Arial, sans-serif`;
        }
        
        // Wrap text to fit within the board
        const lines = wrapText(ctx, text, 1160);
        ctx.fillText(lines.join('\n'), 40, 115);
        
        // Save and send the image
        const imageBuffer = canvas.toBuffer();
        await fs.writeFile(pathImg, imageBuffer);

        await message.reply({ 
            body: "🚀 𝐸𝑙𝑜𝑛 𝑀𝑢𝑠𝑘'𝑠 𝑏𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡!",
            attachment: fs.createReadStream(pathImg) 
        });

        // Clean up
        await fs.unlink(pathImg);

    } catch (error) {
        console.error("𝐸𝑙𝑜𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
    }
};

function wrapText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText('W').width > maxWidth) return null;
    
    const words = text.split(' ');
    const lines = [];
    let line = '';
    
    while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
            const temp = words[0];
            words[0] = temp.slice(0, -1);
            if (split) {
                words[1] = `${temp.slice(-1)}${words[1]}`;
            } else {
                split = true;
                words.splice(1, 0, temp.slice(-1));
            }
        }
        
        if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
            line += `${words.shift()} `;
        } else {
            lines.push(line.trim());
            line = '';
        }
        
        if (words.length === 0) {
            lines.push(line.trim());
        }
    }
    return lines;
}
