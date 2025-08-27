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

module.exports.onStart = async function({ api, event, args, message }) { // Added 'message' here
    const { senderID, threadID, messageID } = event;
    const { loadImage, createCanvas } = require("canvas");
    const fs = require("fs-extra");
    const axios = require("axios");
    const pathImg = __dirname + '/cache/obama.png';
    const text = args.join(" ");
    
    if (!text) return message.reply("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒇𝒐𝒓 𝑶𝒃𝒂𝒎𝒂'𝒔 𝒕𝒘𝒆𝒆𝒕!"); // Changed api.sendMessage to message.reply
    
    try {
        const imageData = (await axios.get(`https://i.imgur.com/6fOxdex.png`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(pathImg, Buffer.from(imageData, 'binary'));
        
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        let fontSize = 40; // Adjusted initial font size for better fit
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        
        // Dynamic font size adjustment for the tweet text
        let wrappedLines;
        do {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
            wrappedLines = await module.exports.wrapText(ctx, text, 1160); // Max width for text
        } while (wrappedLines && wrappedLines.length * fontSize > 200 && fontSize > 10); // Adjust max height and min font size
        
        if (!wrappedLines) {
            return message.reply("❌ 𝑻𝒉𝒆 𝒕𝒆𝒙𝒕 𝒊𝒔 𝒕𝒐𝒐 𝒍𝒐𝒏𝒈 𝒕𝒐 𝒇𝒊𝒕 𝒐𝒏 𝒕𝒉𝒆 𝒕𝒘𝒆𝒆𝒕.");
        }

        ctx.fillText(wrappedLines.join('\n'), 60, 165); // X and Y coordinates for the text
        
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        
        return message.reply({ // Changed api.sendMessage to message.reply
            body: `✅ 𝑶𝒃𝒂𝒎𝒂'𝒔 𝒕𝒘𝒆𝒆𝒕 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅!`,
            attachment: fs.createReadStream(pathImg)
        }, () => fs.unlinkSync(pathImg)); // Callback for unlink
        
    } catch (error) {
        console.error("Error generating Obama tweet:", error);
        return message.reply("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒕𝒉𝒆 𝒕𝒘𝒆𝒆𝒕. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏."); // Changed api.sendMessage to message.reply
    }
};
