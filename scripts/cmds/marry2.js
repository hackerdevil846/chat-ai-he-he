const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "marry2",
        aliases: [],
        version: "2.0",
        author: "Asif Mahmud",
        role: 0,
        category: "love",
        shortDescription: {
            en: "💍 Generate marriage proposal images"
        },
        longDescription: {
            en: "Tag your loved one to create beautiful marriage proposal images 💖"
        },
        guide: {
            en: "{p}marry2 [@mention]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "jimp": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message, event, args }) {
        let outputPath = null;
        
        try {
            // Dependency check
            try {
                require("axios");
                require("jimp");
                require("fs-extra");
            } catch (e) {
                return message.reply("❌ Missing dependencies. Please install: axios, jimp, and fs-extra.");
            }

            const mention = Object.keys(event.mentions);
            if (mention.length === 0) {
                return message.reply("💌 Please mention someone to generate the marriage image! 💝");
            }

            const one = event.senderID;
            const two = mention[0];

            // Validate user IDs
            if (!one || !two) {
                return message.reply("❌ Invalid user IDs detected.");
            }

            console.log(`🎨 Generating marriage image for ${one} and ${two}...`);

            outputPath = await this.generateImage(one, two);

            if (outputPath && fs.existsSync(outputPath)) {
                await message.reply({
                    body: "💖 One day with you for sure... 💑\n\n- Created by Asif Mahmud",
                    attachment: fs.createReadStream(outputPath)
                });

                console.log("✅ Successfully sent marriage image");
            } else {
                await message.reply("❌ Failed to create the marriage image. Please try again later.");
            }

        } catch (error) {
            console.error("💥 Marry2 Command Error:", error);
            await message.reply("😢 Sorry! Couldn't create the marriage image. Please try again later!");
        } finally {
            // Clean up generated image
            if (outputPath && fs.existsSync(outputPath)) {
                try {
                    fs.unlinkSync(outputPath);
                    console.log("🧹 Cleaned up generated image");
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up:", cleanupError.message);
                }
            }
        }
    },

    generateImage: async function(uid1, uid2) {
        const cachePath = path.join(__dirname, "cache");
        const outputFile = path.join(cachePath, `marry2_${uid1}_${uid2}_${Date.now()}.png`);
        
        try {
            // Ensure cache directory exists
            await fs.ensureDir(cachePath);
            console.log("✅ Cache directory verified");

            const backgroundUrl = "https://i.ibb.co/L5w2h2B/ba6abadae46b5bdaa29cf6a64d762874.jpg";
            
            console.log("📥 Downloading images...");

            // Download images with better error handling
            let avatar1, avatar2, background;
            
            try {
                const avatar1Url = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                console.log(`📥 Downloading avatar 1: ${uid1}`);
                avatar1 = await jimp.read(avatar1Url);
                console.log("✅ Downloaded avatar 1");
            } catch (avatar1Error) {
                console.error(`❌ Failed to download avatar for ${uid1}:`, avatar1Error.message);
                throw new Error("Could not download first user's avatar");
            }

            try {
                const avatar2Url = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                console.log(`📥 Downloading avatar 2: ${uid2}`);
                avatar2 = await jimp.read(avatar2Url);
                console.log("✅ Downloaded avatar 2");
            } catch (avatar2Error) {
                console.error(`❌ Failed to download avatar for ${uid2}:`, avatar2Error.message);
                throw new Error("Could not download second user's avatar");
            }

            try {
                console.log("📥 Downloading background image...");
                background = await jimp.read(backgroundUrl);
                console.log("✅ Downloaded background image");
            } catch (backgroundError) {
                console.error("❌ Failed to download background:", backgroundError.message);
                throw new Error("Could not download background image");
            }

            // Resize avatars to fit the circles in the template
            const avatarSize = 105;
            console.log("⭕ Processing avatars...");
            
            avatar1.resize(avatarSize, avatarSize);
            avatar1.circle();
            
            avatar2.resize(avatarSize, avatarSize);
            avatar2.circle();

            // Position avatars accurately on the template
            const avatar1X = 185; 
            const avatar1Y = 70;
            const avatar2X = 330; 
            const avatar2Y = 150;

            console.log("🎨 Compositing images...");
            
            // Resize background to maintain consistency
            background.resize(640, 535);
            
            // Composite avatars onto background
            background.composite(avatar1, avatar1X, avatar1Y);
            background.composite(avatar2, avatar2X, avatar2Y);

            console.log("💾 Saving final image...");
            await background.writeAsync(outputFile);

            // Verify the image was created successfully
            if (fs.existsSync(outputFile)) {
                const stats = fs.statSync(outputFile);
                if (stats.size > 0) {
                    console.log(`✅ Successfully created marriage image: ${outputFile}`);
                    return outputFile;
                } else {
                    throw new Error("Generated image file is empty");
                }
            } else {
                throw new Error("Failed to create output file");
            }

        } catch (error) {
            console.error("💥 Image generation error:", error);
            
            // Clean up if output file was partially created
            if (fs.existsSync(outputFile)) {
                try {
                    fs.unlinkSync(outputFile);
                } catch (cleanupError) {
                    console.warn("⚠️ Failed to clean up partial file:", cleanupError.message);
                }
            }
            
            throw error;
        }
    }
};
