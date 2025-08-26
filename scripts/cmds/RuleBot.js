const fs = require("fs");

module.exports.config = {
    name: "RuleBot",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Asif Mahmud",
    description: "Bot er bebohar er niyomali",
    category: "group",
    usages: "RuleBot",
    cooldowns: 5,
    dependencies: {}
};

module.exports.languages = {
    "en": {
        "message": "💌 Chatbot babohar niyom:\n" +
                  "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
                  "❯ Source Code By Asif Mahmud\n" +
                  "❯ Userdera bot ke 20 bar/diner ceye spam na korben\n" +
                  "▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂\n" +
                  "💖 Powered by Asif Mahmud"
    }
};

module.exports.onLoad = function() {
    console.log("✅ RuleBot loaded successfully!");
};

module.exports.handleEvent = function({ api, event }) {
    const { threadID, messageID } = event;
    const triggers = ["rulebot", "bot rules", "rules"];
    
    if (event.body && triggers.some(trigger => 
        event.body.toLowerCase().includes(trigger.toLowerCase())
    )) {
        api.sendMessage(this.languages.en.message, threadID, messageID);
    }
};

module.exports.onStart = function({ api, event }) {
    const { threadID } = event;
    api.sendMessage(this.languages.en.message, threadID);
};
