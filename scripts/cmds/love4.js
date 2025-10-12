const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
    config: {
        name: "love4",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝖿𝗈𝗋 𝗍𝗐𝗈 𝗎𝗌𝖾𝗋𝗌 💖"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗍𝗐𝗈 𝗎𝗌𝖾𝗋𝗌' 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾𝗌"
        },
        guide: {
            en: "{p}love4 [@𝗍𝖺𝗀]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onLoad: async function () {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
                return;
            }

            const cacheDir = path.join(__dirname, "cache");
            const baseImagePath = path.join(cacheDir, "love_template.png");

            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }

                if (!fs.existsSync(baseImagePath)) {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗅𝗈𝗏𝖾 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...");
                    const response = await axios({
                        method: "get",
                        url: "https://drive.google.com/uc?export=download&id=1ZGGhBH6ed8v4dku83G4NbxuPtNmN2iW9",
                        responseType: "arraybuffer",
                        timeout: 30000,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                        }
                    });
                    
                    if (response.data && response.data.length > 1000) {
                        fs.writeFileSync(baseImagePath, response.data);
                        console.log("✅ 𝖫𝗈𝗏𝖾 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    } else {
                        throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝖺𝗍𝖺");
                    }
                }
            } catch (loadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗎𝗋𝗂𝗇𝗀 𝗈𝗇𝖫𝗈𝖺𝖽:", loadError.message);
            }
        } catch (error) {
            console.error("💥 𝖮𝗇𝖫𝗈𝖺𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ message, event, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { senderID, mentions, threadID } = event;

            if (Object.keys(mentions).length === 0) {
                return message.reply("📍 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝖺𝗀 1 𝗉𝖾𝗋𝗌𝗈𝗇 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾!");
            }

            const [mentionId] = Object.keys(mentions);
            const mentionName = mentions[mentionId].replace(/@/g, "").trim();

            // Don't allow tagging yourself
            if (mentionId === senderID) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖼𝖺𝗇'𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!");
            }

            const loadingMsg = await message.reply("💖 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝗈𝗆𝖺𝗇𝗍𝗂𝖼 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾...");

            try {
                const imagePath = await this.generateLoveImage(senderID, mentionId);
                
                // Get user names for better personalization
                let userName = "𝖸𝗈𝗎";
                let targetName = mentionName;
                
                try {
                    const userInfo = await usersData.get(senderID);
                    if (userInfo && userInfo.name) {
                        userName = userInfo.name;
                    }
                } catch (nameError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError.message);
                }

                const messageObj = {
                    body: `💌 ${userName} & ${targetName}\n\n𝗟𝗼𝘃𝗲 𝘆𝗼𝘂 𝘀𝗼 𝗺𝘂𝗰𝗵! 🥰`,
                    mentions: [
                        {
                            tag: userName,
                            id: senderID
                        },
                        {
                            tag: targetName,
                            id: mentionId
                        }
                    ],
                    attachment: fs.createReadStream(imagePath)
                };

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply(messageObj);

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗀𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋:", imageError);
                
                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗅𝗈𝗏𝖾 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Clean up generated image
            try {
                const cacheDir = path.join(__dirname, "cache");
                const files = await fs.readdir(cacheDir);
                const loveFiles = files.filter(file => file.startsWith('love4_') && file.endsWith('.png'));
                
                // Keep only the 5 most recent files
                if (loveFiles.length > 5) {
                    const oldFiles = loveFiles.sort().slice(0, loveFiles.length - 5);
                    for (const file of oldFiles) {
                        await fs.unlink(path.join(cacheDir, file));
                    }
                }
            } catch (cleanupError) {
                console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖫𝗈𝗏𝖾4 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('Jimp')) {
                errorMessage = "❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    },

    generateLoveImage: async function (user1ID, user2ID) {
        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template.png");

        // Verify template exists
        if (!fs.existsSync(baseImagePath)) {
            throw new Error("𝖫𝗈𝗏𝖾 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
        }

        let baseImage, avatar1, avatar2;
        
        try {
            baseImage = await Jimp.read(baseImagePath);
        } catch (templateError) {
            throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾: " + templateError.message);
        }

        try {
            avatar1 = await this.processAvatar(user1ID);
            avatar2 = await this.processAvatar(user2ID);
        } catch (avatarError) {
            throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋𝗌: " + avatarError.message);
        }

        const outputPath = path.join(cacheDir, `love4_${user1ID}_${user2ID}_${Date.now()}.png`);

        try {
            // Resize avatars
            avatar1.resize(200, 200);
            avatar2.resize(200, 200);

            // Composite images
            baseImage
                .resize(1024, 800)
                .composite(avatar1, 300, 250)
                .composite(avatar2, 650, 250);

            await baseImage.writeAsync(outputPath);
            
            // Verify output file was created
            if (!fs.existsSync(outputPath)) {
                throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗈𝗎𝗍𝗉𝗎𝗍 𝗂𝗆𝖺𝗀𝖾");
            }

            return outputPath;
        } catch (compositeError) {
            throw new Error("𝖨𝗆𝖺𝗀𝖾 𝖼𝗈𝗆𝗉𝗈𝗌𝗂𝗍𝖾 𝖾𝗋𝗋𝗈𝗋: " + compositeError.message);
        }
    },

    processAvatar: async function (userId) {
        const avatarOptions = [
            `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
            `https://graph.facebook.com/${userId}/picture?type=large`,
            `https://graph.facebook.com/${userId}/picture`,
            `https://graph.facebook.com/v19.0/${userId}/picture?width=512&height=512`
        ];

        let avatarBuffer;
        let lastError;

        for (const url of avatarOptions) {
            try {
                console.log(`📥 𝖳𝗋𝗒𝗂𝗇𝗀 𝖺𝗏𝖺𝗍𝖺𝗋 𝖴𝖱𝖫: ${url}`);
                const response = await axios.get(url, {
                    responseType: "arraybuffer",
                    headers: { 
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    },
                    timeout: 15000
                });
                
                if (response.data && response.data.length > 1000) {
                    avatarBuffer = Buffer.from(response.data);
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userId}`);
                    break;
                } else {
                    throw new Error("𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖽𝖺𝗍𝖺");
                }
            } catch (error) {
                lastError = error;
                console.warn(`❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖴𝖱𝖫 𝖿𝖺𝗂𝗅𝖾𝖽: ${url} - ${error.message}`);
                continue;
            }
        }

        if (!avatarBuffer) {
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userId}: ${lastError?.message || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖾𝗋𝗋𝗈𝗋"}`);
        }

        try {
            const avatar = await Jimp.read(avatarBuffer);
            const size = Math.min(avatar.bitmap.width, avatar.bitmap.height);

            return avatar
                .crop(0, 0, size, size)
                .circle();
        } catch (jimpError) {
            throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋 𝗂𝗆𝖺𝗀𝖾: ${jimpError.message}`);
        }
    }
};
