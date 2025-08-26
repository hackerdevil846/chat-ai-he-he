module.exports.config = {
    name: "pair8",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Mathematical Bold Italic
    description: "𝑴𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒂𝒓𝒂 𝒃𝒂𝒏𝒅𝒆𝒓 𝒔𝒂𝒕𝒉𝒆 𝒋𝒖𝒕𝒊 𝒃𝒂𝒏𝒅𝒉𝒂𝒓 𝒌𝒉𝒆𝒍𝒂", // Banglish in Mathematical Bold Italic
    category: "img",
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
    const path = require('path');
    const fs = require('fs-extra');
    const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
    const imagePath = path.resolve(dirMaterial, 'ar1r2.png');
    
    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    
    if (!fs.existsSync(imagePath)) {
        const axios = require('axios');
        try {
            const response = await axios.get("https://i.imgur.com/iaOiAXe.jpeg", { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, Buffer.from(response.data));
        } catch (error) {
            console.error("Error downloading template image:", error);
        }
    }
};

async function circle(imagePath) {
    const jimp = require('jimp');
    const image = await jimp.read(imagePath);
    image.circle();
    return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const path = require('path');
    const fs = require('fs-extra');
    const axios = require('axios');
    const jimp = require('jimp');
    
    const __root = path.resolve(__dirname, "cache", "canvas");
    const templatePath = path.resolve(__root, 'ar1r2.png');
    const outputPath = path.resolve(__root, `pair_${one}_${two}.png`);
    const avatarOnePath = path.resolve(__root, `avt_${one}.png`);
    const avatarTwoPath = path.resolve(__root, `avt_${two}.png`);

    // Download and process first avatar
    const avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
        { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne, 'binary'));
    
    // Download and process second avatar
    const avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
        { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo, 'binary'));
    
    // Process images
    const template = await jimp.read(templatePath);
    const circledAvatarOne = await jimp.read(await circle(avatarOnePath));
    const circledAvatarTwo = await jimp.read(await circle(avatarTwoPath));
    
    // Composite avatars onto template
    template.composite(circledAvatarOne.resize(200, 200), 70, 110)
           .composite(circledAvatarTwo.resize(200, 200), 465, 110);
    
    // Save final image
    await template.writeAsync(outputPath);
    
    // Cleanup temp files
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);
    
    return outputPath;
}

module.exports.onStart = async function({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    if (!mention.length) {
        return api.sendMessage("❌ | 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏", threadID, messageID);
    }
    
    try {
        const one = senderID;
        const two = mention[0];
        const pairedImage = await makeImage({ one, two });
        
        const axios = require('axios');
        const userName = (await axios.get(
            `https://graph.facebook.com/${two}?fields=name&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        )).data.name;
        
        const fs = require('fs-extra');
        api.sendMessage({
            body: `✨╭──•◈•───✮───•◈•──╮\n\n  「 𝐒𝐚𝐩𝐡𝐚𝐥 𝐉𝐮𝐭𝐢𝐛𝐚𝐧𝐝𝐡𝐚𝐧 」\n\n╰──•◈•───✮───•◈•──╯\n\n🥀 | 𝐏𝐚𝐢𝐫𝐞𝐝 𝐰𝐢𝐭𝐡: @${userName}`,
            mentions: [{
                tag: userName,
                id: two
            }],
            attachment: fs.createReadStream(pairedImage)
        }, threadID, () => fs.unlinkSync(pairedImage), messageID);
        
    } catch (error) {
        console.error(error);
        return api.sendMessage("⚠️ | 𝐄𝐫𝐫𝐨𝐫 𝐢𝐧 𝐢𝐦𝐚𝐠𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠!", threadID, messageID);
    }
};
