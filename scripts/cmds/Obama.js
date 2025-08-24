module.exports.config = {
    name: "obama",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑶𝒃𝒂𝒎𝒂 𝒌𝒆 𝑻𝒘𝒆𝒆𝒕 𝒌𝒐𝒓𝒂𝒏 😎",
    category: "edit-img",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
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
    return lines;
};

// Changed from module.exports.run to module.exports.onStart
module.exports.onStart = async function({ api, event, args }) {
    const { senderID, threadID, messageID } = event;
    const { loadImage, createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    const pathImg = __dirname + '/cache/obama.png'; // Changed filename from trump.png to obama.png
    const text = args.join(" ");
    
    if (!text) return api.sendMessage("❌ Please enter your message for Obama's tweet!", threadID, messageID);
    
    try {
        // Download image template
        const imageData = (await axios.get(`https://i.imgur.com/6fOxdex.png`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(pathImg, Buffer.from(imageData, 'binary'));
        
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        let fontSize = 250;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        
        while (ctx.measureText(text).width > 2600) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        }
        
        const lines = await module.exports.wrapText(ctx, text, 1160);
        ctx.fillText(lines.join('\n'), 60, 165);
        
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        
        return api.sendMessage({
            body: `✅ Obama's tweet generated!`,
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => fs.unlinkSync(pathImg), messageID);
        
    } catch (error) {
        console.error("Error generating Obama tweet:", error);
        return api.sendMessage("❌ An error occurred while generating the tweet. Please try again.", threadID, messageID);
    }
};
