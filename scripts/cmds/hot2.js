const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "hot2",
    aliases: ["islamicvid", "islamvideo"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 2,
    role: 0,
    category: "islamic",
    shortDescription: {
        en: "𝑅𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑𝑠 𝑟𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜𝑠 𝑤𝑖𝑡ℎ 𝑖𝑛𝑠𝑝𝑖𝑟𝑎𝑡𝑖𝑜𝑛𝑎𝑙 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}hot2"
    },
    dependencies: {
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onLoad = async function () {
    try {
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);
        console.log(`[ℎ𝑜𝑡2] 𝑐𝑎𝑐ℎ𝑒 𝑑𝑖𝑟 𝑟𝑒𝑎𝑑𝑦: ${cacheDir}`);
    } catch (err) {
        console.error("[ℎ𝑜𝑡2] 𝑜𝑛𝐿𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
    }
};

module.exports.onStart = async function ({ message, event, api }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");

    const islamicVideos = [
        "https://i.imgur.com/bFd7QRW.mp4",
        "https://i.imgur.com/4uhuwAA.mp4",
        "https://i.imgur.com/vfYOmHS.mp4",
        "https://i.imgur.com/wzR3OP7.mp4",
        "https://i.imgur.com/ka0pxxO.mp4",
        "https://i.imgur.com/zeqzgYJ.mp4",
        "https://i.imgur.com/uVBK5gc.mp4",
        "https://i.imgur.com/zSse6lu.mp4",
        "https://i.imgur.com/oBcryzJ.mp4",
        "https://i.imgur.com/yIViust.mp4",
        "https://i.imgur.com/vLcyKJ2.mp4",
        "https://i.imgur.com/6vGHjRM.mp4",
        "https://i.imgur.com/Nu5DcgN.mp4",
        "https://i.imgur.com/MwiTEUL.mp4",
        "https://i.imgur.com/tfePTdM.mp4",
        "https://i.imgur.com/HOSrfId.mp4",
        "https://i.imgur.com/GTxZZfN.mp4",
        "https://i.imgur.com/AaPoSEo.mp4",
        "https://i.imgur.com/08yfKpb.mp4",
        "https://i.imgur.com/xIi5ZjB.mp4",
        "https://i.imgur.com/FVtCcS4.mp4"
    ];

    const islamicMessage =
        "🌿 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑉𝑖𝑑𝑒𝑜 🌿\n\n" +
        "💫 𝑊ℎ𝑒𝑛 𝑑𝑎𝑟𝑘𝑛𝑒𝑠𝑠 𝑓𝑎𝑙𝑙𝑠 𝑜𝑛 𝑡ℎ𝑒 ℎ𝑢𝑚𝑎𝑛 ℎ𝑒𝑎𝑟𝑡,\n" +
        "𝑂𝑛𝑙𝑦 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑙𝑖𝑔ℎ𝑡 𝑠ℎ𝑜𝑤𝑠 𝑡ℎ𝑒 𝑤𝑎𝑦.\n\n" +
        "✨ 𝑊𝑒 𝑠𝑒𝑒𝑘 𝑡𝑎𝑤𝑓𝑖𝑞 𝑡𝑜 𝑠𝑡𝑎𝑦 𝑎𝑤𝑎𝑦 𝑓𝑟𝑜𝑚 ℎ𝑎𝑟𝑎𝑚,\n" +
        "𝑀𝑎𝑦 𝐴𝑙𝑙𝑎ℎ 𝑔𝑟𝑎𝑛𝑡 𝑢𝑠 𝑎𝑙𝑙 𝑎 ℎ𝑎𝑙𝑎𝑙 𝑙𝑖𝑓𝑒.\n\n" +
        "🌙 𝑊ℎ𝑜𝑒𝑣𝑒𝑟 𝑓𝑜𝑟𝑔𝑒𝑡𝑠 𝐴𝑙𝑙𝑎ℎ,\n" +
        "𝐹𝑜𝑟𝑔𝑒𝑡𝑠 𝑡ℎ𝑒𝑚𝑠𝑒𝑙𝑣𝑒𝑠.\n\n" +
        "🕋 𝑇ℎ𝑜𝑠𝑒 𝑤ℎ𝑜 𝑓𝑜𝑟𝑔𝑒𝑡 𝐴𝑙𝑙𝑎ℎ 𝑖𝑛 𝑡ℎ𝑒 𝑛𝑎𝑚𝑒 𝑜𝑓 𝑙𝑜𝑣𝑒,\n" +
        "𝑁𝑒𝑣𝑒𝑟 𝑓𝑖𝑛𝑑 𝑡𝑟𝑢𝑒 𝑝𝑒𝑎𝑐𝑒.\n\n" +
        "📖 𝐿𝑒𝑡'𝑠 𝑑𝑒𝑐𝑜𝑟𝑎𝑡𝑒 𝑙𝑖𝑓𝑒 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑙𝑖𝑔ℎ𝑡 𝑜𝑓 𝑄𝑢𝑟𝑎𝑛,\n" +
        "𝐹𝑖𝑛𝑑 𝑝𝑒𝑎𝑐𝑒 𝑤𝑖𝑡ℎ 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑚𝑒𝑟𝑐𝑦.\n\n" +
        "🤲 𝐿𝑒𝑡 𝑢𝑠 𝑎𝑙𝑙 𝑟𝑒𝑡𝑢𝑟𝑛 𝑡𝑜 𝑡ℎ𝑒 𝑝𝑎𝑡ℎ 𝑜𝑓 𝐴𝑙𝑙𝑎ℎ,\n" +
        "𝐴𝑛𝑑 𝑎𝑡𝑡𝑎𝑖𝑛 𝐻𝑖𝑠 𝑚𝑒𝑟𝑐𝑦 𝑎𝑛𝑑 𝑓𝑜𝑟𝑔𝑖𝑣𝑒𝑛𝑒𝑠𝑠.";

    try {
        await fs.ensureDir(cacheDir);
    } catch (err) {
        console.error("[ℎ𝑜𝑡2] 𝑒𝑛𝑠𝑢𝑟𝑒𝐷𝑖𝑟 𝑒𝑟𝑟𝑜𝑟:", err);
    }

    try {
        await message.reply(islamicMessage);
        await message.reply("📥 𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜... 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡.");

        let videoSent = false;
        let attempts = 0;

        while (attempts < 3 && !videoSent) {
            attempts++;
            const randomIndex = Math.floor(Math.random() * islamicVideos.length);
            const randomVideo = islamicVideos[randomIndex];
            const filename = `islamic_video_${Date.now()}_${attempts}.mp4`;
            const videoPath = path.join(cacheDir, filename);

            try {
                const response = await axios({
                    method: 'GET',
                    url: randomVideo,
                    responseType: 'arraybuffer',
                    timeout: 30000
                });

                await fs.writeFile(videoPath, Buffer.from(response.data, 'binary'));

                const stats = await fs.stat(videoPath);
                if (!stats || stats.size <= 0) {
                    throw new Error("𝐷𝑜𝑤𝑛𝑙𝑜𝑎𝑑𝑒𝑑 𝑓𝑖𝑙𝑒 𝑖𝑠 𝑒𝑚𝑝𝑡𝑦");
                }

                const caption =
                    "▬▬▬▬▬▬▬▬▬▬▬▬\n" +
                    "   𝑅𝑎𝑛𝑑𝑜𝑚 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑉𝑖𝑑𝑒𝑜\n" +
                    "▬▬▬▬▬▬▬▬▬▬▬▬\n\n" +
                    "🌟 𝑀𝑎𝑦 𝑡ℎ𝑖𝑠 𝑟𝑒𝑚𝑖𝑛𝑑𝑒𝑟 𝑏𝑟𝑖𝑛𝑔 𝑝𝑒𝑎𝑐𝑒 𝑎𝑛𝑑 𝑔𝑢𝑖𝑑𝑎𝑛𝑐𝑒. 🤲";

                await message.reply({
                    body: caption,
                    attachment: fs.createReadStream(videoPath)
                });

                videoSent = true;

                try {
                    await fs.unlink(videoPath);
                } catch (cleanupErr) {
                    console.warn(`[ℎ𝑜𝑡2] 𝑐𝑙𝑒𝑎𝑛𝑢𝑝 𝑓𝑎𝑖𝑙𝑒𝑑 𝑓𝑜𝑟 ${videoPath}:`, cleanupErr);
                }

            } catch (innerErr) {
                console.error(`[ℎ𝑜𝑡2] 𝐴𝑡𝑡𝑒𝑚𝑝𝑡 ${attempts} 𝑓𝑎𝑖𝑙𝑒𝑑:`, innerErr.message || innerErr);
                
                if (attempts >= 3) {
                    await message.reply("❌ 𝑆𝑜𝑟𝑟𝑦, 𝐼 𝑐𝑜𝑢𝑙𝑑𝑛'𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑎 𝑣𝑖𝑑𝑒𝑜 𝑟𝑖𝑔ℎ𝑡 𝑛𝑜𝑤. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
                } else {
                    await message.reply(`⚠️ 𝐴𝑡𝑡𝑒𝑚𝑝𝑡 ${attempts} 𝑓𝑎𝑖𝑙𝑒𝑑, 𝑟𝑒𝑡𝑟𝑦𝑖𝑛𝑔...`);
                }
                
                try {
                    if (await fs.pathExists(videoPath)) await fs.unlink(videoPath);
                } catch (rmErr) {
                    console.warn(`[ℎ𝑜𝑡2] 𝑓𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑟𝑒𝑚𝑜𝑣𝑒 𝑝𝑎𝑟𝑡𝑖𝑎𝑙 𝑓𝑖𝑙𝑒:`, rmErr);
                }
            }
        }
    } catch (err) {
        console.error("[ℎ𝑜𝑡2] 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", err);
        try {
            await message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑣𝑖𝑑𝑒𝑜. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
        } catch (sendErr) {
            console.error("[ℎ𝑜𝑡2] 𝑓𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑒𝑟𝑟𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒:", sendErr);
        }
    }
};
