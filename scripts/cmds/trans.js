module.exports.config = {
    name: "translate",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑻𝒆𝒙𝒕 𝒕𝒓𝒂𝒏𝒔𝒍𝒂𝒕𝒊𝒐𝒏 𝒘𝒊𝒕𝒉 𝒂𝒖𝒕𝒐-𝒅𝒆𝒕𝒆𝒄𝒕 𝒂𝒏𝒅 𝒎𝒖𝒍𝒕𝒊𝒍𝒊𝒏𝒈𝒖𝒂𝒍 𝒔𝒖𝒑𝒑𝒐𝒓𝒕",
    category: "media",
    usages: "[lang] [text] OR reply to message",
    cooldowns: 5,
    dependencies: {
        "request": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const request = global.nodemodule["request"];
    
    let content;
    let targetLang = args[0]?.toLowerCase();

    // Supported languages list
    const supportedLangs = ["en", "es", "fr", "de", "ja", "ko", "zh", "vi", "ar", "hi", "bn", "ru"];
    
    if (event.messageReply) {
        content = event.messageReply.body;
        if (supportedLangs.includes(targetLang)) {
            args.shift();
        } else {
            targetLang = "en"; // Default language
        }
    } else {
        if (supportedLangs.includes(targetLang)) {
            args.shift();
            content = args.join(" ");
        } else {
            targetLang = "en";
            content = args.join(" ");
        }
    }

    if (!content) return api.sendMessage("❌ Please provide text or reply to a message to translate!", event.threadID);

    return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${content}`), 
        (err, response, body) => {
            if (err) return api.sendMessage("❌ Translation error: " + err.message, event.threadID);

            try {
                const result = JSON.parse(body);
                const translation = result[0].map(item => item[0]).join('');
                const sourceLang = result[2] || "auto";

                api.sendMessage(
                    `🌐 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗜𝗢𝗡 𝗥𝗘𝗦𝗨𝗟𝗧:\n\n` +
                    `📜 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹 (${sourceLang}):\n"${content}"\n\n` +
                    `🔄 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲𝗱 (${targetLang}):\n"${translation}"\n\n` +
                    `✨ 𝗧𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲𝗱 𝗯𝘆: ${this.config.credits}`,
                    event.threadID,
                    event.messageID
                );
            } catch (e) {
                api.sendMessage("❌ Translation failed. Please try again later.", event.threadID);
            }
        }
    );
};
