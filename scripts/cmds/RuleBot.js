const fs = require("fs");

module.exports.config = {
    name: "RuleBot",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒆𝒓 𝒃𝒆𝒃𝒐𝒉𝒂𝒓 𝒆𝒓 𝒏𝒊𝒚𝒐𝒎𝒎𝒂𝒍𝒊",
    category: "group",
    usages: "RuleBot",
    cooldowns: 5,
    dependencies: {}
};

module.exports.languages = {
    "en": {
        "message": "💌 𝑪𝒉𝒂𝒕𝒃𝒐𝒕 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒏𝒊𝒚𝒐𝒎:

▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂
❯ 𝑺𝒐𝒖𝒓𝒄𝒆 𝑪𝒐𝒅𝒆 𝑩𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅
❯ 𝑼𝒔𝒆𝒓𝒅𝒆𝒓𝒂 𝒃𝒐𝒕 𝒌𝒆 20 𝒃𝒂𝒓/𝒅𝒊𝒏𝒆𝒓 𝒄𝒆𝒚𝒆 𝒔𝒑𝒂𝒎 𝒏𝒂 𝒌𝒐𝒓𝒃𝒆𝒏
▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂ ▂
💖 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅"
    }
};

module.exports.onLoad = function() {
    console.log("✅ RuleBot loaded successfully!");
};

module.exports.handleEvent = function({ api, event }) {
    const { threadID, messageID } = event;
    const triggers = ["rulebot", "bot rules", "rules"];

    if (event.body && triggers.some(trigger => event.body.toLowerCase().includes(trigger.toLowerCase()))) {
        api.sendMessage(this.languages.en.message, threadID, messageID);
    }
};

module.exports.run = function({ api, event }) {
    const { threadID } = event;
    api.sendMessage(this.languages.en.message, threadID);
};
