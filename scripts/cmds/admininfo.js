const axios = require("axios");

module.exports = {
    config: {
        name: "admininfo",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "info",
        shortDescription: {
            en: "𝑆ℎ𝑜𝑤𝑠 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        longDescription: {
            en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟'𝑠 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        guide: {
            en: "{p}admininfo"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // 🛡️ Dependency check
            try {
                require("axios");
            } catch (e) {
                return await this.sendTextOnly(message);
            }

            const profileImageURL = 'https://graph.facebook.com/61571630409265/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
            
            let imageStream = null;
            let imageSuccess = false;

            // 🛡️ Try to get image stream with multiple attempts
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    console.log(`🖼️ 𝐼𝑚𝑎𝑔𝑒 𝑠𝑡𝑟𝑒𝑎𝑚 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt}`);
                    imageStream = await global.utils.getStreamFromURL(profileImageURL);
                    
                    if (imageStream) {
                        imageSuccess = true;
                        console.log(`✅ 𝐼𝑚𝑎𝑔𝑒 𝑠𝑡𝑟𝑒𝑎𝑚 𝑠𝑢𝑐𝑐𝑒𝑠𝑠 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt}`);
                        break;
                    }
                } catch (streamError) {
                    console.log(`❌ 𝐼𝑚𝑎𝑔𝑒 𝑠𝑡𝑟𝑒𝑎𝑚 𝑎𝑡𝑡𝑒𝑚𝑝𝑡 ${attempt} 𝑓𝑎𝑖𝑙𝑒𝑑:`, streamError.message);
                    
                    if (attempt === 3) {
                        console.log(`🔄 𝐴𝑙𝑙 𝑖𝑚𝑎𝑔𝑒 𝑎𝑡𝑡𝑒𝑚𝑝𝑡𝑠 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑢𝑠𝑖𝑛𝑔 𝑡𝑒𝑥𝑡 𝑜𝑛𝑙𝑦`);
                    }
                }
            }

            if (imageSuccess && imageStream) {
                await message.reply({
                    body: `╔════ஜ۞۞ஜ═══╗

🥀 𝑁𝑎𝑎𝑚 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
⚜️ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 : https://www.facebook.com/share/15yVioQQyq/
📱 𝑃ℎ𝑜𝑛 𝑛𝑢𝑚𝑏𝑒𝑟 : 01586400590

╚════ஜ۞۞ஜ═══╝

»»————-　★　————-««
🥀 𝐵𝑜𝑡 𝑒𝑟 𝑀𝑎𝑙𝑖𝑘 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
»»————-　★　————-««`,
                    attachment: imageStream
                });
            } else {
                // 🛡️ Fallback to text-only version
                await this.sendTextOnly(message);
            }
            
        } catch (error) {
            console.error("💥 𝐴𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜 𝑚𝑎𝑖𝑛 𝑒𝑟𝑟𝑜𝑟:", error);
            // 🛡️ Final fallback
            await this.sendTextOnly(message);
        }
    },

    // 🛡️ Text-only fallback function
    sendTextOnly: async function(message) {
        try {
            await message.reply(`╔════ஜ۞۞ஜ═══╗

🥀 𝑁𝑎𝑎𝑚 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
⚜️ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 : https://www.facebook.com/share/15yVioQQyq/
📱 𝑃ℎ𝑜𝑛 𝑛𝑢𝑚𝑏𝑒𝑟 : 01586400590

╚════ஜ۞۞ஜ═══╝

»»————-　★　————-««
🥀 𝐵𝑜𝑡 𝑒𝑟 𝑀𝑎𝑙𝑖𝑘 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
»»————-　★　————-««`);
        } catch (fallbackError) {
            console.error("💥 𝑇𝑒𝑥𝑡 𝑜𝑛𝑙𝑦 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", fallbackError);
            // 🛡️ Ultimate fallback - simple message
            try {
                await message.reply("👑 𝐵𝑜𝑡 𝑂𝑤𝑛𝑒𝑟: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑\n📞 𝐶𝑜𝑛𝑡𝑎𝑐𝑡: 01586400590");
            } catch (finalError) {
                console.error("💥 𝐹𝑖𝑛𝑎𝑙 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘 𝑒𝑟𝑟𝑜𝑟:", finalError);
            }
        }
    },

    onChat: async function({ message, event }) {
        try {
            // 🛡️ Chat trigger words with comprehensive list
            const triggers = [
                "admin", "admininfo", "owner", "malik", "boss", 
                "creator", "developer", "bot owner", "who made",
                "contact admin", "admin contact", "bot admin",
                "who is admin", "admin kaun hai", "admin number",
                "admin info", "owner info", "malik kaun hai"
            ];
            
            const messageText = event.body?.toLowerCase() || "";
            
            // 🛡️ Check if message contains any trigger words
            const shouldRespond = triggers.some(trigger => 
                messageText.includes(trigger.toLowerCase())
            );

            if (shouldRespond) {
                console.log(`💬 𝐶ℎ𝑎𝑡 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝑏𝑦: "${event.body}"`);
                await this.onStart({ message, event });
            }
        } catch (error) {
            console.error("𝐶ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
            // 🛡️ Silent fail for chat handler - don't spam errors
        }
    }
};
