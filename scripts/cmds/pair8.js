const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

// Shared image download function with retry logic
async function downloadBaseImageWithRetry() {
    const dirMaterial = path.resolve(__dirname, "cache", "canvas");
    const arrPath = path.resolve(dirMaterial, "ar1r2.png");

    if (!fs.existsSync(dirMaterial)) {
        fs.mkdirSync(dirMaterial, { recursive: true });
        console.log("✅ Created cache/canvas directory.");
    }

    // If image already exists and is valid, no need to download
    if (fs.existsSync(arrPath)) {
        const stats = fs.statSync(arrPath);
        if (stats.size > 1000) {
            console.log("✅ Base image 'ar1r2.png' already exists and is valid.");
            return true;
        } else {
            console.log("⚠️ Existing base image 'ar1r2.png' is invalid, re-downloading.");
            fs.unlinkSync(arrPath);
        }
    }

    // If another file is currently downloading, wait
    const lockFile = path.resolve(dirMaterial, "downloading_ar1r2.lock");
    if (fs.existsSync(lockFile)) {
        console.log("⏳ Another download is in progress, waiting...");
        let attempts = 0;
        while (fs.existsSync(lockFile) && attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
        if (fs.existsSync(arrPath) && fs.statSync(arrPath).size > 1000) {
            console.log("✅ Base image downloaded by another process while waiting.");
            return true;
        } else if (fs.existsSync(lockFile)) {
            console.warn("⚠️ Waited for download, but lock file still exists. Attempting download.");
            fs.unlinkSync(lockFile);
        }
    }

    // Create lock file and download
    try {
        fs.writeFileSync(lockFile, "downloading");
        console.log("📥 Attempting to download base image 'ar1r2.png'...");

        const imageUrl = "https://i.imgur.com/iaOiAXe.jpeg";
        let lastError;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Download attempt ${attempt} for base image...`);
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    timeout: 20000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Accept": "image/jpeg,image/png,image/*,*/*"
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 400;
                    }
                });
                if (response.data && response.data.length > 1000) {
                    await fs.writeFileSync(arrPath, Buffer.from(response.data));
                    console.log("✅ Base image downloaded successfully.");
                    return true;
                } else {
                    throw new Error("Invalid or empty image data received from URL.");
                }
            } catch (error) {
                lastError = error;
                console.error(`❌ Download attempt ${attempt} failed for base image: ${error.message}`);
                if (attempt < 3) {
                    const delay = attempt * 3000;
                    console.log(`Waiting ${delay}ms before next retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw new Error(`Failed to download base image after multiple retries: ${lastError?.message || 'Unknown error'}`);

    } finally {
        if (fs.existsSync(lockFile)) {
            fs.unlinkSync(lockFile);
            console.log("🔒 Lock file removed.");
        }
    }
}

module.exports = {
    config: {
        name: "pair8",
        aliases: [],
        version: "7.3.1",
        role: 0,
        author: "𝐀𝐬𝐢𝐟 𝐌𝐚𝐡𝐦𝐮𝐝",
        shortDescription: {
            en: "💞 𝐌𝐞𝐧𝐭𝐢𝐨𝐧 𝐭𝐡𝐞 𝐮𝐬𝐞𝐫 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐩𝐚𝐢𝐫𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞"
        },
        longDescription: {
            en: "𝐏𝐥𝐚𝐲 𝐚 𝐟𝐮𝐧 𝐩𝐚𝐢𝐫𝐢𝐧𝐠 𝐠𝐚𝐦𝐞 𝐰𝐢𝐭𝐡 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫"
        },
        category: "𝐈𝐦𝐚𝐠𝐞",
        guide: {
            en: "{p}pair8 [@𝐦𝐞𝐧𝐭𝐢𝐨𝐧]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": ""
        }
    },

    onLoad: async function() {
        try {
            await downloadBaseImageWithRetry();
        } catch (e) {
            console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐝𝐮𝐫𝐢𝐧𝐠 𝐨𝐧𝐋𝐨𝐚𝐝 𝐟𝐨𝐫 𝐩𝐚𝐢𝐫𝟖 𝐜𝐨𝐦𝐦𝐚𝐧𝐝:", e.message);
        }
    },

    onStart: async function({ message, event, usersData }) {
        let pairedImage = null;
        let loadingMessage = null;

        try {
            const { senderID } = event;
            const mention = Object.keys(event.mentions);

            if (!mention.length) {
                return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐬𝐨𝐦𝐞𝐨𝐧𝐞 𝐭𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐚 𝐩𝐚𝐢𝐫𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞!");
            }

            const one = senderID;
            const two = mention[0];

            if (one === two) {
                return message.reply("❌ 𝐘𝐨𝐮 𝐜𝐚𝐧𝐧𝐨𝐭 𝐩𝐚𝐢𝐫 𝐰𝐢𝐭𝐡 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟!");
            }

            loadingMessage = await message.reply("⏳ 𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐩𝐚𝐢𝐫𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞...");

            async function circleImage(imageBuffer) {
                const image = await jimp.read(imageBuffer);
                image.circle();
                return await image.getBufferAsync("image/png");
            }

            async function makeImage({ user1Id, user2Id }) {
                const __root = path.resolve(__dirname, "cache", "canvas");
                const templatePath = path.resolve(__root, 'ar1r2.png');

                // Ensure base image exists before proceeding
                if (!fs.existsSync(templatePath)) {
                    await downloadBaseImageWithRetry();
                    if (!fs.existsSync(templatePath)) {
                        throw new Error("𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 '𝐚𝐫𝟏𝐫𝟐.𝐩𝐧𝐠' 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠 𝐞𝐯𝐞𝐧 𝐚𝐟𝐭𝐞𝐫 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐚𝐭𝐭𝐞𝐦𝐩𝐭.");
                    }
                }

                // Download and process first avatar
                let avatarOneBuffer;
                try {
                    const responseOne = await axios.get(
                        `https://graph.facebook.com/${user1Id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                        { 
                            responseType: 'arraybuffer', 
                            timeout: 20000 
                        }
                    );
                    if (responseOne.data && responseOne.data.length > 1000) {
                        avatarOneBuffer = await circleImage(responseOne.data);
                    } else {
                        throw new Error("𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲 𝐚𝐯𝐚𝐭𝐚𝐫 𝐝𝐚𝐭𝐚 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 𝟏.");
                    }
                } catch (error) {
                    console.error(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝/𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${user1Id}: ${error.message}`);
                    throw new Error("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐬𝐞𝐧𝐝𝐞𝐫'𝐬 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞. 𝐈𝐭 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐩𝐫𝐢𝐯𝐚𝐭𝐞.");
                }

                // Download and process second avatar
                let avatarTwoBuffer;
                try {
                    const responseTwo = await axios.get(
                        `https://graph.facebook.com/${user2Id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                        { 
                            responseType: 'arraybuffer', 
                            timeout: 20000 
                        }
                    );
                    if (responseTwo.data && responseTwo.data.length > 1000) {
                        avatarTwoBuffer = await circleImage(responseTwo.data);
                    } else {
                        throw new Error("𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐨𝐫 𝐞𝐦𝐩𝐭𝐲 𝐚𝐯𝐚𝐭𝐚𝐫 𝐝𝐚𝐭𝐚 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 𝟐.");
                    }
                } catch (error) {
                    console.error(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝/𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐚𝐯𝐚𝐭𝐚𝐫 𝐟𝐨𝐫 𝐮𝐬𝐞𝐫 ${user2Id}: ${error.message}`);
                    throw new Error("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫'𝐬 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞. 𝐈𝐭 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐩𝐫𝐢𝐯𝐚𝐭𝐞.");
                }

                // Read template and avatars
                const template = await jimp.read(templatePath);
                const avatarOneJimp = await jimp.read(avatarOneBuffer);
                const avatarTwoJimp = await jimp.read(avatarTwoBuffer);

                // Resize avatars to fit
                const avatarSize = 200;
                avatarOneJimp.resize(avatarSize, avatarSize);
                avatarTwoJimp.resize(avatarSize, avatarSize);

                // Position avatars on template
                // Left avatar position
                const x1 = 125;
                const y1 = 115;
                // Right avatar position
                const x2 = 475;
                const y2 = 115;

                template.composite(avatarOneJimp, x1, y1)
                        .composite(avatarTwoJimp, x2, y2);

                const outputPath = path.resolve(__root, `pair_${user1Id}_${user2Id}_${Date.now()}.png`);
                await template.writeAsync(outputPath);

                return outputPath;
            }

            pairedImage = await makeImage({ user1Id: one, user2Id: two });

            // Get user names
            const senderName = await usersData.getName(one) || "𝐒𝐞𝐧𝐝𝐞𝐫";
            const mentionedName = await usersData.getName(two) || "𝐌𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐔𝐬𝐞𝐫";

            const replyBody = `✨╭──•◈•───✮───•◈•──╮\n\n  「 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 」\n\n╰──•◈•───✮───•◈•──╯\n\n🥀 | 𝐏𝐚𝐢𝐫𝐞𝐝 𝐰𝐢𝐭𝐡: @${mentionedName}`;

            await message.unsend(loadingMessage.messageID);

            await message.reply({
                body: replyBody,
                mentions: [{
                    tag: mentionedName,
                    id: two
                }],
                attachment: fs.createReadStream(pairedImage)
            });

        } catch (error) {
            console.error("❌ 𝐏𝐚𝐢𝐫𝟖 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", error);
            
            let errorMessage = "⚠️ 𝐄𝐫𝐫𝐨𝐫 𝐢𝐧 𝐢𝐦𝐚𝐠𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫.";

            if (error.message.includes("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐬𝐞𝐧𝐝𝐞𝐫'𝐬 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞")) {
                errorMessage = "❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐲𝐨𝐮𝐫 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞. 𝐈𝐭 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐩𝐫𝐢𝐯𝐚𝐭𝐞.";
            } else if (error.message.includes("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫'𝐬 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞")) {
                errorMessage = "❌ 𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐟𝐞𝐭𝐜𝐡 𝐭𝐡𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐞𝐝 𝐮𝐬𝐞𝐫'𝐬 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞. 𝐈𝐭 𝐦𝐢𝐠𝐡𝐭 𝐛𝐞 𝐩𝐫𝐢𝐯𝐚𝐭𝐞.";
            } else if (error.message.includes("𝐁𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞")) {
                errorMessage = "❌ 𝐂𝐫𝐢𝐭𝐢𝐜𝐚𝐥 𝐞𝐫𝐫𝐨𝐫: 𝐁𝐚𝐬𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞 𝐢𝐦𝐚𝐠𝐞 𝐢𝐬 𝐦𝐢𝐬𝐬𝐢𝐧𝐠. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐨𝐧𝐭𝐚𝐜𝐭 𝐚𝐝𝐦𝐢𝐧.";
            } else if (error.message.includes("𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞")) {
                errorMessage = "❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐭𝐡𝐞 𝐛𝐚𝐬𝐞 𝐢𝐦𝐚𝐠𝐞 𝐭𝐞𝐦𝐩𝐥𝐚𝐭𝐞. 𝐂𝐡𝐞𝐜𝐤 𝐢𝐧𝐭𝐞𝐫𝐧𝐞𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧.";
            }

            if (loadingMessage && loadingMessage.messageID) {
                try {
                    await message.unsend(loadingMessage.messageID);
                } catch (unsendError) {
                    console.warn("𝐂𝐨𝐮𝐥𝐝 𝐧𝐨𝐭 𝐮𝐧𝐬𝐞𝐧𝐝 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐨𝐧 𝐞𝐫𝐫𝐨𝐫:", unsendError.message);
                }
            }
            await message.reply(errorMessage);
        } finally {
            if (pairedImage && fs.existsSync(pairedImage)) {
                try {
                    fs.unlinkSync(pairedImage);
                    console.log("🧹 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐩𝐚𝐢𝐫𝐞𝐝 𝐢𝐦𝐚𝐠𝐞 𝐜𝐥𝐞𝐚𝐧𝐞𝐝 𝐮𝐩.");
                } catch (e) {
                    console.error("❌ 𝐄𝐫𝐫𝐨𝐫 𝐜𝐥𝐞𝐚𝐧𝐢𝐧𝐠 𝐮𝐩 𝐭𝐞𝐦𝐩𝐨𝐫𝐚𝐫𝐲 𝐩𝐚𝐢𝐫𝐞𝐝 𝐢𝐦𝐚𝐠𝐞:", e);
                }
            }
        }
    }
};
