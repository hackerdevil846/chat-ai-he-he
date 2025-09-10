const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "asif",
    aliases: ["asifmahmud", "asifbot"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "no prefix",
    shortDescription: {
        en: "𝐴𝑢𝑡𝑜-𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑒𝑟 𝑓𝑜𝑟 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑠"
    },
    longDescription: {
        en: "𝐴𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑠 𝑤ℎ𝑒𝑛 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 𝑖𝑠 𝑚𝑒𝑛𝑡𝑖𝑜𝑛𝑒𝑑"
    },
    guide: {
        en: "𝑀𝑒𝑛𝑡𝑖𝑜𝑛 @𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑 𝑜𝑟 𝑡𝑦𝑝𝑒 '𝑎𝑠𝑖𝑓'"
    },
    dependencies: {
        "fs": "",
        "path": ""
    }
};

module.exports.onChat = async function({ event, api }) {
    try {
        if (this.config.author !== '𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑') {
            console.log('[𝑊𝐴𝑅𝑁] » 𝐶ℎ𝑎𝑛𝑔𝑒 𝑎𝑢𝑡ℎ𝑜𝑟 𝑡𝑜 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑');
            return api.sendMessage('[𝑊𝐴𝑅𝑁] 𝐶ℎ𝑎𝑛𝑔𝑒 𝑡ℎ𝑒 𝑎𝑢𝑡ℎ𝑜𝑟 𝑡𝑜 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑', event.threadID, event.messageID);
        }

        const { threadID, messageID } = event;
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

        if (triggerWords.some(word => event.body && event.body.toLowerCase().includes(word.toLowerCase()))) {
            const imagePath = path.join(__dirname, "scripts", "cmds", "noprefix", "Asif.png");
            
            if (!fs.existsSync(imagePath)) {
                console.log("𝐼𝑚𝑎𝑔𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑎𝑡:", imagePath);
                return api.sendMessage("❌ 𝐼𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!", threadID, messageID);
            }

            const msg = {
                body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
                attachment: fs.createReadStream(imagePath)
            };
            
            await api.sendMessage(msg, threadID, messageID);
            await api.setMessageReaction("💔", messageID, (err) => {}, true);
        }
    } catch (error) {
        console.error("𝐴𝑠𝑖𝑓 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ api, event }) {
    try {
        const imagePath = path.join(__dirname, "scripts", "cmds", "noprefix", "Asif.png");
        
        if (!fs.existsSync(imagePath)) {
            return api.sendMessage("❌ 𝐼𝑚𝑎𝑔𝑒 𝑓𝑖𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑!", event.threadID, event.messageID);
        }

        const msg = {
            body: "『 @𝐓ɽ͜͡𝐮𝐬ʈ 𝐌̽𝐞 𝐁𝐚͜͡𝐛ɣ̈̈›› 𝐈 𝐖ɪ̽ɭɭ ဗီူံ ๛⃝𓆩𝐁ɽ͜͡𝐞̽ɑ̽𝐤 𝐘ǿ𝐮̽ɾ 𝐇𝐞̽𝐚͜͡𝐫ʈﮩﮩــﮩــــ𓆩  𓆪〘̶𑁍 〘̶𑁍𓆩⃝A̶S̶I̶F̶𓆪 † 』𓆩๏̬̬̬̬̬̬𓆪†『٭𝐱͜͡⃝ᴆ』†٭❯ 』",
            attachment: fs.createReadStream(imagePath)
        };
        
        await api.sendMessage(msg, event.threadID, event.messageID);
        await api.setMessageReaction("💔", event.messageID, (err) => {}, true);
    } catch (error) {
        console.error("𝐴𝑠𝑖𝑓 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.", event.threadID, event.messageID);
    }
};
