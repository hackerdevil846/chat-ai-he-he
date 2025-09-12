const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsName = 45;
const fontsInfo = 33;
const fontsOthers = 27;
const colorName = "#000000";

module.exports.config = {
    name: "cardbox",
    aliases: ["groupcard", "gcard"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "𝗜𝗡𝗙𝗢",
    shortDescription: {
        en: "📋 𝐺𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑑𝑒𝑠𝑖𝑔𝑛"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 𝑤𝑖𝑡ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑠"
    },
    guide: {
        en: "{p}cardbox [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
        "jimp": "",
        "moment-timezone": "",
        "path": ""
    }
};

module.exports.languages = {
    "en": {
        "missingText": "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑡𝑜 𝑑𝑖𝑠𝑝𝑙𝑎𝑦 𝑜𝑛 𝑡ℎ𝑒 𝑐𝑎𝑟𝑑"
    }
};

module.exports.circle = async (image) => {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.onStart = async function ({ api, event, args, message }) {
    try {
        // Check dependencies
        const requiredModules = ["canvas", "axios", "fs-extra", "jimp", "path"];
        for (const mod of requiredModules) {
            try {
                require.resolve(mod);
            } catch {
                throw new Error(`${mod} 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑`);
            }
        }

        const { loadImage, createCanvas } = require("canvas");
        const fs = require("fs-extra");
        const axios = require("axios");
        const jimp = require("jimp");
        const path = require("path");
        
        let { senderID, threadID, messageID } = event;
        let pathImg = __dirname + `/cache/${senderID}123.png`;
        let pathAva = __dirname + `/cache/avtuserthread.png`;
        let pathAvata = __dirname + `/cache/avtuserrd.png`;
        let pathAvata2 = __dirname + `/cache/avtuserrd2.png`;
        let pathAvata3 = __dirname + `/cache/avtuserrd3.png`;
        
        let threadInfo = await api.getThreadInfo(threadID);
        let threadName = threadInfo.threadName;
        var nameMen = [];
        var gendernam = [];
        var gendernu = [];
        var nope = [];

        for (let z in threadInfo.userInfo) {
            var gioitinhone = threadInfo.userInfo[z].gender;
            var nName = threadInfo.userInfo[z].name;

            if (gioitinhone == 'MALE') {
                gendernam.push(z + gioitinhone);
            } else if (gioitinhone == 'FEMALE') {
                gendernu.push(gioitinhone);
            } else {
                nope.push(nName);
            }
        }

        var nam = gendernam.length;
        var nu = gendernu.length;
        let qtv = threadInfo.adminIDs.length;
        let sl = threadInfo.messageCount;
        let threadMem = threadInfo.participantIDs.length;
        const Canvas = require("canvas");
        const __root = path.resolve(__dirname, "cache");
        var qtv2 = threadInfo.adminIDs;
        var idad = qtv2[Math.floor(Math.random() * qtv)];
        let idmem = threadInfo.participantIDs
        var idmemrd = idmem[Math.floor(Math.random() * threadMem)];
        var idmemrd1 = idmem[Math.floor(Math.random() * threadMem)];
        
        let getAvatarOne = (await axios.get(`https://graph.facebook.com/${idad.id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        let getAvatarOne2 = (await axios.get(`https://graph.facebook.com/${idmemrd}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        let getAvatarOne3 = (await axios.get(`https://graph.facebook.com/${idmemrd1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        let Avatar = (
            await axios.get(encodeURI(
                `${threadInfo.imageSrc}`),
                { responseType: "arraybuffer" }
            )
        ).data;
        let getWanted = (
            await axios.get(encodeURI(`https://i.imgur.com/zVvx3bq.png`), {
                responseType: "arraybuffer",
            })
        ).data;
        
        fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
        fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
        fs.writeFileSync(pathAvata2, Buffer.from(getAvatarOne2, 'utf-8'));
        fs.writeFileSync(pathAvata3, Buffer.from(getAvatarOne3, 'utf-8'));
        
        let avatar = await this.circle(pathAva);
        let avataruser = await this.circle(pathAvata);
        let avataruser2 = await this.circle(pathAvata2);
        let avataruser3 = await this.circle(pathAvata3);
        fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

        /*-----------------download----------------------*/
        if(!fs.existsSync(__dirname+`${fonts}`)) { 
            let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
        };
        /*---------------------------------------------*/

        let baseImage = await loadImage(pathImg);
        let baseAva = await loadImage(avatar);
        let baseAvata = await loadImage(avataruser);
        let baseAvata2 = await loadImage(avataruser2);
        let baseAvata3 = await loadImage(avataruser3);
        let canvas = createCanvas(baseImage.width, baseImage.height);
        let ctx = canvas.getContext("2d");
        let text = args.join(" ") || threadName;
        let id = threadInfo.threadID;
        
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAva, 80, 73, 285, 285);
        ctx.drawImage(baseAvata, 450, 422, 43, 43);
        ctx.drawImage(baseAvata2, 500, 422, 43, 43);
        ctx.drawImage(baseAvata3, 550, 422, 43, 43);
        
        ctx.font = `700 ${fontsName}px Arial`;
        ctx.fillStyle = `${colorName}`;
        ctx.textAlign = "start";
        ctx.fillText(text, 435, 125);
        
        Canvas.registerFont(__dirname+`${fonts}`, {
            family: "Lobster"
        });
        
        ctx.font = `${fontsInfo}px Lobster`;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        ctx.fillText(`👥 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${threadMem}`, 439, 199);
        ctx.fillText(`👑 𝐴𝑑𝑚𝑖𝑛𝑠: ${qtv}`, 439, 243);
        ctx.fillText(`🚹 𝑀𝑎𝑙𝑒𝑠: ${nam}`, 439, 287);
        ctx.fillText(`🚺 𝐹𝑒𝑚𝑎𝑙𝑒𝑠: ${nu}`, 439, 331);
        ctx.fillText(`💬 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${sl}`, 439, 379);
        
        ctx.font = `${fontsOthers}px Lobster`;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "start";
        ctx.fillText(`📦 𝐵𝑜𝑥 𝐼𝐷: ${id}`, 18, 470);
        ctx.fillText(`➕ 𝐴𝑛𝑑 ${parseInt(threadMem)-3} 𝑜𝑡ℎ𝑒𝑟 𝑚𝑒𝑚𝑏𝑒𝑟𝑠...`, 607, 453);
        
        ctx.beginPath();
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAva);
        fs.removeSync(pathAvata);
        fs.removeSync(pathAvata2);
        fs.removeSync(pathAvata3);

        return message.reply({
            body: "✅ 𝐺𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑐𝑎𝑟𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!",
            attachment: fs.createReadStream(pathImg)
        }, () => fs.unlinkSync(pathImg));
        
    } catch (error) {
        console.error(error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.");
    }
};
