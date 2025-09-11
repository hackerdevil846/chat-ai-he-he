const { Innertube } = require('youtubei.js');
const https = require('https');
const http = require('http');

module.exports.config = {
    name: "shairi",
    aliases: ["ytvideo", "video"],
    version: "3.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑆ℎ𝑎𝑖𝑟𝑖 𝑣𝑖𝑑𝑒𝑜 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒"
    },
    longDescription: {
        en: "𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎𝑛𝑑 𝑠𝑒𝑛𝑑 𝑆ℎ𝑎𝑖𝑟𝑖 𝑣𝑖𝑑𝑒𝑜𝑠 𝑓𝑟𝑜𝑚 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑜𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝑙𝑖𝑛𝑘𝑠"
    },
    guide: {
        en: "{p}shairi [𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝐿𝑖𝑛𝑘]"
    },
    dependencies: {
        "youtubei.js": "",
        "https": "",
        "http": ""
    }
};

module.exports.languages = {
    "en": {
        "downloading": "📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡!",
        "errorNoFormat": "❌ 𝑁𝑜 𝑠𝑢𝑖𝑡𝑎𝑏𝑙𝑒 𝑣𝑖𝑑𝑒𝑜 𝑓𝑜𝑟𝑚𝑎𝑡 𝑓𝑜𝑢𝑛𝑑",
        "errorDownload": "❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑓𝑎𝑖𝑙𝑒𝑑",
        "sendingVideo": "🎬《 𝑉𝐼𝐷𝐸𝑂 𝑅𝐸𝐴𝐷𝑌 》\n𝐸𝑛𝑗𝑜𝑦! 🌹",
        "errorCatch": "❌ 𝐸𝑟𝑟𝑜𝑟: {𝑒𝑟𝑟𝑜𝑟}\n\n𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟!",
        "invalidLink": "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑙𝑖𝑛𝑘!"
    }
};

let youtube;
const DEFAULT_URL = "https://youtu.be/v7v3TTWaaWU";

// Initialize YouTube client
async function initYouTube() {
    try {
        youtube = await Innertube.create();
        console.log('✅ 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑐𝑙𝑖𝑒𝑛𝑡 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦');
    } catch (err) {
        console.error('❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑖𝑛𝑖𝑡𝑖𝑎𝑙𝑖𝑧𝑒 𝑌𝑜𝑢𝑇𝑢𝑏𝑒 𝑐𝑙𝑖𝑒𝑛𝑡:', err);
    }
}

async function getVideoInfo(videoId) {
    try {
        if (!youtube) await initYouTube();

        const info = await youtube.getInfo(videoId);
        const formats = info.streaming_data?.formats || [];
        const adaptive = info.streaming_data?.adaptive_formats || [];
        const allFormats = [...formats, ...adaptive];

        const videoFormats = allFormats.filter(f =>
            f.mime_type?.includes('video/mp4') && f.has_audio !== false
        );

        if (!videoFormats.length) throw new Error(module.exports.languages.en.errorNoFormat);

        videoFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
        const selected = videoFormats[0];

        return {
            title: info.basic_info.title,
            duration: info.basic_info.duration?.seconds_total,
            thumbnail: info.basic_info.thumbnail?.[0]?.url,
            downloadUrl: await selected.decipher(youtube.session.player)
        };
    } catch (err) {
        console.error('❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑣𝑖𝑑𝑒𝑜 𝑖𝑛𝑓𝑜:', err);
        throw err;
    }
}

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

module.exports.onStart = async function({ api, event, args }) {
    try {
        // Check dependencies
        if (!Innertube) throw new Error("𝑦𝑜𝑢𝑡𝑢𝑏𝑒𝑖.𝑗𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!https || !http) throw new Error("𝐻𝑇𝑇𝑃/𝐻𝑇𝑇𝑃𝑆 𝑚𝑜𝑑𝑢𝑙𝑒𝑠 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        // Use user-provided URL if available, else default
        const inputUrl = args[0] ? args[0] : DEFAULT_URL;
        const videoId = extractVideoId(inputUrl);

        if (!videoId) {
            return api.sendMessage(module.exports.languages.en.invalidLink, event.threadID, event.messageID);
        }

        // Send downloading message
        await api.sendMessage(module.exports.languages.en.downloading, event.threadID, event.messageID);

        // Fetch video info
        const videoInfo = await getVideoInfo(videoId);
        const protocol = videoInfo.downloadUrl.startsWith('https:') ? https : http;

        protocol.get(videoInfo.downloadUrl, (response) => {
            if (response.statusCode !== 200) {
                return api.sendMessage(module.exports.languages.en.errorDownload, event.threadID, event.messageID);
            }

            // Send video as attachment
            api.sendMessage({
                body: `🎬《 𝑉𝐼𝐷𝐸𝑂 𝑅𝐸𝐴𝐷𝑌 》\n𝑇𝑖𝑡𝑙𝑒: ${videoInfo.title}\n𝐷𝑢𝑟𝑎𝑡𝑖𝑜𝑛: ${videoInfo.duration}𝑠\n𝐸𝑛𝑗𝑜𝑦! 🌹`,
                attachment: response
            }, event.threadID, event.messageID);
        }).on('error', (err) => {
            console.error('❌ 𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:', err);
            api.sendMessage(`${module.exports.languages.en.errorDownload}\n${err.message}`, event.threadID, event.messageID);
        });

    } catch (error) {
        console.error('❌ 𝑆ℎ𝑎𝑖𝑟𝑖 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:', error);
        api.sendMessage(
            module.exports.languages.en.errorCatch.replace('{𝑒𝑟𝑟𝑜𝑟}', error.message), 
            event.threadID, 
            event.messageID
        );
    }
};
