const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
    config: {
        name: "arrest",
        aliases: [], 
        version: "1.0",
        author: "Asif Mahmud", 
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "👮‍♂️ Puts a user in jail with a police officer."
        },
        longDescription: {
            en: "👮‍♂️ Creates an image where a mentioned user is 'arrested' by the sender."
        },
        guide: {
            en: "{p}arrest [@mention]"
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
            const bgPath = path.join(canvasDir, 'arrest_bg.png'); // Cache path for the template
            const localSourcePath = path.join(__dirname, 'arrest.png'); // Your provided local backup path
            const imageUrl = "https://i.imgur.com/ep1gG3r.png"; // Your provided Imgur link

            // Create directory if it doesn't exist
            if (!fs.existsSync(canvasDir)) {
                fs.mkdirSync(canvasDir, { recursive: true });
                console.log("✅ Created canvas directory for arrest");
            }
            
            // Check if template exists in cache
            if (!fs.existsSync(bgPath)) {
                // First, try to copy from local backup
                if (fs.existsSync(localSourcePath)) {
                    fs.copyFileSync(localSourcePath, bgPath);
                    console.log("✅ Copied arrest template from local path to cache.");
                } else {
                    // If local backup not found, try to download from URL
                    console.warn("⚠️ Local arrest.png not found. Attempting to download from URL...");
                    try {
                        console.log(`Downloading arrest template from: ${imageUrl}`);
                        const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 10000 });
                        fs.writeFileSync(bgPath, Buffer.from(response.data));
                        console.log("✅ Downloaded arrest template from URL to cache.");
                    } catch (downloadError) {
                        console.error("❌ Failed to download arrest template from URL:", downloadError.message);
                        console.error("❌ Arrest template is missing. Command may not function correctly.");
                    }
                }
            } else {
                console.log("✅ Arrest template already exists in cache.");
            }
        } catch (error) {
            console.error("❌ onLoad Error for arrest:", error);
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
                return message.reply("👮‍♂️ Please tag someone to arrest! Example: /arrest @username");
            }

            const targetID = mentionedUsers[0];
            
            // Check if template exists
            const bgPath = path.join(__dirname, 'cache', 'canvas', 'arrest_bg.png');
            if (!fs.existsSync(bgPath)) {
                return message.reply("❌ Arrest template not found. Please ensure the template image is available locally or can be downloaded.");
            }

            outputPath = path.join(__dirname, 'cache', 'canvas', `arrest_${senderID}_${targetID}_${Date.now()}.png`);
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

            const circularAvatarSender = await createCircularAvatar(avatarSenderPath); // Police officer
            const circularAvatarTarget = await createCircularAvatar(avatarTargetPath); // Arrested person

            // Resize avatars to fit the template - based on the provided image
            // Arrested person (target) avatar on the left, police officer (sender) avatar on the right
            circularAvatarTarget.resize(110, 110); // Size for target's avatar (arrested person)
            circularAvatarSender.resize(120, 120); // Size for sender's avatar (police officer)

            console.log("🖼️ Compositing images...");
            // Composite avatars onto background
            // Positions adjusted for arrest template based on visual analysis of the provided image.
            bgImage.composite(circularAvatarTarget, 137, 10);  // Position for the arrested person's avatar (left circle)
            bgImage.composite(circularAvatarSender, 500, 10);  // Position for the police officer's avatar (right circle)


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

            console.log("✅ Successfully created arrest image");
            
            // Send the image
            await message.reply({
                body: `👮‍♂️ ${targetName} has been arrested by ${senderName}!`,
                attachment: fs.createReadStream(outputPath)
            });

            console.log("✅ Successfully sent arrest image");

        } catch (error) {
            console.error('💥 Arrest command error:', error);
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
                console.log("🧹 Cleaned up temporary avatar files for arrest");
            } catch (cleanupError) {
                console.warn("⚠️ Cleanup warning for arrest:", cleanupError.message);
            }
        }
    }
};
