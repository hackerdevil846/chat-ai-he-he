const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "brother",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "👫 𝖬𝖾𝗇𝗍𝗂𝗈𝗇 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾 𝖺 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗉𝖺𝗂𝗋 𝗂𝗆𝖺𝗀𝖾 𝗐𝗂𝗍𝗁 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋"
        },
        guide: {
            en: "{p}brother [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
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
                require("path");
                require("jimp");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝖿𝗈𝗋 𝖻𝗋𝗈𝗍𝗁𝖾𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                return;
            }

            const canvasPath = path.join(__dirname, "cache", "canvas");
            try {
                if (!fs.existsSync(canvasPath)) {
                    fs.mkdirSync(canvasPath, { recursive: true });
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return;
            }

            const templatePath = path.join(canvasPath, "sibling_template.jpg");
            if (!fs.existsSync(templatePath)) {
                try {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...");
                    const { data } = await axios.get("https://i.imgur.com/n2FGJFe.jpg", {
                        responseType: "arraybuffer",
                        timeout: 30000
                    });
                    fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
                    console.log("✅ 𝖡𝗋𝗈𝗍𝗁𝖾𝗋 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } catch (downloadError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾:", downloadError.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖡𝗋𝗈𝗍𝗁𝖾𝗋.𝗃𝗌 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function ({ event, message, api }) {
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

            const { senderID, threadID } = event;
            const mention = Object.keys(event.mentions)[0];
            
            if (!mention) {
                return message.reply("🔹 𝖯𝗅𝖾𝖺𝗌𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗉𝖺𝗂𝗋");
            }

            // Don't allow self-mention
            if (mention === senderID) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖼𝖺𝗇𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗉𝖺𝗂𝗋 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!");
            }

            const targetName = event.mentions[mention].replace("@", "");
            const cachePath = path.join(__dirname, "cache", "canvas");
            
            // Create cache directory if it doesn't exist
            try {
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            const processingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾...");

            try {
                const imagePath = await makeSiblingImage(senderID, mention, cachePath);

                await message.reply({
                    body: `👫 𝖲𝗂𝖻𝗅𝗂𝗇𝗀 𝗉𝖺𝗂𝗋 𝖼𝗋𝖾𝖺𝗍𝖾𝖽!\n\n✨ 𝖸𝗈𝗎 𝖺𝗇𝖽 ${targetName} 𝗅𝗈𝗈𝗄 𝖺𝗐𝖾𝗌𝗈𝗆𝖾 𝗍𝗈𝗀𝖾𝗍𝗁𝖾𝗋!`,
                    mentions: [{ tag: targetName, id: mention }],
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up temporary file
                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                } catch (cleanupError) {
                    console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError.message);
                }

            } catch (imageError) {
                console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾:", imageError);
                await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // Clean up processing message
            try {
                await api.unsendMessage(processingMsg.messageID);
            } catch (unsendError) {
                console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

        } catch (error) {
            console.error("💥 𝖡𝗋𝗈𝗍𝗁𝖾𝗋.𝗃𝗌 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};

// ========== 𝖧𝖾𝗅𝗉𝖾𝗋 𝖥𝗎𝗇𝖼𝗍𝗂𝗈𝗇𝗌 ==========

async function makeSiblingImage(user1, user2, cacheDir) {
    const templatePath = path.join(cacheDir, "sibling_template.jpg");
    const outputPath = path.join(cacheDir, `siblings_${user1}_${user2}_${Date.now()}.png`);

    try {
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            throw new Error("𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
        }

        const [avatar1, avatar2] = await Promise.all([
            processAvatar(user1, cacheDir),
            processAvatar(user2, cacheDir)
        ]);

        const template = await jimp.read(templatePath);

        template.composite(avatar1.resize(191, 191), 93, 111)
                .composite(avatar2.resize(190, 190), 434, 107);

        await template.writeAsync(outputPath);
        console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗂𝖻𝗅𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾");
        return outputPath;
    } catch (error) {
        console.error("❌ 𝖡𝗋𝗈𝗍𝗁𝖾𝗋.𝗃𝗌 𝖨𝗆𝖺𝗀𝖾 𝖢𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
        
        // Clean up output file if it was partially created
        try {
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
        } catch (cleanupError) {
            console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
        }
        
        throw error;
    }
}

async function processAvatar(userID, cacheDir) {
    const avatarPath = path.join(cacheDir, `avt_${userID}_${Date.now()}.png`);
    try {
        const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const { data } = await axios.get(url, { 
            responseType: "arraybuffer",
            timeout: 15000 
        });
        fs.writeFileSync(avatarPath, Buffer.from(data, "binary"));

        const avatar = await jimp.read(avatarPath);
        avatar.circle();

        // Clean up temporary avatar file
        try {
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        } catch (cleanupError) {
            console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗂𝗅𝖾:", cleanupError.message);
        }

        return avatar;
    } catch (error) {
        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖺𝗏𝖺𝗍𝖺𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userID}:`, error.message);
        
        // Clean up temporary avatar file
        try {
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        } catch (cleanupError) {
            console.warn("⚠️ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝖺𝗏𝖺𝗍𝖺𝗋:", cleanupError.message);
        }
        
        throw error;
    }
}
