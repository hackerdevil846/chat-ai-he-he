const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "studentv2",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝘽𝙤𝙧𝙙 𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙩 𝙠𝙤𝙧𝙖",
    category: "𝙈𝙚𝙢𝙚𝙨",
    usages: "[𝙩𝙚𝙭𝙩]",
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

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID, messageID } = event;
    let pathImg = __dirname + '/cache/studentv2.png';
    let text = args.join(" ");

    if (!text) return api.sendMessage("𝘽𝙤𝙧𝙙 𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙩 𝙠𝙤𝙧𝙖𝙧 𝙟𝙤𝙣𝙣𝙤 𝙩𝙚𝙭𝙩 𝙡𝙞𝙠𝙝𝙪𝙣", threadID, messageID);

    // ডিফল্ট ইমেজ লোড
    const getImage = (await axios.get(`https://i.ibb.co/FK8DTp1/Picsart-22-08-14-02-13-31-581.jpg`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(getImage, 'utf-8'));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Text settings
    let fontSize = 45;
    ctx.font = `400 ${fontSize}px Arial`;
    ctx.rotate(-3 * Math.PI / 180);
    ctx.fillStyle = "black";
    ctx.textAlign = "start";

    while (ctx.measureText(text).width > 2250) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }

    const lines = await this.wrapText(ctx, text, 440);
    ctx.fillText(lines.join('\n'), 90, 500);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
};
