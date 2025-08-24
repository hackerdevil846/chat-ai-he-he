module.exports.config = {
    name: "pooh",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑷𝒖𝒕𝒉𝒖𝒍 𝒌𝒉𝒂𝒍𝒆𝒓 𝒎𝒐𝒏𝒅𝒐𝒍 𝒕𝒐𝒎𝒂𝒓 𝒃𝒂𝒏𝒕𝒊 𝒍𝒆𝒌𝒉𝒂",
    category: "monoronjon",
    usages: "[text1 | text2]",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID } = event;
    
    const inputText = args.join(" ");
    
    if (!inputText.includes(" | ")) {
        return api.sendMessage(`🌸 𝑩𝒂𝒃𝒖𝒋𝒂𝒏, 𝒕𝒐𝒎𝒂𝒌𝒆 𝒅𝒖𝒊𝒕𝒊 𝒕𝒆𝒙𝒕 𝒅𝒊𝒕𝒆 𝒉𝒐𝒃𝒆:\n"${this.config.name} 𝒕𝒆𝒙𝒕𝟏 | 𝒕𝒆𝒙𝒕𝟐"\n\n✨ 𝑬𝒋𝒆𝒎𝒐𝒏: ${this.config.name} 𝑨𝒔𝒊𝒇 | 𝑴𝒂𝒉𝒎𝒖𝒅`, threadID, messageID);
    }

    const [text1, text2] = inputText.split(" | ").map(text => text.trim());

    const generateImage = () => {
        return new Promise((resolve, reject) => {
            const imagePath = __dirname + '/cache/pooh.png';
            request(encodeURI(`https://api.popcat.xyz/pooh?text1=${text1}&text2=${text2}`))
                .pipe(fs.createWriteStream(imagePath))
                .on('close', () => resolve(imagePath))
                .on('error', reject);
        });
    };

    try {
        const imagePath = await generateImage();
        
        return api.sendMessage({
            body: `✨ 𝑬𝒊 𝒏𝒊𝒆𝒓 𝒑𝒖𝒕𝒉𝒖𝒍 𝒕𝒐𝒎𝒂𝒓 𝒃𝒂𝒏𝒕𝒊 𝒏𝒊𝒚𝒆 👇`,
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => fs.unlinkSync(imagePath), messageID);
        
    } catch (error) {
        console.error(error);
        return api.sendMessage("😿 𝑩𝒂𝒃𝒖𝒋𝒂𝒏, 𝒑𝒖𝒕𝒉𝒖𝒍𝒍𝒆𝒓 𝒄𝒉𝒊𝒕𝒓𝒂 𝒃𝒂𝒏𝒂𝒏𝒐 𝒉𝒐𝒍𝒐 𝒋𝒂𝒎𝒆𝒍𝒂 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!", threadID, messageID);
    }
};
