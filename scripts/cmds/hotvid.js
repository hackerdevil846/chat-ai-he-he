module.exports.config = {
    name: "hotvid",
    aliases: ["nsfwvid", "premiumvid"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "nsfw",
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝑁𝑆𝐹𝑊 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 𝑠𝑜𝑢𝑟𝑐𝑒𝑠"
    },
    longDescription: {
        en: "𝐺𝑒𝑡 𝑟𝑎𝑛𝑑𝑜𝑚 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 𝑁𝑆𝐹𝑊 𝑣𝑖𝑑𝑒𝑜 𝑐𝑜𝑛𝑡𝑒𝑛𝑡"
    },
    guide: {
        en: "{p}hotvid"
    },
    dependencies: {
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "replyText": "🔥 𝐸𝑛𝑗𝑜𝑦 𝑡ℎ𝑖𝑠 𝑝𝑟𝑒𝑚𝑖𝑢𝑚 𝑐𝑜𝑛𝑡𝑒𝑛𝑡!",
        "errorText": "❌ 𝑆𝑜𝑟𝑟𝑦, 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑙𝑜𝑎𝑑 𝑡ℎ𝑒 𝑐𝑜𝑛𝑡𝑒𝑛𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟."
    }
};

module.exports.onStart = async function({ message }) {
    try {
        const videoSources = [
            "https://i.imgur.com/FbnZI40.mp4",
            "https://i.imgur.com/E9gbTEZ.mp4",
            "https://i.imgur.com/17nXn9K.mp4",
            "https://i.imgur.com/nj23cCe.mp4",
            "https://i.imgur.com/lMpmBFb.mp4",
            "https://i.imgur.com/85iuBp2.mp4",
            "https://i.imgur.com/R3XHTby.mp4",
            "https://i.imgur.com/qX2HUXp.mp4",
            "https://i.imgur.com/MYn0ese.mp4",
            "https://i.imgur.com/yipoKec.mp4",
            "https://i.imgur.com/0tFSIWT.mp4",
            "https://i.imgur.com/BzP6eD8.mp4",
            "https://i.imgur.com/aDlwRWy.mp4",
            "https://i.imgur.com/l3c86M3.mp4",
            "https://i.imgur.com/lfjT7bx.mp4",
            "https://i.imgur.com/Zp5sci1.mp4",
            "https://i.imgur.com/S6rHOc1.mp4",
            "https://i.imgur.com/cAHRfq3.mp4",
            "https://i.imgur.com/zzqEWkN.mp4",
            "https://i.imgur.com/fL1igWD.mp4",
            "https://i.imgur.com/ZRt0bGT.mp4",
            "https://i.imgur.com/fAKWP0W.mp4",
            "https://i.imgur.com/A1d4F7X.mp4",
            "https://i.imgur.com/9jJgLhV.mp4",
            "https://i.imgur.com/W3qK5bR.mp4"
        ];

        const randomIndex = Math.floor(Math.random() * videoSources.length);
        const videoUrl = videoSources[randomIndex];

        return message.reply({
            body: this.languages.en.replyText,
            attachment: await global.utils.getStreamFromURL(videoUrl)
        });

    } catch (err) {
        console.error("[𝐻𝑂𝑇𝑉𝐼𝐷 𝐶𝑀𝐷 𝐸𝑅𝑅𝑂𝑅]", err);
        return message.reply(this.languages.en.errorText);
    }
};
