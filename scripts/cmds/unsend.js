module.exports.config = {
    name: "unsend",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕 𝒆𝒓 𝒑𝒂𝒕𝒉𝒂𝒏𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒖𝒏𝒔𝒆𝒏𝒅 𝒌𝒐𝒓𝒆",
    category: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "unsend",
    cooldowns: 0
};

module.exports.languages = {
    "en": {
        "returnCant": "𝑨𝒎𝒊 𝒐𝒏𝒏𝒐 𝒅𝒆𝒓 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒖𝒏𝒔𝒆𝒏𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒐 𝒏𝒂",
        "missingReply": "𝑼𝒏𝒔𝒆𝒏𝒅 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒕𝒂 𝒌𝒆 𝒓𝒆𝒑𝒍𝒚 𝒌𝒂𝒓𝒌𝒆 𝒍𝒊𝒌𝒉𝒖𝒏"
    }
};

module.exports.onStart = async function({ api, event, getText }) {
    // ensure it's a reply
    if (event.type !== "message_reply" || !event.messageReply) {
        return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
    }

    // only allow unsend if the replied message was sent by the bot itself
    if (event.messageReply.senderID !== api.getCurrentUserID()) {
        return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
    }

    // perform unsend
    return api.unsendMessage(event.messageReply.messageID);
};
