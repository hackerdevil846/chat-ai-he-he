module.exports.config = {
    name: "fact2",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑹𝒂𝒏𝒅𝒐𝒎 𝒇𝒂𝒄𝒕𝒔 𝒊𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
    commandCategory: "𝑰𝒎𝒂𝒈𝒆",
    usages: "𝒇𝒂𝒄𝒕𝒔 [𝒕𝒆𝒙𝒕]",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID } = event;
    
    let text = args.join(" ");
    if (!text) {
        return api.sendMessage("𝑻𝒆𝒙𝒕 𝒍𝒊𝒌𝒉𝒂𝒏 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏", threadID, messageID);
    }

    const callback = () => {
        api.sendMessage({
            body: "𝑵𝒊𝒋𝒆𝒓 𝑭𝒂𝒄𝒕𝒔 𝑰𝒎𝒂𝒈𝒆 ✨",
            attachment: fs.createReadStream(__dirname + "/cache/facts.png")
        }, threadID, () => fs.unlinkSync(__dirname + "/cache/facts.png"), messageID);
    };

    return request(encodeURI(`https://api.popcat.xyz/facts?text=${text}`))
        .pipe(fs.createWriteStream(__dirname + '/cache/facts.png'))
        .on('close', callback);
};
