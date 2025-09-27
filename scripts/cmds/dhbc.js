const axios = require("axios");

module.exports = {
    config: {
        name: "dhbc",
        aliases: ["wordgame", "guessword"],
        version: "1.3",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "Play game - catch the word from images"
        },
        longDescription: {
            en: "Play a fun word guessing game with random images"
        },
        guide: {
            en: "{p}dhbc"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function ({ message, event, usersData }) {
        try {
            // Random image
            const imageUrl = "https://picsum.photos/1280/720";

            // Random word
            const wordData = (await axios.get("https://random-word-api.herokuapp.com/word")).data;
            const wordcomplete = wordData[0];

            // Hide word with █
            const bodyMsg = `🖼️ | Please reply to this message with your answer!\n${wordcomplete.replace(/\S/g, "█ ")}`;

            // Send message with image
            const attachment = await global.utils.getStreamFromURL(imageUrl);

            await message.reply({
                body: bodyMsg,
                attachment: attachment
            }).then((info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    wordcomplete
                });
            });

        } catch (error) {
            console.error(error);
            await message.reply("❌ | An error occurred while starting the game!");
        }
    },

    onReply: async function ({ message, event, handleReply, usersData }) {
        const { author, wordcomplete, messageID } = handleReply;
        
        // Check if the responder is the original player
        if (event.senderID !== author) {
            return message.reply("⚠️ | You are not the player of this question!");
        }

        // Check if answer is correct
        if (formatText(event.body) === formatText(wordcomplete)) {
            // Remove from handleReply
            global.client.handleReply = global.client.handleReply.filter(item => item.messageID !== messageID);
            
            const reward = 1000;
            const userData = await usersData.get(event.senderID);
            await usersData.set(event.senderID, {
                money: (userData?.money || 0) + reward,
                data: userData?.data || {}
            });
            
            await message.reply(`🎉 | Congratulations! You answered correctly and received ${reward}$`);
        } 
        // Wrong answer
        else {
            await message.reply("❌ | Incorrect answer! Please try again.");
        }
    }
};

// Format text for comparison
function formatText(text) {
    return text.normalize("NFD")
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đ|Đ]/g, (x) => x == "đ" ? "d" : "D");
}
