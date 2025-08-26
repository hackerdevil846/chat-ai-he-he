const fs = require("fs-extra");
const DIG = require("discord-image-generation");
const request = require("node-superfetch");

module.exports.config = {
    name: "spank",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "একজনকে অন্যজনকে spank করতে দেখানো 👋🍑",
    category: "Edit-Image",
    usages: "[mention1] [mention2]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
};

module.exports.languages = {
    "bn": {
        "error": "⚠️ কিছু একটা সমস্যা হয়েছে, পরে আবার চেষ্টা করো।",
        "success": "✅ ছবি তৈরি হয়েছে!"
    },
    "en": {
        "error": "⚠️ Something went wrong, try again later.",
        "success": "✅ Image has been generated!"
    }
};

module.exports.onStart = async function({ api, event, args, Users, Threads, Currencies, permssion }) {
    try {
        const { senderID, threadID, messageID, mentions } = event;

        // Determine target users
        let id1 = Object.keys(mentions)[0] || senderID;
        let id2 = Object.keys(mentions)[1] || senderID;

        // Fetch Facebook avatars
        const avatar1 = (await request.get(`https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        const avatar2 = (await request.get(`https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        // Generate spank image
        let imageBuffer = await new DIG.Spank().getImage(avatar2, avatar1);

        // Temp path
        const path_trash = __dirname + "/cache/spank.png";

        // Save image
        fs.writeFileSync(path_trash, imageBuffer);

        // Send message with attachment
        api.sendMessage({
            body: `🍑 ${mentions && Object.keys(mentions).length ? `<@${id1}> spanked <@${id2}>!` : "Spank action!"}`,
            attachment: fs.createReadStream(path_trash)
        }, threadID, () => fs.unlinkSync(path_trash), messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("⚠️ কিছু একটা সমস্যা হয়েছে, পরে আবার চেষ্টা করো।", event.threadID, event.messageID);
    }
};
