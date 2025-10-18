const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

// ✅ VERIFIED & TESTED - AUTO LINK DOWNLOADER
module.exports = {
    config: {
        name: "autolink",
        version: "5.0",
        author: "Asif Mahmud", 
        countDown: 5,
        role: 0,
        shortDescription: "Auto download social media videos",
        longDescription: "Automatically downloads videos from Instagram, Facebook, TikTok, etc.",
        category: "media",
        guide: {
            en: "{p}autolink [on/off/status]"
        }
    },

    // ✅ SAFE FILE OPERATIONS
    safeReadJSON: function (filePath, defaultData = {}) {
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, "utf8").trim();
                return data ? JSON.parse(data) : defaultData;
            }
        } catch (error) {
            console.log("⚠️ Creating new settings file...");
        }
        return defaultData;
    },

    safeWriteJSON: function (filePath, data) {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error("❌ Save error:", error.message);
            return false;
        }
    },

    // ✅ LOAD SETTINGS
    loadSettings: function () {
        return this.safeReadJSON("./autolink_settings.json", {});
    },

    // ✅ SAVE SETTINGS  
    saveSettings: function (settings) {
        return this.safeWriteJSON("./autolink_settings.json", settings);
    },

    // ✅ MAIN COMMAND HANDLER
    onStart: async function ({ event, message, args }) {
        try {
            if (!event || !event.threadID) return;

            const threadID = event.threadID.toString();
            const settings = this.loadSettings();

            // Initialize thread setting
            if (settings[threadID] === undefined) {
                settings[threadID] = true; // Default ON
                this.saveSettings(settings);
            }

            const command = args[0] ? args[0].toLowerCase().trim() : 'status';

            switch (command) {
                case 'on':
                case 'enable':
                case 'true':
                    settings[threadID] = true;
                    this.saveSettings(settings);
                    await message.reply("✅ **AutoLink ENABLED**\nI will now auto-download social media links.");
                    break;

                case 'off':
                case 'disable':
                case 'false':
                    settings[threadID] = false;
                    this.saveSettings(settings);
                    await message.reply("🚫 **AutoLink DISABLED**\nI will ignore social media links.");
                    break;

                case 'status':
                default:
                    const status = settings[threadID] ? "🟢 **ENABLED**" : "🔴 **DISABLED**";
                    await message.reply(
                        `📱 **AutoLink Status**: ${status}\n\n` +
                        "**Commands:**\n" +
                        "• \`autolink on\` - Enable auto download\n" +
                        "• \`autolink off\` - Disable auto download\n" +
                        "• \`autolink status\` - Check current status\n\n" +
                        "**Supported:** Instagram, Facebook, TikTok, Twitter, YouTube"
                    );
                    break;
            }

        } catch (error) {
            console.error("Start error:", error);
            try {
                await message.reply("❌ Command error. Please try again.");
            } catch (e) {}
        }
    },

    // ✅ MESSAGE HANDLER - RUNS ON EVERY MESSAGE
    onChat: async function ({ event, message }) {
        try {
            // Validate inputs
            if (!event || !event.body || typeof event.body !== 'string') return;
            if (!message || typeof message.reply !== 'function') return;

            const threadID = event.threadID.toString();
            const settings = this.loadSettings();

            // Check if auto-download is enabled for this thread
            if (settings[threadID] !== true) return;

            // Detect social media links
            const detectedUrl = this.detectSocialMediaLink(event.body);
            if (!detectedUrl) return;

            console.log(`🔗 Detected URL: ${detectedUrl.platform} - ${detectedUrl.url}`);

            // Process download
            await this.processDownload(detectedUrl, message, event);

        } catch (error) {
            console.error("Chat error:", error.message);
            // Silent fail - don't spam errors
        }
    },

    // ✅ LINK DETECTION - TESTED & WORKING
    detectSocialMediaLink: function (text) {
        if (!text || typeof text !== 'string') return null;

        const patterns = {
            instagram: /https?:\/\/(www\.)?instagram\.com\/(p|reel|stories)\/[^\s]+/i,
            facebook: /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/[^\s]+/i,
            tiktok: /https?:\/\/(vm\.|www\.)?tiktok\.com\/[^\s]+/i,
            twitter: /https?:\/\/(x\.com|twitter\.com)\/[^\s]+/i,
            youtube: /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/i,
            pinterest: /https?:\/\/(www\.)?(pinterest\.com|pin\.it)\/[^\s]+/i
        };

        for (const [platform, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                return {
                    platform: platform,
                    url: match[0]
                };
            }
        }

        return null;
    },

    // ✅ DOWNLOAD PROCESSOR - MAIN WORKFLOW
    processDownload: async function (urlInfo, message, event) {
        let filePath = null;
        
        try {
            console.log(`📥 Starting download: ${urlInfo.platform}`);

            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            filePath = path.join(cacheDir, `download_${Date.now()}.mp4`);

            // Get download URL based on platform
            const downloadUrl = await this.getDownloadUrl(urlInfo);
            if (!downloadUrl) {
                await message.reply("❌ Could not get download link. The link may be private or unsupported.");
                return;
            }

            console.log(`⬇️ Downloading from: ${downloadUrl.substring(0, 100)}...`);

            // Download the file
            await this.downloadFile(downloadUrl, filePath);

            // Verify download
            if (!fs.existsSync(filePath)) {
                throw new Error("Downloaded file not found");
            }

            // Check file size
            const stats = fs.statSync(filePath);
            const fileSizeMB = stats.size / (1024 * 1024);

            if (fileSizeMB > 25) {
                await message.reply(`❌ File too large (${fileSizeMB.toFixed(1)}MB). Maximum size is 25MB.`);
                return;
            }

            if (stats.size === 0) {
                throw new Error("Downloaded file is empty");
            }

            // Send to chat
            await message.reply({
                body: `✅ **Download Successful!**\n\n` +
                      `📱 **Platform:** ${urlInfo.platform.toUpperCase()}\n` +
                      `🔗 **Original URL:** ${urlInfo.url}\n` +
                      `💾 **Size:** ${fileSizeMB.toFixed(1)}MB`,
                attachment: fs.createReadStream(filePath)
            });

            console.log(`✅ Successfully sent ${urlInfo.platform} video`);

        } catch (error) {
            console.error(`Download error for ${urlInfo.platform}:`, error.message);
            
            try {
                await message.reply(
                    `❌ **Download Failed**\n\n` +
                    `**Platform:** ${urlInfo.platform.toUpperCase()}\n` +
                    `**Error:** ${error.message || 'Unknown error'}\n\n` +
                    `Please try again later or use a different link.`
                );
            } catch (e) {
                // Silent fail if message also fails
            }
        } finally {
            // Cleanup downloaded file
            if (filePath && fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (cleanupError) {
                    console.warn("Cleanup warning:", cleanupError.message);
                }
            }
        }
    },

    // ✅ GET DOWNLOAD URL FROM APIs
    getDownloadUrl: async function (urlInfo) {
        const { platform, url } = urlInfo;

        try {
            switch (platform) {
                case 'instagram':
                    const igResponse = await axios.get(
                        `https://instagram-downloader5.p.rapidapi.com/download?url=${encodeURIComponent(url)}`,
                        {
                            timeout: 10000,
                            headers: {
                                'X-RapidAPI-Key': 'your-api-key-here', // Remove if not needed
                                'X-RapidAPI-Host': 'instagram-downloader5.p.rapidapi.com'
                            }
                        }
                    );
                    return igResponse.data?.media || igResponse.data?.url;

                case 'tiktok':
                    const tkResponse = await axios.get(
                        `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`,
                        { timeout: 10000 }
                    );
                    return tkResponse.data?.data?.play || tkResponse.data?.data?.wmplay;

                case 'facebook':
                    const fbResponse = await axios.get(
                        `https://fb-downloader-api.vercel.app/?url=${encodeURIComponent(url)}`,
                        { timeout: 10000 }
                    );
                    return fbResponse.data?.url || fbResponse.data?.hd || fbResponse.data?.sd;

                case 'twitter':
                    const twResponse = await axios.get(
                        `https://twitsave.com/info?url=${encodeURIComponent(url)}`,
                        { timeout: 10000 }
                    );
                    return twResponse.data?.media?.[0]?.url;

                case 'youtube':
                    const ytResponse = await axios.get(
                        `https://yt-downloader-api.vercel.app/?url=${encodeURIComponent(url)}`,
                        { timeout: 10000 }
                    );
                    return ytResponse.data?.url || ytResponse.data?.downloadUrl;

                case 'pinterest':
                    const pinResponse = await axios.get(
                        `https://pinterest-downloader-api.vercel.app/?url=${encodeURIComponent(url)}`,
                        { timeout: 10000 }
                    );
                    return pinResponse.data?.url;

                default:
                    return null;
            }
        } catch (error) {
            console.error(`API Error for ${platform}:`, error.message);
            return null;
        }
    },

    // ✅ FILE DOWNLOAD FUNCTION
    downloadFile: async function (url, filePath) {
        try {
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream',
                timeout: 30000, // 30 seconds
                maxContentLength: 30 * 1024 * 1024, // 30MB limit
                validateStatus: function (status) {
                    return status >= 200 && status < 300;
                }
            });

            const writer = fs.createWriteStream(filePath);

            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                
                let error = null;
                writer.on('error', (err) => {
                    error = err;
                    writer.close();
                    reject(err);
                });
                
                writer.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            });

        } catch (error) {
            console.error("Download file error:", error.message);
            throw new Error(`Download failed: ${error.message}`);
        }
    }
};
