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
    category: "𝑓𝑢𝑛",
    shortDescription: {
        en: "𝑊𝑟𝑖𝑡𝑒 𝑡𝑒𝑥𝑡 𝑜𝑛 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
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
        "noText": "✏️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑",
        "done": "📝 𝐵𝑜𝑎𝑟𝑑 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
        "error": "❌ 𝐸𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛"
    }
};

module.exports.onLoad = function() {
    const dir = __dirname + "/cache";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) {
            return resolve([text]);
        }
        if (ctx.measureText('W').width > maxWidth) {
            return resolve(null);
        }
        
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

module.exports.onStart = async function({ message, event, args, getText }) {
    try {
        const { threadID, messageID } = event;
        const text = args.join(" ");

        if (!text) {
            return message.reply(getText("noText"));
        }

        // Ensure cache folder exists
        await fs.ensureDir(__dirname + '/cache');
        const pathImg = __dirname + '/cache/markboard.png';

        // Download base image (original link preserved)
        const response = await axios.get('https://i.imgur.com/3j4GPdy.jpg', { 
            responseType: 'arraybuffer' 
        });
        await fs.writeFile(pathImg, Buffer.from(response.data, 'binary'));

        // Load image & prepare canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Font settings
        let fontSize = 45;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'start';
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;

        // Adjust font size if text is too wide
        while (ctx.measureText(text).width > 2250 && fontSize > 10) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        }

        // Wrap text into lines
        const lines = await module.exports.wrapText(ctx, text, 440) || [text];

        // Draw each line
        const startX = 95;
        const startY = 420;
        const lineHeight = Math.floor(fontSize * 1.2);
        
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], startX, startY + (i * lineHeight));
        }

        // Save image
        const imageBuffer = canvas.toBuffer();
        await fs.writeFile(pathImg, imageBuffer);

        // Send result
        await message.reply({
            body: getText("done"),
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝑀𝑎𝑟𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(getText("error") + "\n" + error.message);
    }
};
