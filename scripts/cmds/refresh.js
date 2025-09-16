const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "refresh",
        aliases: ["update", "reload"],
        version: "1.2",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 60,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "♻️ Refresh information of group chat or user"
        },
        longDescription: {
            en: "♻️ Refresh and update information of group chats or users with stylish canvas effects"
        },
        guide: {
            en: "{p}refresh [thread | group | user] [ID | @tag]"
        },
        dependencies: {
            "canvas": ""
        }
    },

    onStart: async function({ api, event, args, threadsData, usersData }) {
        try {
            // Check dependencies
            try {
                if (!Canvas || !Canvas.createCanvas || !fs || !path) {
                    throw new Error("Missing required dependencies");
                }
            } catch (err) {
                return api.sendMessage("❌ | Required dependencies are missing. Please install canvas.", event.threadID, event.messageID);
            }

            // Function to generate stylish canvas message
            async function sendCanvasMessage(text) {
                const canvas = Canvas.createCanvas(600, 150);
                const ctx = canvas.getContext('2d');

                // Background
                ctx.fillStyle = "#23272A";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Text styling
                ctx.font = '28px Sans-serif';
                ctx.fillStyle = "#00FF7F";
                ctx.textAlign = "center";
                ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

                // Convert canvas to buffer
                const imageBuffer = canvas.toBuffer();
                const tempPath = path.join(__dirname, "cache", "refresh_temp.png");
                
                // Ensure cache directory exists
                if (!fs.existsSync(path.join(__dirname, "cache"))) {
                    fs.mkdirSync(path.join(__dirname, "cache"));
                }
                
                fs.writeFileSync(tempPath, imageBuffer);

                await api.sendMessage({ 
                    body: "♻️ Refresh Command",
                    attachment: fs.createReadStream(tempPath)
                }, event.threadID);
                
                // Clean up
                fs.unlinkSync(tempPath);
            }

            if (args[0] === "group" || args[0] === "thread") {
                const targetID = args[1] || event.threadID;
                try {
                    await threadsData.refreshInfo(targetID);
                    const successText = targetID == event.threadID ? 
                        "✅ | Refreshed your group chat information successfully!" : 
                        `✅ | Refreshed group chat ${targetID} information successfully!`;
                    return sendCanvasMessage(successText);
                } catch (error) {
                    console.error("Refresh Thread Error:", error);
                    const errorText = targetID == event.threadID ? 
                        "❌ | Failed to refresh your group chat information!" : 
                        `❌ | Failed to refresh group chat ${targetID} information!`;
                    return sendCanvasMessage(errorText);
                }
            } 
            else if (args[0] === "user") {
                let targetID = event.senderID;
                if (args[1]) {
                    if (Object.keys(event.mentions).length) 
                        targetID = Object.keys(event.mentions)[0];
                    else 
                        targetID = args[1];
                }
                try {
                    await usersData.refreshInfo(targetID);
                    const successText = targetID == event.senderID ? 
                        "✅ | Refreshed your user information successfully!" : 
                        `✅ | Refreshed user ${targetID} information successfully!`;
                    return sendCanvasMessage(successText);
                } catch (error) {
                    console.error("Refresh User Error:", error);
                    const errorText = targetID == event.senderID ? 
                        "❌ | Failed to refresh your user information!" : 
                        `❌ | Failed to refresh user ${targetID} information!`;
                    return sendCanvasMessage(errorText);
                }
            } 
            else {
                // Show help message
                const helpText = `🔄 𝗥𝗘𝗙𝗥𝗘𝗦𝗛 𝗖𝗢𝗠𝗠𝗔𝗡𝗗\n━━━━━━━━━━━━━━━\n\n✨ 𝗨𝘀𝗮𝗴𝗲:\n• ${this.config.guide.en}\n\n📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:\n• ${this.config.name} group\n• ${this.config.name} user @mention\n• ${this.config.name} thread 123456789\n\n👑 𝗕𝘆: ${this.config.author}`;
                
                return api.sendMessage(helpText, event.threadID, event.messageID);
            }

        } catch (error) {
            console.error("Refresh Command Error:", error);
            api.sendMessage("❌ | An error occurred while processing the refresh command.", event.threadID, event.messageID);
        }
    }
};
