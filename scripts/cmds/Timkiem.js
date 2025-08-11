module.exports.config = {
    name: "search",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑", // Updated credits
    description: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒐", // Banglish description
    commandCategory: "info",
    usages: "search [Text]",
    cooldowns: 5,
    dependencies: {
        "request":"",
        "fs":""
    }
};

module.exports.run = function({ api, event, args }) {
    let textNeedSearch = "";
    const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
    
    // Handle empty search query
    if (!event.messageReply && args.length === 0) {
        return api.sendMessage("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒔𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆", event.threadID, event.messageID);
    }

    (event.type == "message_reply") ? textNeedSearch = event.messageReply.attachments[0].url: textNeedSearch = args.join(" ");
    
    if (regex.test(textNeedSearch)) {
        api.sendMessage(`🔎 𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕:\nhttps://www.google.com/searchbyimage?&image_url=${textNeedSearch}`, event.threadID, event.messageID);
    } else {
        api.sendMessage(`🔎 𝑺𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕 𝒇𝒐𝒓 '${textNeedSearch}':\nhttps://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`, event.threadID, event.messageID);
    }
}
