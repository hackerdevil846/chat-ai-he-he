const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "search",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒐𝒐𝒈𝒍𝒆 𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒌𝒐𝒓𝒐",
    category: "info",
    usages: "search [Text]",
    cooldowns: 5,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    let textNeedSearch = "";
    const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
    
    // Check if user replied to an image or provided text
    if (!event.messageReply && args.length === 0) {
        return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒔𝒐𝒎𝒆𝒕𝒉𝒊𝒏𝒈 𝒕𝒐 𝒔𝒆𝒂𝒓𝒄𝒉 𝒐𝒓 𝒓𝒆𝒑𝒍𝒚 𝒕𝒐 𝒂𝒏 𝒊𝒎𝒂𝒈𝒆 ❌", event.threadID, event.messageID);
    }
    
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
        textNeedSearch = event.messageReply.attachments[0].url;
    } else {
        textNeedSearch = args.join(" ");
    }
    
    // If it's an image URL
    if (regex.test(textNeedSearch)) {
        const imageUrl = `https://www.google.com/searchbyimage?&image_url=${textNeedSearch}`;
        return api.sendMessage(`🔎 𝑰𝒎𝒂𝒈𝒆 𝒔𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕:
${imageUrl}`, event.threadID, event.messageID);
    } else {
        const searchUrl = `https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`;
        return api.sendMessage(`🔎 𝑺𝒆𝒂𝒓𝒄𝒉 𝒓𝒆𝒔𝒖𝒍𝒕 𝒇𝒐𝒓 '${textNeedSearch}':
${searchUrl}`, event.threadID, event.messageID);
    }
};
