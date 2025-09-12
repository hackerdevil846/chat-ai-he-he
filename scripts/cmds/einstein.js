const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "einstein",
    aliases: ["board", "chalkboard"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑚𝑒𝑚𝑒𝑠",
    shortDescription: {
        en: "𝐵𝑜𝑎𝑟𝑑 𝑤𝑟𝑖𝑡𝑖𝑛𝑔 𝑚𝑒𝑚𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑐ℎ𝑎𝑙𝑘𝑏𝑜𝑎𝑟𝑑 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}einstein [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, args, event }) {
    try {
        // Check dependencies
        if (!createCanvas || !loadImage) {
            throw new Error("𝐶𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!axios) {
            throw new Error("𝐴𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }
        if (!fs.existsSync) {
            throw new Error("𝐹𝑆-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        }

        const wrapText = async (ctx, text, maxWidth) => {
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
                        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                        else {
                            split = true;
                            words.splice(1, 0, temp.slice(-1));
                        }
                    }
                    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
                    else {
                        lines.push(line.trim());
                        line = '';
                    }
                    if (words.length === 0) lines.push(line.trim());
                }
                return resolve(lines);
            });
        };

        const { threadID, messageID } = event;
        const pathImg = __dirname + '/cache/einstein.png';
        const text = args.join(" ");

        if (!text) {
            return message.reply("📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑤𝑟𝑖𝑡𝑒 𝑜𝑛 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑", threadID, messageID);
        }

        const getPorn = (await axios.get(`https://i.ibb.co/941yM5Y/Picsart-22-08-13-21-34-35-220.jpg`, { 
            responseType: 'arraybuffer' 
        })).data;
        
        fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.font = "400 35px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "start";
        
        let fontSize = 45;
        while (ctx.measureText(text).width > 2250) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        }
        
        const lines = await wrapText(ctx, text, 320);
        ctx.fillText(lines.join('\n'), 300, 90);
        ctx.beginPath();
        
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        
        await message.reply({ 
            body: "✅ 𝐵𝑜𝑎𝑟𝑑 𝑤𝑟𝑖𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒! ✏️",
            attachment: fs.createReadStream(pathImg) 
        }, threadID);
        
        fs.unlinkSync(pathImg);
        
    } catch (error) {
        console.error("𝐸𝑖𝑛𝑠𝑡𝑒𝑖𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒", event.threadID, event.messageID);
    }
};
