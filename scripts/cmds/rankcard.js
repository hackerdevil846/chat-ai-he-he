const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");
const request = require("node-superfetch");
const Canvas = require("canvas");

module.exports.config = {
    name: "rankcard",
    version: "2.2.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "✨ গ্রুপ মেম্বারদের স্টাইলিশ ও গেম-স্টাইল র‍্যাঙ্ক দেখার জন্য",
    category: "𝑮𝒓𝒐𝒖𝒑",
    usages: "[user] বা [tag]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "jimp": "",
        "node-superfetch": "",
        "canvas": ""
    },
    envConfig: {}
};

module.exports.languages = {
    "en": {
        "rankcard": "✨ 𝐘𝐨𝐮𝐫 𝐑𝐚𝐧𝐤 𝐂𝐚𝐫𝐝 ✨",
        "processing": "🔄 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐤 𝐜𝐚𝐫𝐝...",
        "error": "❌ 𝐄𝐫𝐫𝐨𝐫: ইউজার র‍্যাঙ্কিং সিস্টেমে পাওয়া যায়নি"
    }
};

// EXP calculation
const expToLevel = (point) => point < 0 ? 0 : Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
const levelToExp = (level) => level <= 0 ? 0 : 3 * level * (level - 1);

// Circular avatar
async function circle(image) {
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

// Get user info
async function getInfo(uid, Currencies) {
    const point = (await Currencies.getData(uid))?.exp || 0;
    const level = expToLevel(point);
    return {
        level,
        expCurrent: point - levelToExp(level),
        expNextLevel: levelToExp(level + 1) - levelToExp(level)
    };
}

// Make animated game-style rank card
async function makeRankCard(data) {
    const { id, name, rank, level, expCurrent, expNextLevel } = data;
    const __root = path.resolve(__dirname, "cache");
    const PI = Math.PI;

    // Fonts
    Canvas.registerFont(path.join(__root, "regular-font.ttf"), { family: "Manrope", weight: "regular", style: "normal" });
    Canvas.registerFont(path.join(__root, "bold-font.ttf"), { family: "Manrope", weight: "bold", style: "normal" });

    // Select card background
    const pathCustom = path.resolve(__dirname, "cache", "customrank");
    let dirImage = path.join(__root, "rankcard.png");
    if (fs.existsSync(pathCustom)) {
        const customFiles = fs.readdirSync(pathCustom);
        for (const file of customFiles) {
            const [minStr, maxStr] = file.replace('.png', '').split('-');
            const min = parseInt(minStr);
            const max = parseInt(maxStr || minStr);
            if (level >= min && level <= max) {
                dirImage = path.join(pathCustom, file);
                break;
            }
        }
    }

    const rankCard = await Canvas.loadImage(dirImage);
    const pathImg = path.join(__root, `rank_${id}.png`);
    let expWidth = (expCurrent * 610) / expNextLevel;
    if (expWidth > 590.5) expWidth = 590.5;

    // Avatar with glow aura
    const avatar = await circle(
        (await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body
    );

    const canvas = Canvas.createCanvas(1000, 282);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);

    // Avatar aura glow
    ctx.save();
    ctx.shadowColor = "rgba(0, 255, 255, 0.7)";
    ctx.shadowBlur = 25;
    ctx.drawImage(await Canvas.loadImage(avatar), 70, 75, 150, 150);
    ctx.restore();

    // Username neon flicker
    ctx.font = "bold 38px Manrope";
    ctx.textAlign = "start";
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 191, 255, 0.8)";
    ctx.shadowBlur = 12 + Math.sin(Date.now()/150)*5; // flicker effect
    ctx.fillText(name, 270, 164);
    ctx.shadowBlur = 0;

    // Level gradient neon
    const levelGradient = ctx.createLinearGradient(800, 50, 900, 100);
    levelGradient.addColorStop(0, "#FF4500");
    levelGradient.addColorStop(1, "#FFD700");
    ctx.font = "bold 38px Manrope";
    ctx.fillStyle = levelGradient;
    ctx.textAlign = "end";
    ctx.fillText(level, 934 - 68, 82);

    // "Lv." text
    ctx.fillStyle = "#FFD700";
    ctx.fillText("Lv.", 934 - 55 - ctx.measureText(level).width - 10, 82);

    // Rank shiny neon
    ctx.font = "bold 39px Manrope";
    ctx.fillStyle = "#00BFFF";
    ctx.textAlign = "end";
    ctx.fillText(rank, 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText("Lv.").width - 25, 82);
    ctx.fillStyle = "#1E90FF";
    ctx.fillText("#", 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText("Lv.").width - 16 - ctx.measureText(rank).width - 16, 82);

    // EXP bar glow with shimmer
    ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
    ctx.shadowBlur = 12 + Math.sin(Date.now()/120)*6; // shimmer effect
    ctx.font = "bold 40px Manrope";
    ctx.fillStyle = "#FFD700";
    ctx.textAlign = "start";
    ctx.fillText(expCurrent, 710, 164);
    ctx.fillStyle = "#FFA500";
    ctx.fillText("/ " + expNextLevel, 710 + ctx.measureText(expCurrent).width + 10, 164);
    ctx.shadowBlur = 0;

    // Animated XP progress bar
    ctx.beginPath();
    const gradient = ctx.createLinearGradient(275, 200, 900, 220);
    gradient.addColorStop(0, "#FF8C00");
    gradient.addColorStop(1, "#FFD700");
    ctx.fillStyle = gradient;
    ctx.arc(257 + 18.5, 202, 18.5, 1.5 * PI, 0.5 * PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 183.5, expWidth, 37.5);
    ctx.arc(257 + 18.5 + expWidth, 202, 18.75, 1.5 * PI, 0.5 * PI, false);
    ctx.fill();

    // Avatar decorative neon circle
    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(145, 150, 85, 0, 2 * Math.PI);
    ctx.stroke();

    fs.writeFileSync(pathImg, canvas.toBuffer());
    return pathImg;
}

