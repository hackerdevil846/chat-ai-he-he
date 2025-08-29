module.exports = {
    config: {
        name: "sleep",
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝑆𝑙𝑒𝑒𝑝 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
        },
        longDescription: {
            en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑠𝑙𝑒𝑒𝑝-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑐𝑢𝑡𝑒 𝑔𝑖𝑓"
        },
        guide: {
            en: ""
        }
    },

    onStart: async function() {},
    
    onChat: async function({ event, message }) {
        const fs = require("fs-extra");
        
        const sleepKeywords = ["sleep", "Sleep", "goodnight", "Goodnight", "night", "Night", "bed", "Bed", "tired", "Tired"];
        
        if (event.body && sleepKeywords.some(keyword => 
            event.body.toLowerCase().includes(keyword.toLowerCase())
        )) {
            try {
                const gifPath = __dirname + "/noprefix/sleep.gif";
                
                // Check if file exists
                if (fs.existsSync(gifPath)) {
                    await message.reply({
                        body: "𝑆𝑙𝑒𝑒𝑝 𝑤𝑒𝑙𝑙, 𝑚𝑦 𝑑𝑒𝑎𝑟! 💤\n𝐼 𝑤𝑖𝑙𝑙 𝑚𝑖𝑠𝑠 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ!\n𝑆𝑒𝑒 𝑦𝑜𝑢 𝑖𝑛 𝑡ℎ𝑒 𝑚𝑜𝑟𝑛𝑖𝑛𝑔! 🦄💜",
                        attachment: fs.createReadStream(gifPath)
                    });
                } else {
                    await message.reply({
                        body: "𝑆𝑙𝑒𝑒𝑝 𝑤𝑒𝑙𝑙, 𝑚𝑦 𝑑𝑒𝑎𝑟! 💤\n𝐼 𝑤𝑖𝑙𝑙 𝑚𝑖𝑠𝑠 𝑦𝑜𝑢 𝑠𝑜 𝑚𝑢𝑐ℎ!\n𝑆𝑒𝑒 𝑦𝑜𝑢 𝑖𝑛 𝑡ℎ𝑒 𝑚𝑜𝑟𝑛𝑖𝑛𝑔! 🦄💜\n\n🌙 𝑆𝑤𝑒𝑒𝑡 𝑑𝑟𝑒𝑎𝑚𝑠!"
                    });
                }
            } catch (error) {
                console.error("𝑆𝑙𝑒𝑒𝑝 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
                await message.reply("𝐺𝑜𝑜𝑑𝑛𝑖𝑔ℎ𝑡! 𝑆𝑙𝑒𝑒𝑝 𝑤𝑒𝑙𝑙! 🌙");
            }
        }
    }
};
