module.exports.config = {
    name: "fact2",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ 𝑹𝒂𝒏𝒅𝒐𝒎 𝒇𝒂𝒄𝒕𝒔 𝒊𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒐𝒓",
    commandCategory: "🖼️ 𝑰𝒎𝒂𝒈𝒆",
    usages: "[text]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID } = event;
    
    if (!args[0]) {
        return api.sendMessage("❌ 𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒕𝒆𝒙𝒕 𝒕𝒐 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒆 𝒇𝒂𝒄𝒕 𝒊𝒎𝒂𝒈𝒆!", threadID, messageID);
    }

    const text = args.join(" ");
    const path = __dirname + '/cache/facts.png';

    try {
        await new Promise((resolve, reject) => {
            request(encodeURI(`https://api.popcat.xyz/facts?text=${text}`))
                .pipe(fs.createWriteStream(path))
                .on('close', resolve)
                .on('error', reject);
        });

        api.sendMessage({
            body: `✨ 𝑭𝒂𝒄𝒕 𝑰𝒎𝒂𝒈𝒆 𝑮𝒆𝒏𝒆𝒓𝒂𝒕𝒆𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚!\n\n📝 𝑻𝒆𝒙𝒕: "${text}"`,
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆. 𝑷𝒍𝒆𝒂𝒔𝒆 𝒕𝒓𝒚 𝒂𝒈𝒂𝒊𝒏 𝒍𝒂𝒕𝒆𝒓!", threadID, messageID);
    }
};
