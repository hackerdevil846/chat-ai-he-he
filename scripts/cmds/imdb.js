const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "imdb",
    aliases: ["movie", "series"],
    version: "1.0.6",
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
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onStart = async function({ message, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs || !path) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        if (!args.length) {
            return message.reply("🎬 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑜𝑣𝑖𝑒/𝑠𝑒𝑟𝑖𝑒𝑠 𝑛𝑎𝑚𝑒!\n𝑈𝑠𝑎𝑔𝑒: 𝑖𝑚𝑑𝑏 <𝑚𝑜𝑣𝑖𝑒/𝑠𝑒𝑟𝑖𝑒𝑠 𝑛𝑎𝑚𝑒>", event.threadID, event.messageID);
        }

        const query = args.join(" ");
        const apiKey = "8f50e26e";
        const url = `http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.Response === "False") {
            return message.reply(`❌ | 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 "${𝑞𝑢𝑒𝑟𝑦}"\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑡ℎ𝑒 𝑡𝑖𝑡𝑙𝑒 𝑎𝑛𝑑 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛!`, event.threadID, event.messageID);
        }

        const messageText = `
🎬 𝗧𝗜𝗧𝗟𝗘: ${data.Title} (${data.Year})
⭐ 𝗥𝗔𝗧𝗜𝗡𝗚: ${data.imdbRating}/10
🎭 𝗚𝗘𝗡𝗥𝗘: ${data.Genre}
📅 𝗥𝗘𝗟𝗘𝗔𝗦𝗘𝗗: ${data.Released}
⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘: ${data.Runtime}
🎙️ 𝗟𝗔𝗡𝗚𝗨𝗔𝗚𝗘: ${data.Language}
🎬 𝗗𝗜𝗥𝗘𝗖𝗧𝗢𝗥: ${data.Director}
📝 𝗪𝗥𝗜𝗧𝗘𝗥: ${data.Writer}
👨‍👩‍👧‍👦 𝗖𝗔𝗦𝗧: ${data.Actors}
🏆 𝗔𝗪𝗔𝗥𝗗𝗦: ${data.Awards}
🌍 𝗖𝗢𝗨𝗡𝗧𝗥𝗬: ${data.Country}

📜 𝗣𝗟𝗢𝗧:
${data.Plot}

🔗 𝗜𝗠𝗗𝗕 𝗟𝗜𝗡𝗞: https://www.imdb.com/title/${data.imdbID}/
        `.trim();

        await message.reply(messageText, event.threadID, event.messageID);

        if (data.Poster && data.Poster !== "N/A") {
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const posterPath = path.join(cacheDir, `imdb_${data.imdbID}.jpg`);
            
            try {
                const imageResponse = await axios({
                    url: data.Poster,
                    method: 'GET',
                    responseType: 'arraybuffer'
                });

                await fs.writeFileSync(posterPath, Buffer.from(imageResponse.data));
                
                await message.reply({
                    body: "📸 𝗣𝗢𝗦𝗧𝗘𝗥:",
                    attachment: fs.createReadStream(posterPath)
                }, event.threadID);
                
                // Clean up after sending
                setTimeout(() => {
                    if (fs.existsSync(posterPath)) {
                        fs.unlinkSync(posterPath);
                    }
                }, 5000);
                
            } catch (imageError) {
                console.error("𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", imageError);
            }
        }
    } catch (error) {
        console.error("𝐼𝑀𝐷𝐵 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ | 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑡ℎ𝑒 𝑑𝑎𝑡𝑎. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!", event.threadID, event.messageID);
    }
};
