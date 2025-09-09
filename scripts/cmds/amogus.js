const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "sus",
    aliases: ["amongus", "sussy"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "𝑆𝑈𝑆 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑓𝑜𝑟 𝑓𝑢𝑛"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑠𝑢𝑠𝑝𝑖𝑐𝑖𝑜𝑢𝑠 𝑤𝑜𝑟𝑑𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑎𝑢𝑑𝑖𝑜"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 𝑠𝑢𝑠, 𝑎𝑚𝑜𝑔𝑢𝑠, 𝑜𝑟 𝑠𝑢𝑠𝑠𝑦 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onStart = async function ({ api, event }) {
    // Empty onStart since this is an auto-response command
};

module.exports.onChat = async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    
    // List of trigger words (case-sensitive)
    const triggers = [
        "amogus", "Amogus", 
        "sus", "Sus", 
        "sussy", "Sussy",
        "ඞ"
    ];
    
    // Check if message contains any trigger word
    if (body && triggers.some(trigger => body.includes(trigger))) {
        try {
            const audioPath = path.join(__dirname, "assets", "sus.mp3");
            
            // Check if file exists
            if (!fs.existsSync(audioPath)) {
                console.log("𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑, 𝑐𝑟𝑒𝑎𝑡𝑖𝑛𝑔 𝑑𝑖𝑟𝑒𝑐𝑡𝑜𝑟𝑦...");
                const assetsDir = path.join(__dirname, "assets");
                if (!fs.existsSync(assetsDir)) {
                    fs.mkdirSync(assetsDir, { recursive: true });
                }
                console.log("𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑠𝑢𝑠.𝑚𝑝3 𝑡𝑜 𝑡ℎ𝑒 𝑎𝑠𝑠𝑒𝑡𝑠 𝑓𝑜𝑙𝑑𝑒𝑟");
                return api.sendMessage("⚠️ 𝐴𝑢𝑑𝑖𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑎𝑑𝑑 𝑠𝑢𝑠.𝑚𝑝3 𝑡𝑜 𝑎𝑠𝑠𝑒𝑡𝑠 𝑓𝑜𝑙𝑑𝑒𝑟.", threadID, messageID);
            }
            
            const msg = {
                body: "ඞ 𝑺𝑼𝑺𝑺𝒀 𝑩𝑨𝑲𝑨! 😱",
                attachment: fs.createReadStream(audioPath)
            };
            
            // Send SUS response
            await api.sendMessage(msg, threadID, messageID);
            
            // Add reaction
            try {
                await api.setMessageReaction("😱", messageID, (err) => {
                    if (err) console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑡 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛:", err);
                }, true);
            } catch (reactionError) {
                console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", reactionError);
            }
        } catch (error) {
            console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑠𝑢𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
            try {
                await api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑙𝑎𝑦𝑖𝑛𝑔 𝑠𝑢𝑠 𝑎𝑢𝑑𝑖𝑜", threadID, messageID);
            } catch (sendError) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", sendError);
            }
        }
    }
};
