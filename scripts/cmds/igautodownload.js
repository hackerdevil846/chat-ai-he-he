const fs = require("fs-extra");
const axios = require("axios");
const { createWriteStream } = require("fs");
const { tmpdir } = require("os");
const { join } = require("path");
const { randomBytes } = require("crypto");

module.exports.config = {
    name: "igautodownload",
    aliases: ["igdl", "instagramdl"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "utility",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑣𝑖𝑑𝑒𝑜𝑠"
    },
    longDescription: {
        en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑠 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑣𝑖𝑑𝑒𝑜𝑠 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑤ℎ𝑒𝑛 𝑎 𝑙𝑖𝑛𝑘 𝑖𝑠 𝑠𝑒𝑛𝑡"
    },
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑠𝑒𝑛𝑑 𝑎𝑛 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
        "instagram-url-direct": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    return message.reply(
        "✨ | 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑑𝑜𝑒𝑠𝑛'𝑡 𝑛𝑒𝑒𝑑 𝑎 𝑝𝑟𝑒𝑓𝑖𝑥!\n𝐽𝑢𝑠𝑡 𝑠𝑒𝑛𝑑 𝑎𝑛 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑣𝑖𝑑𝑒𝑜 𝑙𝑖𝑛𝑘 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡 💙",
        event.threadID,
        event.messageID
    );
};