// Load fonts and default images
module.exports.onLoad = async function() {
    const { downloadFile } = global.utils;
    const __root = path.resolve(__dirname, "cache");

    if (!fs.existsSync(path.join(__root, "customrank"))) fs.mkdirSync(path.join(__root, "customrank"), { recursive: true });

    const files = [
        { url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf", path: "regular-font.ttf" },
        { url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf", path: "bold-font.ttf" },
        { url: "https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png", path: "rankcard.png" }
    ];

    for (const file of files) {
        const filePath = path.join(__root, file.path);
        if (!fs.existsSync(filePath)) {
            await downloadFile(file.url, filePath);
            console.log(`Downloaded ${file.path}`);
        }
    }
};


module.exports.onStart = async function({ event, api, args, Currencies, Users }) {
    try {
        const { threadID, messageID, senderID } = event;
        const dataAll = (await Currencies.getAll(["userID", "exp"])).filter(item => item.exp > 0);
        dataAll.sort((a, b) => b.exp - a.exp);

        const getTargetIDs = () => {
            if (args.length === 0) return [senderID];
            return Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions) : [senderID];
        };

        const targetIDs = getTargetIDs();

        for (const userID of targetIDs) {
            const rankIndex = dataAll.findIndex(item => parseInt(item.userID) === parseInt(userID));
            if (rankIndex === -1) {
                api.sendMessage(this.languages.en.error, threadID, messageID);
                continue;
            }

            const rank = rankIndex + 1;
            const name = global.data.userName.get(userID) || await Users.getNameUser(userID);
            const pointInfo = await getInfo(userID, Currencies);

            api.sendMessage(this.languages.en.processing, threadID, messageID);
            const timeStart = Date.now();

            const pathRankCard = await makeRankCard({
                id: userID,
                name,
                rank,
                ...pointInfo
            });

            api.sendMessage({
                body: `✨ 𝐘𝐨𝐮𝐫 𝐑𝐚𝐧𝐤 𝐂𝐚𝐫𝐝 ✨\n⏱️ Generated in ${Date.now() - timeStart}ms`,
                attachment: fs.createReadStream(pathRankCard)
            }, threadID, () => fs.unlinkSync(pathRankCard), messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 occurred while processing rank card", event.threadID, event.messageID);
    }
};
