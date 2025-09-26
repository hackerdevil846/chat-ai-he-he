const axios = require("axios");
const fs = require("fs-extra");
const google = require("googlethis");
const cloudscraper = require("cloudscraper");

module.exports.config = {
    name: "imagesearch",
    aliases: [],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝐴𝑑𝑣𝑎𝑛𝑐𝑒𝑑 𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑"
    },
    longDescription: {
        en: "𝑆𝑒𝑎𝑟𝑐ℎ 𝑎𝑛𝑑 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝐺𝑜𝑜𝑔𝑙𝑒"
    },
    guide: {
        en: "{p}imagesearch [𝑡𝑒𝑥𝑡] -[𝑛𝑢𝑚𝑏𝑒𝑟 𝑜𝑓 𝑖𝑚𝑎𝑔𝑒𝑠]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "googlethis": "",
        "cloudscraper": ""
    },
    envConfig: {
        maxResults: 12
    }
};

module.exports.onStart = async function({ message, args, event, api }) {
    try {
        // Parse arguments
        let query = "";
        let imageCount = 6; // Default number of images
        
        if (event.type === "message_reply") {
            query = event.messageReply.body;
        } else {
            const argsList = args.join(" ").split("-");
            query = argsList[0].trim();
            
            if (argsList.length > 1 && !isNaN(argsList[1])) {
                imageCount = parseInt(argsList[1]);
                // Limit to max 12 images to avoid performance issues
                imageCount = Math.min(imageCount, global.configModule[this.config.name].envConfig.maxResults);
            }
        }
        
        if (!query) {
            return message.reply(`🔍 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚\n\n📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒:\n• ${global.config.PREFIX}imagesearch cats\n• ${global.config.PREFIX}imagesearch beautiful scenery -8`);
        }
        
        // Send searching message
        await message.reply(`🔍 | 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑓𝑜𝑟 "${query}"...\n⏳ | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡...`);

        // Perform search
        let result = await google.image(query, { safe: false });
        
        if (result.length === 0) {
            return message.reply(`❌ | 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${query}"\n\n💡 𝑇𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚`);
        }

        let streams = [];
        let counter = 0;
        
        // Create cache directory if it doesn't exist
        if (!fs.existsSync(__dirname + '/cache')) {
            fs.mkdirSync(__dirname + '/cache');
        }

        // Download images
        for (let image of result) {
            if (counter >= imageCount) break;
            
            // Check if URL is valid image
            if (!/\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(image.url)) continue;
            
            let path = __dirname + `/cache/image-${Date.now()}-${counter}.jpg`;
            
            try {
                const response = await cloudscraper.get({
                    uri: image.url,
                    encoding: null,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                
                fs.writeFileSync(path, response);
                streams.push(fs.createReadStream(path));
                counter++;
            } catch (error) {
                console.log("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
                // Clean up failed download
                if (fs.existsSync(path)) fs.unlinkSync(path);
                continue;
            }
        }

        if (streams.length === 0) {
            return message.reply("❌ | 𝑁𝑜 𝑖𝑚𝑎𝑔𝑒𝑠 𝑐𝑜𝑢𝑙𝑑 𝑏𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑\n\n💡 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟 𝑜𝑟 𝑢𝑠𝑒 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑠𝑒𝑎𝑟𝑐ℎ 𝑡𝑒𝑟𝑚");
        }

        // Send results
        const resultMessage = {
            body: `🖼️ | 𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝑅𝑒𝑠𝑢𝑙𝑡\n━━━━━━━━━━━━━━━━━━\n🔮 𝑄𝑢𝑒𝑟𝑦: "${query}"\n📊 𝑇𝑜𝑡𝑎𝑙 𝐹𝑜𝑢𝑛𝑑: ${result.length} 𝑖𝑚𝑎𝑔𝑒${result.length !== 1 ? '𝑠' : ''}\n📨 𝑆𝑒𝑛𝑑𝑖𝑛𝑔: ${streams.length} 𝑖𝑚𝑎𝑔𝑒${streams.length !== 1 ? '𝑠' : ''}\n\n💡 𝑇𝑖𝑝: 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ "${global.config.PREFIX}imagesearch" 𝑡𝑜 𝑠𝑒𝑎𝑟𝑐ℎ 𝑓𝑜𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑜𝑓 𝑡ℎ𝑎𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒\n━━━━━━━━━━━━━━━━━━`,
            attachment: streams
        };

        await message.reply(resultMessage);

        // Clean up files after sending
        setTimeout(() => {
            for (let i = 0; i < streams.length; i++) {
                const path = __dirname + `/cache/image-${Date.now()}-${i}.jpg`;
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        if (err) console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑒:", err);
                    });
                }
            }
        }, 5000);

    } catch (error) {
        console.error("𝐼𝑚𝑎𝑔𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑒𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡\n\n💡 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟");
    }
};

module.exports.onReply = async function({ message, event }) {
    // Handle reply functionality if needed
    if (event.type === "message_reply") {
        await module.exports.onStart({ 
            message, 
            args: [event.messageReply.body], 
            event,
            api: global.api
        });
    }
};

module.exports.onLoad = function() {
    console.log('🖼️ | 𝐼𝑚𝑎𝑔𝑒 𝑆𝑒𝑎𝑟𝑐ℎ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐿𝑜𝑎𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦');
};
