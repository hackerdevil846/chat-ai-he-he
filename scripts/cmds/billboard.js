module.exports.config = {
    name: "billboard",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🌟 𝑩𝒊𝒍𝒃𝒐𝒓𝒅𝒆 𝒕𝒆𝒙𝒕 𝒄𝒓𝒆𝒂𝒕𝒐𝒓 ( ͡° ͜ʖ ͡°)",
    category: "edit-img",
    usages: "[text]",
    cooldowns: 5,
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
        if (words.length === 0) lines.push(line.trim());
    }
    return lines;
};

module.exports.run = async function({ api, event, args }) {
    try {
        const { createCanvas, loadImage } = require("canvas");
        const fs = require("fs-extra");
        const axios = require("axios");
        
        const text = args.join(" ");
        if (!text) return api.sendMessage("✨ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒚𝒐𝒖𝒓 𝒕𝒆𝒙𝒕!", event.threadID, event.messageID);

        const avatarPath = __dirname + '/cache/avt.png';
        const outputPath = __dirname + '/cache/billboard_result.png';
        
        // Get user info
        const userInfo = await api.getUserInfo(event.senderID);
        const { name, thumbSrc } = userInfo[event.senderID];
        
        // Download images
        const avatarBuffer = (await axios.get(thumbSrc, { responseType: 'arraybuffer' })).data;
        const billboardTemplate = (await axios.get("https://imgur.com/uN7Sllp.png", { responseType: 'arraybuffer' })).data;
        
        fs.writeFileSync(avatarPath, Buffer.from(avatarBuffer, 'utf-8'));
        fs.writeFileSync(outputPath, Buffer.from(billboardTemplate, 'utf-8'));

        // Process images
        const canvas = createCanvas(700, 350);
        const ctx = canvas.getContext("2d");
        const baseImage = await loadImage(outputPath);
        const avatarImage = await loadImage(avatarPath);
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatarImage, 148, 75, 110, 110);

        // Add text
        ctx.font = "800 23px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(name, 280, 110);

        ctx.font = "400 20px Arial";
        ctx.fillStyle = "#000000";
        
        const lines = await this.wrapText(ctx, text, 250);
        if (lines) {
            lines.forEach((line, i) => {
                ctx.fillText(line, 280, 145 + (i * 25));
            });
        }

        // Save and send
        const resultBuffer = canvas.toBuffer();
        fs.writeFileSync(outputPath, resultBuffer);
        fs.removeSync(avatarPath);

        return api.sendMessage({
            body: "🎊 𝑩𝒊𝒍𝒍𝒃𝒐𝒓𝒅 𝑪𝒓𝒆𝒂𝒕𝒆𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!",
            attachment: fs.createReadStream(outputPath)
        }, event.threadID, () => fs.unlinkSync(outputPath), event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒊𝒏 𝒃𝒊𝒍𝒍𝒃𝒐𝒓𝒅 𝒄𝒓𝒆𝒂𝒕𝒊𝒐𝒏", event.threadID, event.messageID);
    }
};
