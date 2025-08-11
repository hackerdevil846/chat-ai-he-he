const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "imdb",
    version: "1.0.6",
    hasPermission: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑰𝑴𝑫𝑩 𝒕𝒉𝒆𝒌𝒆 𝒎𝒐𝒗𝒊𝒆 𝒃𝒂 𝒔𝒆𝒓𝒊𝒆𝒔 𝒆𝒓 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒋𝒂𝒏𝒖𝒏",
    commandCategory: "𝒔𝒆𝒂𝒓𝒄𝒉",
    usages: "[𝒎𝒐𝒗𝒊𝒆/𝒔𝒆𝒓𝒊𝒆𝒔 𝒏𝒂𝒎]",
    cooldowns: 3
};

module.exports.run = async ({ event, args, api }) => {
    if (!args.length) {
        return api.sendMessage("❗ 𝑫𝒂𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝒎𝒐𝒗𝒊𝒆 𝒃𝒂 𝒔𝒆𝒓𝒊𝒆𝒔 𝒆𝒓 𝒏𝒂𝒎 𝒆𝒏𝒕𝒆𝒓 𝒌𝒐𝒓𝒖𝒏!", event.threadID, event.messageID);
    }

    const query = args.join(" ");
    const apiKey = "8f50e26e"; // Your IMDb API Key
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.Response === "False") {
            return api.sendMessage(`❌ 𝑰𝑴𝑫𝑩 𝒕𝒆 *${query}* 𝒆𝒓 𝒌𝒐𝒏𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝒑𝒂𝒘𝒂 𝒋𝒂𝒊𝒏𝒊 𝒏𝒂𝒊`, event.threadID, event.messageID);
        }

        // Send movie info
        const message = `🎬 *${data.Title}* (${data.Year})\n⭐ 𝑰𝑴𝑫𝑩 𝑹𝒂𝒕𝒊𝒏𝒈: ${data.imdbRating}/10\n🎭 𝑮𝒆𝒏𝒓𝒆: ${data.Genre}\n🎬 𝑫𝒊𝒓𝒆𝒄𝒕𝒐𝒓: ${data.Director}\n📜 𝑷𝒍𝒐𝒕: ${data.Plot}\n🌍 𝑪𝒐𝒖𝒏𝒕𝒓𝒚: ${data.Country}\n\n🔗 𝑰𝑴𝑫𝑩: https://www.imdb.com/title/${data.imdbID}/`;
        api.sendMessage(message, event.threadID, event.messageID);

        // Download and send poster if available
        if (data.Poster && data.Poster !== "N/A") {
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

            const filePath = path.join(cacheDir, `${data.Title.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`);
            const writer = fs.createWriteStream(filePath);
            
            const imageResponse = await axios({
                url: data.Poster,
                method: "GET",
                responseType: "stream"
            });

            imageResponse.data.pipe(writer);

            writer.on("finish", () => {
                api.sendMessage({ 
                    body: "🎞 𝑴𝒐𝒗𝒊𝒆 𝑷𝒐𝒔𝒕𝒆𝒓:",
                    attachment: fs.createReadStream(filePath) 
                }, event.threadID, () => {
                    setTimeout(() => {
                        fs.unlink(filePath, (err) => {
                            if (err) console.error("❌ 𝑷𝒐𝒔𝒕𝒆𝒓 𝒅𝒆𝒍𝒆𝒕𝒆 𝒉𝒐𝒚𝒏𝒊:", err);
                        });
                    }, 5000);
                });
            });

            writer.on("error", (err) => {
                console.error(err);
                api.sendMessage("⚠️ 𝑷𝒐𝒔𝒕𝒆𝒓 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆!", event.threadID, event.messageID);
            });
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage("⚠️ 𝑰𝑴𝑫𝑩 𝑨𝑷𝑰 𝒕𝒉𝒆𝒌𝒆 𝒅𝒂𝒕𝒂 𝒂𝒏𝒕𝒆 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒉𝒐𝒄𝒄𝒉𝒆! 𝑷𝒐𝒓𝒆 𝒂𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏", event.threadID, event.messageID);
    }
};
