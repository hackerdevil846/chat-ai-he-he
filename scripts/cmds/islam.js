const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "islam",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "islamic",
        shortDescription: {
            en: "Get Islamic inspirational videos"
        },
        longDescription: {
            en: "Sends random Islamic inspirational videos with Quranic recitations"
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
            await message.reply("🕌 Islamic Content Module\n📖 Type 'islam' to get Islamic inspirational videos");
        } catch (error) {
            console.error("Start Error:", error);
        }
    },

    onChat: async function ({ event, message }) {
        try {
            if (event.body && event.body.toLowerCase().trim() === "islam") {
                await this.handleIslamicVideo({ message });
            }
        } catch (error) {
            console.error("Chat Error:", error);
        }
    },

    handleIslamicVideo: async function ({ message }) {
        let videoPath = null;
        let processingMsg = null;
        
        try {
            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            processingMsg = await message.reply("📥 Getting Islamic video for you... Please wait");

            // Islamic video URLs
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

            // Select random video
            const randomIndex = Math.floor(Math.random() * islamicVideos.length);
            const randomVideo = islamicVideos[randomIndex];
            
            // Create unique file path
            videoPath = path.join(cacheDir, `islamic_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
            
            console.log(`Downloading video ${randomIndex + 1}/${islamicVideos.length}: ${randomVideo}`);

            // Download video with timeout and error handling
            const response = await axios({
                method: 'GET',
                url: randomVideo,
                responseType: 'stream',
                timeout: 120000, // 2 minutes timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': '*/*',
                    'Connection': 'keep-alive'
                },
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Accept redirects
                }
            });

            // Write file to disk
            const writer = fs.createWriteStream(videoPath);
            response.data.pipe(writer);

            // Wait for download to complete
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
                response.data.on('error', reject);
            });

            // Verify the downloaded file
            const stats = fs.statSync(videoPath);
            if (stats.size === 0) {
                throw new Error("Downloaded file is empty (0 bytes)");
            }

            if (stats.size < 1024) {
                throw new Error("Downloaded file is too small (may be invalid)");
            }

            console.log(`✅ Video downloaded successfully: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

            // Send the video
            await message.reply({
                body: `🕌 Assalamu Alaikum\n\n📖 Holy Quran Recitation\n✨ May Allah bless you and increase your faith`,
                attachment: fs.createReadStream(videoPath)
            });

            console.log("✅ Islamic video sent successfully");

        } catch (error) {
            console.error("❌ Islamic Video Error:", error.message);
            
            // Send error message
            try {
                await message.reply("❌ Failed to download Islamic video. Please try again later.");
            } catch (replyError) {
                console.error("❌ Failed to send error message:", replyError.message);
            }
            
        } finally {
            // Cleanup processing message
            if (processingMsg && processingMsg.messageID) {
                try {
                    await message.unsend(processingMsg.messageID);
                    console.log("✅ Processing message cleaned up");
                } catch (unsendError) {
                    console.warn("⚠️ Could not unsend processing message:", unsendError.message);
                }
            }
            
            // Cleanup video file
            if (videoPath) {
                try {
                    if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                        console.log("✅ Temporary video file cleaned up");
                    }
                } catch (cleanupError) {
                    console.warn("⚠️ Could not clean up video file:", cleanupError.message);
                }
            }
        }
    }
};
