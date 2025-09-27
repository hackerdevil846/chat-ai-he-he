const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const jimp = require('jimp');

module.exports = {
    config: {
        name: "fuck",
        aliases: ["fumeme", "fumoment"],
        version: "3.1.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "Create a funny meme with you and the mentioned user!"
        },
        longDescription: {
            en: "Create a funny meme with you and the mentioned user!"
        },
        guide: {
            en: "{p}fuck @mention"
        },
        dependencies: {
            "fs-extra": "",
            "path": "",
            "axios": "",
            "jimp": ""
        }
    },

    onLoad: async function () {
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
            console.error("Error during onLoad:", error);
        }
    },

    onStart: async function ({ message, event, args }) {
        const { threadID, senderID } = event;

        try {
            // Dependency check
            try {
                require("fs-extra");
                require("path");
                require("axios");
                require("jimp");
            } catch (e) {
                return message.reply("Missing dependencies: fs-extra, path, axios, jimp");
            }

            // Check for mentions
            if (!event.mentions || Object.keys(event.mentions).length === 0) {
                return message.reply("Please mention someone to use this command!");
            }

            const one = senderID;
            const two = Object.keys(event.mentions)[0];

            // Prevent self-mention
            if (one === two) {
                return message.reply("You can't mention yourself!");
            }

            // Send processing message
            await message.reply("Creating your meme... Please wait!");

            // Generate meme
            const imagePath = await this.makeImage({ one, two });

            // Send result
            await message.reply({
                body: "Here's your special meme moment! 💖",
                attachment: fs.createReadStream(imagePath)
            });

            // Cleanup temp files
            try {
                fs.unlinkSync(imagePath);
                fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${one}.png`));
                fs.unlinkSync(path.join(__dirname, 'cache', 'canvas', `avt_${two}.png`));
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
            }

        } catch (error) {
            console.error("Command error:", error);
            await message.reply("Failed to generate the meme. Please try again later.");
        }
    },

    makeImage: async function ({ one, two }) {
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
            console.error("Image creation error:", error);
            throw new Error("Failed to create meme image");
        }
    },

    downloadAvatar: async function (userID, savePath) {
        try {
            const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 10000
            });

            await fs.writeFile(savePath, Buffer.from(response.data, 'binary'));
            return savePath;
        } catch (error) {
            console.error(`Avatar download failed for ${userID}:`, error);
            throw new Error("Failed to download profile picture");
        }
    },

    createCircularImage: async function (imagePath) {
        try {
            const image = await jimp.read(imagePath);
            image.circle();
            return image;
        } catch (error) {
            console.error(`Image processing failed for ${imagePath}:`, error);
            throw new Error("Failed to create circular avatar");
        }
    },

    downloadFile: async function (url, savePath) {
        try {
            const response = await axios.get(url, { responseType: 'stream' });
            const writer = fs.createWriteStream(savePath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`File download failed from ${url}:`, error);
            throw new Error("Failed to download template image");
        }
    }
};
