const axios = require("axios");

module.exports = {
    config: {
        name: "chocolate",
        aliases: [],
        version: "1.0.1",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "🍫 𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝖾𝖽 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝗌𝗒𝗌𝗍𝖾𝗆"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗍𝗈 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖺𝗇𝖽 𝗍𝗈𝖿𝖿𝖾𝖾 𝗄𝖾𝗒𝗐𝗈𝗋𝖽𝗌 𝗐𝗂𝗍𝗁 𝖺 𝗌𝗐𝖾𝖾𝗍 𝗆𝖾𝗌𝗌𝖺𝗀𝖾"
        },
        guide: {
            en: "𝖩𝗎𝗌𝗍 𝗍𝗒𝗉𝖾 '𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾' 𝗈𝗋 '𝗍𝗈𝖿𝖿𝖾𝖾' 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            return message.reply("🍫 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗌 𝗐𝗁𝖾𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗒𝗉𝖾𝗌 '𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾' 𝗈𝗋 '𝗍𝗈𝖿𝖿𝖾𝖾' 𝗂𝗇 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍!");
        } catch (error) {
            console.error("💥 𝖢𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖮𝗇𝖲𝗍𝖺𝗋𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    onChat: async function({ event, message, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return;
            }

            const { threadID, messageID, body } = event;
            
            if (!body) return;

            const triggers = [
                "chocolate", 
                "toffee", 
                "sweet",
                "𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾",
                "𝗍𝗈𝖿𝖿𝖾𝖾",
                "𝗌𝗐𝖾𝖾𝗍",
                "𝑐ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒",
                "𝑡𝑜𝑓𝑓𝑒𝑒",
                "𝑠𝑤𝑒𝑒𝑡"
            ];
            
            const messageText = body.toLowerCase().trim();
            const shouldTrigger = triggers.some(trigger => 
                messageText.includes(trigger.toLowerCase())
            );

            if (shouldTrigger) {
                const chocolateImageURL = "https://i.imgur.com/8B3r2Q9.jpeg";
                
                console.log(`🍫 𝖳𝗋𝗂𝗀𝗀𝖾𝗋𝖾𝖽 𝖻𝗒: "${body}"`);

                try {
                    const imageStream = await global.utils.getStreamFromURL(chocolateImageURL);

                    if (!imageStream) {
                        throw new Error("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝗂𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆");
                    }

                    await message.reply({
                        body: "🍫 𝖸𝖾 𝗅𝗈 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖽𝖺𝗋𝗅𝗂𝗇𝗀! 💝",
                        attachment: imageStream
                    });
                    
                    console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗌𝖾𝗇𝗍 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾`);

                    // Add reaction with error handling
                    try {
                        await api.setMessageReaction("🍫", messageID, () => {}, true);
                    } catch (reactionError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                    }
                    
                } catch (streamError) {
                    console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝗌𝗍𝗋𝖾𝖺𝗆 𝖾𝗋𝗋𝗈𝗋:", streamError);
                    
                    // Fallback: send text-only response
                    try {
                        await message.reply("🍫 𝖸𝖾 𝗅𝗈 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖽𝖺𝗋𝗅𝗂𝗇𝗀! 💝\n\n❌ 𝖨𝗆𝖺𝗀𝖾 𝗎𝗇𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾, 𝖻𝗎𝗍 𝗁𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝖼𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝗅𝗈𝗏𝖾!");
                        
                        // Add reaction for text-only response
                        try {
                            await api.setMessageReaction("🍫", messageID, () => {}, true);
                        } catch (reactionError) {
                            console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                        }
                    } catch (fallbackError) {
                        console.error("❌ 𝖥𝖺𝗅𝗅𝖻𝖺𝖼𝗄 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾 𝖿𝖺𝗂𝗅𝖾𝖽:", fallbackError);
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖢𝗁𝗈𝖼𝗈𝗅𝖺𝗍𝖾 𝖮𝗇𝖢𝗁𝖺𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    }
};
