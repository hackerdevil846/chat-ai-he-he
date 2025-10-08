const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports = {
    config: {
        name: "arrest",
        aliases: [],
        version: "1.0.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "fun",
        shortDescription: {
            en: "𝖠𝗋𝗋𝖾𝗌𝗍 𝖺 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾𝗂𝗋 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾"
        },
        longDescription: {
            en: "𝖢𝗋𝖾𝖺𝗍𝖾𝗌 𝖺𝗇 𝖺𝗋𝗋𝖾𝗌𝗍 𝗆𝖾𝗆𝖾 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇𝖾𝖽 𝗎𝗌𝖾𝗋'𝗌 𝗉𝗋𝗈𝖿𝗂𝗅𝖾 𝗉𝗂𝖼𝗍𝗎𝗋𝖾"
        },
        guide: {
            en: "{p}arrest [@𝗆𝖾𝗇𝗍𝗂𝗈𝗇]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "path": "",
            "jimp": "",
            "canvas": ""
        }
    },

    onLoad: async function() {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌 𝗂𝗇 𝖺𝗋𝗋𝖾𝗌𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                return;
            }

            const cachePath = path.join(__dirname, "cache");
            const canvasPath = path.join(cachePath, "canvas");
            const templatePath = path.join(canvasPath, "arrest_template.png");
            const fontPath = path.join(canvasPath, "font.ttf");
            
            try {
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
                }
                if (!fs.existsSync(canvasPath)) {
                    fs.mkdirSync(canvasPath, { recursive: true });
                    console.log("✅ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖼𝖺𝗇𝗏𝖺𝗌 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒");
                }
                
                // Download template if not exists
                if (!fs.existsSync(templatePath)) {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖺𝗋𝗋𝖾𝗌𝗍 𝗍𝖾𝗆𝗉𝗅𝖺𝗍𝖾...");
                    const { data } = await axios.get("https://i.imgur.com/ep1gG3r.png", {
                        responseType: "arraybuffer",
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    fs.writeFileSync(templatePath, Buffer.from(data, "binary"));
                    console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                } else {
                    console.log("✅ 𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌");
                }

                // Download font if not exists
                if (!fs.existsSync(fontPath)) {
                    console.log("📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝗈𝗇𝗍...");
                    try {
                        const fontData = await axios.get("https://github.com/catalizcs/storage-data/raw/master/fonts/Manrope-Regular.ttf", {
                            responseType: "arraybuffer",
                            timeout: 30000
                        });
                        fs.writeFileSync(fontPath, Buffer.from(fontData.data));
                        console.log("✅ 𝖥𝗈𝗇𝗍 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒");
                    } catch (fontError) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖿𝗈𝗇𝗍, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍");
                    }
                }

            } catch (err) {
                console.error("❌ 𝖠𝗋𝗋𝖾𝗌𝗍 𝖨𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖺𝗍𝗂𝗈𝗇 𝖤𝗋𝗋𝗈𝗋:", err);
            }
        } catch (error) {
            console.error("💥 𝖠𝗋𝗋𝖾𝗌𝗍 𝖫𝗈𝖺𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
        }
    },

    onStart: async function({ message, event, api }) {
        const { threadID, messageID, senderID } = event;
        
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("axios");
                require("fs-extra");
                require("path");
                require("jimp");
                require("canvas");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌, 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺, 𝗉𝖺𝗍𝗁, 𝗃𝗂𝗆𝗉, 𝖺𝗇𝖽 𝖼𝖺𝗇𝗏𝖺𝗌.");
            }

            const mention = Object.keys(event.mentions)[0];
            if (!mention) {
                return message.reply("⚠️ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝗌𝗈𝗆𝖾𝗈𝗇𝖾 𝗍𝗈 𝖺𝗋𝗋𝖾𝗌𝗍!");
            }

            // Don't allow self-arrest
            if (mention === senderID) {
                return message.reply("❌ 𝖸𝗈𝗎 𝖼𝖺𝗇𝗇𝗈𝗍 𝖺𝗋𝗋𝖾𝗌𝗍 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!");
            }

            const targetName = event.mentions[mention];
            
            // Get user names for better personalization
            let officerName = "𝖮𝖿𝖿𝗂𝖼𝖾𝗋";
            let criminalName = targetName;
            
            try {
                const senderInfo = await api.getUserInfo(senderID);
                officerName = senderInfo[senderID]?.name || "𝖮𝖿𝖿𝗂𝖼𝖾𝗋";
            } catch (nameError) {
                console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗀𝖾𝗍 𝗌𝖾𝗇𝖽𝖾𝗋 𝗇𝖺𝗆𝖾:", nameError);
            }

            // Send processing message
            const processingMsg = await message.reply("⏳ 𝖢𝗋𝖾𝖺𝗍𝗂𝗇𝗀 𝖺𝗋𝗋𝖾𝗌𝗍 𝗐𝖺𝗋𝗋𝖺𝗇𝗍...");
            
            try {
                const canvasPath = path.join(__dirname, "cache", "canvas");
                const imagePath = await this.makeArrestImage(senderID, mention, canvasPath, officerName, criminalName);
                
                // Unsend processing message
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                await message.reply({
                    body: `🚨 ${criminalName}, 𝗒𝗈𝗎'𝗋𝖾 𝗎𝗇𝖽𝖾𝗋 𝖺𝗋𝗋𝖾𝗌𝗍! 🚨\n\n🔒 𝖮𝖿𝖿𝗂𝖼𝖾𝗋: ${officerName}\n⚖️ 𝖢𝗁𝖺𝗋𝗀𝖾𝗌: 𝖡𝖾𝗂𝗇𝗀 𝗍𝗈𝗈 𝖼𝗎𝗍𝖾`,
                    mentions: [{ tag: targetName, id: mention }],
                    attachment: fs.createReadStream(imagePath)
                });

                // Clean up after sending
                setTimeout(() => {
                    try { 
                        if (fs.existsSync(imagePath)) {
                            fs.unlinkSync(imagePath);
                            console.log("🧹 𝖢𝗅𝖾𝖺𝗇𝖾𝖽 𝗎𝗉 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝗂𝗆𝖺𝗀𝖾");
                        }
                    } catch (cleanupErr) {
                        console.warn("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝗂𝗆𝖺𝗀𝖾:", cleanupErr.message);
                    }
                }, 5000);

            } catch (imageError) {
                console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖿𝖺𝗂𝗅𝖾𝖽:", imageError);
                
                // Unsend processing message
                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺𝗋𝗋𝖾𝗌𝗍 𝗂𝗆𝖺𝗀𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖠𝗋𝗋𝖾𝗌𝗍 𝖢𝗈𝗆𝗆𝖺𝗇𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            // Don't send error message to avoid spam
        }
    },

    makeArrestImage: async function(user1, user2, cacheDir, officerName, criminalName) {
        const templatePath = path.join(cacheDir, "arrest_template.png");
        const fontPath = path.join(cacheDir, "font.ttf");
        const outputPath = path.join(cacheDir, `arrest_${user1}_${user2}_${Date.now()}.png`);
        
        try {
            // Check if template exists
            if (!fs.existsSync(templatePath)) {
                throw new Error("𝖳𝖾𝗆𝗉𝗅𝖺𝗍𝖾 𝖿𝗂𝗅𝖾 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽");
            }

            const [avatar1, avatar2, template] = await Promise.all([
                this.getAvatar(user1),
                this.getAvatar(user2),
                loadImage(templatePath)
            ]);

            // Create canvas
            const canvas = createCanvas(800, 600);
            const ctx = canvas.getContext('2d');

            // Draw template background
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            // Register and set font
            try {
                if (fs.existsSync(fontPath)) {
                    registerFont(fontPath, { family: 'Manrope' });
                    ctx.font = 'bold 24px Manrope';
                } else {
                    ctx.font = 'bold 24px Arial';
                }
            } catch (fontError) {
                console.warn("❌ 𝖥𝗈𝗇𝗍 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝖿𝖺𝗂𝗅𝖾𝖽, 𝗎𝗌𝗂𝗇𝗀 𝖽𝖾𝖿𝖺𝗎𝗅𝗍:", fontError);
                ctx.font = 'bold 24px Arial';
            }

            // Draw circular avatars with better positioning
            this.drawCircularImage(ctx, avatar1, 600, 50, 80);  // Officer avatar
            this.drawCircularImage(ctx, avatar2, 100, 150, 80); // Criminal avatar

            // Draw text with better styling
            ctx.fillStyle = '#2c3e50';
            ctx.textAlign = 'center';
            
            // Officer label
            ctx.fillText('👮 𝖮𝖿𝖿𝗂𝖼𝖾𝗋', 600, 160);
            ctx.font = '18px Arial';
            ctx.fillText(this.truncateText(officerName, 20), 600, 185);
            
            // Criminal label
            ctx.font = 'bold 24px Arial';
            ctx.fillText('🔒 𝖢𝗋𝗂𝗆𝗂𝗇𝖺𝗅', 100, 260);
            ctx.font = '18px Arial';
            ctx.fillText(this.truncateText(criminalName, 20), 100, 285);

            // Arrest warrant text
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#e74c3c';
            ctx.fillText('🚨 𝖠𝖱𝖱𝖤𝖲𝖳 𝖶𝖠𝖱𝖱𝖠𝖭𝖳', canvas.width / 2, 350);

            ctx.font = '20px Arial';
            ctx.fillStyle = '#2c3e50';
            ctx.fillText('𝖸𝗈𝗎 𝖺𝗋𝖾 𝖼𝗁𝖺𝗋𝗀𝖾𝖽 𝗐𝗂𝗍𝗁:', canvas.width / 2, 390);
            
            ctx.font = 'bold 22px Arial';
            ctx.fillStyle = '#c0392b';
            ctx.fillText('𝖡𝖾𝗂𝗇𝗀 𝗍𝗈𝗈 𝖼𝗎𝗍𝖾!', canvas.width / 2, 420);

            // Signature line
            ctx.font = '16px Arial';
            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('𝖲𝗂𝗀𝗇𝖾𝖽: 𝖥𝖡𝖨 𝖠𝗇𝗍𝗂-𝖢𝗎𝗍𝖾 𝖣𝗂𝗏𝗂𝗌𝗂𝗈𝗇', canvas.width / 2, 500);

            // Save the final image
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(outputPath, buffer);
            
            console.log("✅ 𝖠𝗋𝗋𝖾𝗌𝗍 𝗂𝗆𝖺𝗀𝖾 𝖼𝗋𝖾𝖺𝗍𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗐𝗂𝗍𝗁 𝖼𝖺𝗇𝗏𝖺𝗌");
            return outputPath;
        } catch (error) {
            console.error("❌ 𝖨𝗆𝖺𝗀𝖾 𝖢𝗋𝖾𝖺𝗍𝗂𝗈𝗇 𝖤𝗋𝗋𝗈𝗋:", error);
            
            // Clean up output file if it was partially created
            try {
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }
            } catch (cleanupError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖼𝗅𝖾𝖺𝗇 𝗎𝗉 𝖿𝖺𝗂𝗅𝖾𝖽 𝗂𝗆𝖺𝗀𝖾:", cleanupError.message);
            }
            
            throw error;
        }
    },

    // Helper function to draw circular images
    drawCircularImage(ctx, image, x, y, radius) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
        
        // Draw border
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.restore();
    },

    // Helper function to truncate long text
    truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    },

    getAvatar: async function(userID) {
        try {
            const url = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const { data } = await axios.get(url, {
                responseType: "arraybuffer",
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            return await loadImage(Buffer.from(data));
        } catch (error) {
            console.error(`❌ 𝖠𝗏𝖺𝗍𝖺𝗋 𝖫𝗈𝖺𝖽𝗂𝗇𝗀 𝖤𝗋𝗋𝗈𝗋 𝖿𝗈𝗋 𝗎𝗌𝖾𝗋 ${userID}:`, error.message);
            
            // Create a fallback avatar with canvas
            const canvas = createCanvas(200, 200);
            const ctx = canvas.getContext('2d');
            
            // Draw circular background
            ctx.fillStyle = '#95a5a6';
            ctx.beginPath();
            ctx.arc(100, 100, 100, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw question mark
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 100, 100);
            
            return await loadImage(canvas.toBuffer());
        }
    }
};
