const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "love",
        aliases: [],
        version: "2.6.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑙𝑜𝑣𝑒",
        shortDescription: {
            en: "𝖯𝗋𝖾𝗆 𝖾𝗋 𝗂𝗆𝖺𝗀𝖾 𝖻𝖺𝗇𝖺𝗈"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗍𝖺𝗀𝗀𝖾𝖽 𝗎𝗌𝖾𝗋"
        },
        guide: {
            en: "{p}love [𝗍𝖺𝗀]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async () => {
        try {
            const dirMaterial = path.resolve(__dirname, 'cache', 'canvas');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(dirMaterial)) {
                fs.mkdirSync(dirMaterial, { recursive: true });
                console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾/𝖼𝖺𝗇𝗏𝖺𝗌 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
            }

            const templatePath = path.resolve(dirMaterial, 'love2.jpg');
            if (!fs.existsSync(templatePath)) {
                console.warn("⚠️ 𝖶𝖺𝗋𝗇𝗂𝗇𝗀: 𝖼𝖺𝖼𝗁𝖾/𝖼𝖺𝗇𝗏𝖺𝗌/𝗅𝗈𝗏𝖾𝟤.𝗃𝗉𝗀 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 𝗅𝗈𝗏𝖾𝟤.𝗃𝗉𝗀 𝗍𝗈 𝖼𝖺𝖼𝗁𝖾/𝖼𝖺𝗇𝗏𝖺𝗌/");
            }
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:", error);
        }
    },

    onStart: async function ({ event, message, usersData }) {
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

            const { senderID } = event;

            if (!event.mentions || Object.keys(event.mentions).length === 0) {
                return message.reply("⚠️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾. 💕");
            }

            const mentionedIDs = Object.keys(event.mentions);
            const targetID = mentionedIDs[0];
            
            // Get user names properly
            let displayName;
            try {
                const userInfo = await usersData.get(targetID);
                displayName = userInfo?.name || event.mentions[targetID] || "𝖴𝗌𝖾𝗋";
            } catch (error) {
                displayName = event.mentions[targetID] || "𝖴𝗌𝖾𝗋";
            }
            
            // Clean the display name
            displayName = String(displayName).replace(/@/g, "").trim();

            const one = senderID;
            const two = targetID;

            // Check if template exists
            const templatePath = path.resolve(__dirname, "cache", "canvas", "love2.jpg");
            if (!fs.existsSync(templatePath)) {
                return message.reply("❌ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖺𝖽𝖽 𝗅𝗈𝗏𝖾𝟤.𝗃𝗉𝗀 𝗍𝗈 𝖼𝖺𝖼𝗁𝖾/𝖼𝖺𝗇𝗏𝖺𝗌/ 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const loadingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾... 💖");

            try {
                const imagePath = await this.makeImage({ one, two });
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply({
                    body: `💖 ${displayName} 𝗍𝗎𝗆𝗂 𝖺𝗆𝖺𝗋 𝗏𝖺𝗅𝗈𝖻𝖺𝗌𝖺 𝖾𝗄𝗍𝗎 𝖻𝖾𝗌𝗁𝗂 💕\n━━━━━━━━━━━━━━━━`,
                    mentions: [{ tag: displayName, id: targetID }],
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up image file
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                }

            } catch (err) {
                console.error("💥 𝖨𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", err);
                
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                return message.reply("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }
        } catch (error) {
            console.error("💥 𝖫𝗈𝗏𝖾 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
        }
    },

    makeImage: async function({ one, two }) {
        const __root = path.resolve(__dirname, "cache", "canvas");
        const templatePath = path.join(__root, "love2.jpg");

        if (!fs.existsSync(templatePath)) {
            throw new Error("𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗅𝗈𝗏𝖾𝟤.𝗃𝗉𝗀 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝖼𝖺𝖼𝗁𝖾/𝖼𝖺𝗇𝗏𝖺𝗌/");
        }

        const outputPath = path.join(__root, `love2_${one}_${two}_${Date.now()}.png`);
        const avatarOnePath = path.join(__root, `avt_${one}_${Date.now()}.png`);
        const avatarTwoPath = path.join(__root, `avt_${two}_${Date.now()}.png`);

        let template;
        try {
            template = await jimp.read(templatePath);
        } catch (templateError) {
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾: ${templateError.message}`);
        }

        const fbTokenPart = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
        const urlOne = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbTokenPart}`;
        const urlTwo = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbTokenPart}`;

        let avatarOneBuffer, avatarTwoBuffer;

        try {
            const responseOne = await axios.get(urlOne, { 
                responseType: 'arraybuffer',
                timeout: 15000 
            });
            avatarOneBuffer = responseOne.data;
            fs.writeFileSync(avatarOnePath, Buffer.from(avatarOneBuffer, 'binary'));
        } catch (avatarOneError) {
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${one}: ${avatarOneError.message}`);
        }

        try {
            const responseTwo = await axios.get(urlTwo, { 
                responseType: 'arraybuffer',
                timeout: 15000 
            });
            avatarTwoBuffer = responseTwo.data;
            fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwoBuffer, 'binary'));
        } catch (avatarTwoError) {
            // Clean up first avatar if second fails
            try { if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath); } catch (e) {}
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${two}: ${avatarTwoError.message}`);
        }

        let circleOne, circleTwo;
        try {
            const circleOneBuf = await this.circle(avatarOnePath);
            const circleTwoBuf = await this.circle(avatarTwoPath);
            circleOne = await jimp.read(circleOneBuf);
            circleTwo = await jimp.read(circleTwoBuf);
        } catch (circleError) {
            // Clean up avatar files
            try { if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath); } catch (e) {}
            try { if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath); } catch (e) {}
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝖺𝗏𝖺𝗍𝖺𝗋𝗌: ${circleError.message}`);
        }

        try {
            template
                .composite(circleOne.resize(270, 270), 800, 100)
                .composite(circleTwo.resize(300, 300), 205, 300);

            const raw = await template.getBufferAsync("image/png");
            fs.writeFileSync(outputPath, raw);
        } catch (compositeError) {
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝖾 𝗂𝗆𝖺𝗀𝖾: ${compositeError.message}`);
        }

        // Clean up temporary avatar files
        try { if (fs.existsSync(avatarOnePath)) fs.unlinkSync(avatarOnePath); } catch (e) {}
        try { if (fs.existsSync(avatarTwoPath)) fs.unlinkSync(avatarTwoPath); } catch (e) {}

        return outputPath;
    },

    circle: async function(imagePath) {
        try {
            let image = await jimp.read(imagePath);
            image.circle();
            return await image.getBufferAsync("image/png");
        } catch (error) {
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾: ${error.message}`);
        }
    }
};
