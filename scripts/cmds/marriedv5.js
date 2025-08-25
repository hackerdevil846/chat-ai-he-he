module.exports.config = {
    name: "marriedv5",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💍 𝑩𝒊𝒚𝒆 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒊𝒎𝒂𝒈𝒆 𝒃𝒂𝒏𝒂𝒐",
    category: "🖼️ 𝑰𝒎𝒂𝒈𝒆",
    usages: "[@𝒎𝒆𝒏𝒕𝒊𝒐𝒏]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'marriedv5.png');
    
    if (!existsSync(dirMaterial)) 
        mkdirSync(dirMaterial, { recursive: true });
    
    if (!existsSync(path)) 
        await downloadFile("https://i.ibb.co/mhxtgwm/49be174dafdc259030f70b1c57fa1c13.jpg", path);
};

module.exports.onStart = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    if (!mention[0]) 
        return api.sendMessage("💍 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏!", threadID, messageID);

    const one = senderID;
    const two = mention[0];
    
    const __root = path.resolve(__dirname, "cache", "canvas");
    const married_img = await jimp.read(__root + "/marriedv5.png");
    const pathImg = __root + `/married_${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;
    
    /* Helper functions */
    const circle = async (image) => {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
    };
    
    /* Process avatars */
    const getAvatar = async (uid) => {
        const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(data, 'utf-8');
    };
    
    fs.writeFileSync(avatarOne, await getAvatar(one));
    fs.writeFileSync(avatarTwo, await getAvatar(two));
    
    /* Create final image */
    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));
    
    married_img.composite(circleOne.resize(130, 130), 300, 150)
              .composite(circleTwo.resize(130, 130), 170, 230);
    
    const buffer = await married_img.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, buffer);
    
    /* Send result */
    const name1 = (await api.getUserInfo(one))[one].name;
    const name2 = (await api.getUserInfo(two))[two].name;
    const msg = one === two 
        ? `🤔 ${name1}, 𝒕𝒖𝒎𝒊 𝒏𝒊𝒋𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 𝒃𝒊𝒚𝒆 𝒌𝒐𝒓𝒄𝒉𝒐? 💍` 
        : `💒 𝑪𝒐𝒏𝒈𝒓𝒂𝒕𝒔! ${name1} 𝒂𝒓 ${name2} 𝒆𝒓 𝒃𝒊𝒚𝒆 𝒉𝒐𝒍𝒐! 💖\n━━━━━━━━━━━━━━━\n💕 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;
    
    api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(pathImg)
    }, threadID, () => {
        [avatarOne, avatarTwo, pathImg].forEach(file => {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        });
    }, messageID);
};
