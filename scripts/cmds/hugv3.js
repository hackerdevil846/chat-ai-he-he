module.exports.config = {
    name: "hugv3",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🥰 | 𝑀𝑒𝓃𝓉𝒾𝑜𝓃𝑒𝒹 𝒻𝓇𝒾𝑒𝓃𝒹 𝓀𝑒 𝒽𝓊𝑔 𝒹𝒾𝓈𝒽𝒶𝓃 𝒹𝒶𝓃𝑜",
    commandCategory: "img",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function() {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'hugv3.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/7lPqHjw.jpg", path);
}

module.exports.run = async function({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const path = global.nodemodule["path"];
    
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    if (!mention[0]) return api.sendMessage("💔 | 𝒟𝒶𝓎𝒶 𝓀𝑜𝓇𝑒 1 𝒿𝒶𝓃𝑒𝓇 @𝓂𝑒𝓃𝓉𝒾𝑜𝓃 𝒹𝒶𝓃 🥺", threadID, messageID);
    
    async function circle(image) {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
    }

    async function makeImage(one, two) {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const batgiam_img = await jimp.read(__root + "/hugv3.png");
        const pathImg = __root + `/hugv3_${one}_${two}.png`;
        const avatarOne = __root + `/avt_${one}.png`;
        const avatarTwo = __root + `/avt_${two}.png`;
        
        const getAvatar = async (uid, path) => {
            const data = (await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
        };

        await Promise.all([
            getAvatar(one, avatarOne),
            getAvatar(two, avatarTwo)
        ]);

        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));
        
        batgiam_img.composite(circleOne.resize(220, 220), 200, 50)
                  .composite(circleTwo.resize(220, 220), 490, 200);
        
        const raw = await batgiam_img.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
        
        [avatarOne, avatarTwo].forEach(path => fs.unlinkSync(path));
        return pathImg;
    }

    try {
        const pathImg = await makeImage(senderID, mention[0]);
        api.sendMessage({
            body: "🥰 | 𝓨𝓸𝓾 𝓻𝓮𝓬𝓮𝓲𝓿𝓮𝓭 𝓪 𝔀𝓪𝓻𝓶 𝓱𝓾𝓰!",
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => fs.unlinkSync(pathImg), messageID);
    } catch (error) {
        api.sendMessage("❌ | 𝓐𝓷 𝓮𝓻𝓻𝓸𝓻 𝓸𝓬𝓬𝓾𝓻𝓮𝓭 𝔀𝓱𝓲𝓵𝓮 𝓹𝓻𝓸𝓬𝓮𝓼𝓼𝓲𝓷𝓰 𝓽𝓱𝓮 𝓲𝓶𝓪𝓰𝓮", threadID, messageID);
    }
};
