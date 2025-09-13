const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "fyoutoo",
    aliases: ["fuckresponse", "autofuck"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑎𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒",
    shortDescription: {
        en: "𝐹𝑢𝑐𝑘 𝑦𝑜𝑢 𝑡𝑜𝑜 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 🖕"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑎𝑦𝑠 𝑓𝑢𝑐𝑘-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑤𝑜𝑟𝑑𝑠"
    },
    guide: {
        en: "𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑠 𝑎𝑢𝑡𝑜-𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑. 𝑁𝑜 𝑚𝑎𝑛𝑢𝑎𝑙 𝑢𝑠𝑎𝑔𝑒 𝑛𝑒𝑒𝑑𝑒𝑑."
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onChat = async function({ api, event, message }) {
    try {
        const { threadID, messageID, body } = event;
        
        // Define trigger words
        const triggers = [
            "fuck", "Fuck", "fuck you", "Fuck you", 
            "pakyu", "Pakyu", "pak you", "Pak you", 
            "pak u", "Pak u", "pak yu", "Pak yu",
            "f*ck", "F*ck", "f*ck you", "F*ck you",
            "fuk", "Fuk", "fuk you", "Fuk you"
        ];
        
        // Check if message contains any trigger word
        if (body && triggers.some(trigger => 
            body.toLowerCase().includes(trigger.toLowerCase()))) {
            
            // Path to the GIF file
            const gifPath = path.join(__dirname, "noprefix", "fuck.gif");
            
            // Check if GIF file exists
            if (!fs.existsSync(gifPath)) {
                return api.sendMessage("❌ 𝑅𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝐺𝐼𝐹 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.", threadID, messageID);
            }
            
            // Create response
            const response = {
                body: "𝑇𝑢𝑚𝑎𝑘𝑒𝑜 𝑓𝑢𝑐𝑘 𝑘𝑜𝑟𝑖 😏",
                attachment: fs.createReadStream(gifPath)
            };
            
            // Send response
            await message.reply(response);
            
            // Add reaction
            try {
                await api.setMessageReaction("😏", messageID, (err) => {
                    if (err) console.error("𝐸𝑟𝑟𝑜𝑟 𝑠𝑒𝑡𝑡𝑖𝑛𝑔 𝑟𝑒𝑎𝑐𝑡𝑖𝑜𝑛:", err);
                }, true);
            } catch (reactionError) {
                console.error("𝑅𝑒𝑎𝑐𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", reactionError);
            }
        }
    } catch (error) {
        console.error("𝐹𝑌𝑜𝑢𝑇𝑜𝑜 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ message }) {
    // Informational message when command is called directly
    await message.reply("⚠️ 𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑖𝑠 𝑎𝑢𝑡𝑜-𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑒𝑑 𝑤ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑠𝑎𝑦𝑠 𝑓𝑢𝑐𝑘-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑤𝑜𝑟𝑑𝑠.");
};
