const axios = require('axios');
const fs = require('fs-extra');
const { createCanvas, loadImage } = require('canvas');

module.exports.config = {
    name: "hackv2",
    aliases: ["hackprank", "fakehack"],
    version: "1.0.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 0,
    role: 0,
    category: "group",
    shortDescription: {
        en: "🖥️ 𝑃𝑟𝑎𝑛𝑘 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑤𝑖𝑡ℎ ℎ𝑎𝑐𝑘 𝑠𝑖𝑚𝑢𝑙𝑎𝑡𝑖𝑜𝑛"
    },
    longDescription: {
        en: "𝑆𝑖𝑚𝑢𝑙𝑎𝑡𝑒𝑠 𝑎 ℎ𝑎𝑐𝑘𝑖𝑛𝑔 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑓𝑜𝑟 𝑝𝑟𝑎𝑛𝑘𝑖𝑛𝑔 𝑓𝑟𝑖𝑒𝑛𝑑𝑠"
    },
    guide: {
        en: "{p}hackv2 @𝑚𝑒𝑛𝑡𝑖𝑜𝑛"
    },
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "canvas": ""
    }
};

module.exports.onStart = async function ({ event, api, message }) {
    try {
        const cachePath = __dirname + "/cache";
        if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

        const pathImg = cachePath + "/background.png";
        const pathAvt1 = cachePath + "/Avtmot.png";
        const mentionID = Object.keys(event.mentions)[0] || event.senderID;
        
        const userInfo = await api.getUserInfo(mentionID);
        const name = userInfo[mentionID].name;
        const backgroundUrl = "https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ";
        const avatarUrl = `https://graph.facebook.com/${mentionID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const wrapText = async (ctx, text, maxWidth) => {
            return new Promise((resolve) => {
                if (ctx.measureText(text).width < maxWidth) return resolve([text]);
                const words = text.split(" ");
                const lines = [];
                let line = "";

                while (words.length > 0) {
                    let split = false;
                    while (ctx.measureText(words[0]).width >= maxWidth) {
                        const temp = words[0];
                        words[0] = temp.slice(0, -1);
                        if (split) {
                            words[1] = `${temp.slice(-1)}${words[1]}`;
                        } else {
                            split = true;
                            words.splice(1, 0, temp.slice(-1));
                        }
                    }
                    if (ctx.measureText(line + words[0]).width < maxWidth) {
                        line += `${words.shift()} `;
                    } else {
                        lines.push(line.trim());
                        line = "";
                    }
                    if (words.length === 0) lines.push(line.trim());
                }
                return resolve(lines);
            });
        };

        const avatarBuffer = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathAvt1, Buffer.from(avatarBuffer, "utf-8"));

        const bgBuffer = (await axios.get(backgroundUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(bgBuffer, "utf-8"));

        const baseImage = await loadImage(pathImg);
        const baseAvt1 = await loadImage(pathAvt1);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.font = "400 23px Arial";
        ctx.fillStyle = "#1878F3";
        ctx.textAlign = "start";

        const lines = await wrapText(ctx, name, 1160);
        ctx.fillText(lines.join("\n"), 200, 497);

        ctx.beginPath();
        ctx.drawImage(baseAvt1, 83, 437, 100, 101);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        fs.removeSync(pathAvt1);

        await message.reply({
            body: "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝐻𝑎𝑐𝑘𝑒𝑑 𝑇ℎ𝑖𝑠 𝑈𝑠𝑒𝑟! 𝑀𝑦 𝐿𝑜𝑟𝑑, 𝑃𝑙𝑒𝑎𝑠𝑒 𝐶ℎ𝑒𝑐𝑘 𝑌𝑜𝑢𝑟 𝐼𝑛𝑏𝑜𝑥. 💌",
            attachment: fs.createReadStream(pathImg)
        });

        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐻𝑎𝑐𝑘 𝑚𝑜𝑑𝑢𝑙𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑, 𝑝𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
