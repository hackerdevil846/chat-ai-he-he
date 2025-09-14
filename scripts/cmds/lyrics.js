const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "lyrics",
    aliases: ["songlyrics", "ganerlyrics"],
    version: "2.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: {
        en: "𝐺𝑎𝑛𝑒𝑟 𝑒𝑟 𝑙𝑦𝑟𝑖𝑐𝑠 𝑗𝑎𝑛𝑎𝑛"
    },
    longDescription: {
        en: "𝐺𝑎𝑛𝑒𝑟 𝑒𝑟 𝑙𝑦𝑟𝑖𝑐𝑠 𝑗𝑎𝑛𝑎𝑛"
    },
    guide: {
        en: "{p}lyrics [𝑔𝑎𝑛𝑒𝑟 𝑛𝑎𝑚]"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        // Check dependencies
        if (!axios) throw new Error("𝑎𝑥𝑖𝑜𝑠 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");
        if (!fs.ensureDir) throw new Error("𝑓𝑠-𝑒𝑥𝑡𝑟𝑎 𝑚𝑜𝑑𝑢𝑙𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑");

        const songName = args.join(" ").trim();
        if (!songName) {
            return api.sendMessage("🎵 𝐺𝑎𝑛𝑒𝑟 𝑒𝑟 𝑛𝑎𝑚 𝑒𝑛𝑡𝑒𝑟 𝑘𝑜𝑟𝑢𝑛!\n𝑈𝑑𝑎ℎ𝑎𝑟𝑎𝑛: lyrics Tum Hi Ho", event.threadID, event.messageID);
        }

        const cacheDir = path.join(__dirname, 'cache');
        const imagePath = path.join(cacheDir, 'lyrics.png');
        await fs.ensureDir(cacheDir);

        api.sendMessage(`🔍 \"${songName}\" 𝑒𝑟 𝑙𝑦𝑟𝑖𝑐𝑠 𝑘ℎ𝑢𝑛𝑐ℎ𝑖... ⏳`, event.threadID, event.messageID);

        // Helper function to send results
        const sendResult = async ({ title, artist, lyrics }) => {
            const header = [
                "━━━━━━━━━━━━━━━",
                "🎶 𝐿𝑦𝑟𝑖𝑐𝑠 𝐹𝑖𝑛𝑑𝑒𝑟",
                "━━━━━━━━━━━━━━━"
            ].join("\n");

            const info = [
                `🎼 𝐺𝑎𝑛 𝑒𝑟 𝑛𝑎𝑚: ${title || '𝑁/𝐴'}`,
                `👤 𝐺𝑜𝑙𝑜𝑘: ${artist || '𝑁/𝐴'}`
            ].join("\n");

            const footer = [
                "\n━━━━━━━━━━━━━━━",
                "© 𝐶𝑟𝑒𝑑𝑖𝑡𝑠: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
                "━━━━━━━━━━━━━━━"
            ].join("\n");

            const bodyText = `${header}\n${info}\n\n📝 𝐿𝑦𝑟𝑖𝑐𝑠:\n${lyrics || '𝑁𝑜𝑡 𝑓𝑜𝑢𝑛𝑑.'}\n${footer}`;

            return api.sendMessage({ body: bodyText }, event.threadID, event.messageID);
        };

        // Step 1: Try original API (kept unchanged)
        try {
            const url = `https://lrclib.net/api/search?q=${encodeURIComponent(songName)}`;
            const { data } = await axios.get(url, { timeout: 15000 });

            if (Array.isArray(data) && data.length > 0) {
                const payload = data[0];
                const title = payload.trackName || songName;
                const artist = payload.artistName || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛';
                const lyrics = payload.plainLyrics || '';

                if (lyrics && typeof lyrics === 'string') {
                    return await sendResult({ title, artist, lyrics });
                }
            }
        } catch (e) {
            console.log("𝐿𝑅𝐶𝐿𝑖𝑏 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑡𝑟𝑦𝑖𝑛𝑔 𝑓𝑎𝑙𝑙𝑏𝑎𝑐𝑘...");
        }

        // Step 2: Fallback to alternative API
        try {
            const fallbackUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist || '')}/${encodeURIComponent(title || songName)}`;
            const { data: fallbackData } = await axios.get(fallbackUrl, { timeout: 10000 });
            
            if (fallbackData.lyrics) {
                return await sendResult({ 
                    title: songName, 
                    artist: '𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐴𝑟𝑡𝑖𝑠𝑡', 
                    lyrics: fallbackData.lyrics 
                });
            }
        } catch (e) {
            console.log("𝐿𝑦𝑟𝑖𝑐𝑠.𝑜𝑣ℎ 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑...");
        }

        // Step 3: Final fallback - search based approach
        try {
            const searchUrl = `https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`;
            const { data: searchData } = await axios.get(searchUrl, { timeout: 10000 });
            
            if (searchData.lyrics) {
                return await sendResult({
                    title: searchData.title || songName,
                    artist: searchData.artist || '𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐴𝑟𝑡𝑖𝑠𝑡',
                    lyrics: searchData.lyrics
                });
            }
        } catch (e) {
            console.log("𝑃𝑜𝑝𝑐𝑎𝑡 𝐴𝑃𝐼 𝑓𝑎𝑖𝑙𝑒𝑑...");
        }

        // Final error message
        return api.sendMessage(
            "⚠️ 𝐿𝑦𝑟𝑖𝑐𝑠 𝑝𝑎𝑤𝑎 𝑗𝑎𝑐𝑐ℎ𝑒 𝑛𝑎. 𝑑𝑎𝑦𝑎 𝑘𝑜𝑟𝑒 𝑘𝑖𝑐ℎ𝑢 𝑝𝑜𝑟𝑒 𝑝𝑢𝑛𝑜𝑟𝑎𝑦 𝑐ℎ𝑒𝑠𝑡𝑎 𝑘𝑜𝑟𝑢𝑛 😢",
            event.threadID,
            event.messageID
        );

    } catch (error) {
        console.error("𝐿𝑦𝑟𝑖𝑐𝑠 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑙𝑦𝑟𝑖𝑐𝑠.", event.threadID, event.messageID);
    }
};
