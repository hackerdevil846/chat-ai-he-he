const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "tea",
    aliases: ["chai", "cha"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "☕ | 𝑇𝑒𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑣𝑒𝑛𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑡𝑜 𝑡𝑒𝑎-𝑟𝑒𝑙𝑎𝑡𝑒𝑑 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑖𝑑𝑒𝑜"
    },
    category: "𝑓𝑢𝑛",
    guide: {
        en: "𝐽𝑢𝑠𝑡 𝑡𝑦𝑝𝑒 '𝑡𝑒𝑎', '𝑐ℎ𝑎𝑖', 𝑜𝑟 '𝑐ℎ𝑎' 𝑖𝑛 𝑐ℎ𝑎𝑡"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onStart = async function() {
    // Required empty function for loader
};

module.exports.onChat = async function({ api, event }) {
    try {
        const { threadID, messageID, body } = event;
        const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
        
        if (!body || !triggers.some(trigger => body.toLowerCase().includes(trigger.toLowerCase()))) {
            return;
        }

        const teaVideoPath = path.join(__dirname, "noprefix", "tea.mp4");
        
        if (fs.existsSync(teaVideoPath)) {
            const msg = {
                body: "☕ | 𝑎𝑖𝑖 𝑙𝑜 𝑏𝑎𝑏𝑦 ☕",
                attachment: fs.createReadStream(teaVideoPath)
            };
            await api.sendMessage(msg, threadID);
            await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } else {
            await api.sendMessage("☕ | 𝑎𝑖𝑖 𝑙𝑜 𝑏𝑎𝑏𝑦 ☕\n❌ 𝑉𝑖𝑑𝑒𝑜 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!", threadID, messageID);
        }
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑡𝑒𝑎 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
    }
};
