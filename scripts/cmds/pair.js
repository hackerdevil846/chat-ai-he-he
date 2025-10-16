const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp'); // Add jimp dependency

module.exports = {
    config: {
        name: "pair",
        aliases: [],
        version: "1.0.0",
        role: 0,
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        shortDescription: {
            en: "💘 𝖢𝗈𝗎𝗉𝗅𝖾 𝗆𝖺𝗍𝖼𝗁𝗂𝗇𝗀 𝗀𝖺𝗆𝖾"
        },
        longDescription: {
            en: "𝖱𝖺𝗇𝖽𝗈𝗆𝗅𝗒 𝗉𝖺𝗂𝗋𝗌 𝗍𝗐𝗈 𝗎𝗌𝖾𝗋𝗌 𝗂𝗇 𝖺 𝗀𝗋𝗈𝗎𝗉 𝗐𝗂𝗍𝗁 𝖺 𝗆𝖺𝗍𝖼𝗁 𝗉𝖾𝗋𝖼𝖾𝗇𝗍𝖺𝗀𝖾 𝖺𝗇𝖽 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅 𝗂𝗆𝖺𝗀𝖾"
        },
        category: "𝖿𝗎𝗇",
        guide: {
            en: "{p}pair"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": "" // Add jimp to dependencies
        }
    },

    onLoad: function () {
        try {
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
        } catch (error) {
            console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖫𝗈𝖺𝖽:", error.message);
        }
    },

    onStart: async function ({ api, message, event, usersData }) {
        try {
            // Enhanced dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            let jimpAvailable = true; // Check for jimp

            try {
                require("axios");
                require("fs-extra");
                require("jimp"); // Require jimp
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
                jimpAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable || !jimpAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝖺𝗇𝖽 𝗃𝗂𝗆𝗉.");
            }

            const { threadID, senderID, messageID } = event;
            const cachePath = path.join(__dirname, 'cache');

            // Ensure cache directory exists
            try {
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            // Helper function to create circular images (re-used from pair2)
            async function createCircularImage(imageBuffer) {
                try {
                    const image = await jimp.read(imageBuffer);
                    const size = Math.min(image.getWidth(), image.getHeight());
                    
                    // Create a circular mask
                    const circle = await new jimp(size, size, 0x00000000);
                    for (let x = 0; x < size; x++) {
                        for (let y = 0; y < size; y++) {
                            const distance = Math.sqrt(Math.pow(x - size/2, 2) + Math.pow(y - size/2, 2));
                            if (distance <= size/2) {
                                circle.setPixelColor(jimp.rgbaToInt(255, 255, 255, 255), x, y);
                            }
                        }
                    }
                    
                    image.resize(size, size);
                    image.mask(circle);
                    return await image.getBufferAsync("image/png");
                } catch (error) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝗂𝗋𝖼𝗎𝗅𝖺𝗋 𝗂𝗆𝖺𝗀𝖾:", error);
                    throw error;
                }
            }

            // Get sender info with error handling
            let senderName;
            try {
                senderName = await usersData.getName(senderID);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗌𝖾𝗇𝖽𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError);
                senderName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            }

            // Get thread participants
            let participants;
            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();

                participants = threadInfo.participantIDs.filter(id =>
                    id !== senderID && id !== botID
                );
            } catch (threadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇.");
            }

            if (participants.length === 0) {
                return message.reply("❌ 𝖭𝗈 𝗈𝗍𝗁𝖾𝗋 𝗎𝗌𝖾𝗋𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉!");
            }

            // Select random participant
            const randomParticipantID = participants[Math.floor(Math.random() * participants.length)];

            // Get participant's name with error handling
            let participantName;
            try {
                participantName = await usersData.getName(randomParticipantID);
            } catch (nameError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗉𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗇𝗍 𝗇𝖺𝗆𝖾:", nameError);
                participantName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇";
            }

            // Compatibility percentage logic
            const percentages = ['𝟮𝟭%', '𝟲𝟳%', '𝟭𝟵%', '𝟯𝟳%', '𝟭𝟳%', '𝟵𝟲%', '𝟱𝟮%', '𝟲𝟮%', '𝟳𝟲%', '𝟴𝟯%', '𝟭𝟬𝟬%', '𝟵𝟵%', "𝟬%", "𝟰𝟴%"];
            const randomPercentage = percentages[Math.floor(Math.random() * percentages.length)];

            // Background template URLs (using the ones you provided as images)
            const backgrounds = [
                "https://i.postimg.cc/wjJ29HRB/background1.png", // Floating hearts, your first image
                "https://i.postimg.cc/zf4Pnshv/background2.png", // Balloons and confetti, your second image
                "https://i.postimg.cc/5tXRQ46D/background3.png"  // Blurry hearts bokeh, your third image
            ];
            const randomBackgroundUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];

            // Create unique file paths
            const timestamp = Date.now();
            const backgroundPath = path.join(cachePath, `background_${timestamp}.png`);
            const finalImagePath = path.join(cachePath, `pair_result_${timestamp}.png`);

            try {
                // Download avatars and background
                const facebookToken = '6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';

                // Helper function to download images as buffer
                async function downloadImageBuffer(url) {
                    try {
                        const response = await axios.get(url, {
                            responseType: 'arraybuffer',
                            timeout: 15000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });
                        return Buffer.from(response.data);
                    } catch (error) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗂𝗆𝖺𝗀𝖾 𝖿𝗋𝗈𝗆 ${url}:`, error.message);
                        throw error;
                    }
                }

                // Download all images as buffers
                const [avatar1Buffer, avatar2Buffer, backgroundBuffer] = await Promise.all([
                    downloadImageBuffer(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${facebookToken}`),
                    downloadImageBuffer(`https://graph.facebook.com/${randomParticipantID}/picture?width=512&height=512&access_token=${facebookToken}`),
                    downloadImageBuffer(randomBackgroundUrl)
                ]);

                // Create circular avatars
                const circularAvatar1 = await jimp.read(await createCircularImage(avatar1Buffer));
                const circularAvatar2 = await jimp.read(await createCircularImage(avatar2Buffer));

                // Load background image
                const backgroundImage = await jimp.read(backgroundBuffer);

                // Define avatar size and positions
                const avatarSize = 180; // Size for the circular avatars
                const heartIcon = await jimp.read(path.join(__dirname, 'cache', 'canvas', 'pairing.png')); // Re-using the pairing heart icon from pair2 for visual consistency if needed, assuming it's downloaded by pair2's onLoad.

                // Resize heart icon
                const resizedHeart = heartIcon.resize(100, jimp.AUTO); // Adjust size as needed

                // Positions for the avatars and heart icon on the background.
                // These are estimates and might need fine-tuning based on the specific background image dimensions and desired layout.
                // Assuming a typical background image resolution of around 1280x720 or 1920x1080 for web backgrounds.
                // Let's target a 1280x720 base for these positions, and center the main heart.
                const bgWidth = backgroundImage.getWidth();
                const bgHeight = backgroundImage.getHeight();

                const avatar1X = Math.floor(bgWidth / 4) - (avatarSize / 2); // Left quarter
                const avatar2X = Math.floor(bgWidth * 3 / 4) - (avatarSize / 2); // Right quarter
                const avatarY = Math.floor(bgHeight / 2) - (avatarSize / 2) - 50; // Slightly above center

                const heartX = Math.floor(bgWidth / 2) - (resizedHeart.getWidth() / 2);
                const heartY = Math.floor(bgHeight / 2) - (resizedHeart.getHeight() / 2);

                // Composite avatars and heart onto the background
                backgroundImage.composite(circularAvatar1.resize(avatarSize, avatarSize), avatar1X, avatarY);
                backgroundImage.composite(circularAvatar2.resize(avatarSize, avatarSize), avatar2X, avatarY);
                // Optionally add the heart icon if you want it in the middle.
                // For the provided backgrounds, placing the `pairing.png` icon might look off.
                // If you want a small heart between them, you might consider drawing a simpler one or finding a better icon.
                // For now, I'll omit the `pairing.png` icon since the backgrounds are already full of hearts/balloons.
                // If you wish to include it, uncomment the line below and adjust position.
                // backgroundImage.composite(resizedHeart, heartX, heartY);


                // Add text for compatibility score
                const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK); // Or FONT_SANS_32_BLACK, FONT_SANS_128_BLACK
                const textColor = 0xFF0000FF; // Red color for text (RGBA)

                const text = `Compatibility: ${randomPercentage}`;
                const textWidth = jimp.measureText(font, text);
                const textX = Math.floor((bgWidth - textWidth) / 2);
                const textY = bgHeight - 100; // Position near the bottom

                backgroundImage.print(font, textX, textY, {
                    text: text,
                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                }, bgWidth, bgHeight);


                // Save final image
                const finalBuffer = await backgroundImage.getBufferAsync("image/png");
                fs.writeFileSync(finalImagePath, finalBuffer);

                // Create message with mentions
                const messageBody = `💘 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${senderName}, 𝗒𝗈𝗎 𝗃𝗎𝗌𝗍 𝗀𝗈𝗍 𝗉𝖺𝗂𝗋𝖾𝖽 𝗐𝗂𝗍𝗁 ${participantName}!\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗌𝖼𝗈𝗋𝖾: ${randomPercentage}`;

                const mentions = [
                    { tag: senderName, id: senderID },
                    { tag: participantName, id: randomParticipantID }
                ];

                // Send the message with image
                await message.reply({
                    body: messageBody,
                    mentions: mentions,
                    attachment: fs.createReadStream(finalImagePath)
                });

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖾𝗋𝗋𝗈𝗋:", imageError);

                // Fallback: send text-only message
                const fallbackMessage = `💘 𝖢𝗈𝗇𝗀𝗋𝖺𝗍𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌 ${senderName}, 𝗒𝗈𝗎 𝗃𝗎𝗌𝗍 𝗀𝗈𝗍 𝗉𝖺𝗂𝗋𝖾𝖽 𝗐𝗂𝗍𝗁 ${participantName}!\n✨ 𝖢𝗈𝗆𝗉𝖺𝗍𝗂𝖻𝗂𝗅𝗂𝗍𝗒 𝗌𝖼𝗈𝗋𝖾: ${randomPercentage}\n\n(𝖨𝗆𝖺𝗀𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾)`;

                const mentions = [
                    { tag: senderName, id: senderID },
                    { tag: participantName, id: randomParticipantID }
                ];

                await message.reply({
                    body: fallbackMessage,
                    mentions: mentions
                });
            } finally {
                // Clean up temporary files
                try {
                    const filesToClean = [backgroundPath, finalImagePath]; // Avatars are now buffers, no need to clean temp files for them
                    for (const filePath of filesToClean) {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝗐𝖺𝗋𝗇𝗂𝗇𝗀:", cleanupError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖯𝖺𝗂𝗋 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);

            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";

            if (error.message.includes('network') || error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('timeout')) {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }

            await message.reply(errorMessage);
        }
    }
};
