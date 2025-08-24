module.exports.config = {
    name: "sis",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙈𝙚𝙣𝙩𝙞𝙤𝙣 𝙠𝙖𝙧𝙖 𝙟𝙖𝙮𝙚𝙧 𝙥𝙖𝙞𝙧 𝙥𝙖𝙬𝙖",
    category: "𝙋𝙉𝙂",
    usages: "[@𝙢𝙚𝙣𝙩𝙞𝙤𝙣]",
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
    const pathFile = resolve(__dirname, 'cache', 'canvas', 'sis.png');

    // Ensure directory exists
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });

    // Download template if not exists (kept the same URL)
    if (!existsSync(pathFile)) {
        try {
            await downloadFile("https://i.imgur.com/n2FGJFe.jpg", pathFile);
        } catch (err) {
            // If download fails at load time, ignore — the command will report errors when used
            console.error("Failed to download sis.png:", err);
        }
    }
};

async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    // Ensure template exists
    const templatePath = __root + "/sis.png";
    if (!fs.existsSync(templatePath)) throw new Error("Template image not found: " + templatePath);

    // read base image
    let baseImg = await jimp.read(templatePath);
    let pathImg = __root + `/batman${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    try {
        // fetch avatar one
        const resOne = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
        fs.writeFileSync(avatarOne, Buffer.from(resOne.data));

        // fetch avatar two
        const resTwo = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
        fs.writeFileSync(avatarTwo, Buffer.from(resTwo.data));
    } catch (err) {
        // Clean up partial files
        if (fs.existsSync(avatarOne)) try { fs.unlinkSync(avatarOne); } catch(e){}
        if (fs.existsSync(avatarTwo)) try { fs.unlinkSync(avatarTwo); } catch(e){}
        throw new Error("Failed to download one or both avatars. " + err.message);
    }

    try {
        let circleOne = await jimp.read(await circle(avatarOne));
        let circleTwo = await jimp.read(await circle(avatarTwo));

        // Composite avatars onto template (kept original coordinates & sizes)
        baseImg.composite(circleOne.resize(191, 191), 93, 111).composite(circleTwo.resize(190, 190), 434, 107);

        // get buffer and write final image
        let raw = await baseImg.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);
    } catch (err) {
        // cleanup avatars if something fails
        if (fs.existsSync(avatarOne)) try { fs.unlinkSync(avatarOne); } catch(e){}
        if (fs.existsSync(avatarTwo)) try { fs.unlinkSync(avatarTwo); } catch(e){}
        throw err;
    }

    // remove temporary avatar files
    try { fs.unlinkSync(avatarOne); } catch(e){}
    try { fs.unlinkSync(avatarTwo); } catch(e){}

    return pathImg;
}

module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions || {});

    if (!mentions[0]) {
        return api.sendMessage("𝑬𝒌𝒕𝒊 𝒍𝒐𝒌𝒌𝒆 𝒎𝒆𝒏𝒕𝒊𝒐𝒏 𝒌𝒂𝒓𝒖𝒏", threadID, messageID);
    } else {
        const one = senderID;
        const two = mentions[0];

        try {
            const path = await makeImage({ one, two });
            const messageBody = "✧•❁𝑩𝒉𝒂𝒊-𝑩𝒂𝒉𝒂𝒏❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   𝑺𝒂𝒇𝒂𝒍 𝑷𝒆𝒚𝒂𝒓\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       👑 𝑴𝒊𝒍𝒍 𝑮𝒂𝒚𝒊 ❤\n\n𝑻𝒖𝒎𝒂𝒓 𝑩𝒐𝒏 🩷\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶";

            return api.sendMessage({
                body: messageBody,
                attachment: fs.createReadStream(path)
            }, threadID, () => {
                // delete generated image after sending
                try { fs.unlinkSync(path); } catch (e) { }
            }, messageID);
        } catch (err) {
            console.error(err);
            return api.sendMessage("দুঃখিত, ছবি তৈরিতে সমস্যা হয়েছে: " + err.message, threadID, messageID);
        }
    }
};
