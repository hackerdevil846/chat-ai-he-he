const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "islam",
        aliases: [],
        version: "1.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "𝗂𝗌𝗅𝖺𝗆𝗂𝖼",
        shortDescription: {
            en: "𝖦𝖾𝗍 𝗋𝖺𝗇𝖽𝗈𝗆 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗂𝗇𝗌𝗉𝗂𝗋𝖺𝗍𝗂𝗈𝗇𝖺𝗅 𝗏𝗂𝖽𝖾𝗈𝗌"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽𝗌 𝖺 𝗋𝖺𝗇𝖽𝗈𝗆 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗂𝗇𝗌𝗉𝗂𝗋𝖺𝗍𝗂𝗈𝗇𝖺𝗅 𝗏𝗂𝖽𝖾𝗈 𝗐𝗂𝗍𝗁 𝖺 𝗀𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝖺𝗇𝖽 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗈𝖿 𝖻𝗅𝖾𝗌𝗌𝗂𝗇𝗀."
        },
        guide: {
            en: "{p}islam"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function ({ message }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const islamDesign = `🕌 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗆𝗈𝖽𝗎𝗅𝖾 𝗂𝗌 𝗋𝖾𝖺𝖽𝗒!\n📖 𝖳𝗒𝗉𝖾 '𝗂𝗌𝗅𝖺𝗆' 𝗍𝗈 𝗀𝖾𝗍 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗂𝗇𝗌𝗉𝗂𝗋𝖺𝗍𝗂𝗈𝗇𝖺𝗅 𝗏𝗂𝖽𝖾𝗈𝗌`;
            await message.reply(islamDesign);
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖲𝗍𝖺𝗋𝗍:", error);
        }
    },

    onChat: async function ({ event, message }) {
        try {
            if (event.body && event.body.toLowerCase().trim() === "islam") {
                await this.handleIslamicVideo({ message, event });
            }
        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖢𝗁𝖺𝗍:", error);
        }
    },

    handleIslamicVideo: async function ({ message, event }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

            const cacheDir = path.join(__dirname, 'cache');
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝖼𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋:", dirError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒.");
            }

            const processingMsg = await message.reply("📥 𝖦𝖾𝗍𝗍𝗂𝗇𝗀 𝖺𝗇 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗏𝗂𝖽𝖾𝗈 𝖿𝗈𝗋 𝗒𝗈𝗎... 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍");

            const greetings = [
                `🕌 𝖠𝗌𝗌𝖺𝗅𝖺𝗆𝗎 𝖠𝗅𝖺𝗂𝗄𝗎𝗆! 🖤💫\n📖 𝖡𝗋𝗈𝗍𝗁𝖾𝗋𝗌 𝖺𝗇𝖽 𝗌𝗂𝗌𝗍𝖾𝗋𝗌 - 𝖨 𝖻𝗋𝗈𝗎𝗀𝗁𝗍 𝗒𝗈𝗎\n📖 𝖧𝗈𝗅𝗒 𝖰𝗎𝗋'𝖺𝗇 𝗋𝖾𝖼𝗂𝗍𝖺𝗍𝗂𝗈𝗇`,
                `🕌 𝖠𝗌𝗌𝖺𝗅𝖺𝗆𝗎 𝖠𝗅𝖺𝗂𝗄𝗎𝗆 𝖶𝖺𝖱𝖺𝗁𝗆𝖺𝗍𝗎𝗅𝗅𝖺𝗁𝗂 𝖶𝖺𝖡𝖺𝗋𝖺𝗄𝖺𝗍𝗎𝗁𝗎\n📖 𝖲𝖾𝗅𝖾𝖼𝗍𝖾𝖽 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗈𝗋 𝗒𝗈𝗎\n📖 𝗐𝗂𝗍𝗁 𝖠𝗅𝗅𝖺𝗁'𝗌 𝗆𝖾𝗋𝖼𝗒`,
                `🕌 𝖠𝗌𝗌𝖺𝗅𝖺𝗆𝗎 𝖠𝗅𝖺𝗂𝗄𝗎𝗆 𝖻𝗋𝗈𝗍𝗁𝖾𝗋𝗌 𝖺𝗇𝖽 𝗌𝗂𝗌𝗍𝖾𝗋𝗌!\n📖 𝖠 𝗀𝗂𝖿𝗍 𝖿𝗈𝗋 𝗒𝗈𝗎𝗋 𝗌𝗉𝗂𝗋𝗂𝗍𝗎𝖺𝗅 𝗇𝗈𝗎𝗋𝗂𝗌𝗁𝗆𝖾𝗇𝗍\n📖 𝗍𝗁𝗂𝗌 𝗏𝗂𝖽𝖾𝗈 𝗂𝗌 𝖿𝗈𝗋 𝗒𝗈𝗎`
            ];
            
            const islamicVideos = [
                "https://drive.usercontent.google.com/download?id=1Y5O3qRzxt-MFR4vVhz0QsMwHQmr-34iH&export=download",
                "https://drive.usercontent.google.com/download?id=1YDyNrN-rnzsboFmYm8Q5-FhzoJD9WV3O&export=download",
                "https://drive.usercontent.google.com/download?id=1XzgEzopoYBfuDzPsml5-RiRnItXVx4zW&export=download",
                "https://drive.usercontent.google.com/download?id=1YEeal83MYRI9sjHuEhJdjXZo9nVZmfHD&export=download",
                "https://drive.usercontent.google.com/download?id=1YMEDEKVXjnHE0KcCJHbcT2PSbu8uGSk4&export=download",
                "https://drive.usercontent.google.com/download?id=1YRb2k01n4rIdA9Vf69oxIOdv54JyAprG&export=download",
                "https://drive.usercontent.google.com/download?id=1YSQCTVhrHTNl6B9xSBCQ7frBJ3bp_KoA&export=download",
                "https://drive.usercontent.google.com/download?id=1Yc9Rwwdpqha1AWeEb5BXV-goFbag0441&export=download",
                "https://drive.usercontent.google.com/download?id=1YcwtkC5wRbbHsAFuEQYQuwQsH4-ZiBS8&export=download",
                "https://drive.usercontent.google.com/download?id=1YhfyPl8oGmsIAIOjWQyzQYkDdZUPSalo&export=download"
            ];

            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            const randomVideo = islamicVideos[Math.floor(Math.random() * islamicVideos.length)];
            
            const videoPath = path.join(cacheDir, `islamic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`);
            
            console.log(`📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗏𝗂𝖽𝖾𝗈 𝖿𝗋𝗈𝗆: ${randomVideo}`);

            try {
                const response = await axios({
                    method: 'GET',
                    url: randomVideo,
                    responseType: 'stream',
                    timeout: 60000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                const writer = fs.createWriteStream(videoPath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                // Verify file was downloaded successfully
                const stats = await fs.stat(videoPath);
                if (stats.size === 0) {
                    throw new Error("𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝖿𝗂𝗅𝖾 𝗂𝗌 𝖾𝗆𝗉𝗍𝗒");
                }

                console.log(`✅ 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗏𝗂𝖽𝖾𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 (${(stats.size / 1024 / 1024).toFixed(2)}𝖬𝖡)`);

                const finalMessage = `${randomGreeting}\n\n✅ 𝖧𝗈𝗅𝗒 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝗏𝗂𝖽𝖾𝗈 𝗌𝖾𝗇𝗍 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!\n📖 𝖬𝖺𝗒 𝖠𝗅𝗅𝖺𝗁 𝗂𝗇𝖼𝗋𝖾𝖺𝗌𝖾 𝗒𝗈𝗎𝗋 𝖿𝖺𝗂𝗍𝗁`;
                
                await message.reply({
                    body: finalMessage,
                    attachment: fs.createReadStream(videoPath)
                });

                // Clean up file
                await fs.unlink(videoPath);
                console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗏𝗂𝖽𝖾𝗈 𝖿𝗂𝗅𝖾");
                
            } catch (downloadError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗏𝗂𝖽𝖾𝗈:", downloadError.message);
                throw new Error(`𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗏𝗂𝖽𝖾𝗈: ${downloadError.message}`);
            }

            // Unsend processing message
            try {
                if (processingMsg && processingMsg.messageID) {
                    await message.unsend(processingMsg.messageID);
                }
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

        } catch (error) {
            console.error("💥 𝖨𝗌𝗅𝖺𝗆𝗂𝖼 𝖵𝗂𝖽𝖾𝗈 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Clean up on error
            try {
                const videoPath = path.join(__dirname, 'cache', `islamic_*.mp4`);
                const files = await fs.readdir(path.dirname(videoPath));
                const islamicFiles = files.filter(f => f.startsWith('islamic_') && f.endsWith('.mp4'));
                
                for (const file of islamicFiles) {
                    try {
                        await fs.unlink(path.join(path.dirname(videoPath), file));
                    } catch (cleanupError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝗂𝗅𝖾:", cleanupError.message);
                    }
                }
            } catch (cleanupError) {
                console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError.message);
            }
            
            // Don't send error message to avoid spam
        }
    }
};
