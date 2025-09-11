const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "board",
    aliases: ["whiteboard", "commentboard"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "general",
    shortDescription: {
        en: "📋 𝐵𝑜𝑎𝑟𝑑 𝑎𝑛𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑐𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑏𝑜𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡 𝑐𝑜𝑚𝑚𝑒𝑛𝑡𝑠"
    },
    guide: {
        en: "{p}board [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        if (!args.length) {
            return message.reply("📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑎𝑟𝑑", event.threadID, event.messageID);
        }

        const text = args.join(" ");
        const pathImg = __dirname + '/cache/bang.png';

        async function wrapText(ctx, text, maxWidth) {
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
        }

        try {
            const getPorn = (await axios.get(`https://i.imgur.com/Jl7sYMm.jpeg`, { 
                responseType: 'arraybuffer' 
            })).data;
            
            await fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
            const baseImage = await loadImage(pathImg);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            
            ctx.font = "bold 20px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            
            let fontSize = 20;
            while (ctx.measureText(text).width > 2250) {
                fontSize--;
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
            }
            
            const lines = await wrapText(ctx, text, 440);
            ctx.fillText(lines.join('\n'), 85, 100);
            
            ctx.beginPath();
            const imageBuffer = canvas.toBuffer();
            await fs.writeFileSync(pathImg, imageBuffer);
            
            await message.reply({ 
                body: "✨ 𝐵𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑐𝑟𝑒𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
                attachment: fs.createReadStream(pathImg) 
            }, event.threadID);
            
            await fs.unlinkSync(pathImg);
            
        } catch (error) {
            console.error("𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
            return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑖𝑚𝑎𝑔𝑒", event.threadID);
        }

    } catch (error) {
        console.error("𝐵𝑜𝑎𝑟𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑒𝑥𝑒𝑐𝑢𝑡𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑", event.threadID);
    }
};
