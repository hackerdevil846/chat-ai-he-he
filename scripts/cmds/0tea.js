const fs = require("fs");

module.exports.config = {
    name: "tea",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "☕ | Tea command event handler",
    commandCategory: "noprefix",
    usages: "tea/Tea/Chai/CHAI/Cha/CHA",
    cooldowns: 5
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID } = event;
    const triggers = ["tea", "Tea", "Chai", "CHAI", "Cha", "CHA"];
    
    if (triggers.some(trigger => event.body.indexOf(trigger) === 0)) {
        try {
            const msg = {
                body: "☕ | 𝒂𝒊𝒊 𝒍𝒐 𝒃𝒂𝒃𝒚 ☕",
                attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`)
            };
            await api.sendMessage(msg, threadID, messageID);
            await api.setMessageReaction("🫖", messageID, (err) => {}, true);
        } catch (error) {
            console.error("Error in tea command:", error);
        }
    }
};

module.exports.run = function({ api, event }) {
    // Optional: Add response when command is directly run with prefix
    api.sendMessage("☕ | Tea command is active! Type 'tea' to get a warm cup! 🫖", event.threadID, event.messageID);
};
