const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "loveResponse",
        version: "1.0.0", 
        author: "Asif Mahmud",
        category: "no prefix",
        role: 0
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

            // Define the audio file path - CORRECT PATH
            const audioFilePath = path.join(__dirname, "i love you.mp3.mp4");

            // Check if audio file exists
            if (!fs.existsSync(audioFilePath)) {
                console.error("❌ Audio file not found:", audioFilePath);
                
                // Send a text response if audio file is missing
                await message.reply("💖 I love you too! ❤️");
                return;
            }

            // Verify file is readable
            try {
                const stats = fs.statSync(audioFilePath);
                if (stats.size === 0) {
                    console.error("❌ Audio file is empty");
                    await message.reply("💖 I love you too! ❤️");
                    return;
                }
                
                console.log("✅ Audio file found, size:", stats.size, "bytes");

            } catch (fileError) {
                console.error("❌ Error accessing audio file:", fileError.message);
                await message.reply("💖 I love you too! ❤️");
                return;
            }

            // Send the audio response
            await message.reply({
                attachment: fs.createReadStream(audioFilePath),
                body: "💖"
            });

            console.log("✅ Love response audio sent successfully");

        } catch (error) {
            console.error("💥 Error in love trigger:", error);
            
            // Fallback text response in case of any error
            try {
                await message.reply("💖 I love you too! ❤️");
            } catch (fallbackError) {
                console.error("💥 Even fallback failed:", fallbackError);
            }
        }
    },

    // Add onStart function to handle command usage if needed
    onStart: async function({ message }) {
        await message.reply("💖 This command automatically responds to love messages in chat. Try saying 'I love you'!");
    }
};
