const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cacheDir = path.join(__dirname, 'cache');

module.exports = {
    config: {
        name: "guess",
        aliases: ["animeguess", "character"],
        version: "1.3",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        category: "game",
        shortDescription: {
            en: "Guess the anime character"
        },
        longDescription: {
            en: "Guess the name of the anime character based on traits and tags with random images."
        },
        guide: {
            en: "{p}guess"
        }
    },

    onLoad: async function () {
        try {
            await fs.ensureDir(cacheDir);
            if (!global.client) global.client = {};
            if (!global.client.onReply) {
                global.client.onReply = new Map();
            }
        } catch (err) {
            console.error('[guess] onLoad error:', err);
        }
    },

    onStart: async function({ message, event, usersData }) {
        try {
            const resp = await axios.get('https://global-prime-mahis-apis.vercel.app', {
                timeout: 30000
            });
            
            if (!resp || !resp.data) {
                throw new Error('Invalid API response from character server');
            }

            const characters = resp.data.data;
            const charactersArray = Array.isArray(characters) ? characters : [characters];
            
            if (!charactersArray.length) {
                throw new Error('No character data available');
            }

            const randomIndex = Math.floor(Math.random() * charactersArray.length);
            const pick = charactersArray[randomIndex];

            const image = pick.image || pick.img || pick.url;
            const traits = pick.traits || pick.description || pick.trait || "No traits available";
            const tags = pick.tags || pick.tag || "No tags available";
            const fullName = pick.fullName || pick.full_name || pick.name || "Unknown Character";
            const firstName = pick.firstName || pick.first_name || (typeof fullName === 'string' ? fullName.split(" ")[0] : "Unknown");

            if (!image) {
                throw new Error('No image URL for selected character');
            }

            await fs.ensureDir(cacheDir);
            const timestamp = Date.now();
            const imagePath = path.join(cacheDir, `character_${timestamp}.jpg`);
            
            // Download character image
            const imageRes = await axios.get(image, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            
            await fs.writeFile(imagePath, imageRes.data);

            // Verify image was downloaded
            if (!fs.existsSync(imagePath)) {
                throw new Error('Failed to save character image');
            }

            const stats = fs.statSync(imagePath);
            if (stats.size === 0) {
                throw new Error('Downloaded image is empty');
            }

            const body = `🎮 𝗚𝘂𝗲𝘀𝘀 𝗧𝗵𝗲 𝗔𝗻𝗶𝗺𝗲 𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿
━━━━━━━━━━━━━━━━━━
✨ 𝗧𝗿𝗮𝗶𝘁𝘀: ${traits}
🏷️ 𝗧𝗮𝗴𝘀: ${tags}

⏰ 𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝟯𝟬 𝘀𝗲𝗰𝗼𝗻𝗱𝘀 𝘁𝗼 𝗮𝗻𝘀𝘄𝗲𝗿!`;

            await message.reply({
                body,
                attachment: fs.createReadStream(imagePath)
            }, async (err, info) => {
                if (err) {
                    console.error('[guess] sendMessage error:', err);
                    await message.reply("❌ Error starting the game. Please try again.");
                    await fs.unlink(imagePath).catch(() => {});
                    return;
                }

                if (!global.client.onReply) {
                    global.client.onReply = new Map();
                }

                // Store correct answers (both full name and first name)
                const correctAnswers = [];
                if (fullName && fullName.trim()) correctAnswers.push(fullName.trim().toLowerCase());
                if (firstName && firstName.trim()) correctAnswers.push(firstName.trim().toLowerCase());

                global.client.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    messageID: info.messageID,
                    correctAnswer: correctAnswers,
                    senderID: event.senderID,
                    imagePath: imagePath,
                    _created: Date.now()
                });

                // Auto cleanup after 30 seconds
                setTimeout(async () => {
                    try {
                        const currentReply = global.client.onReply.get(info.messageID);
                        if (currentReply) {
                            await message.unsend(info.messageID).catch(() => {});
                            global.client.onReply.delete(info.messageID);
                            
                            // Show correct answer if time expires
                            await message.reply(`⏰ Time's up! The correct answer was: ${correctAnswers.join(" or ")}`);
                            
                            // Clean up image file
                            if (fs.existsSync(imagePath)) {
                                await fs.unlink(imagePath).catch(() => {});
                            }
                        }
                    } catch (e) {
                        console.error('[guess] timeout cleanup error:', e);
                    }
                }, 30000); // 30 seconds
            });

        } catch (err) {
            console.error('[guess] onStart error:', err);
            let errorMsg = "❌ An error occurred while starting the game.";
            
            if (err.message.includes('timeout')) {
                errorMsg = "⏰ Game server timeout. Please try again.";
            } else if (err.message.includes('ENOTFOUND')) {
                errorMsg = "🌐 Cannot connect to game server. Check your internet.";
            }
            
            await message.reply(errorMsg);
        }
    },

    onReply: async function({ event, message, handleReply, usersData }) {
        try {
            if (!handleReply) {
                const repliedTo = event.messageReply ? event.messageReply.messageID : event.messageID;
                handleReply = global.client.onReply.get(repliedTo);
            }

            if (!handleReply) return;

            if (event.senderID !== handleReply.senderID) {
                return message.reply("❌ This game is not for you! Start your own game with `guess` command.");
            }

            const userAnswer = (event.body || "").trim().toLowerCase();
            const correctAnswers = handleReply.correctAnswer || [];

            if (correctAnswers.length === 0) {
                await message.reply("❌ Error processing answer.");
                return;
            }

            // Check if answer is correct
            const isCorrect = correctAnswers.some(correctAnswer => 
                userAnswer === correctAnswer.toLowerCase()
            );

            if (isCorrect) {
                const reward = 1000;
                let currentMoney = 0;
                
                // Get current money
                try {
                    if (usersData && typeof usersData.get === 'function') {
                        const userData = await usersData.get(event.senderID);
                        currentMoney = Number(userData.money) || 0;
                    }
                } catch (e) {
                    console.error('[guess] get money error:', e);
                }

                const newBalance = currentMoney + reward;
                
                // Set new money
                try {
                    if (usersData && typeof usersData.set === 'function') {
                        await usersData.set(event.senderID, { money: newBalance });
                    }
                } catch (e) {
                    console.error('[guess] set money error:', e);
                }

                const successMsg = `✅ 𝗖𝗼𝗿𝗿𝗲𝗰𝘁 𝗔𝗻𝘀𝘄𝗲𝗿!\n\n💰 𝗬𝗼𝘂𝗿 𝗪𝗮𝗹𝗹𝗲𝘁:\n━━━━━━━━━━━━━━━━━━\n💵 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $${newBalance}\n🎁 𝗥𝗲𝘄𝗮𝗿𝗱: +$${reward}\n━━━━━━━━━━━━━━━━━━`;
                await message.reply(successMsg);
            } else {
                const wrongMsg = `❌ 𝗪𝗿𝗼𝗻𝗴! 𝗧𝗵𝗲 𝗰𝗼𝗿𝗿𝗲𝗰𝘁 𝗮𝗻𝘀𝘄𝗲𝗿 𝘄𝗮𝘀: ${correctAnswers.join(" or ")}`;
                await message.reply(wrongMsg);
            }

            // Cleanup
            try {
                await message.unsend(handleReply.messageID).catch(() => {});
            } catch (e) {}

            try {
                global.client.onReply.delete(handleReply.messageID);
            } catch (e) {}

            try {
                if (handleReply.imagePath && fs.existsSync(handleReply.imagePath)) {
                    await fs.unlink(handleReply.imagePath).catch(() => {});
                }
            } catch (e) {}

        } catch (err) {
            console.error('[guess] onReply error:', err);
            await message.reply("❌ Error processing your answer.");
        }
    }
};
