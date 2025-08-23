module.exports.config = {
    name: "hugv2",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🤗 𝓜𝓮𝓷𝓽𝓲𝓸𝓷 𝓪 𝓯𝓻𝓲𝓮𝓷𝓭 𝓽𝓸 𝓰𝓲𝓿𝓮 𝓽𝓱𝓮𝓶 𝓪 𝔀𝓪𝓻𝓶 𝓱𝓾𝓰! 💖",
    category: "img",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    },
    envConfig: {}
};

module.exports.languages = {
    "en": {
        "missingMention": "🌸 𝓟𝓵𝓮𝓪𝓼𝓮 𝓶𝓮𝓷𝓽𝓲𝓸𝓷 𝓼𝓸𝓶𝓮𝓸𝓷𝓮 𝓽𝓸 𝓱𝓾𝓰! 🥺"
    }
};

module.exports.onLoad = async function() {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'hugv2.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.ibb.co/zRdZJzG/1626342271-28-kartinkin-com-p-anime-obnimashki-v-posteli-anime-krasivo-30.jpg", path);
}

module.exports.run = async function({ event, api, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const { readFileSync, unlinkSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];

    const mention = Object.keys(event.mentions);
    if (!mention[0]) return api.sendMessage(this.languages.en.missingMention, threadID, messageID);

    const one = senderID, two = mention[0];
    const avatarOne = resolve(__dirname, 'cache/canvas', `avt_${one}.png`);
    const avatarTwo = resolve(__dirname, 'cache/canvas', `avt_${two}.png`);
    const pathImg = resolve(__dirname, 'cache/canvas', `hug_${one}_${two}.png`);

    async function circle(image) {
        image = await jimp.read(image);
        image.circle();
        return await image.getBufferAsync("image/png");
    }

    try {
        const [getAvatarOne, getAvatarTwo] = await Promise.all([
            axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
            axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })
        ]);

        writeFileSync(avatarOne, Buffer.from(getAvatarOne.data, 'utf-8'));
        writeFileSync(avatarTwo, Buffer.from(getAvatarTwo.data, 'utf-8'));

        const baseImage = await jimp.read(resolve(__dirname, 'cache/canvas', 'hugv2.png'));
        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));

        baseImage.composite(circleOne.resize(100, 100), 370, 40)
                 .composite(circleTwo.resize(100, 100), 330, 150);

        const raw = await baseImage.getBufferAsync("image/png");
        writeFileSync(pathImg, raw);

        api.sendMessage({
            body: `💕 ${event.mentions[two].replace(/@/g, "")} 𝓨𝓸𝓾 𝓰𝓸𝓽 𝓪 𝔀𝓪𝓻𝓶 𝓱𝓾𝓰 𝓯𝓻𝓸𝓶 ${await Users.getNameUser(one)}! 🤗`,
            attachment: readFileSync(pathImg)
        }, threadID, () => {
            unlinkSync(pathImg);
            unlinkSync(avatarOne);
            unlinkSync(avatarTwo);
        }, messageID);

    } catch (error) {
        console.error("Error in hugv2 command:", error);
        api.sendMessage("🌸 𝓢𝓸𝓶𝓮𝓽𝓱𝓲𝓷𝓰 𝔀𝓮𝓷𝓽 𝔀𝓻𝓸𝓷𝓰 𝔀𝓱𝓲𝓵𝓮 𝓹𝓻𝓸𝓬𝓮𝓼𝓼𝓲𝓷𝓰 𝓽𝓱𝓮 𝓱𝓾𝓰! 🥺", threadID, messageID);
    }
};
