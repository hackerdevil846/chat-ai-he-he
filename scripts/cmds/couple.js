module.exports.config = {
    name: "couple",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💑 𝑺𝒉𝒐𝒘 𝒍𝒐𝒗𝒆 𝒄𝒐𝒎𝒑𝒂𝒕𝒊𝒃𝒊𝒍𝒊𝒕𝒚",
    category: "𝗟𝗢𝗩𝗘",
    usages: "[@tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async ({ configValue }) => {
    const path = require("path");
    const fs = require("fs-extra");
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const filePath = path.resolve(__dirname, 'cache/canvas', 'seophi.png');
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(filePath)) await downloadFile("https://i.imgur.com/hmKmmam.jpg", filePath);
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let batgiam_img = await jimp.read(__root + "/seophi.png");
    let pathImg = __root + `/batman${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;
    
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    batgiam_img.resize(1024, 712).composite(circleOne.resize(200, 200), 527, 141).composite(circleTwo.resize(200, 200), 389, 407);
    
    let raw = await batgiam_img.getBufferAsync("image/png");
    
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

module.exports.onStart = async function({ api, event, args, Users, Threads, Currencies, permssion }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    
    if (!args[0]) 
        return api.sendMessage("💝 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝐚 𝐮𝐬𝐞𝐫 𝐭𝐨 𝐬𝐞𝐞 𝐥𝐨𝐯𝐞 𝐜𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲!", threadID, messageID);
    
    const mention = Object.keys(event.mentions)[0];
    const tag = event.mentions[mention].replace("@", "");
    let one = senderID, two = mention;
    
    return makeImage({ one, two }).then(path => 
        api.sendMessage({ 
            body: `💑 𝐋𝐨𝐯𝐞 𝐂𝐨𝐦𝐩𝐚𝐭𝐢𝐛𝐢𝐥𝐢𝐭𝐲 𝐁𝐞𝐭𝐰𝐞𝐞𝐧 𝐘𝐨𝐮 𝐀𝐧𝐝 ${tag}\n❣️ 𝗠𝗮𝘆 𝘆𝗼𝘂𝗿 𝗹𝗼𝘃𝗲 𝘀𝘁𝗼𝗿𝘆 𝗯𝗲 𝗳𝗼𝗿𝗲𝘃𝗲𝗿 ❣️`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(path) 
        }, threadID, () => fs.unlinkSync(path), messageID)
    );
}
