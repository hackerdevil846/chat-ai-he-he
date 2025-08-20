const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "imdb",
    version: "1.0.6",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Get movie/series details from IMDB",
    commandCategory: "media",
    usages: "[movie/series name]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs": "",
        "path": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        if (!args.length) {
            return api.sendMessage("🎬 | Please provide a movie/series name!\nUsage: imdb <movie/series name>", event.threadID, event.messageID);
        }

        const query = args.join(" ");
        const apiKey = "8f50e26e";
        const url = `http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.Response === "False") {
            return api.sendMessage(`❌ | No results found for "${query}"\nPlease check the title and try again!`, event.threadID, event.messageID);
        }

        const message = `
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

        api.sendMessage(message, event.threadID, event.messageID);

        if (data.Poster && data.Poster !== "N/A") {
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir);
            }

            const posterPath = path.join(cacheDir, `imdb_${data.imdbID}.jpg`);
            const writer = fs.createWriteStream(posterPath);
            const imageResponse = await axios({
                url: data.Poster,
                method: 'GET',
                responseType: 'stream'
            });

            imageResponse.data.pipe(writer);

            writer.on('finish', () => {
                api.sendMessage({
                    body: "📸 𝗣𝗢𝗦𝗧𝗘𝗥:",
                    attachment: fs.createReadStream(posterPath)
                }, event.threadID, () => {
                    fs.unlinkSync(posterPath);
                });
            });
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | An error occurred while fetching the data. Please try again later!", event.threadID, event.messageID);
    }
};
