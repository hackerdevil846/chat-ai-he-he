const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "lyrics",
        aliases: [],
        version: "2.0.1",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝖦𝖾𝗍 𝗌𝗈𝗇𝗀 𝗅𝗒𝗋𝗂𝖼𝗌"
        },
        longDescription: {
            en: "𝖥𝖾𝗍𝖼𝗁 𝗅𝗒𝗋𝗂𝖼𝗌 𝖿𝗈𝗋 𝖺𝗇𝗒 𝗌𝗈𝗇𝗀"
        },
        guide: {
            en: "{p}lyrics [𝗌𝗈𝗇𝗀 𝗇𝖺𝗆𝖾]"
        },
        dependencies: {
            "axios": "",
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            let fsAvailable = true;
            try {
                require("axios");
                require("fs-extra");
            } catch (e) {
                axiosAvailable = false;
                fsAvailable = false;
            }

            if (!axiosAvailable || !fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌 𝖺𝗇𝖽 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const songName = args.join(" ").trim();
            if (!songName) {
                return message.reply("🎵 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗌𝗈𝗇𝗀 𝗇𝖺𝗆𝖾!\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾: {p}lyrics 𝖳𝗎𝗆 𝖧𝗂 𝖧𝗈");
            }

            // Validate song name length
            if (songName.length > 100) {
                return message.reply("❌ 𝖲𝗈𝗇𝗀 𝗇𝖺𝗆𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖯𝗅𝖾𝖺𝗌𝖾 𝗄𝖾𝖾𝗉 𝗂𝗍 𝗎𝗇𝖽𝖾𝗋 100 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
            }

            if (songName.length < 2) {
                return message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗏𝖺𝗅𝗂𝖽 𝗌𝗈𝗇𝗀 𝗇𝖺𝗆𝖾.");
            }

            // Create cache directory
            const cacheDir = path.join(__dirname, 'cache');
            try {
                await fs.ensureDir(cacheDir);
            } catch (dirError) {
                console.error("𝖢𝖺𝖼𝗁𝖾 𝖽𝗂𝗋𝖾𝖼𝗍𝗈𝗋𝗒 𝖾𝗋𝗋𝗈𝗋:", dirError);
            }

            const processingMsg = await message.reply(`🔍 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝗅𝗒𝗋𝗂𝖼𝗌 𝖿𝗈𝗋 \"${songName}\"... ⏳`);

            // Helper function to send results
            const sendResult = async ({ title, artist, lyrics }) => {
                const header = [
                    "━━━━━━━━━━━━━━━",
                    "🎶 𝖫𝗒𝗋𝗂𝖼𝗌 𝖥𝗂𝗇𝖽𝖾𝗋",
                    "━━━━━━━━━━━━━━━"
                ].join("\n");

                const info = [
                    `🎼 𝖲𝗈𝗇𝗀: ${title || '𝖭/𝖠'}`,
                    `👤 𝖠𝗋𝗍𝗂𝗌𝗍: ${artist || '𝖭/𝖠'}`
                ].join("\n");

                const footer = [
                    "\n━━━━━━━━━━━━━━━",
                    "© 𝖢𝗋𝖾𝖽𝗂𝗍𝗌: 𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
                    "━━━━━━━━━━━━━━━"
                ].join("\n");

                // Truncate lyrics if too long
                let displayLyrics = lyrics || '𝖭𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.';
                if (displayLyrics.length > 4000) {
                    displayLyrics = displayLyrics.substring(0, 4000) + '\n\n... (𝗍𝗋𝗎𝗇𝖼𝖺𝗍𝖾𝖽)';
                }

                const bodyText = `${header}\n${info}\n\n📝 𝖫𝗒𝗋𝗂𝖼𝗌:\n${displayLyrics}\n${footer}`;

                try {
                    await message.unsendMessage(processingMsg.messageID);
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }
                return message.reply(bodyText);
            };

            // List of API endpoints to try
            const apiEndpoints = [
                {
                    name: "𝗅𝗋𝖼𝗅𝗂𝖻",
                    url: `https://lrclib.net/api/search?q=${encodeURIComponent(songName)}`,
                    timeout: 15000,
                    handler: (data) => {
                        if (Array.isArray(data) && data.length > 0) {
                            const payload = data[0];
                            const title = payload.trackName || songName;
                            const artist = payload.artistName || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇';
                            const lyrics = payload.plainLyrics || '';
                            return { title, artist, lyrics };
                        }
                        return null;
                    }
                },
                {
                    name: "𝗅𝗒𝗋𝗂𝖼𝗌.𝗈𝗏𝗁",
                    url: `https://api.lyrics.ovh/v1/${encodeURIComponent(songName)}`,
                    timeout: 10000,
                    handler: (data) => {
                        if (data.lyrics) {
                            return { 
                                title: songName, 
                                artist: '𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖠𝗋𝗍𝗂𝗌𝗍', 
                                lyrics: data.lyrics 
                            };
                        }
                        return null;
                    }
                },
                {
                    name: "𝗉𝗈𝗉𝖼𝖺𝗍",
                    url: `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`,
                    timeout: 10000,
                    handler: (data) => {
                        if (data.lyrics) {
                            return {
                                title: data.title || songName,
                                artist: data.artist || '𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖠𝗋𝗍𝗂𝗌𝗍',
                                lyrics: data.lyrics
                            };
                        }
                        return null;
                    }
                }
            ];

            let lastError = null;

            // Try each API endpoint
            for (const endpoint of apiEndpoints) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 ${endpoint.name} 𝖠𝖯𝖨...`);
                    
                    const response = await axios.get(endpoint.url, { 
                        timeout: endpoint.timeout,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });

                    const result = endpoint.handler(response.data);
                    if (result && result.lyrics && result.lyrics.trim().length > 0) {
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖿𝗋𝗈𝗆 ${endpoint.name} 𝖠𝖯𝖨`);
                        return await sendResult(result);
                    } else {
                        throw new Error("𝖭𝗈 𝗅𝗒𝗋𝗂𝖼𝗌 𝖿𝗈𝗎𝗇𝖽 𝗂𝗇 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾");
                    }
                    
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ ${endpoint.name} 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽:`, apiError.message);
                    continue;
                }
            }

            // Final error message
            try {
                await message.unsendMessage(processingMsg.messageID);
            } catch (unsendError) {
                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            const errorMessages = [
                `⚠️ 𝖫𝗒𝗋𝗂𝖼𝗌 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 \"${songName}\". 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺 𝖽𝗂𝖿𝖿𝖾𝗋𝖾𝗇𝗍 𝗌𝗈𝗇𝗀 𝗇𝖺𝗆𝖾.`,
                `❌ 𝖭𝗈 𝗅𝗒𝗋𝗂𝖼𝗌 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾 𝖿𝗈𝗋 \"${songName}\". 𝖳𝗋𝗒 𝖺𝗇𝗈𝗍𝗁𝖾𝗋 𝗌𝗈𝗇𝗀.`,
                `😢 𝖢𝗈𝗎𝗅𝖽𝗇'𝗍 𝖿𝗂𝗇𝖽 𝗅𝗒𝗋𝗂𝖼𝗌 𝖿𝗈𝗋 \"${songName}\". 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝗌𝗉𝖾𝗅𝗅𝗂𝗇𝗀.`
            ];
            
            const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            return message.reply(randomError);

        } catch (error) {
            console.error("💥 𝖫𝗒𝗋𝗂𝖼𝗌 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖿𝗈𝗋 𝗅𝗒𝗋𝗂𝖼𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
