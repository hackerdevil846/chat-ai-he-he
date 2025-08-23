module.exports.config = {
    name: "hand",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🤝 𝑻𝒘𝒐 𝒑𝒆𝒐𝒑𝒍𝒆 𝒉𝒐𝒍𝒅𝒊𝒏𝒈 𝒉𝒂𝒏𝒅𝒔 𝒄𝒓𝒆𝒂𝒕𝒐𝒓",
    category: "𝑙𝑜𝑣𝑒",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function() {
    const { createCanvas, loadImage } = global.nodemodule["canvas"];
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    
    const dirMaterial = resolve(__dirname, 'cache', 'canvas');
    const bgPath = resolve(dirMaterial, 'hand_bg.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(bgPath)) {
        await downloadFile("https://i.imgur.com/vcG4det.jpg", bgPath);
    }
};

async function makeImage(one, two) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const { createCanvas, loadImage } = global.nodemodule["canvas"];
    
    const __root = path.resolve(__dirname, "cache", "canvas");
    const bgPath = path.resolve(__root, 'hand_bg.png');
    const outputPath = path.resolve(__root, `hand_${one}_${two}.png`);
    
    // Download profile pictures
    const [avatarOne, avatarTwo] = await Promise.all([
        axios.get(`https://graph.facebook.com/${one}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' }),
        axios.get(`https://graph.facebook.com/${two}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })
    ]);

    // Process images with Canvas
    const canvas = createCanvas(700, 440);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    const bg = await loadImage(bgPath);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
    // Draw circular profile pictures
    const drawAvatar = async (img, x, y, size) => {
        const avatar = await loadImage(img);
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, y, size, size);
    };

    await drawAvatar(Buffer.from(avatarOne.data), 280, 90, 60); // Position 1
    await drawAvatar(Buffer.from(avatarTwo.data), 40, 130, 50); // Position 2
    
    // Save final image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    return outputPath;
}

module.exports.run = async function({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    
    if (!args[0]) return api.sendMessage("🌸 𝑷𝒍𝒆𝒂𝒔𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒔𝒐𝒎𝒆𝒐𝒏𝒆 𝒕𝒐 𝒉𝒐𝒍𝒅 𝒉𝒂𝒏𝒅𝒔!", threadID, messageID);
    
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒎𝒆𝒏𝒕𝒊𝒐𝒏, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒂𝒈 𝒂 𝒖𝒔𝒆𝒓!", threadID, messageID);
    
    const tag = event.mentions[mention].replace("@", "");
    
    try {
        const imagePath = await makeImage(senderID, mention);
        
        return api.sendMessage({ 
            body: `🤝 𝑯𝒐𝒍𝒅𝒊𝒏𝒈 𝒚𝒐𝒖𝒓 𝒉𝒂𝒏𝒅 𝒇𝒐𝒓𝒆𝒗𝒆𝒓 ${tag}!\n💝 𝑫𝒐𝒏'𝒕 𝒍𝒆𝒕 𝒈𝒐 𝒎𝒚 𝒍𝒐𝒗𝒆...`,
            mentions: [{ tag, id: mention }],
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => fs.unlinkSync(imagePath), messageID);
        
    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆, 𝒑𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏!", threadID, messageID);
    }
};
