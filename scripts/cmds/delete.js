const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");
const path = require("path");

module.exports.config = {
    name: "delete",
    aliases: ["remove", "del"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑚𝑒𝑑𝑖𝑎",
    shortDescription: {
        en: "𝐷𝑒𝑙𝑒𝑡𝑒 𝑘𝑜𝑟𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 🖱️"
    },
    longDescription: {
        en: "𝐷𝑒𝑙𝑒𝑡𝑒 𝑘𝑜𝑟𝑎𝑟 𝑗𝑜𝑛𝑛𝑜 𝑖𝑚𝑎𝑔𝑒 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    guide: {
        en: "{p}delete [𝑡𝑎𝑔]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "jimp": ""
    }
};

module.exports.languages = {
    "en": {
        "message": "𝐷𝑎𝑦𝑎 𝑘𝑜𝑟𝑒 𝑒𝑘𝑗𝑜𝑛 𝑘𝑒 𝑡𝑎𝑔 𝑘𝑜𝑟𝑢𝑛! 🖱️"
    }
};

module.exports.onLoad = async function() {
    const dirMaterial = __dirname + `/cache/`;
    const imagePath = path.resolve(__dirname, 'cache', 'toilet1.png');
    
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(imagePath)) {
        try {
            const { data } = await axios.get("https://i.imgur.com/vsJYfw5.png", { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, Buffer.from(data, 'utf-8'));
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    }
};

module.exports.onStart = async function({ message, event, args, usersData }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);
        
        if (!mention[0]) return message.reply(this.languages.en.message, threadID, messageID);
        
        const hc = Math.floor(Math.random() * 101);
        const rd = Math.floor(Math.random() * 100000) + 100000;
        await usersData.set(senderID, {
            money: (await usersData.get(senderID))?.money + parseInt(hc * rd) || parseInt(hc * rd),
            data: (await usersData.get(senderID))?.data || {}
        });

        const one = senderID;
        const two = mention[0];
        const __root = path.resolve(__dirname, "cache");

        async function circle(image) {
            const img = await jimp.read(image);
            img.circle();
            return await img.getBufferAsync("image/png");
        }

        async function makeImage() {
            const hon_img = await jimp.read(__root + "/toilet1.png");
            const pathImg = __root + `/toilet1_${one}_${two}.png`;
            const avatarOne = __root + `/avt_${one}.png`;
            const avatarTwo = __root + `/avt_${two}.png`;
            
            const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
            
            const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
            
            const circleOne = await jimp.read(await circle(avatarOne));
            const circleTwo = await jimp.read(await circle(avatarTwo));
            
            hon_img.resize(748, 356)
                   .composite(circleOne.resize(100, 100), 30, 65)
                   .composite(circleTwo.resize(100, 100), 30, 65);
            
            const raw = await hon_img.getBufferAsync("image/png");
            fs.writeFileSync(pathImg, raw);
            
            fs.unlinkSync(avatarOne);
            fs.unlinkSync(avatarTwo);
            
            return pathImg;
        }

        const pathImg = await makeImage();
        await message.reply({
            body: `🧹 𝐷𝑒𝑙𝑒𝑡𝑒 𝑘𝑜𝑟𝑡𝑒 𝑐𝑎𝑖𝑠𝑜 𝑒𝑖 𝑡𝑎? +${hc*rd}💵!`,
            attachment: fs.createReadStream(pathImg)
        }, threadID);
        
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐷𝑒𝑙𝑒𝑡𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑑𝑒𝑙𝑒𝑡𝑒 𝑖𝑚𝑎𝑔𝑒.", event.threadID, event.messageID);
    }
};
