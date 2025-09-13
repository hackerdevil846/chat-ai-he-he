const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "gali",
    aliases: ["abuse", "swear"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "noprefix",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑡𝑜 𝑎𝑏𝑢𝑠𝑖𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑎𝑏𝑢𝑠𝑖𝑣𝑒 𝑜𝑟 𝑠𝑤𝑒𝑎𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑓𝑢𝑛𝑛𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
    },
    guide: {
        en: "𝑁𝑜 𝑝𝑟𝑒𝑓𝑖𝑥 𝑛𝑒𝑒𝑑𝑒𝑑 - 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑡𝑟𝑖𝑔𝑔𝑒𝑟𝑠 𝑜𝑛 𝑎𝑏𝑢𝑠𝑖𝑣𝑒 𝑤𝑜𝑟𝑑𝑠"
    },
    dependencies: {
        "fs": "",
        "path": ""
    },
    envConfig: {
        autoRespond: true
    }
};

module.exports.onLoad = function() {
    console.log("𝐺𝑎𝑙𝑖 𝑑𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑚𝑜𝑑𝑢𝑙𝑒 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦! 🛡️");
};

module.exports.onChat = async function({ event, api }) {
    try {
        const triggers = [
            "fuck", "mc", "chod", "bal", "bc", "maa ki chut",
            "xod", "behen chod", "🖕", "madarchod", "chudi", "gala gali",
            "bitch", "asshole", "shit", "bastard", "motherfucker"
        ];
        
        if (event.body && triggers.some(trigger => 
            event.body.toLowerCase().includes(trigger.toLowerCase()))) {
            
            const videoPath = path.join(__dirname, "noprefix", "gali.mp4");
            
            if (fs.existsSync(videoPath)) {
                const response = {
                    body: "𝐵𝑜𝑠𝑠 𝐷𝑘, 𝐺𝑎𝑙𝑖 𝑘𝑒𝑛𝑜 𝑑𝑒𝑜? 𝐿𝑢𝑛𝑑 𝑘𝑎𝑡𝑘𝑒 ℎ𝑎𝑡ℎ 𝑒𝑟 𝑚𝑜𝑑ℎ𝑒 𝑟𝑎𝑘ℎ𝑏𝑜 😤",
                    attachment: fs.createReadStream(videoPath)
                };
                
                await api.sendMessage(response, event.threadID, event.messageID);
            } else {
                await api.sendMessage("𝐵𝑜𝑠𝑠 𝐷𝑘, 𝐺𝑎𝑙𝑖 𝑘𝑒𝑛𝑜 𝑑𝑒𝑜? 𝐿𝑢𝑛𝑑 𝑘𝑎𝑡𝑘𝑒 ℎ𝑎𝑡ℎ 𝑒𝑟 𝑚𝑜𝑑ℎ𝑒 𝑟𝑎𝑘ℎ𝑏𝑜 😤", event.threadID, event.messageID);
            }
            
            await api.setMessageReaction("😠", event.messageID, (err) => {}, true);
        }
    } catch (error) {
        console.error("𝐺𝑎𝑙𝑖 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ api, event }) {
    try {
        await api.sendMessage("🤖 𝐴𝑢𝑡𝑜 𝑔𝑎𝑙𝑖 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒 𝑠𝑦𝑠𝑡𝑒𝑚 𝑖𝑠 𝑎𝑐𝑡𝑖𝑣𝑒!\n- 𝑇𝑟𝑖𝑔𝑔𝑒𝑟 𝑤𝑜𝑟𝑑𝑠: 𝑓𝑢𝑐𝑘, 𝑚𝑐, 𝑐ℎ𝑜𝑑, 𝑏𝑎𝑙, 𝑏𝑐, 𝑒𝑡𝑐...", event.threadID);
    } catch (error) {
        console.error("𝐺𝑎𝑙𝑖 𝑠𝑡𝑎𝑟𝑡 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
