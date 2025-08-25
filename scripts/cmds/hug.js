module.exports.config = {
    name: "hug",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑱𝒉𝒂𝒏𝒌𝒂𝒘 𝒅𝒆𝒌𝒉𝒂𝒐 🥰",
    category: "𝗜𝗠𝗔𝗚𝗘",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = require("path");
    const { existsSync, mkdirSync } = require("fs-extra");
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'hugv1.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) {
        const axios = require("axios");
        const { data } = await axios.get("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", { responseType: "arraybuffer" });
        require("fs").writeFileSync(path, Buffer.from(data, 'utf-8'));
    }
};

module.exports.onStart = async function ({ event, api, args }) {
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios");
    const jimp = require("jimp");
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    if (!mention[0]) return api.sendMessage("❌ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏", threadID, messageID);
    
    const one = senderID;
    const two = mention[0];
    const __root = path.resolve(__dirname, "cache", "canvas");

    try {
        let hug_img = await jimp.read(__root + "/hugv1.png");
        let pathImg = __root + `/hug_${one}_${two}.png`;
        let avatarOne = __root + `/avt_${one}.png`;
        let avatarTwo = __root + `/avt_${two}.png`;
        
        const getAvatar = async (uid, path) => {
            const { data } = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
            fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
        };

        await Promise.all([
            getAvatar(one, avatarOne),
            getAvatar(two, avatarTwo)
        ]);

        const circle = async (imagePath) => {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        };

        const [circleOne, circleTwo] = await Promise.all([
            circle(avatarOne),
            circle(avatarTwo)
        ]);

        hug_img.composite(await jimp.read(circleOne), 320, 100)
               .composite(await jimp.read(circleTwo), 280, 280);
        
        await hug_img.writeAsync(pathImg);
        
        api.sendMessage({
            body: `💖 𝑨𝒑𝒏𝒂𝒓 𝒋𝒉𝒂𝒏𝒌𝒂𝒘 𝒏𝒊𝒚𝒆!\n${event.mentions[two].replace('@', '')} → ${event.senderID.replace('@', '')}`,
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => {
            fs.unlinkSync(pathImg);
            fs.unlinkSync(avatarOne);
            fs.unlinkSync(avatarTwo);
        }, messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝑨𝒓𝒆 𝒌𝒊𝒉𝒐 𝒈𝒆𝒍𝒐 𝒆𝒓𝒓𝒐𝒓!", threadID, messageID);
    }
};
