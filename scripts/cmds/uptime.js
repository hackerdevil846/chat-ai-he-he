const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "uptime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕𝒆𝒓 𝒖𝒑𝒕𝒊𝒎𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐𝒓 𝒖𝒑𝒂𝒚",
    category: "𝑺𝒚𝒔𝒕𝒆𝒎",
    cooldowns: 3,
    dependencies: {
        "pidusage": ""
    }
};

function byte2mb(bytes) {
    if (!bytes && bytes !== 0) return '0 MB';
    const units = ['𝑩𝒚𝒕𝒆𝒔', '𝑲𝑩', '𝑴𝑩', '𝑮𝑩', '𝑻𝑩', '𝑷𝑩', '𝑬𝑩', '𝒁𝑩', '𝒀𝑩'];
    let l = 0;
    let n = Number(bytes) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.onStart = async ({ api, event, args }) => {
    try {
        const time = process.uptime();
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        const { commands } = global.client || { commands: new Map() };
        const moment = require("moment-timezone");
        const timeNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
        const pidusage = await global.nodemodule["pidusage"](process.pid);
        const timeStart = Date.now();

        // ensure tad directory exists (DO NOT change path)
        const tadDir = __dirname + "/tad";
        fs.ensureDirSync(tadDir);

        // Font setup (paths must not be changed)
        const fontPaths = {
            avo: __dirname + '/tad/UTM-Avo.ttf',
            phenomicon: __dirname + '/tad/phenomicon.ttf',
            caviar: __dirname + '/tad/CaviarDreams.ttf'
        };

        // Download fonts if missing (preserve original links)
        for (const [name, path] of Object.entries(fontPaths)) {
            if (!fs.existsSync(path)) {
                const fontUrl = `https://github.com/hanakuUwU/font/raw/main/${
                    name === 'avo' ? 'UTM%20Avo.ttf' :
                    name === 'phenomicon' ? 'phenomicon.ttf' : 'CaviarDreams.ttf'
                }`;
                try {
                    const resp = await axios.get(fontUrl, { responseType: "arraybuffer" });
                    fs.writeFileSync(path, Buffer.from(resp.data));
                } catch (err) {
                    // if font download fails, continue — canvas will fallback if available
                    console.error(`Failed to download font ${name}:`, err.message || err);
                }
            }
        }

        const { loadImage, createCanvas, registerFont } = require("canvas");

        // LIST handler (keep exactly as functionality)
        if (args[0] === "list") {
            try {
                const alime = (await axios.get('https://raw.githubusercontent.com/mraikero-01/saikidesu_data/main/anilist2.json')).data;
                const count = alime.listAnime.length;
                const page = parseInt(args[1]) || 1;
                const limit = 20;
                const numPage = Math.ceil(count / limit);

                let msg = "╔═════════════════╗\n";
                msg +=     "║  𝑨𝑵𝑰𝑴𝑬 𝑳𝑰𝑺𝑻  ║\n";
                msg +=     "╚═════════════════╝\n\n";

                const start = limit * (page - 1);
                const end = start + limit;

                for (let i = start; i < Math.min(end, count); i++) {
                    msg += `[${i + 1}] ${alime.listAnime[i].ID} | ${alime.listAnime[i].name}\n`;
                }

                msg += `\n╔═════════════════════════╗\n`;
                msg += `║ 𝑷𝒂𝒈𝒆: ${page}/${numPage}          ║\n`;
                msg += `║ 𝑼𝒔𝒆: ${global.config.PREFIX}uptime list <page> ║\n`;
                msg += `╚═════════════════════════╝`;

                return api.sendMessage(msg, event.threadID, event.messageID);
            } catch (errList) {
                console.error("Error fetching anime list:", errList);
                return api.sendMessage("Failed to fetch anime list.", event.threadID, event.messageID);
            }
        }

        // Random background images (DO NOT change links)
        const backgrounds = [
            "https://i.imgur.com/9jbBPIM.jpg",
            "https://i.imgur.com/cPvDTd9.jpg",
            "https://i.imgur.com/ZT8CgR1.jpg",
            "https://i.imgur.com/WhOaTx7.jpg",
            "https://i.imgur.com/BIcgJOA.jpg",
            "https://i.imgur.com/EcJt1yq.jpg",
            "https://i.imgur.com/0dtnQ2m.jpg"
        ];

        // Choose id (keep original behavior)
        const requestedId = args[0] ? parseInt(args[0]) : NaN;
        const id = !isNaN(requestedId) && requestedId > 0 ? requestedId : Math.floor(Math.random() * 883) + 1;

        // fetch character data
        let charData = [];
        try {
            charData = (await axios.get('https://raw.githubusercontent.com/mraikero-01/saikidesu_data/main/imgs_data2.json')).data;
        } catch (errChar) {
            console.error("Failed to fetch charData:", errChar);
        }
        const char = (charData && charData[id - 1]) ? charData[id - 1] : {
            imgAnime: backgrounds[0],
            colorBg: "#2c3e50"
        };

        // Path setup (keep names/paths)
        const pathImg = __dirname + `/tad/background_${id}.png`;
        const pathAva = __dirname + `/tad/avatar_${id}.png`;

        // Download images (ensure binary write)
        let bgResp, avaResp;
        try {
            const bgUrl = encodeURI(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
            const avaUrl = encodeURI(char.imgAnime || backgrounds[0]);
            [bgResp, avaResp] = await Promise.all([
                axios.get(bgUrl, { responseType: "arraybuffer" }),
                axios.get(avaUrl, { responseType: "arraybuffer" })
            ]);
            fs.writeFileSync(pathImg, Buffer.from(bgResp.data));
            fs.writeFileSync(pathAva, Buffer.from(avaResp.data));
        } catch (errImg) {
            console.error("Failed to download images:", errImg);
            // If download fails, send a fallback text message instead of crashing
            return api.sendMessage("Failed to download background/avatar images.", event.threadID, event.messageID);
        }

        // Load images & create canvas
        const [bg, avatar] = await Promise.all([loadImage(pathImg), loadImage(pathAva)]);
        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext("2d");

        // Register fonts (if available)
        try { registerFont(fontPaths.phenomicon, { family: "Phenomicon" }); } catch (e) { /* ignore */ }
        try { registerFont(fontPaths.avo, { family: "UTM Avo" }); } catch (e) { /* ignore */ }
        try { registerFont(fontPaths.caviar, { family: "Caviar Dreams" }); } catch (e) { /* ignore */ }

        // Draw background
        ctx.fillStyle = char.colorBg || "#2c3e50";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // Draw avatar - keep original position/size
        try {
            ctx.drawImage(avatar, 800, -160, 1100, 1100);
        } catch (e) {
            // if drawImage errors (size/position), draw smaller centered avatar as fallback
            const avaW = Math.min(400, canvas.width / 3);
            ctx.drawImage(avatar, canvas.width - avaW - 50, 50, avaW, avaW);
        }

        // Add text elements (keep fonts/text same)
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";

        // Uptime Bot title
        ctx.font = "130px Phenomicon";
        try { ctx.fillText("𝑼𝑷𝑻𝑰𝑴𝑬 𝑩𝑶𝑻", 95, 340); } catch (e) {
            // fallback if Phenomicon not available
            ctx.font = "80px UTM Avo";
            ctx.fillText("𝑼𝑷𝑻𝑰𝑴𝑬 𝑩𝑶𝑻", 95, 260);
        }

        // Time display
        ctx.font = "70px 'UTM Avo'";
        ctx.fillText(`${hours} : ${minutes} : ${seconds}`, 180, 440);

        // Credit information
        ctx.font = "45px 'Caviar Dreams'";
        ctx.fillText("@asif.mahmud.official", 250, 515);
        ctx.fillText("@asif_mahmud", 250, 575);

        // Save final image
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        // Create information table (keep same styling/text)
        let infoTable = "╔═════════════════════════════╗\n";
        infoTable +=    "║  🕒 𝑼𝑷𝑻𝑰𝑴𝑬 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵  ║\n";
        infoTable +=    "╚═════════════════════════════╝\n\n";

        infoTable += `🕒 𝑩𝒐𝒕 𝒄𝒉𝒂𝒍𝒄𝒉𝒆: ${hours} 𝒘𝒂𝒍 ${minutes} 𝒎𝒊𝒏 ${seconds} 𝒔𝒆𝒄𝒐𝒏𝒅\n\n`;
        infoTable += `🤖 𝑩𝒐𝒕 𝑵𝒂𝒎: ${global.config.BOTNAME || "Bot"}\n`;
        infoTable += `⌨️ 𝑷𝒓𝒆𝒇𝒊𝒙: ${global.config.PREFIX || "."}\n`;
        infoTable += `📚 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔: ${commands.size || 0}\n`;
        infoTable += `👥 𝑼𝒔𝒆𝒓𝒔: ${Array.isArray(global.data && global.data.allUserID) ? global.data.allUserID.length : (global.data && global.data.allUserID ? global.data.allUserID.length : 0)}\n`;
        infoTable += `💬 𝑮𝒓𝒐𝒖𝒑𝒔: ${Array.isArray(global.data && global.data.allThreadID) ? global.data.allThreadID.length : (global.data && global.data.allThreadID ? global.data.allThreadID.length : 0)}\n`;
        infoTable += `⚙️ 𝑪𝑷𝑼: ${pidusage && pidusage.cpu ? pidusage.cpu.toFixed(1) + "%" : "N/A"}\n`;
        infoTable += `💾 𝑹𝑨𝑴: ${pidusage && pidusage.memory ? byte2mb(pidusage.memory) : "N/A"}\n`;
        infoTable += `📡 𝑷𝒊𝒏𝒈: ${Date.now() - timeStart}ms\n`;
        infoTable += `🆔 𝑨𝒏𝒊𝒎𝒆 𝑰𝑫: ${id}\n\n`;
        infoTable += `📆 𝑻𝒂𝒓𝒊𝒌𝒉: ${timeNow}\n`;
        infoTable += `⭐ 𝑪𝒓𝒆𝒂𝒕𝒐𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

        // Send final message with image (keep original sendMessage callback pattern and cleanup)
        return api.sendMessage({
            body: infoTable,
            attachment: fs.createReadStream(pathImg)
        }, event.threadID, () => {
            // cleanup files if they exist
            try { if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg); } catch (e) {}
            try { if (fs.existsSync(pathAva)) fs.unlinkSync(pathAva); } catch (e) {}
        }, event.messageID);

    } catch (error) {
        console.error("Uptime command error:", error);
        return api.sendMessage("An error occurred while running the uptime command.", event.threadID, event.messageID);
    }
};
