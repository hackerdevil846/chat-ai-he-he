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
            const url = `http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;

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

            // Clean up processing message
            try {
                await message.unsend(processingMsg.messageID);
            } catch (unsendError) {
                // Ignore unsend errors
            }

            const messageText = `
🎬 𝗧𝗜𝗧𝗟𝗘: ${data.Title || "N/A"} (${data.Year || "N/A"})
⭐ 𝗥𝗔𝗧𝗜𝗡𝗚: ${data.imdbRating || "N/A"}/10
🎭 𝗚𝗘𝗡𝗥𝗘: ${data.Genre || "N/A"}
📅 𝗥𝗘𝗟𝗘𝗔𝗦𝗘𝗗: ${data.Released || "N/A"}
⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘: ${data.Runtime || "N/A"}
🎙️ 𝗟𝗔𝗡𝗚𝗨𝗔𝗚𝗘: ${data.Language || "N/A"}
🎬 𝗗𝗜𝗥𝗘𝗖𝗧𝗢𝗥: ${data.Director || "N/A"}
📝 𝗪𝗥𝗜𝗧𝗘𝗥: ${data.Writer || "N/A"}
👨‍👩‍👧‍👦 𝗖𝗔𝗦𝗧: ${data.Actors || "N/A"}
🏆 𝗔𝗪𝗔𝗥𝗗𝗦: ${data.Awards || "N/A"}
🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬: ${data.Country || "N/A"}

📜 𝗣𝗟𝗢𝗧:
${data.Plot || "No plot available"}

🔗 𝗜𝗠𝗗𝗕 𝗟𝗜𝗡𝗞: https://www.imdb.com/title/${data.imdbID}/
            `.trim();

            await message.reply(messageText);

            // Download and send poster if available
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
                        timeout: 15000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });

                    // Check if image data is valid
                    if (!imageResponse.data || imageResponse.data.length === 0) {
                        throw new Error("Empty image response");
                    }

                    await fs.writeFileSync(posterPath, Buffer.from(imageResponse.data));

                    // Verify file was written
                    if (!fs.existsSync(posterPath)) {
                        throw new Error("Failed to save poster");
                    }

                    const stats = fs.statSync(posterPath);
                    if (stats.size === 0) {
                        throw new Error("Empty poster file");
                    }

                    await message.reply({
                        body: "📸 𝗠𝗢𝗩𝗜𝗘 𝗣𝗢𝗦𝗧𝗘𝗥:",
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
                    // Continue without poster if download fails
                }
            }

        } catch (error) {
            console.error("𝐼𝑀𝐷𝐵 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!";
            
            if (error.message.includes("timeout")) {
                errorMessage = "⏰ | 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            } else if (error.message.includes("ENOTFOUND")) {
                errorMessage = "🌐 | 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
            } else if (error.message.includes("404")) {
                errorMessage = "🔍 | 𝐼𝑀𝐷𝐵 𝐴𝑃𝐼 𝑛𝑜𝑡 𝑎𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒. 𝑇𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
