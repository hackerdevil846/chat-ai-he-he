const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = {
    name: "studentv3",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "📝 Bordo montobbo korun",
    commandCategory: "Memes",
    usages: "[text]",
    cooldowns: 5,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "noText": "❌ Please enter some text to generate the board."
    },
    "bn": {
        "noText": "❌ Bord montobbo korar jonno text enter korun."
    }
};

module.exports.wrapText = async function(ctx, text, maxWidth) {
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

module.exports.run = async function({ api, event, args, Users, Threads }) {
    const { threadID, messageID } = event;
    const text = args.join(" ");
    let pathImg = __dirname + '/cache/studentv3.png';

    if (!text) return api.sendMessage(
        "❌ Bord montobbo korar jonno text enter korun.", 
        threadID, 
        messageID
    );

    try {
        // Download background image
        const getImage = (await axios.get(
            `https://i.ibb.co/64jTRkM/Picsart-22-08-14-10-22-50-196.jpg`, 
            { responseType: 'arraybuffer' }
        )).data;
        fs.writeFileSync(pathImg, Buffer.from(getImage, 'utf-8'));

        // Load and draw canvas
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Font settings
        let fontSize = 45;
        ctx.fillStyle = "black";
        ctx.textAlign = "start";
        ctx.font = `400 ${fontSize}px Arial`;

        // Auto adjust font size
        while (ctx.measureText(text).width > 2250) {
            fontSize--;
            ctx.font = `400 ${fontSize}px Arial, sans-serif`;
        }

        // Wrap text
        const lines = await this.wrapText(ctx, text, 320);
        let startY = 500;
        lines.forEach(line => {
            ctx.fillText(line, 150, startY);
            startY += fontSize + 10;
        });

        // Save and send
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        return api.sendMessage(
            { body: `✨ Bord montobbo ready!`, attachment: fs.createReadStream(pathImg) },
            threadID, 
            () => fs.unlinkSync(pathImg), 
            messageID
        );
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Error generating bord image.", threadID, messageID);
    }
};
