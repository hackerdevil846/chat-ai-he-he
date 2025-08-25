module.exports.config = {
    name: "hololive",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑯𝒐𝒍𝒐𝒍𝒊𝒗𝒆 𝑽𝑻𝒖𝒃𝒆𝒓 𝑷𝒉𝒐𝒕𝒐 𝑮𝒂𝒍𝒍𝒆𝒓𝒚",
    category: "media",
    usages: "[character_name]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "request": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const axios = global.nodemodule["axios"];
    const request = global.nodemodule["request"];
    const fs = global.nodemodule["fs"];
    const { threadID, messageID } = event;

    const characterList = {
        rushia: "🌸 烏羽らすえ (Uruha Rushia)",
        pekora: "🐰 兎田ぺこら (Usada Pekora)", 
        coco: "🐉 桐生ココ (Kiryu Coco)",
        gura: "🐋 がうる・ぐら (Gawr Gura)",
        marine: "🏴‍☠️ 宝鐘マリン (Houshou Marine)"
    };

    if (!args[0]) {
        const availableCharacters = Object.entries(characterList)
            .map(([key, value]) => `• ${key} - ${value}`)
            .join('\n');
        
        return api.sendMessage(
            `🎌 𝗛𝗢𝗟𝗢𝗟𝗜𝗩𝗘 𝗩𝗧𝗨𝗕𝗘𝗥 𝗚𝗔𝗟𝗟𝗘𝗥𝗬\n\n` +
            `𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿𝘀:\n${availableCharacters}\n\n` +
            `𝗨𝘀𝗮𝗴𝗲: ${this.config.name} [character_name]`,
            threadID, messageID
        );
    }

    const character = args[0].toLowerCase();
    if (!characterList[character]) {
        return api.sendMessage(
            `❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿!\n` +
            `𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲: ${Object.keys(characterList).join(', ')}`,
            threadID, messageID
        );
    }

    try {
        const res = await axios.get(`https://api.randvtuber-saikidesu.ml?character=${character}`);
        const ext = res.data.url.substring(res.data.url.lastIndexOf(".") + 1);
        const path = __dirname + `/cache/${character}_${Date.now()}.${ext}`;

        const callback = () => {
            api.sendMessage({
                body: `🎀 𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿: ${characterList[character]}\n` +
                      `📦 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗶𝗺𝗮𝗴𝗲𝘀: ${res.data.count}\n` +
                      `✨ 𝗖𝗿𝗲𝗱𝗶𝘁𝘀: ${res.data.author || "Unknown"}`,
                attachment: fs.createReadStream(path)
            }, threadID, () => fs.unlinkSync(path), messageID);
        };

        request(res.data.url).pipe(fs.createWriteStream(path)).on("close", callback);
        
    } catch (err) {
        api.sendMessage(
            "❌ 𝗘𝗿𝗿𝗼𝗿 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲!\n" +
            "𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿",
            threadID, messageID
        );
    }
};
