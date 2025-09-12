const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FF00";

module.exports.config = {
    name: "cardcute",
    aliases: ["infocard", "usercard"],
    version: "2.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑𝑠 𝑖𝑛 𝑐𝑢𝑡𝑒 𝑠𝑡𝑦𝑙𝑒"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑢𝑡𝑒 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑𝑠 𝑤𝑖𝑡ℎ 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑑𝑒𝑡𝑎𝑖𝑙𝑠"
    },
    guide: {
        en: "{p}cardcute [𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑢𝑠𝑒𝑟]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
        "moment-timezone": "",
        "jimp": ""
    }
};

module.exports.circle = async (image) => {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.onStart = async function({ api, event, args, Users }) {
    // Check dependencies
    try {
        require("canvas");
        require("axios");
        require("fs-extra");
        require("moment-timezone");
        require("jimp");
    } catch (error) {
        return api.sendMessage("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑚𝑜𝑚𝑒𝑛𝑡-𝑡𝑖𝑚𝑒𝑧𝑜𝑛𝑒, 𝑗𝑖𝑚𝑝", event.threadID, event.messageID);
    }

    if (this.config.author !== "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑") {
        return api.sendMessage(`⚠️ 𝐷𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑐𝑟𝑒𝑑𝑖𝑡𝑠 𝑐ℎ𝑎𝑛𝑔𝑒! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑜𝑟𝑖𝑔𝑖𝑛𝑎𝑙 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.`, event.threadID, event.messageID);
    }

    try {
        const { loadImage, createCanvas, registerFont } = require("canvas");
        const fs = require("fs-extra");
        const axios = require("axios");
        const moment = require("moment-timezone");
        let uid = event.senderID;

        if (event.type === "message_reply") {
            uid = event.messageReply.senderID;
        }

        const res = await api.getUserInfoV2(uid);
        const pathImg = __dirname + `/cache/${uid}_card.png`;
        const pathAvata = __dirname + `/cache/${uid}_avt.png`;

        // Download user avatar
        const getAvatarOne = (await axios.get(
            `https://graph.facebook.com/${uid}/picture?height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            { responseType: 'arraybuffer' }
        )).data;
        
        fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
        const avataruser = await this.circle(pathAvata);

        // Download template background
        const bg = (await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
            responseType: "arraybuffer",
        })).data;
        fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

        // Download font if not exists
        if (!fs.existsSync(__dirname + `${fonts}`)) {
            let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + `${fonts}`, Buffer.from(getfont, "utf-8"));
        }

        // Process image
        let baseImage = await loadImage(pathImg);
        let baseAvata = await loadImage(avataruser);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAvata, 50, 130, 270, 270);

        // Process user information
        const genderMap = {
            'male': "👨 𝑀𝑎𝑙𝑒",
            'female': "👩 𝐹𝑒𝑚𝑎𝑙𝑒",
            'unknown': "❓ 𝑁𝑜𝑡 𝑝𝑢𝑏𝑙𝑖𝑐"
        };

        const userInfo = {
            name: res.name || "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑",
            gender: genderMap[res.gender] || genderMap['unknown'],
            follow: res.follow ? `${res.follow} 𝑓𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠` : "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑",
            relationship: res.relationship_status || "𝑁𝑜𝑡 𝑝𝑢𝑏𝑙𝑖𝑐",
            birthday: res.birthday || "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑",
            location: res.location || "𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑",
            link: res.link || "𝑁𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒"
        };

        // Register and use custom font
        registerFont(__dirname + `${fonts}`, { family: "Play-Bold" });

        // Draw user information
        const infoConfig = [
            { text: `👤 𝑁𝑎𝑚𝑒: ${userInfo.name}`, y: 172, color: "#D3D3D3" },
            { text: `⚤ 𝐺𝑒𝑛𝑑𝑒𝑟: ${userInfo.gender}`, y: 208, color: "#99CCFF" },
            { text: `📊 𝐹𝑜𝑙𝑙𝑜𝑤𝑒𝑟𝑠: ${userInfo.follow}`, y: 244, color: "#FFFFE0" },
            { text: `💕 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝: ${userInfo.relationship}`, y: 281, color: "#FFE4E1" },
            { text: `🎂 𝐵𝑖𝑟𝑡ℎ𝑑𝑎𝑦: ${userInfo.birthday}`, y: 320, color: "#9AFF9A" },
            { text: `📍 𝐿𝑜𝑐𝑎𝑡𝑖𝑜𝑛: ${userInfo.location}`, y: 357, color: "#FF6A6A" },
            { text: `🆔 𝑈𝐼𝐷: ${uid}`, y: 397, color: "#EEC591" }
        ];

        infoConfig.forEach(item => {
            ctx.font = `${fontsInfo}px Play-Bold`;
            ctx.fillStyle = item.color;
            ctx.textAlign = "start";
            ctx.fillText(item.text, 410, item.y);
        });

        // Draw Facebook link
        ctx.font = `${fontsLink}px Play-Bold`;
        ctx.fillStyle = "#FFBBFF";
        ctx.fillText(`🔗 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘: ${userInfo.link}`, 30, 450);

        // Save and send image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAvata);

        return api.sendMessage({
            body: "✅ 𝑈𝑠𝑒𝑟 𝑖𝑛𝑓𝑜 𝑐𝑎𝑟𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
            attachment: fs.createReadStream(pathImg)
        }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);

    } catch (error) {
        console.error("𝐶𝑎𝑟𝑑𝑐𝑢𝑡𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒", event.threadID, event.messageID);
    }
};
