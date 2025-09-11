const moment = require("moment-timezone");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "info",
    aliases: ["botinfo", "about"],
    version: "1.2.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "information",
    shortDescription: {
        en: "𝑆ℎ𝑜𝑤𝑠 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑖𝑛 𝑏𝑒𝑎𝑢𝑡𝑖𝑓𝑢𝑙 𝑠𝑡𝑦𝑙𝑒"
    },
    longDescription: {
        en: "𝐷𝑖𝑠𝑝𝑙𝑎𝑦𝑠 𝑑𝑒𝑡𝑎𝑖𝑙𝑒𝑑 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛 𝑤𝑖𝑡ℎ 𝑎 𝑣𝑖𝑠𝑢𝑎𝑙 𝑒𝑙𝑒𝑚𝑒𝑛𝑡"
    },
    guide: {
        en: "{p}info"
    },
    dependencies: {
        "moment-timezone": "",
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onStart = async function({ message, event }) {
    try {
        // Calculate uptime
        const time = process.uptime();
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        const uptime = `${hours}ℎ ${minutes}𝑚 ${seconds}𝑠`;

        // Current date/time in Dhaka
        const date = moment.tz("𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎").format("𝐷/𝑀𝑀/𝑌𝑌𝑌𝑌 [𝑎𝑡] ℎℎ:𝑚𝑚:𝑠𝑠 𝐴");

        // Prepare cache folder & video path
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
        const videoPath = path.join(cacheDir, "info_video.mp4");

        // Download video from provided URL
        try {
            const response = await axios({
                method: "GET",
                url: "https://files.catbox.moe/op5iay.mp4",
                responseType: "arraybuffer"
            });
            
            await fs.writeFile(videoPath, response.data);
        } catch (downloadError) {
            console.error("𝑉𝑖𝑑𝑒𝑜 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", downloadError);
            // Continue without video if download fails
        }

        // Create beautifully formatted message
        const infoBody = 
`╭───────『 ✧ 𝐼-𝐴𝑀-𝐴𝑇𝑂𝑀𝐼𝐶 ✧ 』───────╮
┃
┃ ❄️ 𝐵𝑂𝑇 𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝑇𝐼𝑂𝑁
┠────────────────────────────────────
┃ ✦ 𝑁𝑎𝑚𝑒: 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑
┃ ✦ 𝐺𝑒𝑛𝑑𝑒𝑟: 𝑀𝑎𝑙𝑒
┃ ✦ 𝐴𝑔𝑒: 18+
┠────────────────────────────────────
┃ ✦ 𝑅𝑒𝑙𝑖𝑔𝑖𝑜𝑛: 𝐼𝑠𝑙𝑎𝑚
┃ ✦ 𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑠ℎ𝑖𝑝: 𝑆𝑖𝑛𝑔𝑙𝑒
┠────────────────────────────────────
┃ ✦ 𝑃𝑒𝑟𝑚𝑎𝑛𝑒𝑛𝑡 𝐴𝑑𝑑𝑟𝑒𝑠𝑠: 𝐶ℎ𝑎𝑛𝑑𝑝𝑢𝑟
┃ ✦ 𝐶𝑢𝑟𝑟𝑒𝑛𝑡 𝐴𝑑𝑑𝑟𝑒𝑠𝑠: 𝐷ℎ𝑎𝑘𝑎-1236
┠────────────────────────────────────
┃ ✦ 𝑊𝑜𝑟𝑘: 𝑆𝑡𝑢𝑑𝑒𝑛𝑡
┃ ✦ 𝐺𝑚𝑎𝑖𝑙: 𝑚𝑟𝑠𝑚𝑜𝑘𝑒𝑦232@gmail.com
┠────────────────────────────────────
┃ ✦ 𝑊ℎ𝑎𝑡𝑠𝐴𝑝𝑝: 𝑤𝑎.𝑚𝑒/+8801586400590
┃ ✦ 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘: 𝑓𝑏.𝑐𝑜𝑚/𝐴𝑠𝑖𝑓𝑀𝑎ℎ𝑚𝑢𝑑
┠────────────────────────────────────
┃ ✦ 𝑈𝑝𝑡𝑖𝑚𝑒: ${uptime}
┃ ✦ 𝐷𝑎𝑡𝑒: ${date}
╰────────────────────────────────────╯`;

        // Send message with or without video attachment
        if (fs.existsSync(videoPath)) {
            await message.reply({
                body: infoBody,
                attachment: fs.createReadStream(videoPath)
            });
            
            // Delete cached video after sending
            setTimeout(() => {
                fs.unlink(videoPath).catch(() => {});
            }, 5000);
        } else {
            await message.reply(infoBody);
        }

    } catch (error) {
        console.error("𝐼𝑛𝑓𝑜 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        await message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑜𝑎𝑑 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛: ${error.message}`);
    }
};
