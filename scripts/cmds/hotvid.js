const axios = require('axios');

module.exports = {
    config: {
        name: "hotvid",
        aliases: [],
        version: "2.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 2,
        category: "nsfw",
        shortDescription: {
            en: "Random NSFW video from premium sources"
        },
        longDescription: {
            en: "Get random premium NSFW video content"
        },
        guide: {
            en: "{p}hotvid"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            try {
                require("axios");
            } catch (e) {
                return message.reply("❌ Missing dependency: axios");
            }

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

            await message.reply({
                body: "🔥 Enjoy this premium content!",
                attachment: await global.utils.getStreamFromURL(videoUrl)
            });

        } catch (err) {
            console.error("[HOTVID CMD ERROR]", err);
            await message.reply("❌ Sorry, couldn't load the content. Please try again later.");
        }
    }
};
