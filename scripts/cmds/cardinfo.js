const sendWaiting = true; // enable or disable sending "images in progress, please wait...";
const textWaiting = "🖼️ | 𝐼𝑚𝑎𝑔𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑎𝑡𝑖𝑜𝑛, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 𝑎 𝑚𝑜𝑚𝑒𝑛𝑡...";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports.config = {
    name: "cardinfo",
    aliases: ["userinfo", "profilecard"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "✨ 𝐶𝑟𝑒𝑎𝑡𝑒 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑"
    },
    longDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒𝑠 𝑎 𝑠𝑡𝑦𝑙𝑖𝑠ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    },
    guide: {
        en: "{p}cardinfo [𝑟𝑒𝑝𝑙𝑦/𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
        "jimp": "",
        "moment-timezone": ""
    }
};

module.exports.languages = {
    "en": {
        "missing_reply": "❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜!"
    }
};

module.exports.circle = async function (image) {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.onLoad = function () {
    try {
        const canvas = require("canvas");
        if (!canvas) {
            console.error("𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒");
        }
    } catch (error) {
        console.error("𝐶𝑎𝑛𝑣𝑎𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑖𝑡");
    }
};

module.exports.onStart = async function ({ api, event, args, Users }) {
    try {
        const { loadImage, createCanvas } = require("canvas");
        const fs = global.nodemodule["fs-extra"];
        const axios = global.nodemodule["axios"];
        const Canvas = require("canvas");
        const moment = require("moment-timezone");
        
        let { senderID, threadID, messageID } = event;
        
        if ((this.config.author) !== "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑") { 
            return api.sendMessage(`⚠️ 𝐷𝑒𝑡𝑒𝑐𝑡𝑒𝑑: 𝐴𝑢𝑡ℎ𝑜𝑟 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑐ℎ𝑎𝑛𝑔𝑒𝑑!`, threadID, messageID);
        }

        if (sendWaiting) {
            api.sendMessage(textWaiting, threadID, messageID);
        }

        let uid;
        if (event.type === "message_reply") {
            uid = event.messageReply.senderID;
        } else if (Object.keys(event.mentions).length > 0) {
            uid = Object.keys(event.mentions)[0];
        } else {
            uid = event.senderID;
        }

        const res = await api.getUserInfoV2(uid); 
        let pathImg = __dirname + `/cache/1.png`;
        let pathAvata = __dirname + `/cache/2.png`;

        let getAvatarOne = (await axios.get(
            `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            { responseType: 'arraybuffer' }
        )).data;

        let bg = (await axios.get(encodeURI(`https://i.imgur.com/tW6nSDm.png`), {
            responseType: "arraybuffer",
        })).data;

        fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
        let avataruser = await this.circle(pathAvata);
        fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

        if (!fs.existsSync(__dirname + `${fonts}`)) { 
            let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
        }

        let baseImage = await loadImage(pathImg);
        let baseAvata = await loadImage(avataruser);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAvata, 80, 73, 285, 285);
        
        // Process user data
        const userData = {
            name: res.name || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑",
            gender: res.gender === 'male' ? "♂️ 𝑀𝑎𝑙𝑒" : res.gender === 'female' ? "♀️ 𝐹𝑒𝑚𝑎𝑙𝑒" : "𝑁𝑜𝑡 𝑝𝑢𝑏𝑙𝑖𝑐",
            follow: res.follow || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑",
            relationship: res.relationship_status || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑",
            birthday: res.birthday || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑",
            location: res.location || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑",
            link: res.link || "𝑁𝑜𝑡 𝐹𝑜𝑢𝑛𝑑"
        };

        Canvas.registerFont(__dirname + `${fonts}`, {
            family: "Play-Bold"
        });

        // Draw user information
        ctx.font = `${fontsInfo}px Play-Bold`;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        
        ctx.fillText(`👤 ${userData.name}`, 480, 172);
        ctx.fillText(`⚥ ${userData.gender}`, 550, 208);
        ctx.fillText(`👥 ${userData.follow}`, 550, 244);
        ctx.fillText(`💞 ${userData.relationship}`, 550, 281);
        ctx.fillText(`🎂 ${userData.birthday}`, 550, 320);
        ctx.fillText(`📍 ${userData.location}`, 550, 357);
        ctx.fillText(`🆔 ${uid}`, 550, 399);
        
        ctx.font = `${fontsLink}px Play-Bold`;
        ctx.fillStyle = "#0000FF";
        ctx.fillText(`🔗 ${userData.link}`, 180, 475);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAvata);

        return api.sendMessage(
            { attachment: fs.createReadStream(pathImg) },
            threadID,
            () => fs.unlinkSync(pathImg),
            messageID
        );

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.", event.threadID, event.messageID);
    }
};
