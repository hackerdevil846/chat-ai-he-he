const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "anisearch",
        aliases: [],
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        version: "2.1",
        countDown: 15,
        role: 0,
        category: "𝗆𝖾𝖽𝗂𝖺",
        shortDescription: {
            en: "𝖲𝖾𝖺𝗋𝖼𝗁 𝖳𝗂𝗄𝖳𝗈𝗄 𝖺𝗇𝗂𝗆𝖾 𝖾𝖽𝗂𝗍 𝗏𝗂𝖽𝖾𝗈𝗌"
        },
        longDescription: {
            en: "𝖲𝖾𝖺𝗋𝖼𝗁 𝖺𝗇𝖽 𝖿𝖾𝗍𝖼𝗁 𝖳𝗂𝗄𝖳𝗈𝗄 𝖺𝗇𝗂𝗆𝖾 𝖾𝖽𝗂𝗍 𝗏𝗂𝖽𝖾𝗈𝗌 𝖻𝖺𝗌𝖾𝖽 𝗈𝗇 𝗒𝗈𝗎𝗋 𝗊𝗎𝖾𝗋𝗒"
        },
        guide: {
            en: "{p}anisearch [𝗊𝗎𝖾𝗋𝗒]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ api, event, args, message }) {
        try {
            // 𝖣𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗒 𝖼𝗁𝖾𝖼𝗄
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            // 𝖲𝖾𝗍 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            try {
                api.setMessageReaction("🕐", event.messageID, () => {}, true);
            } catch (reactionError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
            }

            // 𝖭𝗈 𝗊𝗎𝖾𝗋𝗒 𝖼𝗁𝖾𝖼𝗄
            if (!args[0]) {
                return message.reply("🔍 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗌𝖾𝖺𝗋𝖼𝗁 𝗊𝗎𝖾𝗋𝗒 (𝖾.𝗀., 𝗇𝖺𝗋𝗎𝗍𝗈 𝖿𝗂𝗀𝗁𝗍)");
            }

            const userQuery = args.join(' ').trim();
            
            // 𝖵𝖺𝗅𝗂𝖽𝖺𝗍𝖾 𝗊𝗎𝖾𝗋𝗒 𝗅𝖾𝗇𝗀𝗍𝗁
            if (userQuery.length > 50) {
                return message.reply("❌ 𝖰𝗎𝖾𝗋𝗒 𝗂𝗌 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 50 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            const query = encodeURIComponent(userQuery + " anime edit");
            const apiUrl = `https://mahi-apis.onrender.com/api/tiktok?search=${query}`;

            console.log(`🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋: ${userQuery}`);
            console.log(`🔗 𝖠𝖯𝖨 𝖴𝖱𝖫: ${apiUrl}`);

            const loadingMsg = await message.reply("⏳ 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋 𝖺𝗇𝗂𝗆𝖾 𝖾𝖽𝗂𝗍𝗌...");

            // 𝖥𝖾𝗍𝖼𝗁 𝗏𝗂𝖽𝖾𝗈𝗌
            let videos;
            try {
                const response = await axios.get(apiUrl, {
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                videos = response.data.data;

                if (!videos || videos.length === 0) {
                    await message.unsend(loadingMsg.messageID);
                    return message.reply("❌ 𝖭𝗈 𝗏𝗂𝖽𝖾𝗈𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗊𝗎𝖾𝗋𝗒");
                }
            } catch (apiError) {
                console.error("❌ 𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError.message);
                await message.unsend(loadingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝗏𝗂𝖽𝖾𝗈𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            // 𝖯𝗂𝖼𝗄 𝗋𝖺𝗇𝖽𝗈𝗆 𝗏𝗂𝖽𝖾𝗈
            const videoData = videos[Math.floor(Math.random() * videos.length)];
            const videoUrl = videoData.video;
            const title = videoData.title || "𝖴𝗇𝗍𝗂𝗍𝗅𝖾𝖽";

            console.log(`🎬 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝗏𝗂𝖽𝖾𝗈: ${title}`);
            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖴𝖱𝖫: ${videoUrl}`);

            // 𝖢𝖺𝖼𝗁𝖾 𝗌𝖾𝗍𝗎𝗉
            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("❌ 𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖾𝗋𝗋𝗈𝗋:", dirError);
                await message.unsend(loadingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const tempPath = path.join(cacheDir, `anitok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`);

            // 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈
            try {
                const writer = fs.createWriteStream(tempPath);
                const videoResponse = await axios({
                    method: 'get',
                    url: videoUrl,
                    responseType: 'stream',
                    timeout: 45000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.tiktok.com/'
                    },
                    maxContentLength: 50 * 1024 * 1024 // 50MB 𝗅𝗂𝗆𝗂𝗍
                });

                videoResponse.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                // 𝖢𝗁𝖾𝖼𝗄 𝖿𝗂𝗅𝖾 𝗌𝗂𝗓𝖾
                const stats = await fs.stat(tempPath);
                const fileSize = (stats.size / (1024 * 1024)).toFixed(2);

                if (parseFloat(fileSize) > 25) {
                    await fs.unlink(tempPath);
                    await message.unsend(loadingMsg.messageID);
                    return message.reply(`❌ 𝖵𝗂𝖽𝖾𝗈 𝗂𝗌 𝗍𝗈𝗈 𝗅𝖺𝗋𝗀𝖾 (${fileSize}𝖬𝖡). 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 𝗌𝗂𝗓𝖾 𝗂𝗌 25𝖬𝖡.`);
                }

                console.log(`✅ 𝖵𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${fileSize}𝖬𝖡)`);

            } catch (downloadError) {
                console.error("❌ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", downloadError.message);
                
                // 𝖢𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽
                try {
                    if (await fs.pathExists(tempPath)) {
                        await fs.unlink(tempPath);
                    }
                } catch (cleanupError) {
                    console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
                }

                await message.unsend(loadingMsg.messageID);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
            }

            // 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            try {
                api.setMessageReaction("✅", event.messageID, () => {}, true);
            } catch (reactionError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
            }

            // 𝖴𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾
            try {
                await message.unsend(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            // 𝖲𝖾𝗇𝖽 𝗏𝗂𝖽𝖾𝗈
            await message.reply({
                body: `╔════════════════╗
   𝕬𝖓𝖎𝖒𝖊 𝕰𝖉𝖎𝖙
╚════════════════╝

🎬 𝖳𝗂𝗍𝗅𝖾: ${title}
🔍 𝖰𝗎𝖾𝗋𝗒: ${userQuery}
✨ 𝖤𝗇𝗃𝗈𝗒 𝗍𝗁𝖾 𝖺𝗇𝗂𝗆𝖾 𝖾𝖽𝗂𝗍!`,
                attachment: fs.createReadStream(tempPath)
            });

            console.log("✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖺𝗇𝗂𝗆𝖾 𝖾𝖽𝗂𝗍");

            // 𝖢𝗅𝖾𝖺𝗇 𝗎𝗉
            try {
                await fs.unlink(tempPath);
                console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾");
            } catch (cleanupError) {
                console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
            }

        } catch (error) {
            console.error("💥 𝖠𝗇𝗂𝗌𝖾𝖺𝗋𝖼𝗁 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // 𝖲𝗂𝗅𝖾𝗇𝗍 𝖿𝖺𝗂𝗅 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
            try {
                api.setMessageReaction("❌", event.messageID, () => {}, true);
            } catch (reactionError) {
                // 𝖨𝗀𝗇𝗈𝗋𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋𝗌
            }
        }
    }
};
