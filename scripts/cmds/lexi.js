const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "lexi",
    aliases: ["lexiboard", "commentboard"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-image",
    shortDescription: {
        en: "𝐶𝑜𝑚𝑚𝑒𝑛𝑡 𝑜𝑛 𝐿𝑒𝑥𝑖 𝐹𝑟𝑖𝑒𝑑𝑚𝑎𝑛'𝑠 𝑏𝑜𝑎𝑟𝑑"
    },
    longDescription: {
        en: "𝐴𝑑𝑑 𝑎 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑡𝑜 𝐿𝑒𝑥𝑖 𝐹𝑟𝑖𝑒𝑑𝑚𝑎𝑛'𝑠 𝑏𝑜𝑎𝑟𝑑 𝑖𝑚𝑎𝑔𝑒"
    },
    guide: {
        en: "{p}lexi [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
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

module.exports.onStart = async function ({ message, event, args }) {
    try {
        const { threadID, messageID } = event;
        const pathImg = path.join(__dirname, 'cache/lexi_board.png');

        let text = args.join(" ");
        if (!text) return message.reply("❌ 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑙𝑖𝑘ℎ𝑎𝑛 𝑒𝑛𝑡𝑒𝑟 𝑘𝑜𝑟𝑢𝑛 📝", threadID, messageID);

        // Download base image
        const getImage = (await axios.get(`https://i.imgur.com/hTU9zhX.png`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(pathImg, Buffer.from(getImage, 'utf-8'));

        // Load image and create canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        // Draw base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Setup text styles
        ctx.font = "400 18px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";

        // Auto-adjust font size if text is too long
        let fontSize = 50;
        while (ctx.measureText(text).width > 1200 && fontSize > 10) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial`;
        }

        // Wrap text
        const lines = await this.wrapText(ctx, text, 490);
        ctx.fillText(lines.join('\n'), 18, 85); // Comment position

        // Save final image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // Send message with attachment
        await message.reply({
            body: "✨ 𝐿𝑒𝑥𝑖 𝐹𝑟𝑖𝑒𝑑𝑚𝑎𝑛 𝑒𝑟 𝑏𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡! ✏️",
            attachment: fs.createReadStream(pathImg)
        }, threadID);

        // Clean up
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐿𝑒𝑥𝑖 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐵𝑜𝑎𝑟𝑑 𝑒 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑏𝑎𝑛𝑎𝑡𝑒 𝑝𝑎𝑟𝑐ℎ𝑖𝑛𝑖 😢", event.threadID, event.messageID);
    }
};
