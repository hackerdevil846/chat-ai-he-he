const axios = require("axios");

module.exports = {
    config: {
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
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            const profileImageURL = 'https://graph.facebook.com/61571630409265/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662';
            
            const imageStream = await global.utils.getStreamFromURL(profileImageURL);

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
            
        } catch (error) {
            console.error("𝐴𝑑𝑚𝑖𝑛 𝑖𝑛𝑓𝑜 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply(`╔════ஜ۞۞ஜ═══╗

🥀 𝑁𝑎𝑎𝑚 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
⚜️ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 : https://www.facebook.com/share/15yVioQQyq/
📱 𝑃ℎ𝑜𝑛 𝑛𝑢𝑚𝑏𝑒𝑟 : 01586400590

╚════ஜ۞۞ஜ═══╝

»»————-　★　————-««
🥀 𝐵𝑜𝑡 𝑒𝑟 𝑀𝑎𝑙𝑖𝑘 : 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
»»————-　★　————-««`);
        }
    },

    onChat: async function({ message, event }) {
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
    }
};
