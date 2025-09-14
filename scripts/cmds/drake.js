const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas, loadImage, registerFont } = require("canvas");

module.exports.config = {
    name: "drake",
    aliases: ["drakememe"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 10,
    role: 0,
    category: "edit-image",
    shortDescription: {
        en: "🎭 𝐶𝑟𝑒𝑎𝑡𝑒 𝐷𝑟𝑎𝑘𝑒 𝑚𝑒𝑚𝑒 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚 𝑡𝑒𝑥𝑡"
    },
    longDescription: {
        en: "𝐺𝑒𝑛𝑒𝑟𝑎𝑡𝑒 𝐷𝑟𝑎𝑘𝑒 𝑚𝑒𝑚𝑒𝑠 𝑤𝑖𝑡ℎ 𝑐𝑢𝑠𝑡𝑜𝑚𝑖𝑧𝑎𝑏𝑙𝑒 𝑡𝑒𝑥𝑡"
    },
    guide: {
        en: "{p}drake [𝑡𝑒𝑥𝑡 1] | [𝑡𝑒𝑥𝑡 2]"
    },
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        // Check dependencies
        if (!axios || !fs || !createCanvas || !loadImage) {
            throw new Error("𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠");
        }

        let pathImg = __dirname + `/cache/drake_${event.senderID}.png`;
        const text = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|").split("|");
        
        if (!text[0] || !text[1]) {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑓𝑜𝑟𝑚𝑎𝑡!\n💡 𝑈𝑠𝑒: 𝑑𝑟𝑎𝑘𝑒 [𝑡𝑒𝑥𝑡 1] | [𝑡𝑒𝑥𝑡 2]", event.threadID, event.messageID);
        }

        // Download template
        const imageResponse = await axios.get("https://i.imgur.com/qmkwLUx.png", {
            responseType: "arraybuffer"
        });
        fs.writeFileSync(pathImg, Buffer.from(imageResponse.data, "utf-8"));

        // Download font if not exists
        const fontPath = __dirname + '/cache/SVN-Arial 2.ttf';
        if (!fs.existsSync(fontPath)) {
            try {
                const fontResponse = await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
                    responseType: "arraybuffer"
                });
                fs.writeFileSync(fontPath, Buffer.from(fontResponse.data, "utf-8"));
            } catch (fontError) {
                console.error("𝐹𝑜𝑛𝑡 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", fontError);
                // Use default font if custom font fails
            }
        }

        // Process image
        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        
        // Register font if available
        if (fs.existsSync(fontPath)) {
            try {
                registerFont(fontPath, {
                    family: "SVN-Arial 2"
                });
                ctx.font = "30px SVN-Arial 2";
            } catch (fontError) {
                ctx.font = "30px Arial";
            }
        } else {
            ctx.font = "30px Arial";
        }

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";

        const wrapText = (text, maxWidth) => {
            const words = text.split(" ");
            const lines = [];
            let line = "";

            for (const word of words) {
                const testLine = line + word + " ";
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && line !== "") {
                    lines.push(line.trim());
                    line = word + " ";
                } else {
                    line = testLine;
                }
            }
            lines.push(line.trim());
            return lines;
        };

        // Draw texts
        const lines1 = wrapText(text[0], 464);
        const lines2 = wrapText(text[1], 464);

        // Adjust vertical positioning based on number of lines
        const yPos1 = 129 - (lines1.length - 1) * 15;
        const yPos2 = 339 - (lines2.length - 1) * 15;

        ctx.fillText(lines1.join("\n"), 464, yPos1);
        ctx.fillText(lines2.join("\n"), 464, yPos2);

        // Save and send
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        await api.sendMessage({
            body: "🖼️ 𝐻𝑒𝑟𝑒'𝑠 𝑦𝑜𝑢𝑟 𝐷𝑟𝑎𝑘𝑒 𝑚𝑒𝑚𝑒!",
            attachment: fs.createReadStream(pathImg)
        }, event.threadID, event.messageID);

        // Clean up
        fs.unlinkSync(pathImg);

    } catch (error) {
        console.error("𝐷𝑟𝑎𝑘𝑒 𝑒𝑟𝑟𝑜𝑟:", error);
        return api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑛𝑔 𝑖𝑚𝑎𝑔𝑒", event.threadID, event.messageID);
    }
};
