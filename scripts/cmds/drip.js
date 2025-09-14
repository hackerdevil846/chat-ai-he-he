const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports.config = {
    name: "drip",
    aliases: ["drippic", "stylish"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "✨ 𝐷𝑟𝑖𝑝 𝑒𝑓𝑓𝑒𝑐𝑡 𝑜𝑛 𝑦𝑜𝑢𝑟 𝑖𝑚𝑎𝑔𝑒"
    },
    longDescription: {
        en: "𝐴𝑑𝑑𝑠 𝑑𝑟𝑖𝑝 𝑒𝑓𝑓𝑒𝑐𝑡 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒"
    },
    guide: {
        en: "{p}drip"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    }
};

module.exports.circle = async (image) => {
    const imageBuffer = await jimp.read(image);
    imageBuffer.circle();
    return await imageBuffer.getBufferAsync("image/png");
};

module.exports.onStart = async function({ message, event }) {
    try {
        const pathImg = __dirname + `/cache/${event.threadID}_${event.senderID}.png`;
        const pathAva = __dirname + `/cache/avt${event.senderID}.png`;

        // Get user's avatar
        const Avatar = (await axios.get(
            `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            { responseType: "arraybuffer" }
        )).data;
        
        await fs.writeFileSync(pathAva, Buffer.from(Avatar, 'utf-8'));

        // Process avatar to circle
        const avatar = await this.circle(pathAva);
        
        // Get drip template
        const dripTemplate = await axios.get("https://i.imgur.com/e3YvQWP.jpg", {
            responseType: "arraybuffer"
        });
        
        await fs.writeFileSync(pathImg, Buffer.from(dripTemplate.data, "utf-8"));

        // Compose image
        const template = await loadImage(pathImg);
        const ava = await loadImage(avatar);
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(ava, 320, 80, 239, 239);

        // Save and send
        const result = canvas.toBuffer();
        await fs.writeFileSync(pathImg, result);
        await fs.unlinkSync(pathAva);

        await message.reply({
            body: `✨ 𝐷𝑟𝑖𝑝 𝐸𝑓𝑓𝑒𝑐𝑡 𝐼𝑚𝑎𝑔𝑒 𝐶𝑟𝑒𝑎𝑡𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!⚡`,
            attachment: fs.createReadStream(pathImg)
        });

        await fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐷𝑟𝑖𝑝 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
    }
};
