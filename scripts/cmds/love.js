module.exports.config = {
    name: "love",
    version: "2.6.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑷𝒓𝒆𝒎 𝒆𝒓 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒐",
    commandCategory: "𝑳𝒐𝒗𝒆",
    usages: "[𝒕𝒂𝒈]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async() => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'love2.jpg');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/JTvb5yc.png", path);
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let tromcho_img = await jimp.read(__root + "/love2.jpg");
    let pathImg = __root + `/love2_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;
    
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    tromcho_img.composite(circleOne.resize(270, 270), 800, 100).composite(circleTwo.resize(300, 300), 205, 300);
    
    let raw = await tromcho_img.getBufferAsync("image/png");
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    var mention = Object.keys(event.mentions)[0]
    
    if (!mention) return api.sendMessage("𝑬𝒌 𝒋𝒐𝒏 𝒌𝒆 𝒕𝒂𝒈 𝒌𝒐𝒓𝒖𝒏 😊", threadID, messageID);
    
    let tag = event.mentions[mention].replace("@", "");
    var one = senderID, two = mention;
    
    return makeImage({ one, two }).then(path => api.sendMessage({ 
        body: `💖 ${tag} 𝒕𝒖𝒎𝒊 𝒌𝒆 𝒃𝒉𝒂𝒍𝒐𝒃𝒂𝒔𝒆 𝒆𝒌𝒕𝒖 𝒃𝒆𝒔𝒉𝒊 💕\n━━━━━━━━━━━━━━━━`,
        mentions: [{
          tag: tag,
          id: mention
        }],
        attachment: fs.createReadStream(path) 
    }, threadID, () => fs.unlinkSync(path), messageID));
}
