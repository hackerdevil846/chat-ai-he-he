const fs = global.nodemodule["fs-extra"];
const Discord = global.nodemodule["discord.js"];
const DIG = global.nodemodule["discord-image-generation"];
const request = global.nodemodule["node-superfetch"];

module.exports.config = {
    name: "spank",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "একজনকে অন্যজনকে spank করতে দেখানো",
    commandCategory: "Edit-Image",
    usages: "[খালি বা tag]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "discord.js": "",
        "discord-image-generation": "",
        "node-superfetch": ""
    }
};

module.exports.run = async ({ event, api, args, Users }) => {
    try {
        const { senderID, threadID, messageID, mentions } = event;

        // Mentioned user বা default sender
        let id1 = Object.keys(mentions)[0] || senderID;
        let id2 = Object.keys(mentions)[1] || senderID;

        // Facebook avatar fetch
        const avatar1 = (await request.get(`https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
        const avatar2 = (await request.get(`https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;

        // Image generation
        let img = await new DIG.Spank().getImage(avatar2, avatar1);

        // Temp path
        const path_trash = __dirname + "/cache/spank.png";

        // Save file
        fs.writeFileSync(path_trash, img);

        // Send message with attachment
        api.sendMessage({ attachment: fs.createReadStream(path_trash) }, threadID, () => fs.unlinkSync(path_trash), messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("⚠️ কিছু একটা সমস্যা হয়েছে, পরে আবার চেষ্টা করো।", event.threadID, event.messageID);
    }
};
