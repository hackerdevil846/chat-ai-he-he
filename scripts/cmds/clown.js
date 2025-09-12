const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "clown",
    aliases: ["clownify", "jester"],
    version: "1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "🎪 𝐴𝑑𝑑 𝑠𝑜𝑚𝑒 𝑐𝑙𝑜𝑤𝑛 𝑣𝑖𝑏𝑒𝑠 𝑡𝑜 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓 𝑜𝑟 𝑎 𝑓𝑟𝑖𝑒𝑛𝑑!"
    },
    longDescription: {
        en: "🎪 𝐶𝑟𝑒𝑎𝑡𝑒 𝑓𝑢𝑛𝑛𝑦 𝑐𝑙𝑜𝑤𝑛-𝑡ℎ𝑒𝑚𝑒𝑑 𝑖𝑚𝑎𝑔𝑒𝑠 𝑓𝑟𝑜𝑚 𝑢𝑠𝑒𝑟 𝑎𝑣𝑎𝑡𝑎𝑟𝑠"
    },
    guide: {
        en: "{p}clown [𝑟𝑒𝑝𝑙𝑦/𝑡𝑎𝑔 𝑠𝑜𝑚𝑒𝑜𝑛𝑒]"
    },
    dependencies: {
        "discord-image-generation": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ message, event, usersData }) {
    try {
        let targetID;
        
        if (event.type === "message_reply") {
            targetID = event.messageReply.senderID;
        } else if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0];
        } else {
            targetID = event.senderID;
        }

        const userData = await usersData.get(targetID);
        const avatarUrl = userData.avatar || `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const pathSave = `${__dirname}/tmp/clown_${targetID}.png`;
        
        // Create triggered effect
        const triggeredBuffer = await new DIG.Triggered().getImage(avatarUrl);
        fs.writeFileSync(pathSave, triggeredBuffer);

        let bodyMessage;
        if (targetID === event.senderID) {
            bodyMessage = "🤡 𝑌𝑜𝑢'𝑟𝑒 𝑡ℎ𝑒 𝑐𝑙𝑜𝑤𝑛! 𝐿𝑜𝑜𝑘 𝑎𝑡 𝑦𝑜𝑢𝑟𝑠𝑒𝑙𝑓!";
        } else {
            const targetName = await usersData.getName(targetID);
            const senderName = await usersData.getName(event.senderID);
            bodyMessage = `🤡 ${senderName} 𝑎𝑑𝑑𝑒𝑑 𝑠𝑜𝑚𝑒 𝑐𝑙𝑜𝑤𝑛𝑖𝑠ℎ 𝑣𝑖𝑏𝑒𝑠 𝑡𝑜 ${targetName}!`;
        }

        await message.reply({
            body: bodyMessage,
            attachment: fs.createReadStream(pathSave)
        });

        // Clean up
        fs.unlinkSync(pathSave);

    } catch (error) {
        console.error("𝐶𝑙𝑜𝑤𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑐𝑙𝑜𝑤𝑛 𝑖𝑚𝑎𝑔𝑒. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
