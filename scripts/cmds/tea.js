const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "tea", // Command name
    version: "1.0.2",
    hasPermssion: 0, // 0 = all members, 1 = admin+, 2 = owner
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Credit
    description: "Sends a tea video when triggered",
    category: "no prefix", // Category
    usages: "", // Usage info
    cooldowns: 5,
    dependencies: {
        "fs": "latest",
        "path": "latest"
    },
    envConfig: {} // Optional env configs
};

module.exports.languages = {
    "en": {},
    "vi": {}
};

module.exports.onLoad = function({ configValue }) {
    // Optional: Do something when the module loads
};

module.exports.handleEvent = async function({ event, api }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const triggers = ["tea", "Tea", "Cha", "চা"];
    const trimmedBody = body.trim().toLowerCase();
    const shouldTrigger = triggers.some(trigger => trimmedBody.startsWith(trigger.toLowerCase()));

    if (!shouldTrigger) return;

    try {
        const videoPath = path.join(__dirname, "noprefix", "tea.mp4");
        if (!fs.existsSync(videoPath)) {
            return api.sendMessage("❌ Tea video file is missing. Please contact the admin.", threadID, messageID);
        }

        api.setMessageReaction("🫖", messageID, (err) => {
            if (err) console.error("Reaction error:", err);
        }, true);

        api.sendMessage({
            body: "🥤 Ai Lo Bby ☕",
            attachment: fs.createReadStream(videoPath)
        }, threadID, messageID);

    } catch (error) {
        console.error("Tea Command Error:", error);
        api.sendMessage("❌ An error occurred while sending the tea video. Please try again later.", threadID, messageID);
    }
};

module.exports.onStart = async function({ api, event, args }) {
    // For command-style execution (optional)
    const { threadID, messageID } = event;
    try {
        const videoPath = path.join(__dirname, "noprefix", "tea.mp4");
        if (!fs.existsSync(videoPath)) {
            return api.sendMessage("❌ Tea video file is missing.", threadID, messageID);
        }

        api.sendMessage({
            body: "🥤 Ai Lo Bby ☕",
            attachment: fs.createReadStream(videoPath)
        }, threadID, messageID);
    } catch (err) {
        console.error(err);
        api.sendMessage("❌ Error sending tea video.", threadID, messageID);
    }
};
