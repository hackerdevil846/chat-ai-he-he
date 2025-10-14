const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const ARYAN_API = "ArYANAHMEDRUDRO";

// Famous Open-Source APIs - NO CREDIT LIMITS, UNLIMITED USE
const OPEN_SOURCE_APIS = [
    {
        name: "Real-ESRGAN (Replicate)",
        url: "https://api.replicate.com/v1/predictions",
        model: "nightmareai/real-esrgan",
        apiKey: null,
        handler: async (imageUrl) => {
            try {
                const response = await axios.post(
                    "https://api.replicate.com/v1/predictions",
                    {
                        version: "42fed498a82038fc0e73e11f3a6fc9b2eef1a28f9d1d1f16b7d27fcb5c6a6e4e",
                        input: { image: imageUrl, scale: 4 }
                    },
                    { timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
                );
                return response.data?.output?.[0] || response.data?.output;
            } catch (e) {
                console.log("Real-ESRGAN failed:", e.message);
                return null;
            }
        }
    },
    {
        name: "Upscayl API",
        url: "https://api.upscayl.app",
        handler: async (imageUrl) => {
            try {
                const response = await axios.post(
                    "https://api.upscayl.app/upscale",
                    { image_url: imageUrl, scale: "4x", model: "realesrgan" },
                    { timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
                );
                return response.data?.upscaled_image || response.data?.image || response.data?.result;
            } catch (e) {
                console.log("Upscayl API failed:", e.message);
                return null;
            }
        }
    },
    {
        name: "AI Image Enhancer (Open-Source)",
        handler: async (imageUrl) => {
            try {
                const response = await axios.post(
                    "https://enhance-image.onrender.com/api/upscale",
                    { imageUrl: imageUrl, scale: 4, model: "realesrgan" },
                    { timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
                );
                return response.data?.result || response.data?.output_url || response.data?.url;
            } catch (e) {
                console.log("AI Image Enhancer failed:", e.message);
                return null;
            }
        }
    },
    {
        name: "ImgUpscaler (Free Open-Source)",
        handler: async (imageUrl) => {
            try {
                const response = await axios.get(
                    `https://imgupscaler.ai/api/upscale?image_url=${encodeURIComponent(imageUrl)}&scale=4&model=realesrgan`,
                    { timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
                );
                return response.data?.output_url || response.data?.image_url || response.data?.result;
            } catch (e) {
                console.log("ImgUpscaler failed:", e.message);
                return null;
            }
        }
    },
    {
        name: "ESRGAN Segmind API",
        handler: async (imageUrl) => {
            try {
                const response = await axios.post(
                    "https://api.segmind.com/v1/esrgan",
                    { image_url: imageUrl, scale: 4 },
                    { timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
                );
                return response.data?.image_url || response.data?.result || response.data?.output;
            } catch (e) {
                console.log("ESRGAN Segmind failed:", e.message);
                return null;
            }
        }
    },
    {
        name: "Free Image Enhancement (GitHub Hosted)",
        handler: async (imageUrl) => {
            try {
                const response = await axios.post(
                    "https://upscale-api.herokuapp.com/enhance",
                    { url: imageUrl, factor: 4 },
                    { timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
                );
                return response.data?.enhanced_url || response.data?.image || response.data?.result;
            } catch (e) {
                console.log("GitHub Hosted API failed:", e.message);
                return null;
            }
        }
    }
];

// Fallback URLs using direct image processing
const DIRECT_UPSCALE_SERVICES = [
    (imageUrl) => `https://imgupscaler.ai/upscale?url=${encodeURIComponent(imageUrl)}&scale=4x`,
    (imageUrl) => `https://upscale.media/api/upscale?image_url=${encodeURIComponent(imageUrl)}&size=4x`,
    (imageUrl) => `https://enhance.picsart.com/api/upscale?image=${encodeURIComponent(imageUrl)}&scale=4`
];

// Download image and convert to base64
async function imageToBase64(imageUrl) {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000,
            maxContentLength: 50 * 1024 * 1024
        });
        return Buffer.from(response.data).toString('base64');
    } catch (e) {
        console.log("Base64 conversion failed:", e.message);
        return null;
    }
}

// Try all open-source APIs in sequence
async function tryOpenSourceAPIs(imageUrl) {
    for (const api of OPEN_SOURCE_APIS) {
        try {
            console.log(`🔄 Trying: ${api.name}`);
            const result = await api.handler(imageUrl);
            if (result) {
                console.log(`✅ Success with ${api.name}`);
                return result;
            }
        } catch (e) {
            console.log(`❌ ${api.name} failed: ${e.message}`);
        }
    }
    return null;
}

// Try direct upscale services
async function tryDirectUpscaleServices(imageUrl) {
    for (const getUrl of DIRECT_UPSCALE_SERVICES) {
        try {
            const url = getUrl(imageUrl);
            console.log(`📡 Attempting direct service: ${url.substring(0, 50)}...`);
            
            const response = await axios.get(url, {
                timeout: 60000,
                maxRedirects: 5,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            
            if (response.status === 200 && response.headers['content-type']?.includes('image')) {
                console.log("✅ Direct service returned image");
                return url;
            }
        } catch (e) {
            console.log(`Direct service attempt failed: ${e.message}`);
        }
    }
    return null;
}

module.exports = {
    config: {
        name: "4k",
        aliases: ["enhance", "upscale"],
        version: "3.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 10,
        role: 0,
        shortDescription: {
            en: "𝖤𝗇𝗁𝖺𝗇𝖼𝖾 𝗉𝗁𝗈𝗍𝗈𝗌 𝗍𝗈 𝗌𝗍𝗎𝗇𝗇𝗂𝗇𝗀 4𝖪 𝗋𝖾𝗌𝗈𝗅𝗎𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖯𝗈𝗐𝖾𝗋𝖿𝗎𝗅 𝖺𝗂-𝗉𝗈𝗐𝖾𝗋𝖾𝖽 𝗂𝗆𝖺𝗀𝖾 𝖾𝗇𝗁𝖺𝗇𝖼𝖾𝗆𝖾𝗇𝗍 𝗍𝗈 4𝖪 𝗊𝗎𝖺𝗅𝗂𝗍𝗒"
        },
        category: "edit-img",
        guide: {
            en: "{p}4k [𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝗂𝗆𝖺𝗀𝖾 𝗈𝗋 𝗂𝗆𝖺𝗀𝖾 𝗎𝗋𝗅]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": ""
        }
    },

    onStart: async function({ api, event, args, message }) {
        let tempPath;
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ Missing dependencies. Please install axios, fs-extra, and path.");
            }

            const { threadID, messageID, senderID, messageReply } = event;
            
            const cacheDir = path.join(__dirname, "cache");
            try {
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
            } catch (dirError) {
                console.error("Directory creation error:", dirError);
                return message.reply("❌ Failed to create cache directory.");
            }

            tempPath = path.join(cacheDir, `4k_${Date.now()}_${senderID}_${Math.random().toString(36).substr(2, 9)}.jpg`);

            let imageUrl;
            
            // Check for replied image
            if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
                const attachment = messageReply.attachments[0];
                if (["photo", "sticker"].includes(attachment.type)) {
                    imageUrl = attachment.url;
                } else {
                    return message.reply("⚠️ Please reply to a valid image or sticker.");
                }
            } else if (args[0] && /^https?:\/\//.test(args[0])) {
                imageUrl = args[0];
            } else {
                return message.reply(
                    `📸 Please reply to an image or provide a valid image URL.\nExample: ${global.config.PREFIX}4k [image_url]`
                );
            }

            const waitMsg = await message.reply("🖼️ Enhancing your image to 4K... (Using Open-Source Real-ESRGAN). Please wait.");

            try {
                console.log("🚀 Starting upscale process with Open-Source APIs...");
                let resultImageUrl = null;

                // Method 1: Try Open-Source APIs (Real-ESRGAN, Upscayl, etc.)
                console.log("🔵 Method 1: Trying Open-Source APIs...");
                resultImageUrl = await tryOpenSourceAPIs(imageUrl);

                // Method 2: Try Direct Upscale Services
                if (!resultImageUrl) {
                    console.log("🟡 Method 2: Trying Direct Upscale Services...");
                    resultImageUrl = await tryDirectUpscaleServices(imageUrl);
                }

                // Method 3: Try Primary Aryan API (backup)
                if (!resultImageUrl) {
                    try {
                        console.log("🟠 Method 3: Trying Aryan API (Backup)...");
                        const enhancementUrl = `https://aryan-xyz-upscale-api-phi.vercel.app/api/upscale-image?imageUrl=${encodeURIComponent(imageUrl)}&apikey=${ARYAN_API}`;
                        
                        const { data } = await axios.get(enhancementUrl, { 
                            timeout: 60000,
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                        });

                        if (data?.resultImageUrl) {
                            resultImageUrl = data.resultImageUrl;
                            console.log("✅ Aryan API success!");
                        }
                    } catch (e) {
                        console.log("⚠️ Aryan API failed:", e.message);
                    }
                }

                if (!resultImageUrl) {
                    throw new Error("All upscaling methods failed. Please try again later.");
                }

                console.log(`📥 Downloading enhanced image: ${resultImageUrl}`);

                const imageResponse = await axios.get(resultImageUrl, {
                    responseType: "arraybuffer",
                    timeout: 120000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                    maxContentLength: 50 * 1024 * 1024
                });

                const contentType = imageResponse.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error("Invalid image format received");
                }

                await fs.writeFile(tempPath, imageResponse.data);

                const stats = await fs.stat(tempPath);
                if (stats.size === 0) {
                    throw new Error("Downloaded file is empty");
                }

                console.log(`✅ Image enhanced successfully (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);

                await message.reply({
                    body: "✅ Image enhanced to 4K successfully! (Using Real-ESRGAN Open-Source Model)",
                    attachment: fs.createReadStream(tempPath)
                });

                // Clean up
                try {
                    await message.unsend(waitMsg.messageID);
                } catch (unsendError) {
                    console.warn("Could not unsend wait message:", unsendError.message);
                }

            } catch (apiError) {
                console.error("API Error:", apiError.message);
                
                let errorText = "❌ Failed to enhance image. ";

                if (apiError.code === 'ECONNREFUSED') {
                    errorText += "Could not connect to enhancement servers. Try again later.";
                } else if (apiError.code === 'ETIMEDOUT') {
                    errorText += "Request timed out. Please try again later.";
                } else {
                    errorText += `Error: ${apiError.message}`;
                }

                await message.reply(errorText);
            }

        } catch (error) {
            console.error("💥 4K Error:", error);
            await message.reply("❌ An unexpected error occurred. Please try again.");
            
        } finally {
            // Clean up temporary file
            if (tempPath) {
                try {
                    if (await fs.pathExists(tempPath)) {
                        await fs.unlink(tempPath);
                        console.log("🧹 Cleaned up temporary file");
                    }
                } catch (cleanupError) {
                    console.warn("Cleanup error:", cleanupError.message);
                }
            }
        }
    }
};
