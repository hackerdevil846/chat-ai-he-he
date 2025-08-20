module.exports.config = {
    name: "hug2b",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🥰 𝑴𝒆𝒚𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒉𝒖𝒈 𝒅𝒆𝒐𝒘𝒂",
    commandCategory: "🖼️ 𝑰𝒎𝒂𝒈𝒆",
    usages: "[@𝒎𝒆𝒏𝒕𝒊𝒐𝒏]",
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
    const path = resolve(__dirname, 'cache/canvas', 'hugv1.png');
    
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", path);
}

module.exports.run = async function({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const path = global.nodemodule["path"];
    
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    if (!mention[0]) return api.sendMessage("❌ 𝑬𝒌𝒋𝒐𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏! 🥺", threadID, messageID);
    
    async function circle(image) {
        image = await jimp.read(image);
        image.circle();
        return await image.getBufferAsync("image/png");
    }

    async function makeImage(one, two) {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const batgiam_img = await jimp.read(__root + "/hugv1.png");
        const pathImg = __root + `/hug_${one}_${two}.png`;
        const avatarOne = __root + `/avt_${one}.png`;
        const avatarTwo = __root + `/avt_${two}.png`;
        
        const getAvatarOne = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
        
        const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
        
        const circleOne = await jimp.read(await circle(avatarOne));
        const circleTwo = await jimp.read(await circle(avatarTwo));
        
        batgiam_img.composite(circleOne.resize(150, 150), 320, 100)
                   .composite(circleTwo.resize(130, 130), 280, 280);
        
        const raw = await batgiam_img.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
        
        fs.unlinkSync(avatarOne);
        fs.unlinkSync(avatarTwo);
        
        return pathImg;
    }

    const one = senderID;
    const two = mention[0];
    
    makeImage(one, two).then(path => {
        api.sendMessage({ 
            body: `💖 𝑵𝒊𝒋𝒆𝒓 𝑯𝒖𝒈! ${event.mentions[two].replace("@", "")} 🥰`,
            mentions: [{
                tag: event.mentions[two].replace("@", ""),
                id: two
            }],
            attachment: fs.createReadStream(path) 
        }, threadID, () => fs.unlinkSync(path), messageID);
    }).catch(err => {
        console.error(err);
        api.sendMessage("❌ 𝑨𝒓𝒆 𝒃𝒂𝒄𝒄𝒂! 𝑲𝒊𝒄𝒉𝒖 𝒈𝒐𝒍𝒂𝒕 𝒉𝒐𝒊𝒚𝒆𝒄𝒉𝒆, 𝒑𝒐𝒓𝒆 𝒂𝒃𝒂𝒓 𝒕𝒓𝒚 𝒌𝒐𝒓𝒖𝒏! 😿", threadID, messageID);
    });
};
