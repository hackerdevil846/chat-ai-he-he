const fs = require("fs-extra");
const path = require("path");
const Canvas = require("canvas");
const request = require("node-superfetch");

module.exports.config = {
    name: "rank",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑴𝒆𝒎𝒃𝒆𝒓 𝑹𝒂𝒏𝒌𝒊𝒏𝒈𝒔 𝒅𝒆𝒌𝒉𝒂𝒏 💫",
    category: "group",
    usages: "[user] or [tag]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "jimp": "",
        "node-superfetch": "",
        "canvas": ""
    }
};

// Add the missing onStart function
module.exports.onStart = async function () {
    // This function is called when the command starts
    // You can leave it empty or add initialization code here
};

module.exports.onLoad = async function () {
    const { resolve } = path;
    const { existsSync, mkdirSync } = fs;
    const { downloadFile } = global.utils;
    const cachePath = resolve(__dirname, "cache");
    const customPath = resolve(cachePath, "customrank");

    if (!existsSync(customPath)) mkdirSync(customPath, { recursive: true });
    if (!existsSync(resolve(cachePath, 'regular-font.ttf'))) await downloadFile("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/regular-font.ttf", resolve(cachePath, 'regular-font.ttf'));
    if (!existsSync(resolve(cachePath, 'bold-font.ttf'))) await downloadFile("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/fonts/bold-font.ttf", resolve(cachePath, 'bold-font.ttf'));
    if (!existsSync(resolve(cachePath, 'rankcard.png'))) await downloadFile("https://raw.githubusercontent.com/catalizcs/storage-data/master/rank/rank_card/rankcard.png", resolve(cachePath, 'rankcard.png'));
}

module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.expToLevel = (point) => {
    if (point < 0) return 0;
    return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
}

module.exports.levelToExp = (level) => {
    if (level <= 0) return 0;
    return 3 * level * (level - 1);
}

module.exports.getInfo = async (uid, Currencies) => {
    let point = (await Currencies.getData(uid)).exp;
    const level = this.expToLevel(point);
    const expCurrent = point - this.levelToExp(level);
    const expNextLevel = this.levelToExp(level + 1) - this.levelToExp(level);
    return { level, expCurrent, expNextLevel };
}

module.exports.makeRankCard = async (data) => {
    const { id, name, rank, level, expCurrent, expNextLevel } = data;
    const __root = path.resolve(__dirname, "cache");
    Canvas.registerFont(__root + "/regular-font.ttf", { family: "Manrope", weight: "regular", style: "normal" });
    Canvas.registerFont(__root + "/bold-font.ttf", { family: "Manrope", weight: "bold", style: "normal" });

    const pathCustom = path.resolve(__dirname, "cache", "customrank");
    let dirImage = __root + "/rankcard.png";
    if (fs.existsSync(pathCustom)) {
        const customDir = fs.readdirSync(pathCustom).map(item => item.replace(/\.png/g, ""));
        for (const singleLimit of customDir) {
            let limitRate = false;
            const split = singleLimit.split(/-/g);
            let min = parseInt(split[0]), max = parseInt((split[1]) ? split[1] : min);
            for (; min <= max; min++) if (level == min) { limitRate = true; break; }
            if (limitRate) { dirImage = pathCustom + `/${singleLimit}.png`; break; }
        }
    }

    let rankCard = await Canvas.loadImage(dirImage);
    const pathImg = __root + `/rank_${id}.png`;
    let expWidth = (expCurrent * 610) / expNextLevel;
    if (expWidth > 610 - 19.5) expWidth = 610 - 19.5;

    let avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avatar = await this.circle(avatar.body);

    const canvas = Canvas.createCanvas(1000, 282);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(avatar), 70, 75, 150, 150);

    ctx.font = `bold 36px Manrope`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    ctx.fillText(name, 270, 164);

    ctx.font = `bold 38px Manrope`;
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "end";
    ctx.fillText(level, 866, 82);
    ctx.fillText("Lv.", 793, 82);
    ctx.fillText(`#${rank}`, 700, 82);

    ctx.font = `bold 40px Manrope`;
    ctx.fillStyle = "#00BFFF";
    ctx.fillText(expCurrent, 710, 164);
    ctx.fillStyle = "#1874CD";
    ctx.fillText(`/ ${expNextLevel}`, 710 + ctx.measureText(expCurrent).width + 10, 164);

    ctx.beginPath();
    ctx.fillStyle = "#FFB90F";
    ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
    ctx.fill();
    ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
    ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.fill();

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    return pathImg;
}

module.exports.run = async ({ api, event, args, Currencies, Users }) => {
    const mention = Object.keys(event.mentions);
    let dataAll = (await Currencies.getAll(["userID", "exp"]));
    dataAll.sort((a, b) => b.exp - a.exp);

    const sendRank = async (userID) => {
        const rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(userID)) + 1;
        const name = global.data.userName.get(userID) || await Users.getNameUser(userID);
        if (rank == 0) return api.sendMessage("❌ Error, please try again after 5 seconds!", event.threadID, event.messageID);
        const point = await this.getInfo(userID, Currencies);
        const startTime = Date.now();
        const pathRankCard = await this.makeRankCard({ id: userID, name, rank, ...point });
        return api.sendMessage({ body: `⏱ Time taken: ${Date.now() - startTime}ms`, attachment: fs.createReadStream(pathRankCard) }, event.threadID, () => fs.unlinkSync(pathRankCard), event.messageID);
    };

    if (args.length === 0) return sendRank(event.senderID);
    if (mention.length >= 1) return sendRank(mention[0]);
}
