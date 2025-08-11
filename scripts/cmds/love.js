/**
 * @warn Do not edit code or edit credits
 */

module.exports.config = {
    name: "love",
    version: "1.0.1",
    permission: 0,
    credits: "Asif",
    description: "Create a love image with two users",
    prefix: true,
    category: "Love",
    usages: "love @[mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onStart = async function() {
    return true;
};

module.exports.run = async function({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    const mentionedUsers = Object.keys(mentions);
    if (mentionedUsers.length === 0) {
        return api.sendMessage("Please tag 1 person", threadID, messageID);
    }

    const mentionedUserID = mentionedUsers[0];
    const mentionedName = mentions[mentionedUserID].replace("@", "");

    try {
        const imageBuffer = await generateLoveImage(senderID, mentionedUserID);
        const message = {
            body: `👉 ${mentionedName} loves you so much 🥰'”`,
            mentions: [
                { tag: mentionedName, id: mentionedUserID }
            ],
            attachment: global.nodemodule["fs-extra"].createReadStream(imageBuffer)
        };

        api.sendMessage(message, threadID, (error, info) => {
            if (!error) {
                setTimeout(() => {
                    try {
                        global.nodemodule["fs-extra"].unlinkSync(imageBuffer);
                    } catch (e) {
                        console.error("Error deleting temporary file:", e);
                    }
                }, 30000);
            }
        }, messageID);

    } catch (error) {
        console.error("Error in love command:", error);
        api.sendMessage("Failed to generate love image. Please try again later.", threadID, messageID);
    }
};

async function generateLoveImage(user1ID, user2ID) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const Jimp = global.nodemodule["jimp"];

    // Create necessary directories
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) {
        await fs.mkdir(cachePath, { recursive: true });
    }

    // Base image path with proper Google Drive URL
    const baseImagePath = path.join(cachePath, "love_template.png");

    // Download base image if not already present
    if (!fs.existsSync(baseImagePath)) {
        try {
            const response = await axios({
                method: 'get',
                url: 'https://drive.google.com/uc?export=download&id=1z3KKYHQMJsfgn4JPypgq-MsttM0b-OLY',
                responseType: 'stream'
            });

            await new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(baseImagePath);
                response.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log("Base image downloaded successfully");
        } catch (error) {
            console.error("Failed to download base image:", error);
            throw error;
        }
    }

    // Generate unique filenames
    const outputFilename = `love_${user1ID}_${user2ID}_${Date.now()}.png`;
    const user1AvatarPath = path.join(cachePath, `avt_${user1ID}.png`);
    const user2AvatarPath = path.join(cachePath, `avt_${user2ID}.png`);
    const outputPath = path.join(cachePath, outputFilename);

    // Download avatars
    const [user1Avatar, user2Avatar] = await Promise.all([
        downloadAvatar(user1ID, user1AvatarPath),
        downloadAvatar(user2ID, user2AvatarPath)
    ]);

    // Load and process images
    try {
        let baseImage = await Jimp.read(baseImagePath);
        let user1Processed = await processAvatar(await Jimp.read(user1AvatarPath));
        let user2Processed = await processAvatar(await Jimp.read(user2AvatarPath));

        // Composite images onto base
        baseImage.resize(1024, 767)
            .composite([user1Processed.resize(180, 180), 200, 160])
            .composite([user2Processed.resize(180, 180), 680, 160]);

        // Add text
        let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        baseImage.print(font, 450, 600, "LOVE", 30);

        // Save result
        await baseImage.writeAsync(outputPath);

        return outputPath;
    } catch (error) {
        console.error("Error processing images:", error);
        throw error;
    } finally {
        // Clean up temporary files
        try {
            if (fs.existsSync(user1AvatarPath)) fs.unlinkSync(user1AvatarPath);
            if (fs.existsSync(user2AvatarPath)) fs.unlinkSync(user2AvatarPath);
        } catch (error) {
            console.error("Error cleaning up temporary files:", error);
        }
    }
}

async function downloadAvatar(userID, savePath) {
    try {
        // Try multiple avatar sources with different parameters
        const avatarSources = [
            `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=cuhNoHmveJa6nM_aSTyO kapitMfh4aYTitYrl0VHLKD9ln0yFsrIu62Ln5kaTH`,
            `https://graph.facebook.com/${userID}/picture?width=512&height=512`,
            `https://graph.facebook.com/${userID}/picture`
        ];

        for (const source of avatarSources) {
            try {
                const response = await axios.get(source, { responseType: 'arraybuffer' });
                if (response.data) {
                    await fs.writeFile(savePath, Buffer.from(response.data), 'binary');
                    return savePath;
                }
            } catch (error) {
                console.log(`Failed to download avatar from ${source}, trying next source...`);
            }
        }

        throw new Error(`Failed to download avatar for user ${userID} after trying all sources`);
    } catch (error) {
        console.error("Error downloading avatar:", error);
        throw error;
    }
}

async function processAvatar(avatar) {
    try {
        // Make sure the avatar is square
        if (avatar.bitmap.width > avatar.bitmap.height) {
            const size = avatar.bitmap.height;
            avatar = avatar.crop(0, 0, size, size).resize(size, size);
        } else if (avatar.bitmap.height > avatar.bitmap.width) {
            const size = avatar.bitmap.width;
            avatar = avatar.crop(0, 0, size, size).resize(size, size);
        }

        // Create a subtle white background for better transparency
        const circleBorder = new Jimp(200, 200, 0xFFFFFFFF);
        circleBorder.circle();
        avatar.composite(circleBorder, 0, 0, {
            mode: Jimp.BlendSourceOver,
            opacity: 0.2
        });

        // Apply blur effect for smoother appearance
        avatar.gaussian(1);

        // Circle crop the avatar
        avatar.circle();

        return avatar;
    } catch (error) {
        console.error("Error processing avatar:", error);
        throw error;
    }
}
