const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "gali",
        aliases: ["abuse", "swear"],
        version: "1.0.1",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "noprefix",
        shortDescription: {
            en: "Auto response to abusive messages"
        },
        longDescription: {
            en: "Automatically responds to abusive or swear messages with a funny response"
        },
        guide: {
            en: "No prefix needed - automatically triggers on abusive words"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onLoad: function() {
        console.log("Gali detection module loaded successfully! 🛡️");
    },

    onStart: async function({ message, event }) {
        try {
            await message.reply("🤖 Auto gali response system is active!\n- Trigger words: fuck, mc, chod, bal, bc, etc...");
        } catch (error) {
            console.error("Gali start error:", error);
        }
    },

    onChat: async function({ event, message }) {
        try {
            const triggers = [
                "fuck", "mc", "chod", "bal", "bc", "maa ki chut",
                "xod", "behen chod", "🖕", "madarchod", "chudi", "gala gali",
                "bitch", "asshole", "shit", "bastard", "motherfucker"
            ];
            
            if (event.body && triggers.some(trigger => 
                event.body.toLowerCase().includes(trigger.toLowerCase()))) {
                
                const videoPath = path.join(__dirname, "noprefix", "gali.mp4");
                
                if (fs.existsSync(videoPath)) {
                    await message.reply({
                        body: "Boss Dk, Gali keno deo?Tomar nunu katke hath er modhe dhoriya dibo 😤",
                        attachment: fs.createReadStream(videoPath)
                    });
                } else {
                    await message.reply("Boss Dk, Gali keno deo?Tomar nunu katke hath er modhe dhoriya dibo 😤");
                }
                
                // Add reaction if possible
                try {
                    if (message.react) {
                        await message.react("😠");
                    }
                } catch (reactionError) {
                    console.error("Reaction error:", reactionError);
                }
            }
        } catch (error) {
            console.error("Gali response error:", error);
        }
    }
};
