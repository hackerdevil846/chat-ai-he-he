const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

module.exports.config = {
    name: "fuck",
    aliases: ["fumeme", "fumoment"],
    version: "3.1.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "😂 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟!"
    },
    longDescription: {
        en: "😂 𝐶𝑟𝑒𝑎𝑡𝑒 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑 𝑢𝑠𝑒𝑟!"
    },
    guide: {
        en: "{p}fuck @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    dependencies: {
        "fs-extra": "",
        "path": "",
        "axios": "",
        "jimp": ""
    }
};

module.exports.onLoad = async function () {
    const dirMaterial = path.join(__dirname, 'cache', 'canvas');
    const pathToImage = path.join(dirMaterial, 'fuckv3.png');

    try {
        if (!fs.existsSync(dirMaterial)) {
            await fs.mkdirp(dirMaterial);
        }

        if (!fs.existsSync(pathToImage)) {
            await this.downloadFile(
                "https://i.ibb.co/TW9Kbwr/images-2022-08-14-T183542-356.jpg",
                pathToImage
            );
        }
    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑑𝑢𝑟𝑖𝑛𝑔 𝑜𝑛𝐿𝑜𝑎𝑑:", error);
    }
};

module.exports.onStart = async function ({ message, event, args }) {
    const { threadID, messageID, senderID } = event;

    try {
        // Check for mentions
        if (!event.mentions || Object.keys(event.mentions).length === 0) {
            return message.reply("⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑜 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!", threadID, messageID);
        }

        const one = senderID;
        const two = Object.keys(event.mentions)[0];

        // Prevent self-mention
        if (one === two) {
            return message.reply("😂 𝑌𝑜𝑢 𝑐𝑎𝑛'𝑡 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓!", threadID, messageID);
        }

        // Send processing message
        message.reply("⏳ 𝐶𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑚𝑒𝑚𝑒... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!", threadID, messageID);

        // Generate meme
        const imagePath = await this.makeImage({ one, two });

        // Send result
        return message.reply({
            body: "🤣 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑠𝑝𝑒𝑐𝑖𝑎𝑙 𝑚𝑒𝑚𝑒 𝑚𝑜𝑚𝑒𝑛𝑡! 💖",
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => {
            // Cleanup temp files
            try {
                fs.unlinkSync(imagePath);
                fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${one}.png`));
                fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${two}.png`));
            } catch (cleanupError) {
                console.error("⚠️ 𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑒𝑟𝑟𝑜𝑟:", cleanupError);
            }
        }, messageID);

    } catch (error) {
        console.error("❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("🚫 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑡ℎ𝑒 𝑚𝑒𝑚𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.", threadID, messageID);
    }
};

module.exports.makeImage = async function ({ one, two }) {
    const canvasDir = path.join(__dirname, 'cache', 'canvas');
    const outputPath = path.join(canvasDir, `fuck_${one}_${two}.png`);
    const avatarOnePath = path.join(canvasDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(canvasDir, `avt_${two}.png`);

    try {
        // Load template
        const templatePath = path.join(canvasDir, 'fuckv3.png');
        const memeTemplate = await jimp.read(templatePath);

        // Process first avatar
        const avatarOne = await this.downloadAvatar(one, avatarOnePath);
        const circleOne = await this.createCircularImage(avatarOne);
        memeTemplate.composite(
            await jimp.read(circleOne).resize(100, 100),
            20, 300
        );

        // Process second avatar
        const avatarTwo = await this.downloadAvatar(two, avatarTwoPath);
        const circleTwo = await this.createCircularImage(avatarTwo);
        memeTemplate.composite(
            await jimp.read(circleTwo).resize(150, 150),
            100, 20
        );

        // Save final image
        await memeTemplate.writeAsync(outputPath);
        return outputPath;

    } catch (error) {
        console.error("❌ 𝐼𝑚𝑎𝑔𝑒 𝑐𝑟𝑒𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑚𝑒𝑚𝑒 𝑖𝑚𝑎𝑔𝑒");
    }
};

module.exports.downloadAvatar = async function (userID, savePath) {
    try {
        const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 10000
        });

        await fs.writeFile(savePath, Buffer.from(response.data, 'binary'));
        return savePath;
    } catch (error) {
        console.error(`❌ 𝐴𝑣𝑎𝑡𝑎𝑟 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 ${userID}:`, error);
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒");
    }
};

module.exports.createCircularImage = async function (imagePath) {
    try {
        const image = await jimp.read(imagePath);
        image.circle();
        return image;
    } catch (error) {
        console.error(`❌ 𝐼𝑚𝑎𝑔𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 ${imagePath}:`, error);
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑖𝑟𝑐𝑢𝑙𝑎𝑟 𝑎𝑣𝑎𝑡𝑎𝑟");
    }
};

module.exports.downloadFile = async function (url, savePath) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ 𝐹𝑖𝑙𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑟𝑜𝑚 ${url}:`, error);
        throw new Error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒");
    }
};
