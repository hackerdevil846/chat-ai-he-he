const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: "restart",
    version: "1.0.0",
    hasPermssion: 2, // 2 = bot admins/owners
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🔄 Bot ke punarabar suru korano",
    commandCategory: "system",
    usages: "",
    cooldowns: 5,
    dependencies: {
        "canvas": "latest"
    },
    envConfig: {}
};

module.exports.languages = {
    "bn": {},
    "en": {}
}

module.exports.onLoad = function () {
    console.log("✅ Restart command loaded successfully.");
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    // Create canvas
    const canvas = createCanvas(600, 200);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling
    ctx.font = "bold 30px Sans";
    ctx.fillStyle = "#00ffea";
    ctx.textAlign = "center";
    ctx.fillText("🔄 Bot is Restarting...", canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = "20px Sans";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`See you soon!`, canvas.width / 2, canvas.height / 2 + 30);

    const buffer = canvas.toBuffer();

    // Send canvas image before restarting
    return api.sendMessage({ 
        body: `💡 [ ${global.config.BOTNAME} ] Bot punarabar suru hocche...`,
        attachment: buffer 
    }, threadID, () => process.exit(1));
}
