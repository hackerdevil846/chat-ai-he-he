const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp");

module.exports.config = {
    name: "love6",
    version: "1.0.0",
    permssion: 0,
    credits: "Asif",
    description: "Create a romantic love image with two users",
    prefix: true,
    category: "Love",
    usages: "[tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onStart = () => true;

module.exports.onLoad = async function () {
    try {
        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template.png");

        if (!fs.existsSync(cacheDir)) {
            await fs.mkdir(cacheDir, { recursive: true });
        }

        if (!fs.existsSync(baseImagePath)) {
            const url = 'https://drive.google.com/uc?export=download&id=1BZu-1GS5DMiuQHtcdZNmY4-ayiOwVyI3';
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            await fs.writeFile(baseImagePath, response.data);
            console.log("Base image downloaded successfully");
        }
    } catch (error) {
        console.error("Error during module loading:", error);
    }
};

module.exports.run = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (!Object.keys(mentions).length) {
        return api.sendMessage('Please tag 1 person', threadID, messageID);
    }

    const [mentionedUserID] = Object.keys(mentions);
    const mentionedName = mentions[mentionedUserID].replace(/@/g, '');

    try {
        const imageBuffer = await generateLoveImage(senderID, mentionedUserID);
        const message = {
            body: `🫄 ${mentionedName} love you so much🤗🥀`,
            mentions: [{
                tag: mentionedName,
                id: mentionedUserID
            }],
            attachment: fs.createReadStream(imageBuffer)
        };

        api.sendMessage(message, threadID, () => {
            try {
                fs.unlinkSync(imageBuffer);
            } catch (e) {
                console.error("Error deleting temporary file:", e);
            }
        }, messageID);
    } catch (error) {
        console.error("Error in love command:", error);
        api.sendMessage("Failed to generate love image. Please try again later.", threadID, messageID);
    }
};

async function generateLoveImage(user1ID, user2ID) {
    const cacheDir = path.join(__dirname, 'cache');
    const baseImagePath = path.join(cacheDir, 'love_template.png');

    if (!fs.existsSync(baseImagePath)) {
        throw new Error("Base image not found. Please try again later.");
    }

    try {
        let baseImage = await Jimp.read(baseImagePath);

        const downloadAvatar = async (userID) => {
            const avatarPath = path.join(cacheDir, `avatar_${userID}.png`);
            const avatarSources = [
                `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                `https://graph.facebook.com/${userID}/picture?width=512&height=512`,
                `https://graph.facebook.com/v19.0/${userID}/picture?width=512&height=512`
            ];

            for (const source of avatarSources) {
                try {
                    const response = await axios.get(source, {
                        responseType: 'arraybuffer',
                        timeout: 10000
                    });
                    if (response.data) {
                        await fs.writeFile(avatarPath, Buffer.from(response.data));
                        return Jimp.read(avatarPath);
                    }
                } catch (error) {
                    console.log(`Avatar source failed: ${source} - ${error.message}`);
                }
            }
            throw new Error(`All avatar sources failed for user ${userID}`);
        };

        const [avatar1, avatar2] = await Promise.all([
            downloadAvatar(user1ID),
            downloadAvatar(user2ID)
        ]);

        const [processedAvatar1, processedAvatar2] = await Promise.all([
            processAvatar(avatar1),
            processAvatar(avatar2)
        ]);

        const outputFilename = `love_${user1ID}_${user2ID}_${Date.now()}.png`;
        const outputPath = path.join(cacheDir, outputFilename);

        await baseImage
            .resize(1200, 800)
            .composite(processedAvatar1.resize(180, 180), 300, 350)
            .composite(processedAvatar2.resize(180, 180), 800, 350)
            .writeAsync(outputPath);

        [user1ID, user2ID].forEach(id => {
            const avatarPath = path.join(cacheDir, `avatar_${id}.png`);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        });

        return outputPath;
    } catch (error) {
        console.error("Error generating love image:", error);
        throw error;
    }
}

async function processAvatar(avatar) {
    try {
        const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);
        avatar.crop(0, 0, size, size).resize(size, size);
        avatar.circle();

        const border = new Jimp(avatar.bitmap.width + 10, avatar.bitmap.height + 10, 0xFFFFFFFF);
        border.circle();
        border.composite(avatar, 5, 5);

        return border.resize(200, 200);
    } catch (error) {
        console.error("Error processing avatar:", error);
        throw error;
    }
}
