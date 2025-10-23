const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "noprefix00",
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "media",
        shortDescription: {
            en: "Plays ara.mp3 when triggered by specific words"
        },
        longDescription: {
            en: "Automatically plays ara.mp3 audio when trigger words are detected in chat"
        },
        guide: {
            en: "Just type trigger words in chat"
        }
    },

    onChat: async function({ event, message }) {
        try {
            // Trigger words that will activate the audio
            const triggerWords = [
                "hintai", "hentai", "ara", "ara ara", "yamete", "kudasai",
                "senpai", "onii chan", "onee chan", "baka", "kawaii",
                "oppai", "ecchi", "lewd", "anime", "weeb"
            ];

            // Check if message exists and contains trigger words
            if (!event.body) return;

            const messageText = event.body.toLowerCase().trim();
            
            // Check if any trigger word is in the message
            const foundTrigger = triggerWords.some(word => 
                messageText.includes(word.toLowerCase())
            );

            if (!foundTrigger) return;

            // Define the audio file path
            const audioPath = path.join(__dirname, "ara.mp3");

            // Check if audio file exists
            if (!fs.existsSync(audioPath)) {
                console.error("❌ Audio file not found:", audioPath);
                return;
            }

            // Check file size to ensure it's valid
            const stats = fs.statSync(audioPath);
            if (stats.size === 0) {
                console.error("❌ Audio file is empty");
                return;
            }

            console.log("🎵 Playing ara.mp3 audio");

            // Send the audio file
            await message.reply({
                body: "🎶 Ara ara~!",
                attachment: fs.createReadStream(audioPath)
            });

        } catch (error) {
            console.error("💥 Audio Command Error:", error);
        }
    },

    onStart: async function({ message }) {
        // Optional: Info when someone uses the command directly
        await message.reply("🎵 This command plays ara.mp3 when trigger words are detected in chat.\n\nTrigger words: hintai, hentai, ara, yamete, senpai, etc.");
    }
};
