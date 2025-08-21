const sendWaiting = true;
const textWaiting = "𝑰𝒎𝒂𝒈𝒆 𝒊𝒏𝒊𝒕𝒊𝒂𝒍𝒊𝒛𝒂𝒕𝒊𝒐𝒏, 𝒅𝒆𝒓𝒊 𝒌𝒉𝒖𝒏 𝒆𝒌𝒕𝒖 𝒐𝒑𝒆𝒌𝒌𝒉𝒂 𝒌𝒐𝒓𝒖𝒏";
const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsLink = 20
const fontsInfo = 28
const colorName = "#00FFFF"

module.exports.config = {
    name: "fbpost-tag",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "📝 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑷𝒐𝒔𝒕 𝑪𝒓𝒆𝒂𝒕𝒆 𝒌𝒐𝒓𝒆",
    commandCategory: "🖼️ 𝑬𝒅𝒊𝒕-𝑰𝒎𝒂𝒈𝒆",
    usages: "@𝒎𝒆𝒏𝒕𝒊𝒐𝒏 = 𝒕𝒆𝒙𝒕",
    cooldowns: 5,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
    },
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
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.run = async function({ api, event, args, Users }) {
    const { loadImage, createCanvas, registerFont } = require("canvas");
    const request = require('request');
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const Canvas = global.nodemodule["canvas"];
    
    let pathImg = __dirname + `/cache/fbv1.png`;
    let pathAvata = __dirname + `/cache/fbv2.png`;
    
    let uid;
    if (event.type == "message_reply") {
        uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
    } else {
        return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂 𝒖𝒔𝒆𝒓!", event.threadID, event.messageID);
    }

    const res = await api.getUserInfoV2(uid);
    const work = args.join(" ");
    const fw = work.indexOf(" = ");
    
    if (fw === -1) {
        return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒇𝒐𝒓𝒎𝒂𝒕! 𝑼𝒔𝒆: @𝒎𝒆𝒏𝒕𝒊𝒐𝒏 = 𝒕𝒆𝒙𝒕", event.threadID, event.messageID);
    }

    const text = work.slice(fw + 3, work.length);
    
    if (sendWaiting) {
        api.sendMessage(textWaiting, event.threadID, event.messageID);
    }

    try {
        const [getAvatarOne, bg] = await Promise.all([
            axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
            axios.get(encodeURI(`https://i.ibb.co/xq3jLQm/Picsart-22-08-15-23-51-29-721.jpg`), { responseType: "arraybuffer" })
        ]);

        fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne.data, 'utf-8'));
        const avataruser = await this.circle(pathAvata);
        fs.writeFileSync(pathImg, Buffer.from(bg.data, "utf-8"));

        if (!fs.existsSync(__dirname + `${fonts}`)) {
            const getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
        }

        const baseImage = await loadImage(pathImg);
        const baseAvata = await loadImage(avataruser);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAvata, 11, 8, 42, 42);

        registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });
        ctx.font = `bold 400 14px Arial, sans-serif`;
        ctx.fillStyle = "#3A3B3C";
        ctx.textAlign = "start";
        ctx.fillText(`${res.name}`, 58, 20);

        ctx.font = "400 18px Arial";
        ctx.fillStyle = "#0000FF";
        ctx.textAlign = "start";
        
        const lines = await this.wrapText(ctx, text, 470);
        ctx.fillText(lines.join('\n'), 15, 75);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        
        api.sendMessage({
            body: "✅ 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑷𝒐𝒔𝒕 𝑪𝒓𝒆𝒂𝒕𝒆𝒅! 💬",
            attachment: fs.createReadStream(pathImg)
        }, event.threadID, () => {
            fs.unlinkSync(pathImg);
            fs.unlinkSync(pathAvata);
        }, event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
    }
};
