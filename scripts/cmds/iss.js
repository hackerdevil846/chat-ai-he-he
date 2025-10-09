const axios = require("axios");

module.exports = {
    config: {
        name: "iss",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "tool",
        shortDescription: {
            en: "𝖨𝗇𝗍𝖾𝗋𝗇𝖺𝗍𝗂𝗈𝗇𝖺𝗅 𝖲𝗉𝖺𝖼𝖾 𝖲𝗍𝖺𝗍𝗂𝗈𝗇 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖲𝖾𝖾 𝗍𝗁𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇 𝗈𝖿 𝗍𝗁𝖾 𝖨𝗇𝗍𝖾𝗋𝗇𝖺𝗍𝗂𝗈𝗇𝖺𝗅 𝖲𝗉𝖺𝖼𝖾 𝖲𝗍𝖺𝗍𝗂𝗈𝗇"
        },
        guide: {
            en: "{p}iss"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message }) {
        try {
            // Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
            }

            if (!axiosAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗑𝗂𝗈𝗌.");
            }

            const loadingMsg = await message.reply("🛰️ 𝖥𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝖨𝖲𝖲 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇...");

            // List of ISS API endpoints to try
            const apiEndpoints = [
                "http://api.open-notify.org/iss-now.json",
                "https://api.wheretheiss.at/v1/satellites/25544",
                "http://api.open-notify.org/iss-now.json"
            ];

            let issData = null;
            let lastError = null;

            // Try each API endpoint
            for (const endpoint of apiEndpoints) {
                try {
                    console.log(`🔗 𝖳𝗋𝗒𝗂𝗇𝗀 𝖨𝖲𝖲 𝖠𝖯𝖨: ${endpoint}`);
                    
                    const response = await axios.get(endpoint, {
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'application/json'
                        }
                    });

                    if (endpoint.includes('open-notify.org')) {
                        // Open Notify API format
                        if (response.data && response.data.iss_position) {
                            issData = {
                                latitude: response.data.iss_position.latitude,
                                longitude: response.data.iss_position.longitude,
                                timestamp: response.data.timestamp,
                                source: "𝖮𝗉𝖾𝗇 𝖭𝗈𝗍𝗂𝖿𝗒 𝖠𝖯𝖨"
                            };
                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖿𝗋𝗈𝗆 𝖮𝗉𝖾𝗇 𝖭𝗈𝗍𝗂𝖿𝗒 𝖠𝖯𝖨`);
                            break;
                        }
                    } else if (endpoint.includes('wheretheiss.at')) {
                        // Where The ISS At API format
                        if (response.data && response.data.latitude !== undefined) {
                            issData = {
                                latitude: response.data.latitude,
                                longitude: response.data.longitude,
                                altitude: response.data.altitude,
                                velocity: response.data.velocity,
                                source: "𝖶𝗁𝖾𝗋𝖾 𝖳𝗁𝖾 𝖨𝖲𝖲 𝖠𝗍 𝖠𝖯𝖨"
                            };
                            console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌 𝖿𝗋𝗈𝗆 𝖶𝗁𝖾𝗋𝖾 𝖳𝗁𝖾 𝖨𝖲𝖲 𝖠𝗍 𝖠𝖯𝖨`);
                            break;
                        }
                    }
                    
                } catch (apiError) {
                    lastError = apiError;
                    console.error(`❌ 𝖠𝖯𝖨 𝖿𝖺𝗂𝗅𝖾𝖽: ${endpoint} - ${apiError.message}`);
                    continue;
                }
            }

            // Unsend loading message
            try {
                await message.unsendMessage(loadingMsg.messageID);
            } catch (unsendError) {
                console.warn("❌ 𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
            }

            if (!issData) {
                console.error("💥 𝖠𝗅𝗅 𝖨𝖲𝖲 𝖠𝖯𝖨𝗌 𝖿𝖺𝗂𝗅𝖾𝖽`);
                
                // Send fallback information
                return message.reply(
                    "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n" +
                    "       𝖨𝖭𝖳𝖤𝖱𝖭𝖠𝖳𝖨𝖮𝖭𝖠𝖫 𝖲𝖯𝖠𝖢𝖤 𝖲𝖳𝖠𝖳𝖨𝖮𝖭\n" +
                    "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n\n" +
                    "❌ 𝖴𝗇𝖺𝖻𝗅𝖾 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗅𝗈𝖼𝖺𝗍𝗂𝗈𝗇\n\n" +
                    "🔭 𝖱𝖾𝖺𝗅-𝗍𝗂𝗆𝖾 𝗍𝗋𝖺𝖼𝗄𝗂𝗇𝗀:\n" +
                    "https://spotthestation.nasa.gov/tracking_map.cfm\n\n" +
                    "🛰️ 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝗌𝗉𝖾𝖾𝖽: 28,000 𝗄𝗆/𝗁\n" +
                    "🌎 𝖮𝗋𝖻𝗂𝗍 𝗍𝗂𝗆𝖾: 90 𝗆𝗂𝗇𝗎𝗍𝖾𝗌\n" +
                    "👨‍🚀 𝖢𝗋𝖾𝗐: 7 𝖺𝗌𝗍𝗋𝗈𝗇𝖺𝗎𝗍𝗌"
                );
            }

            // Format coordinates
            const lat = parseFloat(issData.latitude).toFixed(4);
            const lon = parseFloat(issData.longitude).toFixed(4);
            
            // Determine position over Earth
            let position = "𝖮𝗏𝖾𝗋 𝗈𝖼𝖾𝖺𝗇";
            if (lat > 0) {
                position = "𝖭𝗈𝗋𝗍𝗁𝖾𝗋𝗇 𝗁𝖾𝗆𝗂𝗌𝗉𝗁𝖾𝗋𝖾";
            } else {
                position = "𝖲𝗈𝗎𝗍𝗁𝖾𝗋𝗇 𝗁𝖾𝗆𝗂𝗌𝗉𝗁𝖾𝗋𝖾";
            }

            // Create the response message
            const issMessage = 
                "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n" +
                "       𝖨𝖭𝖳𝖤𝖱𝖭𝖠𝖳𝖨𝖮𝖭𝖠𝖫 𝖲𝖯𝖠𝖢𝖤 𝖲𝖳𝖠𝖳𝖨𝖮𝖭\n" +
                "🛰️ ━━━━━━━━━━━━━━━━━━━━ 🛰️\n\n" +
                `📍 𝖫𝖺𝗍𝗂𝗍𝗎𝖽𝖾: ${lat}°\n` +
                `📍 𝖫𝗈𝗇𝗀𝗂𝗍𝗎𝖽𝖾: ${lon}°\n` +
                `🌍 𝖯𝗈𝗌𝗂𝗍𝗂𝗈𝗇: ${position}\n\n` +
                `🔭 𝖱𝖾𝖺𝗅-𝗍𝗂𝗆𝖾 𝗍𝗋𝖺𝖼𝗄𝗂𝗇𝗀:\n` +
                `https://spotthestation.nasa.gov/tracking_map.cfm\n\n` +
                `🛰️ 𝖢𝗎𝗋𝗋𝖾𝗇𝗍 𝗌𝗉𝖾𝖾𝖽: 28,000 𝗄𝗆/𝗁\n` +
                `🌎 𝖮𝗋𝖻𝗂𝗍 𝗍𝗂𝗆𝖾: 90 𝗆𝗂𝗇𝗎𝗍𝖾𝗌\n` +
                `👨‍🚀 𝖢𝗋𝖾𝗐: 7 𝖺𝗌𝗍𝗋𝗈𝗇𝖺𝗎𝗍𝗌\n` +
                `📡 𝖣𝖺𝗍𝖺 𝗌𝗈𝗎𝗋𝖼𝖾: ${issData.source}`;

            await message.reply(issMessage);

        } catch (error) {
            console.error("💥 𝖨𝖲𝖲 𝖤𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖿𝖾𝗍𝖼𝗁 𝖨𝖲𝖲 𝖽𝖺𝗍𝖺. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage = "❌ 𝖭𝖾𝗍𝗐𝗈𝗋𝗄 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗍𝖾𝗋𝗇𝖾𝗍 𝖼𝗈𝗇𝗇𝖾𝖼𝗍𝗂𝗈𝗇.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = "❌ 𝖱𝖾𝗊𝗎𝖾𝗌𝗍 𝗍𝗂𝗆𝖾𝖽 𝗈𝗎𝗍. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
