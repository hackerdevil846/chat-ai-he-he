const fs = global.nodemodule["fs-extra"];
const axios = global.nodemodule["axios"];
const { loadImage, createCanvas } = global.nodemodule["canvas"];

module.exports.config = {
    name: "studentv3",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒓𝒅𝒆 𝒎𝒐𝒏𝒕𝒐𝒃𝒃𝒐 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝑴𝒆𝒎𝒆𝒔",
    usages: "[𝒕𝒆𝒙𝒕]",
    cooldowns: 5,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
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
}

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID, messageID } = event;
    let pathImg = __dirname + '/cache/studentv3.png';
    const text = args.join(" ");

    if (!text) return api.sendMessage(
        "𝑩𝒐𝒓𝒅𝒆 𝒎𝒐𝒏𝒕𝒐𝒃𝒃𝒐 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒄𝒐𝒏𝒕𝒆𝒏𝒕 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", 
        threadID, messageID
    );

    // Load background image
    const getImage = (await axios.get(
        `https://i.ibb.co/64jTRkM/Picsart-22-08-14-10-22-50-196.jpg`, 
        { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(pathImg, Buffer.from(getImage, 'utf-8'));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Font settings
    let fontSize = 45;
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    ctx.font = `400 ${fontSize}px Arial`;

    while (ctx.measureText(text).width > 2250) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }

    const lines = await this.wrapText(ctx, text, 320);
    ctx.fillText(lines.join('\n'), 150, 500);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) }, 
        threadID, 
        () => fs.unlinkSync(pathImg), 
        messageID
    );
};
