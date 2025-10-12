const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "kiss",
        aliases: [],
        version: "2.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "💖 𝖨𝗌𝗁𝗊𝖾𝗋 𝗆𝗈𝗆𝖾𝗇𝗍! 𝖪𝗂𝗌𝗌 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝖻𝗒 𝗍𝖺𝗀𝗀𝗂𝗇𝗀 𝗍𝗁𝖾𝗆 💌"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼 𝗄𝗂𝗌𝗌 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗍𝖺𝗀𝗀𝖾𝖽 𝗉𝖾𝗋𝗌𝗈𝗇"
        },
        guide: {
            en: "{p}kiss [𝗍𝖺𝗀]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            const dirMaterial = __dirname + `/cache/`;
            const pathFile = path.resolve(__dirname, 'cache', 'hon0.jpeg');

            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
            }
            
            if (!fs.existsSync(pathFile)) {
                console.warn("💡 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗎𝗍 '𝗁𝗈𝗇𝟢.𝗃𝗉𝖾𝗀' 𝗂𝗇 𝗍𝗁𝖾 𝖼𝖺𝖼𝗁𝖾 𝖿𝗈𝗅𝖽𝖾𝗋!");
            }
        } catch (error) {
            console.error("💥 𝖮𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message, event, args, currenciesData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗉𝖺𝗍𝗁, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { threadID, senderID } = event;
            const mention = Object.keys(event.mentions);

            const one = senderID;
            const two = mention[0];

            const hc = Math.floor(Math.random() * 101);
            const rd = Math.floor(Math.random() * 100000) + 100000;

            // Increase user's in-bot currency if available
            try {
                if (currenciesData && typeof currenciesData.increaseMoney === 'function') {
                    await currenciesData.increaseMoney(senderID, parseInt(hc * rd));
                }
            } catch (currencyError) {
                console.warn("𝖢𝗎𝗋𝗋𝖾𝗇𝖼𝗒 𝖾𝗋𝗋𝗈𝗋:", currencyError);
            }

            if (!two) {
                return message.reply("💌 𝖣𝖺𝗒𝖺 𝖪𝗈𝗋𝖾 𝟣 𝗃𝗈𝗇 𝖪𝖾 𝗍𝖺𝗀 𝖪𝗈𝗋𝗎𝗇!");
            } else {
                const imagePath = await this.makeImage({ one, two });
                
                if (imagePath) {
                    await message.reply({
                        body: `💖 𝖨𝗌𝗁𝗊𝖾𝗋 𝖯𝗈𝗋𝗂𝗆𝖺𝗇: ${hc}%\n💸 𝖠𝗉𝗇𝖺𝖽𝖾𝗋 𝖩𝗈𝗇𝗇𝗈 𝖡𝗅𝖾𝗌𝗌𝗂𝗇𝗀: ${hc * rd} $ 💰\n🍀 𝖠𝗉𝗇𝖺𝖽𝖾𝗋 𝖩𝗈𝗇𝗇𝗈 𝖲𝗁𝗎𝖻𝖾𝖼𝖼𝗁𝖺 𝖱𝗈𝗄𝗁𝗎𝗇!`,
                        attachment: fs.createReadStream(imagePath)
                    });
                    
                    // Cleanup the generated image
                    try {
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                        }
                    } catch (cleanupError) {
                        console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
                    }
                } else {
                    await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗄𝗂𝗌𝗌 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
                }
            }
        } catch (error) {
            console.error("💥 𝖪𝗂𝗌𝗌 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    makeImage: async function({ one, two }) {
        const __root = path.resolve(__dirname, "cache");
        const pathImg = __root + `/hon0_${one}_${two}_${Date.now()}.png`;
        const avatarOne = __root + `/avt_${one}_${Date.now()}.png`;
        const avatarTwo = __root + `/avt_${two}_${Date.now()}.png`;

        try {
            // Check if template exists
            const templatePath = __root + "/hon0.jpeg";
            if (!fs.existsSync(templatePath)) {
                console.error("❌ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽:", templatePath);
                return null;
            }

            const hon_img = await jimp.read(templatePath);

            // Download avatars with error handling
            let avatarOneBuffer, avatarTwoBuffer;
            
            try {
                const avatarOneResponse = await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                    responseType: 'arraybuffer',
                    timeout: 15000
                });
                avatarOneBuffer = Buffer.from(avatarOneResponse.data, 'utf-8');
                fs.writeFileSync(avatarOne, avatarOneBuffer);
            } catch (avatarOneError) {
                console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${one}:`, avatarOneError.message);
                return null;
            }

            try {
                const avatarTwoResponse = await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { 
                    responseType: 'arraybuffer',
                    timeout: 15000
                });
                avatarTwoBuffer = Buffer.from(avatarTwoResponse.data, 'utf-8');
                fs.writeFileSync(avatarTwo, avatarTwoBuffer);
            } catch (avatarTwoError) {
                console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 ${two}:`, avatarTwoError.message);
                return null;
            }

            // Make circular avatars
            let circleOne, circleTwo;
            try {
                circleOne = await jimp.read(await this.circle(avatarOne));
                circleTwo = await jimp.read(await this.circle(avatarTwo));
            } catch (circleError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌:", circleError);
                return null;
            }

            // Composite avatars on template
            try {
                hon_img.resize(700, 440)
                    .composite(circleOne.resize(150, 150), 390, 23)
                    .composite(circleTwo.resize(150, 150), 115, 130);

                const raw = await hon_img.getBufferAsync("image/png");
                fs.writeFileSync(pathImg, raw);

                console.log(`✅ 𝖪𝗂𝗌𝗌 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒: ${pathImg}`);
                return pathImg;
            } catch (compositeError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾:", compositeError);
                return null;
            }

        } catch (error) {
            console.error("💥 𝖬𝖺𝗄𝖾𝖨𝗆𝖺𝗀𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            return null;
        } finally {
            // Cleanup temporary files
            try {
                if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
                if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
            } catch (cleanupError) {
                console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
            }
        }
    },

    circle: async function(imagePath) {
        try {
            const image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾:", error);
            throw error;
        }
    }
};
