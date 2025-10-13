const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "refresh",
        aliases: [],
        version: "1.2",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 60,
        role: 0,
        category: "utility",
        shortDescription: {
            en: "♻️ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗈𝖿 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍 𝗈𝗋 𝗎𝗌𝖾𝗋"
        },
        longDescription: {
            en: "♻️ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖺𝗇𝖽 𝗎𝗉𝖽𝖺𝗍𝖾 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗈𝖿 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍𝗌 𝗈𝗋 𝗎𝗌𝖾𝗋𝗌 𝗐𝗂𝗍𝗁 𝗌𝗍𝗒𝗅𝗂𝗌𝗁 𝖼𝖺𝗇𝗏𝖺𝗌 𝖾𝖿𝖿𝖾𝖼𝗍𝗌"
        },
        guide: {
            en: "{p}refresh [𝗍𝗁𝗋𝖾𝖺𝖽 | 𝗀𝗋𝗈𝗎𝗉 | 𝗎𝗌𝖾𝗋] [𝖨𝖣 | @𝗍𝖺𝗀]"
        },
        dependencies: {
            "canvas": "",
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ api, event, args, threadsData, usersData }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("canvas");
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return api.sendMessage("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖼𝖺𝗇𝗏𝖺𝗌.", event.threadID, event.messageID);
            }

            // Function to generate stylish canvas message
            async function sendCanvasMessage(text) {
                try {
                    const canvas = Canvas.createCanvas(700, 200);
                    const ctx = canvas.getContext('2d');

                    // Background gradient
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    gradient.addColorStop(0, "#1a1a2e");
                    gradient.addColorStop(1, "#16213e");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Border
                    ctx.strokeStyle = "#00FF7F";
                    ctx.lineWidth = 4;
                    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

                    // Main text
                    ctx.font = 'bold 32px Arial';
                    ctx.fillStyle = "#00FF7F";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

                    // Subtitle
                    ctx.font = '18px Arial';
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillText("♻️ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖢𝗈𝗆𝗆𝖺𝗇𝖽", canvas.width / 2, canvas.height - 40);

                    // Convert canvas to buffer
                    const imageBuffer = canvas.toBuffer();
                    const tempPath = path.join(__dirname, "cache", `refresh_${Date.now()}.png`);
                    
                    // Ensure cache directory exists
                    const cacheDir = path.join(__dirname, "cache");
                    if (!fs.existsSync(cacheDir)) {
                        fs.mkdirSync(cacheDir, { recursive: true });
                    }
                    
                    fs.writeFileSync(tempPath, imageBuffer);

                    await api.sendMessage({ 
                        body: "♻️ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖢𝗈𝗆𝗆𝖺𝗇𝖽",
                        attachment: fs.createReadStream(tempPath)
                    }, event.threadID);
                    
                    // Clean up
                    setTimeout(() => {
                        try {
                            if (fs.existsSync(tempPath)) {
                                fs.unlinkSync(tempPath);
                            }
                        } catch (cleanupError) {
                            console.warn("𝖢𝗅𝖾𝖺𝗇𝗎𝗉 𝖾𝗋𝗋𝗈𝗋:", cleanupError);
                        }
                    }, 5000);

                } catch (canvasError) {
                    console.error("𝖢𝖺𝗇𝗏𝖺𝗌 𝖾𝗋𝗋𝗈𝗋:", canvasError);
                    // Fallback to text message if canvas fails
                    await api.sendMessage(`♻️ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖢𝗈𝗆𝗆𝖺𝗇𝖽\n\n${text}`, event.threadID);
                }
            }

            if (args[0] === "group" || args[0] === "thread") {
                const targetID = args[1] || event.threadID;
                
                // Validate thread ID
                if (targetID && isNaN(targetID)) {
                    return sendCanvasMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗀𝗋𝗈𝗎𝗉 𝖨𝖣! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                }

                try {
                    await threadsData.refreshInfo(targetID);
                    const successText = targetID == event.threadID ? 
                        "✅ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁𝖾𝖽 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!" : 
                        `✅ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁𝖾𝖽 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍 ${targetID} 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!`;
                    return sendCanvasMessage(successText);
                } catch (error) {
                    console.error("𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖳𝗁𝗋𝖾𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
                    const errorText = targetID == event.threadID ? 
                        "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝗒𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇!" : 
                        `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍 ${targetID} 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇!`;
                    return sendCanvasMessage(errorText);
                }
            } 
            else if (args[0] === "user") {
                let targetID = event.senderID;
                
                if (args[1]) {
                    if (Object.keys(event.mentions).length) {
                        targetID = Object.keys(event.mentions)[0];
                    } else {
                        targetID = args[1];
                    }
                }

                // Validate user ID
                if (targetID && isNaN(targetID)) {
                    return sendCanvasMessage("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗇𝗎𝗆𝖾𝗋𝗂𝖼 𝖨𝖣.");
                }

                try {
                    await usersData.refreshInfo(targetID);
                    const successText = targetID == event.senderID ? 
                        "✅ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁𝖾𝖽 𝗒𝗈𝗎𝗋 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!" : 
                        `✅ 𝖱𝖾𝖿𝗋𝖾𝗌𝗁𝖾𝖽 𝗎𝗌𝖾𝗋 ${targetID} 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!`;
                    return sendCanvasMessage(successText);
                } catch (error) {
                    console.error("𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖴𝗌𝖾𝗋 𝖤𝗋𝗋𝗈𝗋:", error);
                    const errorText = targetID == event.senderID ? 
                        "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝗒𝗈𝗎𝗋 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇!" : 
                        `❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝗎𝗌𝖾𝗋 ${targetID} 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇!`;
                    return sendCanvasMessage(errorText);
                }
            } 
            else {
                // Show help message with stylish formatting
                const helpText = 
`╭───────『 ✧  𝖱𝖤𝖥𝖱𝖤𝖲𝖧 𝖢𝖮𝖬𝖬𝖠𝖭𝖣  ✧ 』───────╮
│
│ ✦ {𝗉}refresh 𝗀𝗋𝗈𝗎𝗉
│     𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇
│
│ ✦ {𝗉}refresh 𝗎𝗌𝖾𝗋
│     𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝗒𝗈𝗎𝗋 𝗎𝗌𝖾𝗋 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇
│
│ ✦ {𝗉}refresh 𝗀𝗋𝗈𝗎𝗉 [𝖨𝖣]
│     𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝗀𝗋𝗈𝗎𝗉 𝖻𝗒 𝖨𝖣
│
│ ✦ {𝗉}refresh 𝗎𝗌𝖾𝗋 [@𝗍𝖺𝗀/𝖨𝖣]
│     𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝗎𝗌𝖾𝗋
│
╰───────────────────────╯
👑 𝖡𝗒: ${this.config.author}`;
                
                return api.sendMessage(helpText, event.threadID, event.messageID);
            }

        } catch (error) {
            console.error("💥 𝖱𝖾𝖿𝗋𝖾𝗌𝗁 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝗋𝖾𝖿𝗋𝖾𝗌𝗁 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.";
            
            if (error.message.includes('threadsData') || error.message.includes('usersData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('canvas')) {
                errorMessage = "❌ 𝖢𝖺𝗇𝗏𝖺𝗌 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await api.sendMessage(errorMessage, event.threadID, event.messageID);
        }
    }
};
