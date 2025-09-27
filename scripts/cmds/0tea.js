const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "tea",
    aliases: ["chai", "cha"],
    version: "1.0.1",
    author: "Asif Mahmud",
    countDown: 5,
    role: 0,
    shortDescription: {
        en: "☕ | Tea command event handler"
    },
    longDescription: {
        en: "Automatically responds to tea-related messages with a video"
    },
    category: "fun",
    guide: {
        en: "Just type 'tea', 'chai', or 'cha' in chat"
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
                body: "☕ | aii lo baby ☕",
                attachment: fs.createReadStream(teaVideoPath)
            };
            await api.sendMessage(msg, threadID);
            await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } else {
            await api.sendMessage("☕ | aii lo baby ☕\n❌ Video file not found!", threadID, messageID);
        }
    } catch (error) {
        console.error("Error in tea command:", error);
    }
};
