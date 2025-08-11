module.exports.config = {
    name: "pooh",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑷𝒖𝒕𝒉𝒖𝒍 𝒌𝒉𝒂𝒍𝒆𝒓 𝒎𝒐𝒏𝒅𝒐𝒍 𝒕𝒐𝒎𝒂𝒓 𝒃𝒂𝒏𝒕𝒊 𝒍𝒆𝒌𝒉𝒂",
    commandCategory: "monoronjon",
    usages: "[text | text]",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {  
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID, senderID } = event;
    
    let text = args.join(" ");
    if (!text.includes(" | ")) {
        return api.sendMessage(`𝑩𝒂𝒃𝒖𝒋𝒂𝒏, 𝒕𝒐𝒎𝒂𝒌𝒆 𝒅𝒖𝒊𝒕𝒊 𝒕𝒆𝒙𝒕 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆 "𝒕𝒆𝒙𝒕𝟏 | 𝒕𝒆𝒙𝒕𝟐" 𝒆𝒊𝒗𝒂𝒃𝒆 𝒍𝒊𝒌𝒉𝒐\n𝑬𝒋𝒆𝒎𝒐𝒏: pooh 𝑨𝒔𝒊𝒇 | 𝑴𝒂𝒉𝒎𝒖𝒅`, event.threadID, event.messageID);
    }

    const text1 = text.substr(0, text.indexOf(' | ')); 
    const text2 = text.split(" | ").pop();
    
    var callback = () => api.sendMessage({
        body: `𝑬𝒊 𝒏𝒊𝒆𝒓 𝒑𝒖𝒕𝒉𝒖𝒍 𝒕𝒐𝒎𝒂𝒓 𝒃𝒂𝒏𝒕𝒊 𝒏𝒊𝒚𝒆 👇`,
        attachment: fs.createReadStream(__dirname + "/cache/pooh.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/pooh.png"), event.messageID);
    
    return request(encodeURI(`https://api.popcat.xyz/pooh?text1=${text1}&text2=${text2}`))
        .pipe(fs.createWriteStream(__dirname + '/cache/pooh.png'))
        .on('close', () => callback());
};
