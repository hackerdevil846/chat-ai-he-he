const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "arrest2",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud", // Assuming this is your name based on previous interactions
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "👮‍♂️ Arrests a user with a funny image"
        },
        longDescription: {
            en: "👮‍♂️ Puts a user's avatar on a 'most wanted' or 'arrested' template, along with the sender's avatar."
        },
        guide: {
            en: "{p}arrest2 [@mention]"
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
            const bgPath = path.join(canvasDir, 'arrestv2_bg.png'); // Renamed for consistency
            const sourcePath = path.join(__dirname, 'arrestv2.png'); // Original template image
            
            // Create directory if it doesn't exist
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory for arrest2");
            }
            
            // Copy template if it doesn't exist
            if (!fs.existsSync(bgPath)) {
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, bgPath);
                    console.log("✅ Copied arrest2 template to cache");
                } else {
                    console.error("❌ arrestv2.png not found in script directory!");
                    console.log("📁 Expected path:", sourcePath);
                }
            } else {
                console.log("✅ arrest2 template already exists in cache");
            }
        } catch (error) {
            console.error("❌ onLoad Error for arrest2:", error);
        }
    },

    onStart: async function({ message, event, args, usersData }) {
        let outputPath = null;
        let avatarSenderPath = null;
        let avatarTargetPath = null;
        
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
                return message.reply("👮‍♂️ Please tag someone to arrest! Example: /arrest2 @username");
            }

            const targetID = mentionedUsers[0];
            
            // Check if template exists
            const bgPath = path.join(__dirname, 'cache', 'canvas', 'arrestv2_bg.png');
            if (!fs.existsSync(bgPath)) {
                return message.reply("❌ Arrest template not found. Please make sure 'arrestv2.png' exists in the script directory.");
            }

            outputPath = path.join(__dirname, 'cache', 'canvas', `arrest2_${senderID}_${targetID}_${Date.now()}.png`);
            avatarSenderPath = path.join(__dirname, 'cache', 'canvas', `avt_sender_${senderID}_${Date.now()}.png`);
            avatarTargetPath = path.join(__dirname, 'cache', 'canvas', `avt_target_${targetID}_${Date.now()}.png`);

            console.log("📝 Getting user names...");
            // Get user names (optional, but good for logs)
            const senderName = await usersData.getName(senderID);
            const targetName = await usersData.getName(targetID);

            console.log("📥 Downloading profile pictures...");
            // Download profile pictures with error handling
            let avatarSenderBuffer, avatarTargetBuffer;
            try {
                const avatarSenderResponse = await axios.get(
                    `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                avatarSenderBuffer = Buffer.from(avatarSenderResponse.data);
                fs.writeFileSync(avatarSenderPath, avatarSenderBuffer);
                console.log("✅ Downloaded sender's avatar");
            } catch (error) {
                console.error("❌ Failed to download sender avatar:", error.message);
                return message.reply("❌ Failed to download your profile picture. Please try again.");
            }

            try {
                const avatarTargetResponse = await axios.get(
                    `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                    { 
                        responseType: 'arraybuffer',
                        timeout: 15000
                    }
                );
                avatarTargetBuffer = Buffer.from(avatarTargetResponse.data);
                fs.writeFileSync(avatarTargetPath, avatarTargetBuffer);
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

            const circularAvatarSender = await createCircularAvatar(avatarSenderPath);
            const circularAvatarTarget = await createCircularAvatar(avatarTargetPath);

            // Resize avatars to fit the template - based on the provided image, 
            // the circles are slightly different sizes and positions.
            // Police officer (sender) avatar is larger and on the right.
            // Arrested person (target) avatar is smaller and on the left.
            circularAvatarSender.resize(110, 110); // Size for sender's avatar (police)
            circularAvatarTarget.resize(100, 100); // Size for target's avatar (arrested)

            console.log("🖼️ Compositing images...");
            // Composite avatars onto background
            // Positions adjusted for arrest2 template based on visual analysis of the provided image.
            bgImage.composite(circularAvatarTarget, 105, 12);  // Position for the arrested person's avatar (left side)
            bgImage.composite(circularAvatarSender, 520, 12);  // Position for the police officer's avatar (right side)


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

            console.log("✅ Successfully created arrest2 image");
            
            // Send the image
            await message.reply({
                body: `👮‍♂️ You arrested ${targetName}!`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent arrest2 image");

        } catch (error) {
            console.error('💥 Arrest2 command error:', error);
            await message.reply("❌ Failed to create arrest image! Please try again later.");
        } finally {
            // Cleanup temporary files
            try {
                if (outputPath && fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                    console.log("🧹 Cleaned up output image");
                }
                if (avatarSenderPath && fs.existsSync(avatarSenderPath)) {
                    fs.unlinkSync(avatarSenderPath);
                }
                if (avatarTargetPath && fs.existsSync(avatarTargetPath)) {
                    fs.unlinkSync(avatarTargetPath);
                }
                console.log("🧹 Cleaned up temporary avatar files for arrest2");
            } catch (cleanupError) {
                console.warn("⚠️ Cleanup warning for arrest2:", cleanupError.message);
            }
        }
    }
};
