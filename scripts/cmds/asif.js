const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "asif",
        aliases: ["asifmahmud", "asifbot"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "no prefix",
        shortDescription: {
            en: "𝖠𝗎𝗍𝗈-𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝖾𝗋 𝖿𝗈𝗋 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝗌"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝗂𝗌 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽"
        },
        guide: {
            en: "𝖬𝖾𝗇𝗍𝗂𝗈𝗇 @𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽 𝗈𝗋 𝗍𝗒𝗉𝖾 '𝖺𝗌𝗂𝖿'"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            const imagePath = path.join(__dirname, "scripts", "cmds", "noprefix", "Asif.png");
            
            if (!fs.existsSync(imagePath)) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍:", imagePath);
                return message.reply("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽!");
            }

            const msg = {
                body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
                attachment: fs.createReadStream(imagePath)
            };
            
            await message.reply(msg);
            
            // Add reaction with error handling
            try {
                await api.setMessageReaction("💔", event.messageID, () => {}, true);
            } catch (reactionError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
            }
            
        } catch (error) {
            console.error("💥 𝖠𝗌𝗂𝖿 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function({ event, api, message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { threadID, messageID, body } = event;
            
            if (!body) return;

            const triggerWords = [
                "@Asif Mahmud",
                "@𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯",
                "@𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
                "@Asif",
                "Asif",
                "asif",
                "𝐴𝑠𝑖𝑓",
                "𝑨𝒔𝒊𝒇"
            ];

            const messageText = body.toLowerCase().trim();
            const shouldTrigger = triggerWords.some(word => 
                messageText.includes(word.toLowerCase())
            );

            if (shouldTrigger) {
                const imagePath = path.join(__dirname, "scripts", "cmds", "noprefix", "Asif.png");
                
                if (!fs.existsSync(imagePath)) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖺𝗍:", imagePath);
                    return;
                }

                // Check if file is readable
                try {
                    fs.accessSync(imagePath, fs.constants.R_OK);
                } catch (accessError) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝗋𝖾𝖺𝖽𝖺𝖻𝗅𝖾:", accessError.message);
                    return;
                }

                const msg = {
                    body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
                    attachment: fs.createReadStream(imagePath)
                };
                
                try {
                    await message.reply(msg);
                    
                    // Add reaction with error handling
                    try {
                        await api.setMessageReaction("💔", messageID, () => {}, true);
                    } catch (reactionError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                    }
                    
                } catch (replyError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗋𝖾𝗉𝗅𝗒:", replyError.message);
                }
            }
        } catch (error) {
            console.error("💥 𝖠𝗌𝗂𝖿 𝖼𝗁𝖺𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
