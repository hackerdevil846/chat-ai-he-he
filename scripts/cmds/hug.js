const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "hug",
    aliases: ["embrace", "cuddle"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑖𝑚𝑎𝑔𝑒",
    shortDescription: {
        en: "𝐽ℎ𝑎𝑛𝑘𝑎𝑤 𝑑𝑒𝑘ℎ𝑎𝑜 🥰"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑎 ℎ𝑢𝑔 𝑔𝑖𝑓 𝑤𝑖𝑡ℎ 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟'𝑠 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒𝑠"
    },
    guide: {
        en: "{p}hug [@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = require("path");
    const { existsSync, mkdirSync } = require("fs-extra");
    const dirMaterial = __dirname + `/cache/canvas/`;
    const canvasPath = resolve(__dirname, 'cache/canvas', 'hugv1.png');
    
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(canvasPath)) {
        try {
            const { data } = await axios.get("https://i.ibb.co/3YN3T1r/q1y28eqblsr21.jpg", { responseType: "arraybuffer" });
            fs.writeFileSync(canvasPath, Buffer.from(data, 'utf-8'));
        } catch (error) {
            console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 ℎ𝑢𝑔 𝑖𝑚𝑎𝑔𝑒:", error);
        }
    }
};

module.exports.onStart = async function ({ event, api, args, message }) {
    try {
        const { threadID, messageID, senderID } = event;
        const mention = Object.keys(event.mentions);
        
        if (!mention[0]) {
            return message.reply("❌ 𝐷𝑎𝑦𝑎 𝑘𝑜𝑟𝑒 𝑒𝑘𝑗𝑜𝑛 𝑘𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑘𝑜𝑟𝑢𝑛");
        }
        
        const one = senderID;
        const two = mention[0];
        const __root = path.resolve(__dirname, "cache", "canvas");

        let hug_img = await jimp.read(__root + "/hugv1.png");
        let pathImg = __root + `/hug_${one}_${two}.png`;
        let avatarOne = __root + `/avt_${one}.png`;
        let avatarTwo = __root + `/avt_${two}.png`;
        
        const getAvatar = async (uid, path) => {
            try {
                const { data } = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
                fs.writeFileSync(path, Buffer.from(data, 'utf-8'));
            } catch (error) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑎𝑣𝑎𝑡𝑎𝑟:", error);
                throw error;
            }
        };

        await Promise.all([
            getAvatar(one, avatarOne),
            getAvatar(two, avatarTwo)
        ]);

        const circle = async (imagePath) => {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        };

        const [circleOne, circleTwo] = await Promise.all([
            circle(avatarOne),
            circle(avatarTwo)
        ]);

        hug_img.composite(await jimp.read(circleOne), 320, 100)
               .composite(await jimp.read(circleTwo), 280, 280);
        
        await hug_img.writeAsync(pathImg);
        
        await message.reply({
            body: `💖 𝐴𝑝𝑛𝑎𝑟 𝑗ℎ𝑎𝑛𝑘𝑎𝑤 𝑛𝑖𝑦𝑒!\n${event.mentions[two].replace('@', '')} → ${event.senderID.replace('@', '')}`,
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up temporary files
        fs.unlinkSync(pathImg);
        fs.unlinkSync(avatarOne);
        fs.unlinkSync(avatarTwo);

    } catch (error) {
        console.error("𝐻𝑢𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑟𝑒 𝑘𝑖ℎ𝑜 𝑔𝑒𝑙𝑜 𝑒𝑟𝑟𝑜𝑟!");
    }
};
