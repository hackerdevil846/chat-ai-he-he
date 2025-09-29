const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "imdb",
        aliases: [],
        version: "1.0.7",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "media",
        shortDescription: {
            en: "𝐺𝑒𝑡 𝑚𝑜𝑣𝑖𝑒/𝑠𝑒𝑟𝑖𝑒𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑠 𝑓𝑟𝑜𝑚 𝐼𝑀𝐷𝐵"
        },
        longDescription: {
            en: "𝐹𝑒𝑡𝑐ℎ 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑎𝑏𝑜𝑢𝑡 𝑚𝑜𝑣𝑖𝑒𝑠 𝑎𝑛𝑑 𝑠𝑒𝑟𝑖𝑒𝑠 𝑓𝑟𝑜𝑚 𝐼𝑀𝐷𝐵"
        },
        guide: {
            en: "{p}imdb <𝑚𝑜𝑣𝑖𝑒/𝑠𝑒𝑟𝑖𝑒𝑠 𝑛𝑎𝑚𝑒>"
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            if (!args.length) {
                return message.reply("🎬 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑜𝑣𝑖𝑒/𝑠𝑒𝑟𝑖𝑒𝑠 𝑛𝑎𝑚𝑒!\n𝑈𝑠𝑎𝑔𝑒: 𝑖𝑚𝑑𝑏 <𝑚𝑜𝑣𝑖𝑒/𝑠𝑒𝑟𝑖𝑒𝑠 𝑛𝑎𝑚𝑒>");
            }

            const query = args.join(" ");
            const apiKey = "8f50e26e";
            const url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}&plot=full`;

            // Show processing message
            const processingMsg = await message.reply("🔍 | 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝐼𝑀𝐷𝐵 𝑑𝑎𝑡𝑎𝑏𝑎𝑠𝑒...");

            const response = await axios.get(url, {
                timeout: 15000
            });
            
            const data = response.data;

            if (data.Response === "False") {
                await message.unsend(processingMsg.messageID);
                return message.reply(`❌ | 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${query}"\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑡𝑖𝑡𝑙𝑒 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!`);
            }

            // Helper function to handle N/A values
            const handleNA = (value) => value === "N/A" ? "Not Available" : value;

            const messageText = `
🎬 𝗧𝗜𝗧𝗟𝗘: ${handleNA(data.Title)} (${handleNA(data.Year)})
⭐ 𝗥𝗔𝗧𝗜𝗡𝗚: ${handleNA(data.imdbRating)}/10
🎭 𝗚𝗘𝗡𝗥𝗘: ${handleNA(data.Genre)}
📅 𝗥𝗘𝗟𝗘𝗔𝗦𝗘𝗗: ${handleNA(data.Released)}
⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘: ${handleNA(data.Runtime)}
🎙️ 𝗟𝗔𝗡𝗚𝗨𝗔𝗚𝗘: ${handleNA(data.Language)}
🎬 𝗗𝗜𝗥𝗘𝗖𝗧𝗢𝗥: ${handleNA(data.Director)}
📝 𝗪𝗥𝗜𝗧𝗘𝗥: ${handleNA(data.Writer)}
👨‍👩‍👧‍👦 𝗖𝗔𝗦𝗧: ${handleNA(data.Actors)}
🏆 𝗔𝗪𝗔𝗥𝗗𝗦: ${handleNA(data.Awards)}
🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬: ${handleNA(data.Country)}
📺 𝗧𝗬𝗣𝗘: ${handleNA(data.Type)}

📜 𝗣𝗟𝗢𝗧:
${handleNA(data.Plot)}

🔗 𝗜𝗠𝗗𝗕 𝗟𝗜𝗡𝗞: https://www.imdb.com/title/${data.imdbID}/
            `.trim();

            // Clean up processing message
            await message.unsend(processingMsg.messageID);

            // Send text info first
            await message.reply(messageText);

            // Send poster if available
            if (data.Poster && data.Poster !== "N/A") {
                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }

                const posterPath = path.join(cacheDir, `imdb_${data.imdbID}_${Date.now()}.jpg`);
                
                try {
                    const imageResponse = await axios({
                        url: data.Poster,
                        method: 'GET',
                        responseType: 'arraybuffer',
                        timeout: 30000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // Check if response is valid
                    if (!imageResponse.data || imageResponse.data.length === 0) {
                        throw new Error("Empty image response");
                    }

                    await fs.writeFileSync(posterPath, Buffer.from(imageResponse.data));

                    // Verify file was written
                    if (!fs.existsSync(posterPath)) {
                        throw new Error("Failed to save image");
                    }

                    const stats = fs.statSync(posterPath);
                    if (stats.size === 0) {
                        throw new Error("Empty image file");
                    }

                    await message.reply({
                        body: "📸 𝗠𝗢𝗩𝗜𝗘 𝗣𝗢𝗦𝗧𝗘𝗥",
                        attachment: fs.createReadStream(posterPath)
                    });

                    // Clean up after sending
                    setTimeout(() => {
                        try {
                            if (fs.existsSync(posterPath)) {
                                fs.unlinkSync(posterPath);
                            }
                        } catch (cleanupError) {
                            console.error("Poster cleanup error:", cleanupError);
                        }
                    }, 5000);
                    
                } catch (imageError) {
                    console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", imageError);
                    // Don't send error message for image failure, just continue
                }
            }

        } catch (error) {
            console.error("𝐼𝑀𝐷𝐵 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!";
            
            if (error.code === "ECONNABORTED") {
                errorMessage = "⏰ | 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            } else if (error.response) {
                errorMessage = "🌐 | 𝐴𝑃𝐼 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            } else if (error.request) {
                errorMessage = "🔗 | 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
