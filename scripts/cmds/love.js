const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "love",
        aliases: [],
        version: "2.6.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "love",
        shortDescription: {
            en: "Create romantic love image"
        },
        longDescription: {
            en: "Creates a beautiful love image with tagged user"
        },
        guide: {
            en: "{p}love @mention"
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
            const canvasDir = path.join(__dirname, 'cache', 'canvas');
            
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created cache/canvas directory");
            }

            const templatePath = path.join(canvasDir, 'love2.jpg');
            if (!fs.existsSync(templatePath)) {
                console.warn("⚠️ Template not found: Please add 'love2.jpg' to cache/canvas/ folder");
            } else {
                console.log("✅ Love template found:", templatePath);
            }
        } catch (error) {
            console.error("❌ onLoad Error:", error.message);
        }
    },

    onStart: async function ({ event, message, usersData, api }) {
        let generatedImagePath = null;
        let avatarOneTempPath = null;
        let avatarTwoTempPath = null;

        try {
            const { senderID, mentions } = event;

            // Check if someone is tagged
            if (!mentions || Object.keys(mentions).length === 0) {
                return message.reply("💌 Please tag someone to create a love image!\n\nExample: /love @username");
            }

            const mentionedIDs = Object.keys(mentions);
            const targetID = mentionedIDs[0];
            const userOne = senderID;
            const userTwo = targetID;

            // Get display name for the message
            let displayName = "Your Love";
            try {
                const userInfo = await usersData.get(targetID);
                displayName = userInfo?.name || mentions[targetID]?.replace('@', '') || "Your Love";
            } catch (error) {
                displayName = mentions[targetID]?.replace('@', '') || "Your Love";
            }

            // Check template exists
            const templatePath = path.join(__dirname, "cache", "canvas", "love2.jpg");
            if (!fs.existsSync(templatePath)) {
                return message.reply("❌ Template missing!\n\nPlease add 'love2.jpg' to the cache/canvas/ folder.");
            }

            // Send loading message
            const loadingMsg = await message.reply("🔄 Creating your romantic love image... 💖");

            try {
                // Generate the love image
                const result = await this.makeImage({ one: userOne, two: userTwo });
                
                if (!result || !result.outputPath || !fs.existsSync(result.outputPath)) {
                    throw new Error("Failed to generate image file");
                }

                generatedImagePath = result.outputPath;
                avatarOneTempPath = result.avatarOneTempPath;
                avatarTwoTempPath = result.avatarTwoTempPath;

                // Verify the generated image is valid
                const stats = fs.statSync(generatedImagePath);
                if (stats.size === 0) {
                    throw new Error("Generated image is empty");
                }

                // Unsend loading message
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend loading message:", unsendError.message);
                }

                // Send the final result
                await message.reply({
                    body: `💕 ${displayName}, you mean the world to me! 💖\n━━━━━━━━━━━━━━━━━━━━`,
                    mentions: [{ tag: displayName, id: targetID }],
                    attachment: fs.createReadStream(generatedImagePath)
                });

                console.log("✅ Successfully created and sent love image");

            } catch (imageError) {
                console.error("❌ Image creation failed:", imageError.message);
                
                try {
                    await message.unsend(loadingMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend loading message:", unsendError.message);
                }
                
                return message.reply("❌ Failed to create love image. Please try again later.");
            }

        } catch (error) {
            console.error("💥 Love command error:", error);
            await message.reply("❌ An unexpected error occurred. Please try again.");
        } finally {
            // Cleanup all temporary files
            this.cleanupFiles([generatedImagePath, avatarOneTempPath, avatarTwoTempPath]);
        }
    },

    makeImage: async function({ one, two }) {
        const canvasDir = path.join(__dirname, "cache", "canvas");
        const templatePath = path.join(canvasDir, "love2.jpg");

        if (!fs.existsSync(templatePath)) {
            throw new Error("Template love2.jpg not found in cache/canvas/");
        }

        // Create unique file paths
        const timestamp = Date.now();
        const outputPath = path.join(canvasDir, `love_${one}_${two}_${timestamp}.png`);
        const avatarOnePath = path.join(canvasDir, `avt1_${one}_${timestamp}.png`);
        const avatarTwoPath = path.join(canvasDir, `avt2_${two}_${timestamp}.png`);

        let template;
        try {
            template = await jimp.read(templatePath);
            console.log("✅ Template loaded successfully");
        } catch (templateError) {
            throw new Error(`Failed to load template: ${templateError.message}`);
        }

        // Facebook access token for avatar downloads
        const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
        const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${fbToken}`;
        const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${fbToken}`;

        // Download first avatar
        console.log(`📥 Downloading avatar for user ${one}...`);
        try {
            const responseOne = await axios.get(avatarOneUrl, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "image/*"
                }
            });

            if (!responseOne.data || responseOne.data.length < 1000) {
                throw new Error("Invalid avatar data received");
            }

            fs.writeFileSync(avatarOnePath, Buffer.from(responseOne.data, 'binary'));
            console.log("✅ First avatar downloaded successfully");
        } catch (avatarOneError) {
            throw new Error(`Failed to download first avatar: ${avatarOneError.message}`);
        }

        // Download second avatar
        console.log(`📥 Downloading avatar for user ${two}...`);
        try {
            const responseTwo = await axios.get(avatarTwoUrl, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "image/*"
                }
            });

            if (!responseTwo.data || responseTwo.data.length < 1000) {
                throw new Error("Invalid avatar data received");
            }

            fs.writeFileSync(avatarTwoPath, Buffer.from(responseTwo.data, 'binary'));
            console.log("✅ Second avatar downloaded successfully");
        } catch (avatarTwoError) {
            // Clean up first avatar if second fails
            if (fs.existsSync(avatarOnePath)) {
                try { fs.unlinkSync(avatarOnePath); } catch (e) {}
            }
            throw new Error(`Failed to download second avatar: ${avatarTwoError.message}`);
        }

        // Process avatars into circles
        let circleOne, circleTwo;
        try {
            console.log("⭕ Creating circular avatars...");
            const circleOneBuffer = await this.createCircularAvatar(avatarOnePath);
            const circleTwoBuffer = await this.createCircularAvatar(avatarTwoPath);
            
            circleOne = await jimp.read(circleOneBuffer);
            circleTwo = await jimp.read(circleTwoBuffer);
            console.log("✅ Circular avatars created successfully");
        } catch (circleError) {
            // Clean up downloaded avatars
            if (fs.existsSync(avatarOnePath)) { try { fs.unlinkSync(avatarOnePath); } catch (e) {} }
            if (fs.existsSync(avatarTwoPath)) { try { fs.unlinkSync(avatarTwoPath); } catch (e) {} }
            throw new Error(`Failed to create circular avatars: ${circleError.message}`);
        }

        // Composite avatars onto template
        try {
            console.log("🎨 Compositing avatars onto template...");
            
            // Avatar positions for love2.jpg template
            // Left avatar (user one) - Groom position
            const avatarOneSize = 150;
            const avatarOneX = 290;
            const avatarOneY = 185;

            // Right avatar (user two) - Bride position  
            const avatarTwoSize = 120;
            const avatarTwoX = 525;
            const avatarTwoY = 270;

            // Resize and place avatars
            template.composite(
                circleOne.resize(avatarOneSize, avatarOneSize),
                avatarOneX,
                avatarOneY
            );

            template.composite(
                circleTwo.resize(avatarTwoSize, avatarTwoSize),
                avatarTwoX, 
                avatarTwoY
            );

            // Save final image
            await template.writeAsync(outputPath);
            console.log("✅ Love image created successfully:", outputPath);

            return {
                outputPath,
                avatarOneTempPath: avatarOnePath,
                avatarTwoTempPath: avatarTwoPath
            };

        } catch (compositeError) {
            throw new Error(`Failed to composite image: ${compositeError.message}`);
        }
    },

    createCircularAvatar: async function(imagePath) {
        try {
            let image = await jimp.read(imagePath);
            
            // Crop to square for perfect circle
            const size = Math.min(image.bitmap.width, image.bitmap.height);
            image.crop(0, 0, size, size);
            
            // Create circle
            image.circle();
            
            return await image.getBufferAsync("image/png");
        } catch (error) {
            throw new Error(`Failed to create circular avatar: ${error.message}`);
        }
    },

    cleanupFiles: function(filePaths) {
        filePaths.forEach(filePath => {
            if (filePath && fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log("🧹 Cleaned up:", path.basename(filePath));
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", path.basename(filePath), cleanupError.message);
                }
            }
        });
    }
};
