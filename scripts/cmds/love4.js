const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const Jimp = require("jimp");

module.exports = {
    config: {
        name: "love4",
        aliases: [],
        version: "1.0.1",
        author: "Asif Mahmud", // Retaining your author name
        countDown: 5,
        role: 0,
        category: "edit-img",
        shortDescription: {
            en: "𝐂𝐫𝐞𝐚𝐭𝐞 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐭𝐰𝐨 𝐮𝐬𝐞𝐫𝐬 💖" // Retaining Unicode as requested
        },
        longDescription: {
            en: "𝐂𝐫𝐞𝐚𝐭𝐞𝐬 𝐚 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐰𝐨 𝐮𝐬𝐞𝐫𝐬' 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞𝐬" // Retaining Unicode as requested
        },
        guide: {
            en: "{p}love4 [@𝐭𝐚𝐠]" // Retaining Unicode as requested
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "jimp": ""
        }
    },

    /**
     * Called when the command is loaded.
     * Ensures the cache directory exists and downloads the template image if necessary.
     */
    onLoad: async function () {
        console.log("🔄 𝐈𝐧𝐢𝐭𝐢𝐚𝐥𝐢𝐳𝐢𝐧𝐠 𝐥𝐨𝐯𝐞𝟒 𝐜𝐨𝐦𝐦𝐚𝐧𝐝...");

        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template.png");

        try {
            // Ensure cache directory exists
            if (!fs.existsSync(cacheDir)) {
                await fs.mkdir(cacheDir, { recursive: true }); // Use await with fs-extra
                console.log("✅ 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐜𝐚𝐜𝐡𝐞 𝐝𝐢𝐫𝐞𝐜𝐭𝐨𝐫𝐲:", cacheDir);
            }

            // Check if the template image already exists and is valid
            if (fs.existsSync(baseImagePath)) {
                const stats = await fs.stat(baseImagePath); // Use await with fs-extra
                if (stats.size > 1000) { // Simple check for a non-empty image file
                    console.log("✅ 𝐋𝐨𝐯𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐞𝐱𝐢𝐬𝐭𝐬 𝐚𝐧𝐝 𝐢𝐬 𝐯𝐚𝐥𝐢𝐝.");
                    return; // Exit if template is good
                } else {
                    console.log("⚠️ 𝐄𝐱𝐢𝐬𝐭𝐢𝐧𝐠 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐬 𝐢𝐧𝐯𝐚𝐥𝐢𝐝 (𝐬𝐢𝐳𝐞 𝟎 𝐨𝐫 𝐭𝐨𝐨 𝐬𝐦𝐚𝐥𝐥), 𝐫𝐞-𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠...");
                    await fs.unlink(baseImagePath); // Delete invalid file (use await)
                }
            }

            // Download the template image
            console.log("📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐥𝐨𝐯𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐟𝐫𝐨𝐦 𝐆𝐨𝐨𝐠𝐥𝐞 𝐃𝐫𝐢𝐯𝐞...");
            const response = await axios({
                method: "GET",
                url: "https://drive.google.com/uc?export=download&id=1ZGGhBH6ed8v4dku83G4NbxuPtNmN2iW9", // DO NOT CHANGE THIS LINK
                responseType: "arraybuffer",
                timeout: 45000, // Increased timeout for better reliability
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "image/png,image/*,*/*" // Explicitly request image types
                },
                // Validate status codes for successful downloads
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Accept 2xx (success) and 3xx (redirection handled by axios)
                }
            });

            if (response.data && response.data.length > 1000) {
                await fs.writeFile(baseImagePath, response.data); // Use await with fs-extra
                console.log("✅ 𝐋𝐨𝐯𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐭𝐨:", baseImagePath);
            } else {
                throw new Error("𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐝𝐚𝐭𝐚 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝 𝐝𝐮𝐫𝐢𝐧𝐠 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 (𝐭𝐨𝐨 𝐬𝐦𝐚𝐥𝐥 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲).");
            }

        } catch (error) {
            console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐝𝐮𝐫𝐢𝐧𝐠 𝐨𝐧𝐋𝐨𝐚𝐝 𝐟𝐨𝐫 𝐥𝐨𝐯𝐞𝟒:", error.message);
            // Re-throw to indicate a critical setup failure if needed, or just log.
            // For a command, logging is usually sufficient for onLoad.
        }
    },

    /**
     * Main command execution logic.
     * Handles user input, image generation, and sending the response.
     */
    onStart: async function ({ message, event, usersData }) {
        let generatedImagePath = null; // Variable to hold the path of the generated image

        try {
            const { senderID, mentions } = event;

            // 1. Input Validation
            if (Object.keys(mentions).length === 0) {
                return message.reply("📍 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐚𝐠 𝟏 𝐩𝐞𝐫𝐬𝐨𝐧 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞!");
            }

            const [mentionId] = Object.keys(mentions);

            if (mentionId === senderID) {
                return message.reply("❌ 𝐘𝐨𝐮 𝐜𝐚𝐧'𝐭 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!");
            }

            // Send a loading message
            const loadingMsg = await message.reply("💖 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐨𝐦𝐚𝐧𝐭𝐢𝐜 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭.");
            console.log(`⏳ 𝐒𝐭𝐚𝐫𝐭𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐟𝐨𝐫 ${senderID} 𝐚𝐧𝐝 ${mentionId}`);

            // 2. Image Generation
            try {
                generatedImagePath = await this.generateLoveImage(senderID, mentionId);

                // Verify the generated image file exists and is not empty
                if (!generatedImagePath || !(await fs.exists(generatedImagePath)) || (await fs.stat(generatedImagePath)).size === 0) {
                    throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐢𝐦𝐚𝐠𝐞 𝐟𝐢𝐥𝐞.");
                }
                console.log("✅ 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲:", generatedImagePath);

                // 3. Prepare message details
                // Get user names with robust fallbacks
                let userName = "𝐘𝐨𝐮";
                try {
                    const userInfo = await usersData.get(senderID);
                    if (userInfo && userInfo.name) userName = userInfo.name;
                } catch (nameError) {
                    console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐠𝐞𝐭 𝐬𝐞𝐧𝐝𝐞𝐫'𝐬 𝐧𝐚𝐦𝐞:", nameError.message);
                }

                let targetName = "𝐓𝐡𝐞𝐦";
                try {
                    const targetInfo = await usersData.get(mentionId);
                    if (targetInfo && targetInfo.name) targetName = targetInfo.name;
                } catch (targetNameError) {
                    console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐠𝐞𝐭 𝐭𝐚𝐫𝐠𝐞𝐭 𝐮𝐬𝐞𝐫'𝐬 𝐧𝐚𝐦𝐞:", targetNameError.message);
                }

                const messageObj = {
                    body: `💌 ${userName} & ${targetName}\n\n𝐋𝐨𝐯𝐞 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡! 🥰`, // Retaining Unicode as requested
                    mentions: [
                        { tag: userName, id: senderID },
                        { tag: targetName, id: mentionId }
                    ],
                    attachment: fs.createReadStream(generatedImagePath) // Ensure stream is created only if path is valid
                };

                // 4. Unsend loading message and send final image
                if (loadingMsg && loadingMsg.messageID) {
                    try {
                        await message.unsend(loadingMsg.messageID);
                        console.log("🧹 𝐔𝐧𝐬𝐞𝐧𝐭 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞.");
                    } catch (unsendError) {
                        console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 (𝐦𝐢𝐠𝐡𝐭 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐛𝐞 𝐮𝐧𝐬𝐞𝐧𝐭 𝐨𝐫 𝐟𝐚𝐢𝐥𝐞𝐝):", unsendError.message);
                    }
                }

                await message.reply(messageObj);
                console.log("✅ 𝐋𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞 𝐬𝐞𝐧𝐭 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲.");

            } catch (imageGenError) {
                console.error("❌ 𝐈𝐦𝐚𝐠𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐨𝐫 𝐬𝐞𝐧𝐝𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫:", imageGenError);

                // Attempt to unsend loading message even on failure
                if (loadingMsg && loadingMsg.messageID) {
                    try {
                        await message.unsend(loadingMsg.messageID);
                    } catch (unsendError) {
                        console.warn("⚠️ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐚𝐟𝐭𝐞𝐫 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐟𝐚𝐢𝐥𝐮𝐫𝐞:", unsendError.message);
                    }
                }
                return message.reply("❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐥𝐨𝐯𝐞 𝐢𝐦𝐚𝐠𝐞. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫. " + imageGenError.message);
            }

        } catch (mainError) {
            console.error("💥 𝐆𝐞𝐧𝐞𝐫𝐚𝐥 𝐋𝐨𝐯𝐞𝟒 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", mainError);

            let errorMessage = "❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";

            if (mainError.code === 'ECONNREFUSED' || mainError.code === 'ENOTFOUND') {
                errorMessage = "❌ 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐢𝐧𝐭𝐞𝐫𝐧𝐞𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.";
            } else if (mainError.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐭𝐢𝐦𝐞𝐝 𝐨𝐮𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧.";
            } else if (mainError.message.includes('Jimp') || mainError.message.includes('image')) {
                errorMessage = "❌ 𝐈𝐦𝐚𝐠𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧. " + mainError.message;
            } else if (mainError.message.includes('avatar')) {
                errorMessage = "❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞𝐬. 𝐓𝐡𝐞𝐲 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐩𝐫𝐢𝐯𝐚𝐭𝐞 𝐨𝐫 𝐚𝐧 𝐢𝐬𝐬𝐮𝐞 𝐰𝐢𝐭𝐡 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤'𝐬 𝐀𝐏𝐈. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
            } else {
                 errorMessage = "❌ 𝐀𝐧 𝐮𝐧𝐞𝐱𝐩𝐞𝐜𝐭𝐞𝐝 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝: " + mainError.message + ". 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";
            }
            await message.reply(errorMessage);
        } finally {
            // Clean up the generated image file regardless of success or failure
            if (generatedImagePath && (await fs.exists(generatedImagePath))) {
                try {
                    await fs.unlink(generatedImagePath); // Use await with fs-extra
                    console.log("🧹 𝐂𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐢𝐦𝐚𝐠𝐞:", generatedImagePath);
                } catch (cleanupError) {
                    console.warn("⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐜𝐥𝐞𝐚𝐧 𝐮𝐩 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐦𝐚𝐠𝐞:", cleanupError.message);
                }
            }
        }
    },

    /**
     * Generates the love image by compositing avatars onto the template.
     * @param {string} user1ID - The ID of the first user.
     * @param {string} user2ID - The ID of the second user.
     * @returns {Promise<string>} - The path to the generated image.
     */
    generateLoveImage: async function (user1ID, user2ID) {
        const cacheDir = path.join(__dirname, "cache");
        const baseImagePath = path.join(cacheDir, "love_template.png");

        // Critical check: Ensure template exists before proceeding
        if (!await fs.exists(baseImagePath) || (await fs.stat(baseImagePath)).size === 0) {
            throw new Error("𝐋𝐨𝐯𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝 𝐨𝐫 𝐢𝐬 𝐞𝐦𝐩𝐭𝐲. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐬𝐮𝐫𝐞 𝐢𝐭'𝐬 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐥𝐲.");
        }

        let baseImage, avatar1, avatar2;

        try {
            console.log("📖 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐟𝐨𝐫 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠...");
            baseImage = await Jimp.read(baseImagePath);
        } catch (templateError) {
            throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐥𝐨𝐚𝐝 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐉𝐢𝐦𝐩: " + templateError.message);
        }

        try {
            console.log(`👤 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐔𝐬𝐞𝐫𝟏 (${user1ID})...`);
            avatar1 = await this.processAvatar(user1ID);
            console.log(`👤 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐔𝐬𝐞𝐫𝟐 (${user2ID})...`);
            avatar2 = await this.processAvatar(user2ID);
        } catch (avatarError) {
            throw new Error("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐚𝐯𝐚𝐭𝐚𝐫𝐬: " + avatarError.message);
        }

        // Define output path for the new image
        const outputPath = path.join(cacheDir, `love4_${user1ID}_${user2ID}_${Date.now()}.png`);

        try {
            // Resize avatars to fit the template circles (assuming 200x200 for good fit)
            const avatarSize = 200;
            avatar1.resize(avatarSize, avatarSize);
            avatar2.resize(avatarSize, avatarSize);

            // Coordinates for avatar placement (top-left corner of the 200x200 avatar)
            // These coordinates are based on the visual analysis of your provided template image
            const x1 = 300; // X-position for the left avatar
            const y1 = 250; // Y-position for the left avatar
            const x2 = 650; // X-position for the right avatar
            const y2 = 250; // Y-position for the right avatar

            console.log("🎨 𝐂𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫𝐬 𝐨𝐧𝐭𝐨 𝐭𝐡𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞...");
            baseImage
                .composite(avatar1, x1, y1)
                .composite(avatar2, x2, y2);

            // Write the final composited image to disk
            await baseImage.writeAsync(outputPath);

            // Final verification of the output file
            if (!await fs.exists(outputPath) || (await fs.stat(outputPath)).size === 0) {
                throw new Error("𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐨𝐮𝐭𝐩𝐮𝐭 𝐢𝐦𝐚𝐠𝐞 𝐟𝐢𝐥𝐞 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲 𝐚𝐟𝐭𝐞𝐫 𝐰𝐫𝐢𝐭𝐢𝐧𝐠.");
            }

            return outputPath;

        } catch (compositeError) {
            throw new Error("𝐈𝐦𝐚𝐠𝐞 𝐜𝐨𝐦𝐩𝐨𝐬𝐢𝐭𝐞 𝐨𝐫 𝐰𝐫𝐢𝐭𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫: " + compositeError.message);
        }
    },

    /**
     * Fetches and processes a user's avatar.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Jimp>} - A Jimp image object of the circular avatar.
     */
    processAvatar: async function (userId) {
        // Facebook Graph API URLs for fetching profile pictures
        const avatarOptions = [
            `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, // Primary with access token
            `https://graph.facebook.com/${userId}/picture?width=512&height=512`, // Fallback without access token
            `https://graph.facebook.com/${userId}/picture?type=large`, // Older type=large
            `https://graph.facebook.com/${userId}/picture`, // Default (might redirect to smaller)
            `https://graph.facebook.com/v19.0/${userId}/picture?width=512&height=512` // Specific API version
        ]; // DO NOT CHANGE THESE LINKS

        let avatarBuffer = null;
        let lastError = null;

        // Try each URL until an avatar is successfully downloaded
        for (const url of avatarOptions) {
            try {
                // console.log(`📥 𝐓𝐫𝐲𝐢𝐧𝐠 𝐚𝐯𝐚𝐭𝐚𝐫 𝐔𝐑𝐋: ${url}`); // Uncomment for verbose debugging
                const response = await axios.get(url, {
                    responseType: "arraybuffer",
                    timeout: 20000, // Increased timeout for better network reliability
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Accept": "image/jpeg,image/png,image/*" // Request common image formats
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 400;
                    }
                });

                if (response.data && response.data.length > 1000) { // Check for valid data length
                    avatarBuffer = Buffer.from(response.data);
                    // console.log(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId}`); // Uncomment for verbose debugging
                    break; // Exit loop on successful download
                } else {
                    throw new Error("𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐝𝐚𝐭𝐚 𝐫𝐞𝐜𝐞𝐢𝐯𝐞𝐝 (𝐭𝐨𝐨 𝐬𝐦𝐚𝐥𝐥 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲).");
                }
            } catch (error) {
                lastError = error;
                // console.warn(`❌ 𝐀𝐯𝐚𝐭𝐚𝐫 𝐔𝐑𝐋 𝐟𝐚𝐢𝐥𝐞𝐝 𝐟𝐨𝐫 ${userId}: ${url} - ${error.message}`); // Uncomment for verbose debugging
                // Continue to the next URL option
            }
        }

        if (!avatarBuffer) {
            throw new Error(`𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${userId} 𝐚𝐟𝐭𝐞𝐫 𝐚𝐥𝐥 𝐚𝐭𝐭𝐞𝐦𝐩𝐭𝐬: ${lastError ? lastError.message : "𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐞𝐫𝐫𝐨𝐫"}`);
        }

        try {
            // Read the avatar buffer into Jimp, crop to a square, and then make it circular
            const avatar = await Jimp.read(avatarBuffer);
            const size = Math.min(avatar.bitmap.width, avatar.bitmap.height); // Get smallest dimension for square crop

            return avatar
                .crop(0, 0, size, size) // Crop to a square from top-left
                .circle(); // Make it circular
        } catch (jimpError) {
            throw new Error(`𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐚𝐯𝐚𝐭𝐚𝐫 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐉𝐢𝐦𝐩: ${jimpError.message}`);
        }
    }
};
