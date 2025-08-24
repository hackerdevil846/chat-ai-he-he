const fs = require("fs");

module.exports = {
    config: {
        name: "wednesday",
        version: "1.0.1",
        hasPermssion: 0,
        credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
        description: "𝑾𝒆𝒅𝒏𝒆𝒔𝒅𝒂𝒚 𝒍𝒊𝒌𝒉𝒍𝒆 𝒆𝒌𝒕𝒊 𝒗𝒊𝒅𝒆𝒐 𝒑𝒂𝒕𝒉𝒂𝒃𝒆",
        category: "no prefix",
        usages: "𝒘𝒆𝒅𝒏𝒆𝒔𝒅𝒂𝒚",
        cooldowns: 5,
    },

    handleEvent: async function({ api, event }) {
        if (event.body.toLowerCase().startsWith("wednesday")) {
            const msg = {
                body: "𝑾𝒆𝒅𝒏𝒆𝒔𝒅𝒂𝒚 🧛🏻‍♀️",
                attachment: fs.createReadStream(__dirname + "/noprefix/wednesday.mp4")
            };
            api.sendMessage(msg, event.threadID, event.messageID);
            api.setMessageReaction("🧛🏻‍♀️", event.messageID, (err) => {}, true);
        }
    },

    run: async function({ api, event }) {
        
    }
};
