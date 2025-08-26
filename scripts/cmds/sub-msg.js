const fs = require("fs");

module.exports.config = {
    name: "sub",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙎𝙪𝙗𝙨𝙘𝙧𝙞𝙗𝙚 𝙨𝙖𝙢𝙥𝙖𝙧𝙠𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙",
    category: "𝙣𝙤-𝙥𝙧𝙚𝙛𝙞𝙭",
    usages: "sub",
    cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
    var { threadID, messageID } = event;
    if (
        event.body.indexOf("Priyansh rajput") == 0 ||
        event.body.indexOf("Sub") == 0 ||
        event.body.indexOf("Subscribe") == 0 ||
        event.body.indexOf("Priyansh") == 0
    ) {
        var msg = {
            body: "👋 𝙆𝙤𝙣𝙤 𝙨𝙖𝙝𝙖𝙮𝙮𝙖 𝙡𝙖𝙜𝙡𝙚 @𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝙪𝒅 𝙠𝙚 𝙘𝙤𝙣𝙩𝙖𝙘𝙩 𝙠𝙤𝙧𝙪𝙣 😇",
            attachment: fs.createReadStream(__dirname + `/noprefix/sub.mp3`)
        }
        api.sendMessage(msg, threadID, messageID);
        api.setMessageReaction("🔔", event.messageID, (err) => {}, true);
    }
}

module.exports.onStart = function({ api, event, client, __GLOBAL }) {
    // No additional functionality needed
}
