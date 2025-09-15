const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const cp = require("child_process");
const ytSearch = require("yt-search");

module.exports = {
    config: {
        name: "mu-sing",
        aliases: ["music", "song"],
        version: "1.0.4",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🎶 𝙆𝙚𝙮𝙬𝙤𝙧𝙙 𝙙𝙞𝙮𝙚 𝙗𝙖 𝙡𝙞𝙣𝙠 𝙩𝙝𝙚𝙠𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝙜𝙖𝙖𝙣 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙠𝙤𝙧𝙪𝙣 🎧"
        },
        longDescription: {
            en: "𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑓𝑟𝑜𝑚 𝑠𝑜𝑛𝑔 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑤𝑖𝑡ℎ 𝑘𝑒𝑦𝑤𝑜𝑟𝑑 𝑜𝑟 𝑙𝑖𝑛𝑘"
        },
        category: "𝑚𝑒𝑑𝑖𝑎",
        guide: {
            en: "{p}mu-sing [𝑠𝑜𝑛𝑔_𝑛𝑎𝑚𝑒_𝑜𝑟_𝑙𝑖𝑛𝑘] [𝑎𝑢𝑑𝑖𝑜/𝑣𝑖𝑑𝑒𝑜]"
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
                return message.reply("❔ | 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒆𝒌𝒕𝒊 𝒈𝒂𝒂𝒏𝒆𝒓 𝒏𝒂𝒂𝒎 𝒃𝒂 𝒍𝒊𝒏𝒌 𝒅𝒊𝒏. 🎶");
            }
            
            const processingMessage = await message.reply("✅ | 𝑨𝒑𝒏𝒂𝒓 𝒐𝒏𝒖𝒓𝒐𝒅𝒉 𝒑𝒓𝒐𝒔𝒆𝒔 𝒌𝒐𝒓𝒂 𝒉𝒐𝒄𝒄𝒉𝒆. 𝑫𝒐𝒚𝒂 𝒌𝒐𝒓𝒆 𝒐𝒑𝒆𝒌𝒌𝒉𝒂 𝒌𝒐𝒓𝒖𝒏... ⏳");

            let videoId;
            if (ytdl.validateURL(query)) {
                videoId = ytdl.getURLVideoID(query);
            } else {
                const searchResults = await ytSearch(query);
                if (!searchResults || !searchResults.videos.length) {
                    throw new Error("𝑨𝒑𝒏𝒂𝒓 𝒌𝒉𝒐𝒋𝒂𝒓 𝒋𝒐ᱱ𝒏𝒐 𝒌𝒐ᱱ𝒐 𝒇𝒐𝒍𝒂𝒇𝒐𝒍 𝒑𝒂𝒐𝒂 𝒋𝒂𝒚𝒏𝒊. 😔");
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
                cp.exec(`"${ffmpegPath}" -i pipe:0 -b:a 192K "${downloadPath}"`, { windowsHide: true, stdio: ['pipe', 'ignore', 'ignore'] }, (err) => {
                    if (err) {
                        console.error(`FFmpeg error: ${err.message}`);
                        message.unsend(processingMessage.messageID);
                        return message.reply("❌ | 𝑨udio 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐. 😞");
                    }
                    message.reply({
                        attachment: fs.createReadStream(downloadPath),
                        body: `✨ 𝑻𝒊𝒕𝒍𝒆: ${info.videoDetails.title}\n\n🎶 𝑬𝒊 𝒏𝒊𝒏 𝒂𝒑𝒏𝒂𝒓 𝒂𝒖𝒅𝒊𝒐 🎧`
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
                            body: `✨ 𝑻𝒊𝒕𝒍𝒆: ${info.videoDetails.title}\n\n🎬 𝑬𝒊 𝒏𝒊𝒏 𝒂𝒑𝒏𝒂𝒓 𝒗𝒊𝒅𝒆𝒐 🎥`
                        }, () => {
                            fs.unlinkSync(downloadPath);
                            message.unsend(processingMessage.messageID);
                        });
                    })
                    .on('error', (err) => {
                        console.error(`Video download error: ${err.message}`);
                        message.unsend(processingMessage.messageID);
                        message.reply("❌ | 𝑽ideo 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐. 😞");
                    });
            }
        } catch (error) {
            console.error(`❌ | 𝑮𝒂𝒂𝒏 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒆𝒃𝒐𝒏𝒈 𝒑𝒂𝒕𝒉𝒂𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐: ${error.message}`);
            message.reply(`❌ | 𝑮𝒂𝒂𝒏 𝒅𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒃𝒚𝒂𝒓𝒕𝒉𝒐: ${error.message}`);
        }
    }
};
