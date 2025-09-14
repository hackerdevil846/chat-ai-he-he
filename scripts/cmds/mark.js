const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "mark",
    aliases: ["board", "comment"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑔𝑎𝑚𝑒",
    shortDescription: {
        en: "𝐵𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑘𝑜𝑟𝑢𝑛"
    },
    longDescription: {
        en: "𝑊𝑟𝑖𝑡𝑒 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑎 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}mark [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "noText": "✏️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑.",
        "done": "📝 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑘𝑜𝑟𝑙𝑎𝑚!",
        "error": "❌ 𝐾𝑖𝑐ℎ𝑢 𝑣𝑢𝑙 ℎ𝑜𝑦𝑒𝑐ℎ𝑒. 𝑇𝑟𝑦 𝑘𝑜𝑟𝑢𝑛 𝑎𝑏𝑎𝑟.",
    },
    "bn": {
        "noText": "✏️ 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑙𝑖𝑘ℎ𝑎𝑛 𝑒𝑛𝑡𝑒𝑟 𝑘𝑜𝑟𝑢𝑛.",
        "done": "📝 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑘𝑜𝑟𝑙𝑎𝑚!",
        "error": "❌ 𝑘𝑖𝑐ℎ𝑢 𝑠𝑜𝑚𝑜𝑠𝑠𝑦𝑎 ℎ𝑜𝑦𝑒𝑐ℎ𝑒. 𝑎𝑏𝑎𝑟 𝑐𝑒𝑠𝑡𝑎 𝑘𝑜𝑟𝑢𝑛.",
    }
};

module.exports.onLoad = function() {
    const dir = __dirname + "/cache";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        
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
        return resolve(lines);
    });
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        const { threadID, messageID } = event;
        const text = args.join(" ");

        if (!text) {
            return message.reply(module.exports.languages['bn'].noText);
        }

        // Ensure cache folder exists
        await fs.ensureDir(__dirname + '/cache');
        const pathImg = __dirname + '/cache/markngu.png';

        // Download base image (link kept unchanged as requested)
        const response = await axios.get('https://i.imgur.com/3j4GPdy.jpg', { 
            responseType: 'arraybuffer' 
        });
        await fs.writeFile(pathImg, Buffer.from(response.data, 'binary'));

        // Load image & prepare canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Initial font settings
        let fontSize = 45;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'start';
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;

        // Reduce font if the raw text is too wide overall
        while (ctx.measureText(text).width > 2250 && fontSize > 10) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        }

        // Wrap text into lines
        const lines = await module.exports.wrapText(ctx, text, 440) || [text];

        // Draw each line with proper line height (multiline support)
        const startX = 95;
        const startY = 420;
        const lineHeight = Math.floor(fontSize * 1.2);
        
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], startX, startY + (i * lineHeight));
        }

        // Write image back to file
        const imageBuffer = canvas.toBuffer();
        await fs.writeFile(pathImg, imageBuffer);

        // Send image
        await message.reply({
            body: module.exports.languages['bn'].done + " ✅",
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝑀𝑎𝑟𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(module.exports.languages['bn'].error + "\n" + error.message);
    }
};
