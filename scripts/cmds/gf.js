module.exports.config = {
    name: "gf",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑴𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒆 𝒑𝒂𝒊𝒓 𝒑𝒂𝒃𝒐 💞",
    category: "𝗜𝗠𝗔𝗚𝗘",
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
    const path = resolve(__dirname, 'cache/canvas', 'arr2.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/iaOiAXe.jpeg", path);
}

module.exports.onStart = async function({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    
    if (!mention[0]) return api.sendMessage("✨ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒋𝒐𝒏 𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒐𝒓𝒖𝒏! 💝", threadID, messageID);
    
    async function circle(image) {
        const img = await jimp.read(image);
        img.circle();
        return await img.getBufferAsync("image/png");
    }

    const one = senderID;
    const two = mention[0];
    const __root = path.resolve(__dirname, "cache", "canvas");

    try {
        let avatarOne = __root + `/avt_${one}.png`;
        let avatarTwo = __root + `/avt_${two}.png`;
        let background = __root + `/arr2.png`;
        
        // Download and process avatars
        let getAvatar = async (id, path) => {
            let response = await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, 
                { responseType: 'arraybuffer' });
            fs.writeFileSync(path, Buffer.from(response.data, 'utf-8'));
        };

        await Promise.all([
            getAvatar(one, avatarOne),
            getAvatar(two, avatarTwo)
        ]);

        // Create circular avatars
        let [circleOne, circleTwo, bg] = await Promise.all([
            circle(avatarOne),
            circle(avatarTwo),
            jimp.read(background)
        ]);

        circleOne = await jimp.read(circleOne);
        circleTwo = await jimp.read(circleTwo);

        // Composite images
        bg.composite(circleOne.resize(200, 200), 70, 110)
          .composite(circleTwo.resize(200, 200), 465, 110);

        const outputPath = __root + `/paired_${one}_${two}.png`;
        await bg.writeAsync(outputPath);

        // Send message with attachment
        api.sendMessage({
            body: `╔═══════❖•💘•❖═══════╗\n\n       𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍 𝑷𝒂𝒊𝒓𝒊𝒏𝒢 💞\n\n╚═══════❖•💘•❖═══════╝\n\n╔═══════❖•💘•❖═══════╗\n\n   𝑴𝒊𝒍𝒍 𝑮𝒂𝒚𝒊 𝒂𝒓 𝑻𝒖𝒎𝒊 💌\n\n╚═══════❖•💘•❖═══════╝\n\n💖 𝑻𝒖𝒎𝒂𝒓 𝑮𝒊𝒓𝒍𝒇𝒓𝒊𝒆𝒏𝒅 💖`,
            attachment: fs.createReadStream(outputPath)
        }, threadID, () => {
            // Clean up files
            [avatarOne, avatarTwo, outputPath].forEach(path => {
                if (fs.existsSync(path)) fs.unlinkSync(path);
            });
        }, messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ 𝑨𝒏 𝒆𝒓𝒓𝒐𝒓 𝒐𝒄𝒄𝒖𝒓𝒆𝒅 𝒘𝒉𝒊𝒍𝒆 𝒑𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆", threadID, messageID);
    }
};
