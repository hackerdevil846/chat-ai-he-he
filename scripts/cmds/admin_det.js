const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "admininfo",
    aliases: ["admin", "owner", "malik"],
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
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ message }) {
    try {
        // Create cache directory if it doesn't exist
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const profileImagePath = path.join(cacheDir, 'profile.png');
        
        // Try to download admin profile image if it doesn't exist
        if (!fs.existsSync(profileImagePath)) {
            try {
                const imageResponse = await axios.get('https://graph.facebook.com/61571630409265/picture?width=720&height=720', {
                    responseType: 'arraybuffer'
                });
                fs.writeFileSync(profileImagePath, Buffer.from(imageResponse.data));
            } catch (imageError) {
                console.log("𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑖𝑚𝑎𝑔𝑒:", imageError);
                // Continue without image if download fails
            }
        }

        const msg = {
            body: `╔════ஜ۞۞ஜ═══╗

🥀 𝑁𝑎𝑎𝑚 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
⚜️ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 : https://www.facebook.com/share/15yVioQQyq/
📱 𝑃ℎ𝑜𝑛 𝑛𝑢𝑚𝑏𝑒𝑟 : 01586400590

╚════ஜ۞۞ஜ═══╝

»»————-　★　————-««
🥀 𝐵𝑜𝑡 𝑒𝑟 𝑀𝑎𝑙𝑖𝑘 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
»»————-　★　————-««`
        };

        // Add attachment only if image exists
        if (fs.existsSync(profileImagePath)) {
            msg.attachment = fs.createReadStream(profileImagePath);
        }

        await message.reply(msg);
        
    } catch (error) {
        console.error("𝐴𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑠ℎ𝑜𝑤𝑖𝑛𝑔 𝑎𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜.");
    }
};

module.exports.onChat = async function({ message, event }) {
    try {
        const triggers = ["admin", "Admin", "/Admin", "#admin", "owner", "malik"];
        
        if (event.body && triggers.some(trigger => 
            event.body.toLowerCase().includes(trigger.toLowerCase())
        )) {
            await this.onStart({ message, event });
        }
    } catch (error) {
        console.error("𝐶ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
