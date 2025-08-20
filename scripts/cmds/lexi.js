const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "lexi",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "📝 Lexi Friedman এর board এ comment করুন",
    commandCategory: "Edit-Image",
    usages: "lexi [text]",
    cooldowns: 10,
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

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const pathImg = path.join(__dirname, 'cache/lexi_board.png');

    let text = args.join(" ");
    if (!text) return api.sendMessage("❌ 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒍𝒊𝒌𝒉𝒂𝒏 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏 📝", threadID, messageID);

    try {
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
        api.sendMessage({
            body: "✨ 𝑳𝒆𝒙𝒊 𝑭𝒓𝒊𝒆𝒅𝒎𝒂𝒏 𝒆𝒓 𝒃𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕! ✏️",
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => fs.unlinkSync(pathImg), messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝑩𝒐𝒂𝒓𝒅 𝒆 𝒄𝒐𝒎𝒎𝒆𝒏𝒕 𝒃𝒂𝒏𝒂𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊 😢", threadID, messageID);
    }
};
