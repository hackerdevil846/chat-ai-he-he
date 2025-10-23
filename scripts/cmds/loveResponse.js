const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "loveResponse",
        version: "1.0.0", 
        author: "Asif Mahmud",
        category: "no prefix"
    },

    onChat: async function({ event, message }) {
        try {
            const { body, senderID } = event;
            
            if (!body) return;

            // Convert to lowercase for matching
            const messageText = body.toLowerCase().trim();
            
            // Check for "i love you" variations
            const loveTriggers = [
                "i love you",
                "i love u", 
                "love you",
                "ilu",
                "ily",
                "i luv u",
                "i luv you",
                "aisa keno tomake bhalobashi",
                "আই লাভ ইউ",
                "আমি তোমাকে ভালোবাসি"
            ];

            const isLoveMessage = loveTriggers.some(trigger => 
                messageText.includes(trigger.toLowerCase())
            );

            if (!isLoveMessage) return;

            console.log("💖 Love message detected from user:", senderID);

            // Define the audio file path
            const audioFilePath = path.join(__dirname, "i love you.mp3.mp4");

            // Check if audio file exists
            if (!fs.existsSync(audioFilePath)) {
                console.error("❌ Audio file not found:", audioFilePath);
                return;
            }

            // Verify file is readable
            try {
                const stats = fs.statSync(audioFilePath);
                if (stats.size === 0) {
                    console.error("❌ Audio file is empty");
                    return;
                }
            } catch (fileError) {
                console.error("❌ Error accessing audio file:", fileError.message);
                return;
            }

            // Send only the audio response without text
            await message.reply({
                attachment: fs.createReadStream(audioFilePath)
            });

            console.log("✅ Love response audio sent successfully");

        } catch (error) {
            console.error("💥 Error in love trigger:", error);
        }
    }
};
