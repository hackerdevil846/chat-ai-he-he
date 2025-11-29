const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

module.exports = {
    config: {
        name: "fbautodownload",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "Automatically download Facebook videos from shared links"
        },
        longDescription: {
            en: "✨ Automatically download Facebook videos from shared links using multiple APIs"
        },
        guide: {
            en: "Just send a Facebook video link"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message }) {
        return message.reply(
            `🎭 | 𝖤𝗂 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖽𝗂𝗋𝖾𝖼𝗍𝗅𝗒 𝗎𝗌𝖾 𝖼𝗈𝗋𝗍𝖾 𝗁𝗈𝖻𝖾 𝗇𝖺!\n✦ 𝖩𝗎𝗌𝗍 𝖾𝗄𝗍𝖺 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝗏𝗂𝖽𝖾𝗈 𝗅𝗂𝗇𝗄 𝗉𝖺𝗍𝗁𝖺𝗈, 𝖺𝗋 𝖺𝗆𝗂 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖼𝗈𝗋𝖾 𝗉𝖺𝗍𝗁𝖺𝗂 𝖽𝗂𝖻𝗈 ✨`
        );
    },

    onChat: async function({ message, event }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            if (event.type !== "message" || !event.body) return;
            
            // Regex for FB Links
            const fbRegex = /^(https?:\/\/)?(www\.|web\.|m\.)?facebook\.com\/(share|reel|watch|story\.php|video\.php)\/.+/i;
            const fbRegex2 = /^(https?:\/\/)?(www\.)?fb\.watch\/.+/i;
            const fbRegex3 = /^(https?:\/\/)?(www\.)?fb\.gg\/.+/i;
            
            if (!fbRegex.test(event.body) && !fbRegex2.test(event.body) && !fbRegex3.test(event.body)) return;
            
            const loadingMsg = await message.reply("🔄 | 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝗌𝗎𝗋𝗎 𝗁𝗈𝖼𝖼𝗁𝖾, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...");
            
            // Try multiple download methods
            let videoUrl = null;
            let lastError = null;
            const link = event.body;
            
            // ✅ UPDATED WORKING APIS LIST
            const downloadApis = [
                {
                    name: "JOSH-API",
                    url: `https://api.joshweb.click/api/facebook?url=${encodeURIComponent(link)}`,
                    handler: (response) => response.data?.result?.hd || response.data?.result?.sd || response.data?.data?.url
                },
                {
                    name: "KAIZ-API",
                    url: `https://kaiz-apis.gleeze.com/api/fbdl?url=${encodeURIComponent(link)}`,
                    handler: (response) => response.data?.videoUrl || response.data?.hd
                },
                {
                    name: "DAVID-API",
                    url: `https://api.davidcyriltech.my.id/facebook?url=${encodeURIComponent(link)}`,
                    handler: (response) => response.data?.videoUrl || response.data?.direct_url
                }
            ];
            
            // Try each API loop
            for (const api of downloadApis) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${api.name}...`);
                    
                    const response = await axios.get(api.url, {
                        timeout: 10000, // 10s timeout per API
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                        }
                    });
                    
                    videoUrl = api.handler(response);
                    
                    if (videoUrl) {
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖿𝗋𝗈𝗆 ${api.name}`);
                        break;
                    } 
                    
                } catch (apiError) {
                    console.error(`❌ ${api.name} 𝖿𝖺𝗂𝗅𝖾𝖽.`);
                    continue;
                }
            }
            
            if (!videoUrl) {
                await message.unsendMessage(loadingMsg.messageID);
                return message.reply(
                    "❌ | 𝖲𝗈𝗋𝗋𝗒! 𝖪𝗈𝗇𝗈 𝖠𝖯𝖨 𝖽𝗂𝗒𝖾𝗂 𝗏𝗂𝖽𝖾𝗈 𝗉𝖺𝗈𝗐𝖺 𝗀𝖾𝗅𝗈 𝗇𝖺. 𝖫𝗂𝗇𝗄 𝗍𝗂 𝗉𝗋𝗂𝗏𝖺𝗍𝖾 𝗁𝗈𝗍𝖾 𝗉𝖺𝗋𝖾."
                );
            }
            
            // Download the video stream
            const tempPath = path.join(os.tmpdir(), `fb_vid_${Date.now()}.mp4`);
            
            try {
                const response = await axios({
                    method: 'GET',
                    url: videoUrl,
                    responseType: 'stream',
                    timeout: 60000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    }
                });

                const writer = fs.createWriteStream(tempPath);
                response.data.pipe(writer);
                
                await new Promise((resolve, reject) => {
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                });
                
                const stats = await fs.stat(tempPath);
                
                // Size Check (25MB standard Messenger Limit, extended to 45MB for some bots)
                if (stats.size > 48 * 1024 * 1024) { 
                    await fs.unlink(tempPath);
                    await message.unsendMessage(loadingMsg.messageID);
                    return message.reply("❌ | 𝖵𝗂𝖽𝖾𝗈 𝗍𝗂 𝗈𝗇𝖾𝗄 𝖻𝗈𝗋𝗈 (𝟦𝟧𝖬𝖡+), 𝗍𝖺𝗂 𝗉𝖺𝗍𝗁𝖺𝗇𝗈 𝗃𝖺𝖼𝖼𝗁𝖾 𝗇𝖺!");
                }
                
                await message.unsendMessage(loadingMsg.messageID);
                
                await message.reply({
                    body: `✅ | 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽!`,
                    attachment: fs.createReadStream(tempPath)
                });
                
                // Cleanup
                await fs.unlink(tempPath);
                
            } catch (downloadError) {
                if (await fs.pathExists(tempPath)) await fs.unlink(tempPath);
                await message.unsendMessage(loadingMsg.messageID);
                return message.reply("❌ | 𝖵𝗂𝖽𝖾𝗈 𝗉𝖺𝗈𝗐𝖺 𝗀𝖾𝖼𝗁𝖾 𝗄𝗂𝗇𝗍𝗎 𝗉𝖺𝗍𝗁𝖺𝗍𝖾 𝗌𝗈𝗆𝗈𝗌𝗌𝖺 𝗁𝗈𝖼𝖼𝗁𝖾 (Size/Network issue).");
            }
            
        } catch (error) {
            console.error("💥 FB Auto Error:", error);
        }
    }
};