module.exports.onChat = async function({ message, event, api }) {
    if (event.type !== "message" || !event.body) return;

    const instaRegex = /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|stories)\/([^\/\s?]+)/gi;
    const instaMatch = event.body.match(instaRegex);
    
    if (!instaMatch) return;

    for (const url of instaMatch) {
        let tempFilePath = null;
        try {
            await message.reply("⬇️ | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑣𝑖𝑑𝑒𝑜...", event.threadID);

            let results;
            try {
                console.log(`𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑈𝑅𝐿: ${url}`);
                
                // Try to require the instagram module
                let getInstagram;
                try {
                    getInstagram = require("instagram-url-direct");
                    // Handle both default and named exports
                    if (typeof getInstagram !== 'function') {
                        getInstagram = getInstagram.default || Object.values(getInstagram)[0];
                    }
                } catch (moduleError) {
                    console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚-𝑢𝑟𝑙-𝑑𝑖𝑟𝑒𝑐𝑡:", moduleError.message);
                    await message.reply(
                        "⚠️ | 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑚𝑎𝑛𝑢𝑎𝑙𝑙𝑦: 𝑛𝑝𝑚 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑖𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚-𝑢𝑟𝑙-𝑑𝑖𝑟𝑒𝑐𝑡",
                        event.threadID
                    );
                    continue;
                }
                
                results = await getInstagram(url);
                
                if (!results || !results.results) {
                    throw new Error("𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑓𝑟𝑜𝑚 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝐴𝑃𝐼");
                }
                
                console.log(`𝐹𝑜𝑢𝑛𝑑 ${results.results.length} 𝑚𝑒𝑑𝑖𝑎 𝑖𝑡𝑒𝑚𝑠`);
            } catch (libError) {
                console.error("𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟 𝑙𝑖𝑏𝑟𝑎𝑟𝑦 𝑒𝑟𝑟𝑜𝑟:", libError.message);
                await message.reply(
                    "⚠️ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑡ℎ𝑖𝑠 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑙𝑖𝑛𝑘. 𝐼𝑡 𝑚𝑖𝑔ℎ𝑡 𝑏𝑒 𝑝𝑟𝑖𝑣𝑎𝑡𝑒 𝑜𝑟 𝑢𝑛𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒.",
                    event.threadID
                );
                continue;
            }

            if (results.results.length === 0) {
                await message.reply(
                    "❌ | 𝑁𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑎𝑏𝑙𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡 𝑡ℎ𝑖𝑠 𝑙𝑖𝑛𝑘!",
                    event.threadID
                );
                continue;
            }

            // Get the highest quality video
            const videoResults = results.results.filter(r => r.type === 'video');
            const bestResult = videoResults.length > 0 ? videoResults[0] : results.results[0];
            
            if (!bestResult.url) {
                throw new Error("𝑁𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑈𝑅𝐿 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒");
            }

            const hdLink = bestResult.url;
            console.log("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑟𝑜𝑚:", hdLink);

            // Download the video with timeout and proper headers
            const response = await axios.get(hdLink, { 
                responseType: "stream", 
                timeout: 60000,
                headers: {
                    '𝑈𝑠𝑒𝑟-𝐴𝑔𝑒𝑛𝑡': '𝑀𝑜𝑧𝑖𝑙𝑙𝑎/5.0 (𝑊𝑖𝑛𝑑𝑜𝑤𝑠 𝑁𝑇 10.0; 𝑊𝑖𝑛64; 𝑥64) 𝐴𝑝𝑝𝑙𝑒𝑊𝑒𝑏𝐾𝑖𝑡/537.36 (𝐾𝐻𝑇𝑀𝐿, 𝑙𝑖𝑘𝑒 𝐺𝑒𝑐𝑘𝑜) 𝐶ℎ𝑟𝑜𝑚𝑒/91.0.4472.124 𝑆𝑎𝑓𝑎𝑟𝑖/537.36',
                    '𝐴𝑐𝑐𝑒𝑝𝑡': '*/*',
                    '𝐴𝑐𝑐𝑒𝑝𝑡-𝐸𝑛𝑐𝑜𝑑𝑖𝑛𝑔': '𝑖𝑑𝑒𝑛𝑡𝑖𝑡𝑦',
                    '𝐶𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛': '𝑘𝑒𝑒𝑝-𝑎𝑙𝑖𝑣𝑒'
                }
            });

            // Create temporary file
            const randomName = randomBytes(16).toString("hex");
            tempFilePath = join(tmpdir(), `𝑖𝑔_𝑣𝑖𝑑𝑒𝑜_${randomName}.𝑚𝑝4`);

            const writer = createWriteStream(tempFilePath);
            response.data.pipe(writer);

            // Wait for download to complete
            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
                response.data.on("error", reject);
            });

            // Verify the downloaded file
            const stats = fs.statSync(tempFilePath);
            if (stats.size === 0) {
                throw new Error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑓𝑖𝑙𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
            }

            console.log(`𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑐𝑜𝑚𝑝𝑙𝑒𝑡𝑒𝑑. 𝐹𝑖𝑙𝑒 𝑠𝑖𝑧𝑒: ${stats.size} 𝑏𝑦𝑡𝑒𝑠`);

            // Send the video
            await message.reply({
                body: "✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑦𝑜𝑢𝑟 𝑣𝑖𝑑𝑒𝑜!\n𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
                attachment: fs.createReadStream(tempFilePath)
            }, event.threadID);

        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝐼𝑛𝑠𝑡𝑎𝑔𝑟𝑎𝑚 𝑣𝑖𝑑𝑒𝑜:", error.message);
            await message.reply(
                "❌ | 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑! 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.",
                event.threadID
            );
        } finally {
            // Clean up temporary file
            if (tempFilePath) {
                try {
                    if (fs.existsSync(tempFilePath)) {
                        fs.unlinkSync(tempFilePath);
                        console.log("𝑇𝑒𝑚𝑝𝑜𝑟𝑎𝑟𝑦 𝑓𝑖𝑙𝑒 𝑐𝑙𝑒𝑎𝑛𝑒𝑑 𝑢𝑝");
                    }
                } catch (cleanupError) {
                    console.error("𝐶𝑙𝑒𝑎𝑛𝑢𝑝 𝑓𝑎𝑖𝑙𝑒𝑑:", cleanupError.message);
                }
            }
        }
    }
};
