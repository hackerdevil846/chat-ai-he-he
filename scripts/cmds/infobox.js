const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsName = 45;
const fontsInfo = 33;
const fontsOthers = 27;
const colorName = "#00FFFF";

module.exports.config = {
    name: "infobox",
    aliases: ["groupinfo", "ginfo"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "group",
    shortDescription: {
        en: "📊 𝑉𝑖𝑒𝑤 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝'𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑔𝑟𝑎𝑝ℎ𝑖𝑐𝑠"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑖𝑠𝑢𝑎𝑙𝑙𝑦 𝑎𝑝𝑝𝑒𝑎𝑙𝑖𝑛𝑔 𝑑𝑒𝑠𝑖𝑔𝑛"
    },
    guide: {
        en: "{p}infobox"
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
        "missingThreadInfo": "❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑟𝑒𝑡𝑟𝑖𝑒𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
        "errorProcessing": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.",
        "notGroup": "❌ 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑐𝑎𝑛 𝑜𝑛𝑙𝑦 𝑏𝑒 𝑢𝑠𝑒𝑑 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑐ℎ𝑎𝑡𝑠.",
        "successResult": "📊 %1 𝐺𝑟𝑜𝑢𝑝 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
    }
};

module.exports.circle = async (image) => {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.onStart = async function ({ api, event, message }) {
    try {
        const { loadImage, createCanvas, registerFont } = require("canvas");
        const fs = require("fs-extra");
        const axios = require("axios");
        const path = require("path");
        const moment = require("moment-timezone");

        let { senderID, threadID, messageID, threadType } = event;
        
        // Check if it's a group chat
        if (threadType !== "2") {
            return message.reply(this.languages.en.notGroup);
        }

        // Define file paths
        let pathImg = __dirname + `/cache/${senderID}_${threadID}_infobox.png`;
        let pathAva = __dirname + `/cache/${senderID}_${threadID}_groupavt.png`;
        let pathAvata = __dirname + `/cache/${senderID}_${threadID}_adminavt.png`;
        let pathAvata2 = __dirname + `/cache/${senderID}_${threadID}_memavt1.png`;
        let pathAvata3 = __dirname + `/cache/${senderID}_${threadID}_memavt2.png`;

        // Get thread information
        var threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo) {
            return message.reply(this.languages.en.missingThreadInfo);
        }
        
        let threadName = threadInfo.threadName || "𝑈𝑛𝑛𝑎𝑚𝑒𝑑 𝐺𝑟𝑜𝑢𝑝";

        // Gender counts
        var nam = 0, nu = 0;
        for (let user of threadInfo.userInfo) {
            if (user.gender === 'MALE') nam++;
            else if (user.gender === 'FEMALE') nu++;
        }

        // Group statistics
        let qtv = threadInfo.adminIDs.length;
        let sl = threadInfo.messageCount || 0;
        let threadMem = threadInfo.participantIDs.length;

        // Random admin and members
        var idad = threadInfo.adminIDs[Math.floor(Math.random() * qtv)]?.id;
        var idmemrd = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];
        var idmemrd1 = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];

        // Download images
        let avatarData = await Promise.allSettled([
            axios.get(encodeURI(threadInfo.imageSrc || `https://graph.facebook.com/${threadID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), { responseType: "arraybuffer" }),
            idad ? axios.get(`https://graph.facebook.com/${idad}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }) : Promise.resolve(null),
            axios.get(`https://graph.facebook.com/${idmemrd}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
            axios.get(`https://graph.facebook.com/${idmemrd1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
            axios.get("https://i.imgur.com/hHKQMW8.jpg", { responseType: "arraybuffer" })
        ]);

        // Save files
        fs.writeFileSync(pathAva, Buffer.from(avatarData[0].value?.data || avatarData[0].value));
        if (avatarData[1].value) fs.writeFileSync(pathAvata, Buffer.from(avatarData[1].value.data));
        fs.writeFileSync(pathAvata2, Buffer.from(avatarData[2].value.data));
        fs.writeFileSync(pathAvata3, Buffer.from(avatarData[3].value.data));
        fs.writeFileSync(pathImg, Buffer.from(avatarData[4].value.data));

        // Download font if missing
        if (!fs.existsSync(__dirname + fonts)) {
            try {
                let fontData = await axios.get(downfonts, { responseType: "arraybuffer" });
                fs.writeFileSync(__dirname + fonts, Buffer.from(fontData.data));
            } catch (fontError) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑜𝑛𝑡:", fontError);
            }
        }

        // Process images
        let [avatar, avataruser, avataruser2, avataruser3] = await Promise.all([
            this.circle(pathAva),
            fs.existsSync(pathAvata) ? this.circle(pathAvata) : null,
            this.circle(pathAvata2),
            this.circle(pathAvata3)
        ]);

        // Load images
        let imageLoaders = [
            loadImage(pathImg),
            loadImage(avatar),
            avataruser ? loadImage(avataruser) : Promise.resolve(null),
            loadImage(avataruser2),
            loadImage(avataruser3)
        ];
        
        let [baseImage, baseAva, baseAvata, baseAvata2, baseAvata3] = await Promise.all(imageLoaders);

        // Create canvas
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        
        // Draw background
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Draw group avatar
        ctx.drawImage(baseAva, 80, 73, 285, 285);
        
        // Draw member avatars
        if (baseAvata) ctx.drawImage(baseAvata, 450, 422, 43, 43);
        ctx.drawImage(baseAvata2, baseAvata ? 500 : 450, 422, 43, 43);
        ctx.drawImage(baseAvata3, baseAvata ? 550 : 500, 422, 43, 43);

        // Register and use custom font
        try {
            registerFont(__dirname + fonts, { family: "Lobster" });
        } catch (e) {
            console.log("𝑈𝑠𝑖𝑛𝑔 𝑑𝑒𝑓𝑎𝑢𝑙𝑡 𝑓𝑜𝑛𝑡 𝑑𝑢𝑒 𝑡𝑜 𝑟𝑒𝑔𝑖𝑠𝑡𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", e);
        }

        // Draw group name
        ctx.font = `700 ${fontsName}px ${fs.existsSync(__dirname + fonts) ? "Lobster" : "Arial"}`;
        ctx.fillStyle = colorName;
        // Ensure text doesn't overflow
        let displayName = threadName;
        if (ctx.measureText(displayName).width > 300) {
            while (ctx.measureText(displayName + "...").width > 300 && displayName.length > 10) {
                displayName = displayName.substring(0, displayName.length - 1);
            }
            displayName += "...";
        }
        ctx.fillText(displayName, 435, 125);

        // Draw group info
        ctx.font = `${fontsInfo}px ${fs.existsSync(__dirname + fonts) ? "Lobster" : "Arial"}`;
        ctx.fillStyle = "#00FF00";
        
        const infoData = [
            { emoji: "👥", text: `𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${threadMem}` },
            { emoji: "🛡️", text: `𝐴𝑑𝑚𝑖𝑛𝑠: ${qtv}` },
            { emoji: "♂️", text: `𝑀𝑎𝑙𝑒: ${nam}` },
            { emoji: "♀️", text: `𝐹𝑒𝑚𝑎𝑙𝑒: ${nu}` },
            { emoji: "💬", text: `𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${sl}` }
        ];

        infoData.forEach((item, i) => {
            ctx.fillText(`${item.emoji} ${item.text}`, 439, 199 + i * 44);
        });

        // Draw footer
        ctx.font = `${fontsOthers}px ${fs.existsSync(__dirname + fonts) ? "Lobster" : "Arial"}`;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`🔖 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${threadInfo.threadID}`, 18, 470);
        ctx.fillText(`✨ 𝐴𝑛𝑑 ${threadMem - 3} 𝑜𝑡ℎ𝑒𝑟 𝑚𝑒𝑚𝑏𝑒𝑟𝑠...`, 607, 453);

        // Save and send
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // Create info text
        const infoText = `📊 ${threadName} 𝐺𝑟𝑜𝑢𝑝 𝐼𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛!\n` +
            `👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${threadMem} | 🛡️ 𝐴𝑑𝑚𝑖𝑛𝑠: ${qtv}\n` +
            `♂️ 𝑀𝑎𝑙𝑒: ${nam} | ♀️ 𝐹𝑒𝑚𝑎𝑙𝑒: ${nu}\n` +
            `💬 𝑇𝑜𝑡𝑎𝑙 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${sl}\n` +
            `🔖 𝐺𝑟𝑜𝑢𝑝 𝐼𝐷: ${threadInfo.threadID}`;

        await message.reply({
            body: infoText,
            attachment: fs.createReadStream(pathImg)
        });

        // Cleanup temporary files
        const filesToDelete = [pathAva, pathAvata, pathAvata2, pathAvata3, pathImg];
        filesToDelete.forEach(file => {
            if (fs.existsSync(file)) {
                try {
                    fs.unlinkSync(file);
                } catch (e) {
                    console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑒:", e);
                }
            }
        });

    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑖𝑛𝑓𝑜𝑏𝑜𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
        message.reply(this.languages.en.errorProcessing);
    }
};
