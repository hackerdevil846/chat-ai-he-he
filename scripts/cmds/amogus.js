const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "sus",
        aliases: ["amongus", "sussy"],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑓𝑢𝑛",
        shortDescription: {
            en: "𝑆𝑈𝑆 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑟 𝑓𝑢𝑛"
        },
        longDescription: {
            en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑠𝑢𝑠𝑝𝑖𝑐𝑖𝑜𝑢𝑠 𝑤𝑜𝑟𝑑𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑎𝑢𝑑𝑖𝑜"
        },
        guide: {
            en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 𝑠𝑢𝑠, 𝑎𝑚𝑜𝑔𝑢𝑠, 𝑜𝑟 𝑠𝑢𝑠𝑠𝑦 𝑖𝑛 𝑐ℎ𝑎𝑡"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function ({ message }) {
        // Empty onStart since this is an auto-response command
        // You can add help information here if needed
        await message.reply("🔍 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎𝑛 𝑎𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑇𝑦𝑝𝑒 '𝑠𝑢𝑠', '𝑎𝑚𝑜𝑔𝑢𝑠', 𝑜𝑟 '𝑠𝑢𝑠𝑠𝑦' 𝑖𝑛 𝑐ℎ𝑎𝑡 𝑡𝑜 𝑡𝑟𝑖𝑔𝑔𝑒𝑟 𝑖𝑡!");
    },

    onChat: async function ({ message, event }) {
        const { threadID, body } = event;
        
        // List of trigger words (case-insensitive)
        const triggers = [
            "amogus", "sus", "sussy", "ඞ",
            "among us", "amongus", "suspicious"
        ];
        
        // Check if message contains any trigger word (case-insensitive)
        if (body && triggers.some(trigger => 
            body.toLowerCase().includes(trigger.toLowerCase())
        )) {
            try {
                // Use the exact path you specified
                const audioPath = path.join(__dirname, "..", "..", "noprefix", "sus.mp3");
                
                // Check if file exists
                if (!fs.existsSync(audioPath)) {
                    console.log("𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡:", audioPath);
                    console.log("𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑠𝑢𝑠.𝑚𝑝3 𝑡𝑜: scripts/cmds/noprefix/sus.mp3");
                    
                    // Send fallback message without audio
                    await message.reply({
                        body: "ඞ 𝑺𝑼𝑺𝑺𝒀 𝑩𝑨𝑲𝑨! 😱\n\n⚠️ 𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑚𝑖𝑠𝑠𝑖𝑛𝑔. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑: 𝑠𝑐𝑟𝑖𝑝𝑡𝑠/𝑐𝑚𝑑𝑠/𝑛𝑜𝑝𝑟𝑒𝑓𝑖𝑥/𝑠𝑢𝑠.𝑚𝑝3"
                    });
                    return;
                }
                
                // Send SUS response with audio
                await message.reply({
                    body: "ඞ 𝑺𝑼𝑺𝑺𝒀 𝑩𝑨𝑲𝑨! 😱",
                    attachment: fs.createReadStream(audioPath)
                });
                
                // Add reaction if possible
                try {
                    // Some bots support reactions, some don't
                    // This is optional and won't break the command if it fails
                    if (message.react) {
                        await message.react("😱");
                    }
                } catch (reactionError) {
                    console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟 (𝑛𝑜𝑡 𝑐𝑟𝑖𝑡𝑖𝑐𝑎𝑙):", reactionError);
                }
                
            } catch (error) {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑠𝑢𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
                await message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑙𝑎𝑦𝑖𝑛𝑔 𝑠𝑢𝑠 𝑎𝑢𝑑𝑖𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
            }
        }
    }
};
