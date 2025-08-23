const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports.config = {
    name: "batslap",
    version: "1.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🎭 Batslap image generator",
    commandCategory: "random-img",
    usages: "@tag [message]",
    cooldowns: 5,
    dependencies: {
        "discord-image-generation": "",
        "fs-extra": ""
    },
    envConfig: {}
};

module.exports.languages = {
    "vi": {
        noTag: "Bạn phải tag người bạn muốn tát"
    },
    "en": {
        noTag: "❌ You must tag the person you want to slap!"
    }
};

module.exports.onLoad = function() {
    // Runs when command is loaded
};

module.exports.run = async function({ api, event, args, Users }) {
    try {
        const uid1 = event.senderID;
        const uid2 = Object.keys(event.mentions)[0];
        if (!uid2) return api.sendMessage(global.GoatBot.getLang("en", "noTag"), event.threadID);

        const avatarURL1 = await Users.getAvatarUrl(uid1);
        const avatarURL2 = await Users.getAvatarUrl(uid2);

        const img = await new DIG.Batslap().getImage(avatarURL1, avatarURL2);
        const pathSave = `${__dirname}/tmp/${uid1}_${uid2}Batslap.png`;
        fs.writeFileSync(pathSave, Buffer.from(img));

        const content = args.join(' ').replace(Object.keys(event.mentions)[0], "") || "Bópppp 😵‍💫😵";
        api.sendMessage({
            body: `💥 ${content}`,
            attachment: fs.createReadStream(pathSave)
        }, event.threadID, () => fs.unlinkSync(pathSave));

    } catch (error) {
        console.error(error);
        api.sendMessage("❌ Something went wrong while generating the Batslap image!", event.threadID);
    }
};
