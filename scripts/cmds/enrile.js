const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "enrile",
    aliases: ["enrilecomment", "balloon"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 15,
    role: 0,
    category: "edit-image",
    shortDescription: {
        en: "𝐸𝑛𝑟𝑖𝑙𝑒'𝑠 𝑏𝑎𝑙𝑙𝑜𝑜𝑛 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑜𝑟"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒𝑠 𝑎 𝑏𝑎𝑙𝑙𝑜𝑜𝑛 𝑐𝑜𝑚𝑚𝑒𝑛𝑡 𝑖𝑚𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝐸𝑛𝑟𝑖𝑙𝑒'𝑠 𝑠𝑡𝑦𝑙𝑒"
    },
    guide: {
        en: "{p}enrile [𝑡𝑒𝑥𝑡]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    },
    envConfig: {
        fontStyle: "𝑏𝑜𝑙𝑑 60𝑝𝑥 𝐴𝑟𝑖𝑎𝑙",
        textColor: "#𝐹𝐹𝐹𝐹𝐹𝐹",
        textX: 500,
        textY: 450,
        maxWidth: 600
    }
};

module.exports.onStart = async function({ message, args, api }) {
    try {
        // Check dependencies
        if (!axios || !fs || !createCanvas || !loadImage) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        const text = args.join(" ");
        
        if (!text) {
            return message.reply("✨ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑦𝑜𝑢𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑓𝑜𝑟 𝐸𝑛𝑟𝑖𝑙𝑒'𝑠 𝑏𝑎𝑙𝑙𝑜𝑜𝑛!");
        }

        let pathImg = __dirname + '/cache/enrile_edit.png';

        // Download base image
        const { data } = await axios.get("https://i.imgur.com/1plDf6o.png", { 
            responseType: 'arraybuffer' 
        });
        await fs.writeFileSync(pathImg, Buffer.from(data, 'utf-8'));

        // Process image
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Text styling
        ctx.font = this.config.envConfig.fontStyle;
        ctx.fillStyle = this.config.envConfig.textColor;
        ctx.textAlign = "start";
        
        // Text wrapping function
        const wrapText = (ctx, text, maxWidth) => {
            const words = text.split(' ');
            const lines = [];
            let line = '';

            while (words.length > 0) {
                let split = false;
                while (ctx.measureText(words[0]).width >= maxWidth) {
                    const temp = words[0];
                    words[0] = temp.slice(0, -1);
                    split ? words[1] = `${temp.slice(-1)}${words[1]}` : words.splice(1, 0, temp.slice(-1));
                    split = true;
                }
                if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                    line += `${words.shift()} `;
                } else {
                    lines.push(line.trim());
                    line = '';
                }
                if (words.length === 0) lines.push(line.trim());
            }
            return lines;
        };

        const lines = wrapText(ctx, text, this.config.envConfig.maxWidth);
        ctx.fillText(lines.join('\n'), this.config.envConfig.textX, this.config.envConfig.textY);

        // Save and send
        const buffer = canvas.toBuffer();
        await fs.writeFileSync(pathImg, buffer);
        
        await message.reply({
            body: `🎈 𝐸𝑛𝑟𝑖𝑙𝑒'𝑠 𝑏𝑎𝑙𝑙𝑜𝑜𝑛 𝑐𝑜𝑚𝑚𝑒𝑛𝑡:\n"${text}"`,
            attachment: fs.createReadStream(pathImg)
        });

        // Clean up
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }

    } catch (error) {
        console.error("𝐸𝑛𝑟𝑖𝑙𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        message.reply("❌ 𝐸𝑟𝑟𝑜𝑟 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒");
    }
};
