const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "googlesearch",
    aliases: ["googlebar", "gsearch"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-img",
    shortDescription: {
        en: "𝐶𝑟𝑒𝑎𝑡𝑒 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝑐𝑢𝑠𝑡𝑜𝑚 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟 𝑖𝑚𝑎𝑔𝑒𝑠 𝑤𝑖𝑡ℎ 𝑦𝑜𝑢𝑟 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}googlesearch [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText("W").width > maxWidth) return resolve(null);

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

            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
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

module.exports.onStart = async function({ api, event, args }) {
    try {
        const { threadID, messageID } = event;
        const text = args.join(" ");

        if (!text) {
            return api.sendMessage(
                "⚠️ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡𝑒𝑥𝑡 𝑓𝑜𝑟 𝑡ℎ𝑒 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟\n\n📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒: 𝑔𝑜𝑜𝑔𝑙𝑒𝑠𝑒𝑎𝑟𝑐ℎ ℎ𝑜𝑤 𝑡𝑜 𝑐𝑜𝑑𝑒",
                threadID,
                messageID
            );
        }

        const processingMsg = await api.sendMessage(
            "⏳ 𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑐𝑢𝑠𝑡𝑜𝑚 𝐺𝑜𝑜𝑔𝑙𝑒 𝑠𝑒𝑎𝑟𝑐ℎ 𝑏𝑎𝑟... 🔍",
            threadID
        );

        const templateUrl = "https://i.imgur.com/GXPQYtT.png";
        const templatePath = __dirname + "/cache/google_template.png";

        const response = await axios.get(templateUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(templatePath, Buffer.from(response.data));

        const baseImage = await loadImage(templatePath);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        ctx.font = "500 52px Arial, sans-serif";
        ctx.fillStyle = "#000000";
        ctx.textBaseline = "middle";

        let fontSize = 52;
        while (ctx.measureText(text).width > 1200 && fontSize > 24) {
            fontSize -= 2;
            ctx.font = `500 ${fontSize}px Arial, sans-serif`;
        }

        const lines = await this.wrapText(ctx, text, 470);
        const lineHeight = fontSize * 1.4;
        const startY = 646 - ((lines.length - 1) * lineHeight / 2);

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 580, startY + (i * lineHeight));
        }

        const outputPath = __dirname + "/cache/google_result.png";
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(outputPath, buffer);

        await api.sendMessage(
            {
                body: "✅ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝑮𝒐𝒐𝒈𝒍𝒆 𝑺𝒆𝒂𝒓𝒄𝒉 𝑹𝒆𝒔𝒖𝒍𝒕 🔎✨",
                attachment: fs.createReadStream(outputPath)
            },
            threadID,
            messageID
        );

        fs.unlinkSync(templatePath);
        fs.unlinkSync(outputPath);
        api.unsendMessage(processingMsg.messageID);

    } catch (error) {
        console.error("𝐺𝑜𝑜𝑔𝑙𝑒𝑆𝑒𝑎𝑟𝑐ℎ 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑐𝑟𝑒𝑎𝑡𝑒 𝑖𝑚𝑎𝑔𝑒.\n⚠️ 𝐸𝑟𝑟𝑜𝑟: " + error.message, event.threadID, event.messageID);
    }
};
