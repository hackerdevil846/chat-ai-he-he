const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "chocolate",
        version: "1.0.1",
        hasPermssion: 0,
        credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
        description: "🍫 Automated chocolate response system",
        category: "fun",
        usages: "N/A",
        cooldowns: 5,
        envConfig: {}
    },

    onLoad: function() {
        console.log('🍫 Chocolate module loaded');
    },

    onStart: async function({ api, event }) {
        // This function can remain empty since we're using handleEvent
        // But must exist to prevent the "onStart undefined" error
    },

    handleEvent: function({ api, event }) {
        const { threadID, messageID, body } = event;
        const triggers = ["chocolate", "toffee"];
        
        if (triggers.some(trigger => 
            body.toLowerCase().includes(trigger.toLowerCase())
        )) {
            const chocolatePath = path.join(__dirname, 'cache', 'chocolate.jpg');
            
            if (!fs.existsSync(chocolatePath)) {
                console.error("Chocolate image not found:", chocolatePath);
                return;
            }

            const msg = {
                body: "🍫 𝐘𝐞 𝐥𝐨 𝐜𝐡𝐨𝐜𝐨𝐥𝐚𝐭𝐞 𝐝𝐚𝐫𝐥𝐢𝐧𝐠! 💝",
                attachment: fs.createReadStream(chocolatePath)
            };
            
            api.sendMessage(msg, threadID, messageID);
            api.setMessageReaction("🍫", messageID, (err) => {}, true);
        }
    }
};
