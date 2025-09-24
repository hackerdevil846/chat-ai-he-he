const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const cp = require("child_process");
const ytSearch = require("yt-search");

module.exports = {
    config: {
        name: "music-play",
        aliases: ["ytmusic", "playmusic"], // CHANGED: Unique aliases
        version: "1.0.4",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🎶 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑚𝑢𝑠𝑖𝑐 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑟"
        },
        longDescription: {
            en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑤𝑖𝑡ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 𝑜𝑟 𝑙𝑖𝑛𝑘"
        },
        category: "𝑚𝑒𝑑𝑖𝑎",
        guide: {
            en: "{p}music-play [𝑠𝑜𝑛𝑔_𝑛𝑎𝑚𝑒_𝑜𝑟_𝑙𝑖𝑛𝑘] [𝑎𝑢𝑑𝑖𝑜/𝑣𝑖𝑑𝑒𝑜]"
        },
        countDown: 5,
        dependencies: {
            "ytdl-core": "",
            "ffmpeg-static": "",
            "axios": "",
            "yt-search": ""
        }
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs");
                require("path");
                require("ytdl-core");
                require("ffmpeg-static");
                require("child_process");
                require("yt-search");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑙𝑙 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑝𝑎𝑐𝑘𝑎𝑔𝑒𝑠.");
            }

            let query, type;

            if (args.length > 1 && (args[args.length - 1] === "audio" || args[args.length - 1] === "video")) {
                type = args.pop();
                query = args.join(" ");
            } else {
                query = args.join(" ");
                type = "audio";
            }

            if (!query) {
                return message.reply("❔ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒 𝑜𝑟 𝑙𝑖𝑛𝑘.");
            }
            
            const processingMessage = await message.reply("✅ 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡... ⏳");

            let videoId;
            if (ytdl.validateURL(query)) {
                videoId = ytdl.getURLVideoID(query);
            } else {
                const searchResults = await ytSearch(query);
                if (!searchResults || !searchResults.videos.length) {
                    throw new Error("𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑦𝑜𝑢𝑟 𝑠𝑒𝑎𝑟𝑐ℎ.");
                }
                videoId = searchResults.videos[0].videoId;
            }

            const info = await ytdl.getInfo(videoId);
            const title = info.videoDetails.title.replace(/[^a-zA-Z0-9\s\-_]/g, "");
            const filename = `${title}.${type === "audio" ? "mp3" : "mp4"}`;
            const downloadPath = path.join(__dirname, "cache", filename);

            if (!fs.existsSync(path.dirname(downloadPath))) {
                fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
            }

            if (type === "audio") {
                const audio = ytdl(videoId, { quality: 'highestaudio' });
                cp.exec(`"${ffmpegPath}" -i pipe:0 -b:a 192K ${downloadPath}`, { windowsHide: true, stdio: ['pipe', 'ignore', 'ignore'] }, (err) => {
                    if (err) {
                        console.error(`𝐹𝐹𝑚𝑝𝑒𝑔 𝑒𝑟𝑟𝑜𝑟: ${err.message}`);
                        message.unsend(processingMessage.messageID);
                        return message.reply("❌ 𝐴𝑢𝑑𝑖𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑.");
                    }
                    message.reply({
                        attachment: fs.createReadStream(downloadPath),
                        body: `✨ 𝑇𝑖𝑡𝑙𝑒: ${info.videoDetails.title}\n\n🎶 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑎𝑢𝑑𝑖𝑜 🎧`
                    }, () => {
                        fs.unlinkSync(downloadPath);
                        message.unsend(processingMessage.messageID);
                    });
                }).stdin.end(audio.read());
            } else {
                ytdl(videoId, { quality: 'highestvideo' })
                    .pipe(fs.createWriteStream(downloadPath))
                    .on('finish', () => {
                        message.reply({
                            attachment: fs.createReadStream(downloadPath),
                            body: `✨ 𝑇𝑖𝑡𝑙𝑒: ${info.videoDetails.title}\n\n🎬 𝐻𝑒𝑟𝑒 𝑖𝑠 𝑦𝑜𝑢𝑟 𝑣𝑖𝑑𝑒𝑜 🎥`
                        }, () => {
                            fs.unlinkSync(downloadPath);
                            message.unsend(processingMessage.messageID);
                        });
                    })
                    .on('error', (err) => {
                        console.error(`𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟: ${err.message}`);
                        message.unsend(processingMessage.messageID);
                        message.reply("❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑.");
                    });
            }
        } catch (error) {
            console.error(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message}`);
            message.unsend(processingMessage?.messageID);
            message.reply(`❌ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑: ${error.message}`);
        }
    }
};
