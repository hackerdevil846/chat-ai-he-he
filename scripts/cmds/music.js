const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = {
    config: {
        name: "music",
        aliases: ["ytdownload", "ytaudio"],
        version: "1.1.0",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "🎵 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑚𝑢𝑠𝑖𝑐/𝑣𝑖𝑑𝑒𝑜𝑠 𝑜𝑟 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑡𝑟𝑎𝑐𝑘𝑠"
        },
        longDescription: {
            en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑚𝑢𝑠𝑖𝑐 𝑜𝑟 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑏𝑦 𝑠𝑒𝑎𝑟𝑐ℎ 𝑜𝑟 𝑑𝑖𝑟𝑒𝑐𝑡 𝑙𝑖𝑛𝑘"
        },
        category: "𝑚𝑒𝑑𝑖𝑎",
        guide: {
            en: "{p}music [𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒/𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘/𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑙𝑖𝑛𝑘] [𝑎𝑢𝑑𝑖𝑜/𝑣𝑖𝑑𝑒𝑜]"
        },
        countDown: 15,
        dependencies: {
            "ytdl-core": "",
            "axios": "",
            "yt-search": "",
            "fs-extra": ""
        }
    },

    onLoad: function() {
        const cachePath = path.join(__dirname, "cache");
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });
    },

    onStart: async function({ message, event, args }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("ytdl-core");
                require("yt-search");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑦𝑡𝑑𝑙-𝑐𝑜𝑟𝑒, 𝑎𝑛𝑑 𝑦𝑡-𝑠𝑒𝑎𝑟𝑐ℎ.");
            }

            if (!args.length) {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑠𝑜𝑛𝑔 𝑛𝑎𝑚𝑒, 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘, 𝑜𝑟 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑙𝑖𝑛𝑘\n𝐸𝑥𝑎𝑚𝑝𝑙𝑒: !𝑚𝑢𝑠𝑖𝑐 𝑠ℎ𝑎𝑝𝑒 𝑜𝑓 𝑦𝑜𝑢 𝑎𝑢𝑑𝑖𝑜");
            }

            let query = args.join(" ");
            let type = "audio";
            let isPlaylist = false;
            let playlistId = null;

            const lastArg = args[args.length - 1].toLowerCase();
            if (lastArg === "audio" || lastArg === "video") {
                type = lastArg;
                query = args.slice(0, -1).join(" ");
            }

            const playlistRegex = /[?&]list=([^&]+)/i;
            const playlistMatch = query.match(playlistRegex);
            if (playlistMatch) {
                isPlaylist = true;
                playlistId = playlistMatch[1];
            }

            const processingMsg = await message.reply(
                isPlaylist ? "🔍 𝐹𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑑𝑎𝑡𝑎..." : "🔍 𝑆𝑒𝑎𝑟𝑐ℎ𝑖𝑛𝑔 𝑌𝑜𝑢𝑇𝑢𝑏𝑒..."
            );

            if (isPlaylist) {
                const playlistData = await getPlaylistVideos(playlistId);

                if (!playlistData.status || !playlistData.data || !playlistData.data.length) {
                    await message.unsend(processingMsg.messageID);
                    return message.reply("❌ 𝑁𝑜 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑜𝑢𝑛𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡");
                }

                const maxVideos = 5;
                const videos = playlistData.data.slice(0, maxVideos);
                const totalVideos = Math.min(playlistData.data.length, maxVideos);

                await message.unsend(processingMsg.messageID);
                await message.reply(
                    `📼 𝐹𝑜𝑢𝑛𝑑 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡 𝑤𝑖𝑡ℎ ${playlistData.data.length} 𝑣𝑖𝑑𝑒𝑜𝑠\n𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑓𝑖𝑟𝑠𝑡 ${totalVideos} ${type} 𝑓𝑖𝑙𝑒𝑠...`
                );

                for (let i = 0; i < videos.length; i++) {
                    const video = videos[i];
                    try {
                        const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
                        const sanitizedTitle = video.title.replace(/[^\w\s]/gi, '').trim().substring(0, 50);
                        const filename = `${sanitizedTitle}.${type === "audio" ? "mp3" : "mp4"}`;
                        const downloadPath = path.join(__dirname, "cache", filename);

                        await new Promise((resolve) => {
                            ytdl(videoUrl, {
                                quality: type === 'audio' ? 'highestaudio' : 'highestvideo',
                                filter: type === 'audio' ? 'audioonly' : 'videoandaudio'
                            })
                            .pipe(fs.createWriteStream(downloadPath))
                            .on('finish', resolve);
                        });

                        await message.reply({
                            body: `🎵 [${i+1}/${videos.length}] ${video.title}\n⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${video.duration}`,
                            attachment: fs.createReadStream(downloadPath)
                        });

                        fs.unlinkSync(downloadPath);
                    } catch (err) {
                        console.error(`𝐸𝑟𝑟𝑜𝑟 𝑤𝑖𝑡ℎ 𝑣𝑖𝑑𝑒𝑜 ${video.videoId}:`, err);
                        message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑: ${video.title}`);
                    }
                }
            } else {
                const searchResults = await ytSearch(query);

                if (!searchResults.videos.length) {
                    await message.unsend(processingMsg.messageID);
                    return message.reply("❌ 𝑁𝑜 𝑟𝑒𝑠𝑢𝑙𝑡𝑠 𝑓𝑜𝑢𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎 𝑑𝑖𝑓𝑓𝑒𝑟𝑒𝑛𝑡 𝑞𝑢𝑒𝑟𝑦.");
                }

                const video = searchResults.videos[0];
                const sanitizedTitle = video.title.replace(/[^\w\s]/gi, '').trim().substring(0, 50);
                const filename = `${sanitizedTitle}.${type === "audio" ? "mp3" : "mp4"}`;
                const downloadPath = path.join(__dirname, "cache", filename);

                await message.unsend(processingMsg.messageID);
                await message.reply(`⬇️ 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 ${type === "audio" ? "𝑎𝑢𝑑𝑖𝑜" : "𝑣𝑖𝑑𝑒𝑜"}...`);

                await new Promise((resolve) => {
                    ytdl(video.url, {
                        quality: type === 'audio' ? 'highestaudio' : 'highestvideo',
                        filter: type === 'audio' ? 'audioonly' : 'videoandaudio'
                    })
                    .pipe(fs.createWriteStream(downloadPath))
                    .on('finish', resolve);
                });

                const duration = video.duration.toString().includes(':') 
                    ? video.duration 
                    : new Date(video.duration * 1000).toISOString().substr(11, 8);

                await message.reply({
                    body: `🎵 𝑇𝑖𝑡𝑙𝑒: ${video.title}\n⏱️ 𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${duration}\n👀 𝑉𝑖𝑒𝑤𝑠: ${video.views.toLocaleString()}\n📅 𝑈𝑝𝑙𝑜𝑎𝑑𝑒𝑑: ${video.ago}`,
                    attachment: fs.createReadStream(downloadPath)
                });

                fs.unlinkSync(downloadPath);
            }
        } catch (error) {
            console.error("𝑀𝑢𝑠𝑖𝑐 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            message.reply(`❌ 𝐸𝑟𝑟𝑜𝑟: ${error.message || "𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑"}`);
        }
    }
};

async function getPlaylistVideos(playlistId) {
    const options = {
        method: 'GET',
        url: 'https://youtube-music-api-yt.p.rapidapi.com/get-playlist-videos',
        params: { playlistId },
        headers: {
            'x-rapidapi-key': '78186a3f74msh516a9d9dd0f051cp19fea6jsnac2a9d4351fb',
            'x-rapidapi-host': 'youtube-music-api-yt.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        throw new Error('❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑝𝑙𝑎𝑦𝑙𝑖𝑠𝑡: ' + error.message);
    }
}
