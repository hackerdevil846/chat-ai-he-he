const sendWaiting = true;
const textWaiting = "𝐼𝑚𝑎𝑔𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports.config = {
    name: "fbpost-tag",
    aliases: ["fbpost", "facebookpost"],
    version: "7.3.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑒𝑑𝑖𝑡-𝑖𝑚𝑎𝑔𝑒",
    shortDescription: {
        en: "𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑃𝑜𝑠𝑡 𝐶𝑟𝑒𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘-𝑠𝑡𝑦𝑙𝑒 𝑝𝑜𝑠𝑡𝑠 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠"
    },
    guide: {
        en: "{p}fbpost-tag @𝑚𝑒𝑛𝑡𝑖𝑜𝑛 = 𝑡𝑒𝑥𝑡"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
        "jimp": "",
        "moment-timezone": ""
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
};

module.exports.circle = async (image) => {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.onStart = async function({ api, event, args, message, Users }) {
    try {
        const { loadImage, createCanvas, registerFont } = require("canvas");
        const fs = require("fs-extra");
        const axios = require("axios");
        const Canvas = require("canvas");

        let pathImg = __dirname + `/cache/fbv1.png`;
        let pathAvata = __dirname + `/cache/fbv2.png`;
        
        let uid;
        if (event.type == "message_reply") {
            uid = event.messageReply.senderID;
        } else if (Object.keys(event.mentions).length > 0) {
            uid = Object.keys(event.mentions)[0];
        } else {
            return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑢𝑠𝑒𝑟!");
        }

        const res = await api.getUserInfoV2(uid);
        const work = args.join(" ");
        const fw = work.indexOf(" = ");
        
        if (fw === -1) {
            return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡! 𝑈𝑠𝑒: @𝑚𝑒𝑛𝑡𝑖𝑜𝑛 = 𝑡𝑒𝑥𝑡");
        }

        const text = work.slice(fw + 3, work.length);
        
        if (sendWaiting) {
            message.reply(textWaiting);
        }

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
        
        message.reply({
            body: "✅ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑃𝑜𝑠𝑡 𝐶𝑟𝑒𝑎𝑡𝑒𝑑! 💬",
            attachment: fs.createReadStream(pathImg)
        }).then(() => {
            fs.unlinkSync(pathImg);
            fs.unlinkSync(pathAvata);
        });

    } catch (error) {
        console.error("𝐹𝐵𝑃𝑜𝑠𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
    }
};
