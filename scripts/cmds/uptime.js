module.exports.config = {
    name: "uptime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑩𝒐𝒕𝒆𝒓 𝒖𝒑𝒕𝒊𝒎𝒆 𝒅𝒆𝒌𝒉𝒂𝒏𝒐𝒓 𝒖𝒑𝒂𝒚",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    cooldowns: 3,
    dependencies: {
        "pidusage": ""
    }
};

function byte2mb(bytes) {
    const units = ['𝑩𝒚𝒕𝒆𝒔', '𝑲𝑩', '𝑴𝑩', '𝑮𝑩', '𝑻𝑩', '𝑷𝑩', '𝑬𝑩', '𝒁𝑩', '𝒀𝑩'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.run = async ({ api, event, args }) => {
    const time = process.uptime(),
          hours = Math.floor(time / 3600),
          minutes = Math.floor((time % 3600) / 60),
          seconds = Math.floor(time % 60);
    
    const { commands } = global.client;
    const moment = require("moment-timezone");
    const timeNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
    const axios = require('axios');
    const pidusage = await global.nodemodule["pidusage"](process.pid);
    const timeStart = Date.now();
    const fs = require('fs-extra');
    
    // Font setup
    const fontPaths = {
        avo: __dirname + '/tad/UTM-Avo.ttf',
        phenomicon: __dirname + '/tad/phenomicon.ttf',
        caviar: __dirname + '/tad/CaviarDreams.ttf'
    };
    
    // Download fonts if missing
    for (const [name, path] of Object.entries(fontPaths)) {
        if (!fs.existsSync(path)) {
            const fontUrl = `https://github.com/hanakuUwU/font/raw/main/${
                name === 'avo' ? 'UTM%20Avo.ttf' :
                name === 'phenomicon' ? 'phenomicon.ttf' : 'CaviarDreams.ttf'
            }`;
            const fontData = (await axios.get(fontUrl, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(path, Buffer.from(fontData, "utf-8"));
        }
    }

    const { loadImage, createCanvas, registerFont } = require("canvas");
    const Canvas = require('canvas');
    
    // Handle list command
    if (args[0] === "list") {
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
    }

    // Random background images
    const backgrounds = [
        "https://i.imgur.com/9jbBPIM.jpg",
        "https://i.imgur.com/cPvDTd9.jpg",
        "https://i.imgur.com/ZT8CgR1.jpg",
        "https://i.imgur.com/WhOaTx7.jpg",
        "https://i.imgur.com/BIcgJOA.jpg",
        "https://i.imgur.com/EcJt1yq.jpg",
        "https://i.imgur.com/0dtnQ2m.jpg"
    ];

    const id = args[0] ? parseInt(args[0]) : Math.floor(Math.random() * 883) + 1;
    const charData = (await axios.get('https://raw.githubusercontent.com/mraikero-01/saikidesu_data/main/imgs_data2.json')).data;
    const char = charData[id - 1];

    // Path setup
    const pathImg = __dirname + `/tad/background_${id}.png`;
    const pathAva = __dirname + `/tad/avatar_${id}.png`;
    
    // Download images
    const [bgData, avaData] = await Promise.all([
        axios.get(encodeURI(backgrounds[Math.floor(Math.random() * backgrounds.length)]), 
        axios.get(encodeURI(char.imgAnime))
    ]);
    
    fs.writeFileSync(pathImg, Buffer.from(bgData.data, "utf-8"));
    fs.writeFileSync(pathAva, Buffer.from(avaData.data, "utf-8"));

    // Process images
    const [bg, avatar] = await Promise.all([loadImage(pathImg), loadImage(pathAva)]);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    
    // Register fonts
    registerFont(fontPaths.phenomicon, { family: "Phenomicon" });
    registerFont(fontPaths.avo, { family: "UTM Avo" });
    registerFont(fontPaths.caviar, { family: "Caviar Dreams" });

    // Draw background
    ctx.fillStyle = char.colorBg || "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 800, -160, 1100, 1100);

    // Add text elements
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    
    // Uptime Bot title
    ctx.font = "130px Phenomicon";
    ctx.fillText("𝑼𝑷𝑻𝑰𝑴𝑬 𝑩𝑶𝑻", 95, 340);
    
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

    // Create information table
    let infoTable = "╔═════════════════════════════╗\n";
    infoTable +=    "║  🕒 𝑼𝑷𝑻𝑰𝑴𝑬 𝑰𝑵𝑭𝑶𝑹𝑴𝑨𝑻𝑰𝑶𝑵  ║\n";
    infoTable +=    "╚═════════════════════════════╝\n\n";
    
    infoTable += `🕒 𝑩𝒐𝒕 𝒄𝒉𝒂𝒍𝒄𝒉𝒆: ${hours} 𝒈𝒉𝒂𝒏𝒕𝒂 ${minutes} 𝒎𝒊𝒏𝒖𝒕 ${seconds} 𝒔𝒆𝒄𝒐𝒏𝒅\n\n`;
    infoTable += `🤖 𝑩𝒐𝒕 𝑵𝒂𝒎: ${global.config.BOTNAME}\n`;
    infoTable += `⌨️ 𝑷𝒓𝒆𝒇𝒊𝒙: ${global.config.PREFIX}\n`;
    infoTable += `📚 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔: ${commands.size}\n`;
    infoTable += `👥 𝑼𝒔𝒆𝒓𝒔: ${global.data.allUserID.length}\n`;
    infoTable += `💬 𝑮𝒓𝒐𝒖𝒑𝒔: ${global.data.allThreadID.length}\n`;
    infoTable += `⚙️ 𝑪𝑷𝑼: ${pidusage.cpu.toFixed(1)}%\n`;
    infoTable += `💾 𝑹𝑨𝑴: ${byte2mb(pidusage.memory)}\n`;
    infoTable += `📡 𝑷𝒊𝒏𝒈: ${Date.now() - timeStart}ms\n`;
    infoTable += `🆔 𝑨𝒏𝒊𝒎𝒆 𝑰𝑫: ${id}\n\n`;
    infoTable += `📆 𝑻𝒂𝒓𝒊𝒌𝒉: ${timeNow}\n`;
    infoTable += `⭐ 𝑪𝒓𝒆𝒂𝒕𝒐𝒓: 𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅`;

    // Send final message
    return api.sendMessage({
        body: infoTable,
        attachment: fs.createReadStream(pathImg)
    }, event.threadID, () => {
        fs.unlinkSync(pathImg);
        fs.unlinkSync(pathAva);
    }, event.messageID);
};
