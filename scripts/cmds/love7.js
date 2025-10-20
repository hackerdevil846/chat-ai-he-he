const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
    config: {
        name: "love7",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "💖 Create romantic love image with two users"
        },
        longDescription: {
            en: "Creates a romantic love image with two users' profile pictures"
        },
        guide: {
            en: "{p}love7 [@tag]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    onLoad: async function () {
        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template_7.png");

        try {
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
                console.log("✅ Created cache directory");
            }

            if (!fs.existsSync(baseImagePath)) {
                console.log("📥 Downloading base template for love7...");
                const response = await axios({
                    method: 'get',
                    url: 'https://drive.google.com/uc?export=download&id=1m6ymMdBr4U-PccDqEQknH9QUuPsGLk8x',
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    fs.writeFileSync(baseImagePath, Buffer.from(response.data, 'binary'));
                    console.log("✅ Base template downloaded successfully");
                } else {
                    throw new Error("Downloaded template is empty");
                }
            } else {
                console.log("✅ Base template already exists");
            }
        } catch (error) {
            console.error("❌ Error during onLoad:", error.message);
        }
    },

    onStart: async function ({ event, message, usersData }) {
        const { senderID, mentions } = event;
        const tempFiles = [];

        try {
            // Validate mentions
            const mentionedUsers = Object.keys(mentions || {});
            if (mentionedUsers.length === 0) {
                return message.reply("📍 Please tag 1 person to create a love image!");
            }

            let targetUserID = mentionedUsers.find(id => id !== senderID) || mentionedUsers[0];
            
            // Get user names for better message
            let senderName = "You";
            let targetName = "Your Love";
            
            try {
                const senderInfo = await usersData.get(senderID);
                const targetInfo = await usersData.get(targetUserID);
                senderName = senderInfo?.name || "You";
                targetName = targetInfo?.name || "Your Love";
            } catch (nameError) {
                console.warn("⚠️ Could not fetch user names:", nameError.message);
            }

            const processingMsg = await message.reply("💖 Creating your romantic love image...");

            // Generate the love image
            const imagePath = await this.generateLoveImage(senderID, targetUserID, tempFiles);
            
            if (!imagePath || !fs.existsSync(imagePath)) {
                throw new Error("Generated image file is missing");
            }
            
            tempFiles.push(imagePath);

            const messageBody = `💌 ${senderName} & ${targetName}\n❤️ Made for each other! 🥰`;

            await message.reply({
                body: messageBody,
                attachment: fs.createReadStream(imagePath)
            });

            console.log("✅ Love image sent successfully");

            // Clean up processing message
            if (processingMsg?.messageID) {
                try {
                    await message.unsend(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("⚠️ Could not unsend processing message");
                }
            }

        } catch (error) {
            console.error("💥 Command error:", error);
            await message.reply("❌ Error generating the image. Please try again later.");
        } finally {
            // Clean up temporary files after delay
            if (tempFiles.length > 0) {
                setTimeout(() => {
                    this.cleanupTempFiles(tempFiles);
                }, 30000);
            }
        }
    },

    generateLoveImage: async function (user1ID, user2ID, tempFiles) {
        const cacheDir = path.join(__dirname, 'cache');
        const baseImagePath = path.join(cacheDir, 'love_template_7.png');

        if (!fs.existsSync(baseImagePath)) {
            throw new Error("Base template missing. Please check if template downloaded properly.");
        }

        console.log("📖 Reading base template image...");
        const baseImage = await Jimp.read(baseImagePath);

        console.log("📥 Downloading user avatars...");
        const [avatar1, avatar2] = await Promise.all([
            this.downloadAndProcessAvatar(user1ID, tempFiles),
            this.downloadAndProcessAvatar(user2ID, tempFiles)
        ]);

        console.log("🎨 Compositing avatars on template...");

        // Avatar configuration
        const avatarSize = 250;
        const avatar1Processed = avatar1.resize(avatarSize, avatarSize).circle();
        const avatar2Processed = avatar2.resize(avatarSize, avatarSize).circle();

        // Position avatars on template
        // Left circle position
        baseImage.composite(avatar1Processed, 65, 125);
        // Right circle position  
        baseImage.composite(avatar2Processed, 450, 125);

        // Save final image
        const outputPath = path.join(cacheDir, `love7_${user1ID}_${user2ID}_${Date.now()}.png`);
        await baseImage.writeAsync(outputPath);

        // Verify output
        if (!fs.existsSync(outputPath)) {
            throw new Error("Failed to save output image");
        }

        const stats = fs.statSync(outputPath);
        if (stats.size === 0) {
            throw new Error("Output image is empty");
        }

        console.log(`✅ Generated love image: ${outputPath}`);
        return outputPath;
    },

    downloadAndProcessAvatar: async function (userId, tempFiles) {
        const cacheDir = path.join(__dirname, 'cache');
        const avatarPath = path.join(cacheDir, `avatar_${userId}_${Date.now()}.png`);
        tempFiles.push(avatarPath);

        const avatarUrls = [
            `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
            `https://graph.facebook.com/${userId}/picture?width=512&height=512`,
            `https://graph.facebook.com/${userId}/picture?type=large`,
            `https://graph.facebook.com/${userId}/picture`
        ];

        for (const url of avatarUrls) {
            try {
                console.log(`📥 Trying avatar source for user ${userId}`);
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (response.data && response.data.length > 0) {
                    await fs.writeFile(avatarPath, Buffer.from(response.data, 'binary'));
                    const avatarImage = await Jimp.read(avatarPath);

                    // Validate image
                    if (avatarImage.bitmap.width > 50 && avatarImage.bitmap.height > 50) {
                        console.log(`✅ Successfully downloaded avatar for user ${userId}`);
                        return avatarImage;
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Failed avatar source for user ${userId}: ${error.message}`);
                continue;
            }
        }

        // Fallback avatar
        console.warn(`⚠️ Using fallback avatar for user ${userId}`);
        const fallbackImage = new Jimp(250, 250, 0x808080FF); // Gray color
        fallbackImage.circle();
        return fallbackImage;
    },

    cleanupTempFiles: function (tempFiles) {
        tempFiles.forEach(file => {
            try {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    console.log(`🧹 Cleaned up: ${path.basename(file)}`);
                }
            } catch (cleanupError) {
                console.warn(`⚠️ Could not delete ${path.basename(file)}: ${cleanupError.message}`);
            }
        });
    }
};
