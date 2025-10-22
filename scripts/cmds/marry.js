const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "marry",
        aliases: [], 
        version: "3.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "romance",
        shortDescription: {
            en: "💍 Propose to someone with a marriage certificate"
        },
        longDescription: {
            en: "💍 Send a marriage proposal with a beautiful certificate"
        },
        guide: {
            en: "{p}marry [@mention]"
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
            const bgPath = path.join(canvasDir, 'marry_bg.png');
            const sourcePath = path.join(__dirname, 'marrywi.png');
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory");
            }
            
            // Copy template if it doesn't exist
            if (!fs.existsSync(bgPath)) {
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, bgPath);
                    console.log("✅ Copied marriage template to cache");
                } else {
                    console.error("❌ marrywi.png not found in script directory!");
                    console.log("📁 Expected path:", sourcePath);
                }
            } else {
                console.log("✅ Marriage template already exists in cache");
            }
        } catch (error) {
            console.error("❌ onLoad Error:", error);
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        let outputPath = null;
        let avatar1Path = null;
        let avatar2Path = null;
        
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
            } catch (e) {
                return message.reply("❌ Missing dependencies. Please install: axios, fs-extra, path, and jimp.");
            }

            const { senderID, mentions } = event;

            // Check if someone is mentioned
            const mentionedUsers = Object.keys(mentions);
            if (mentionedUsers.length === 0) {
                return message.reply("💍 Please tag someone to propose marriage! Example: /marry @username");
            }

            const targetID = mentionedUsers[0];
            
            // Don't allow self-marriage
            if (senderID === targetID) {
                return message.reply("❌ You cannot marry yourself!");
            }

            // Check if template exists
            const bgPath = path.join(__dirname, 'cache', 'canvas', 'marry_bg.png');
            if (!fs.existsSync(bgPath)) {
                return message.reply("❌ Marriage template not found. Please make sure 'marrywi.png' exists in the script directory.");
            }

            outputPath = path.join(__dirname, 'cache', 'canvas', `marry_${senderID}_${targetID}_${Date.now()}.png`);
            avatar1Path = path.join(__dirname, 'cache', 'canvas', `avt1_${senderID}_${Date.now()}.png`);
            avatar2Path = path.join(__dirname, 'cache', 'canvas', `avt2_${targetID}_${Date.now()}.png`);

            console.log("📝 Getting user names...");
            // Get user names
            const senderName = await usersData.getName(senderID);
            const targetName = await usersData.getName(targetID);

            console.log("📥 Downloading profile pictures...");
            // Download profile pictures with error handling
            let avatar1Buffer, avatar2Buffer;
            try {
                const avatar1Response = await axios.get(
                    `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                avatar1Buffer = Buffer.from(avatar1Response.data);
                fs.writeFileSync(avatar1Path, avatar1Buffer);
                console.log("✅ Downloaded sender's avatar");
            } catch (error) {
                console.error("❌ Failed to download sender avatar:", error.message);
                return message.reply("❌ Failed to download your profile picture. Please try again.");
            }

            try {
                const avatar2Response = await axios.get(
                    `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                avatar2Buffer = Buffer.from(avatar2Response.data);
                fs.writeFileSync(avatar2Path, avatar2Buffer);
                console.log("✅ Downloaded target's avatar");
            } catch (error) {
                console.error("❌ Failed to download target avatar:", error.message);
                return message.reply("❌ Failed to download the tagged user's profile picture. Please try again.");
            }

            console.log("🎨 Processing images...");
            // Load background image
            const bgImage = await jimp.read(bgPath);
            
            // Create circular avatars
            const createCircularAvatar = async (imagePath) => {
                const image = await jimp.read(imagePath);
                image.circle();
                return image;
            };

            const circularAvatar1 = await createCircularAvatar(avatar1Path);
            const circularAvatar2 = await createCircularAvatar(avatar2Path);

            // Resize avatars to fit the template
            circularAvatar1.resize(60, 60); // Size for first avatar
            circularAvatar2.resize(60, 60); // Size for second avatar

            console.log("🖼️ Compositing images...");
            // Composite avatars onto background
            // Positions adjusted for marriage certificate template
            bgImage.composite(circularAvatar1, 130, 40);  // Left position (sender)
            bgImage.composite(circularAvatar2, 190, 23);  // Right position (target)

            // Save the final image
            console.log("💾 Saving final image...");
            await bgImage.writeAsync(outputPath);

            // Verify the image was created
            if (!fs.existsSync(outputPath)) {
                throw new Error("Failed to create output image");
            }

            const stats = fs.statSync(outputPath);
            if (stats.size === 0) {
                throw new Error("Created image is empty");
            }

            console.log("✅ Successfully created marriage certificate");
            
            // Send the marriage proposal
            await message.reply({
                body: `💞 Marriage Certificate\n\n👰 ${senderName} 💍 🤵 ${targetName}\n\n"I want to spend every moment of my life with you 💍"`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent marriage proposal");

        } catch (error) {
            console.error('💥 Marry command error:', error);
            await message.reply("❌ Failed to create marriage certificate! Please try again later.");
        } finally {
            // Cleanup temporary files
            try {
                if (outputPath && fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                    console.log("🧹 Cleaned up output image");
                }
                if (avatar1Path && fs.existsSync(avatar1Path)) {
                    fs.unlinkSync(avatar1Path);
                }
                if (avatar2Path && fs.existsSync(avatar2Path)) {
                    fs.unlinkSync(avatar2Path);
                }
                console.log("🧹 Cleaned up temporary files");
            } catch (cleanupError) {
                console.warn("⚠️ Cleanup warning:", cleanupError.message);
            }
        }
    }
};
