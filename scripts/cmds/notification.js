const { getStreamsFromAttachment } = global.utils;
const axios = require("axios");
const fs = require("fs-extra");
const { createCanvas } = require("canvas");
const path = require("path");

module.exports = {
    config: {
        name: "notification",
        aliases: ["broadcast", "announce"],
        version: "2.0",
        role: 2,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "📢 𝑆𝑒𝑛𝑑 𝑎𝑑𝑚𝑖𝑛 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠"
        },
        longDescription: {
            en: "𝐵𝑟𝑜𝑎𝑑𝑐𝑎𝑠𝑡 𝑖𝑚𝑝𝑜𝑟𝑡𝑎𝑛𝑡 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑡𝑜 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠 𝑤ℎ𝑒𝑟𝑒 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑖𝑠 𝑝𝑟𝑒𝑠𝑒𝑛𝑡"
        },
        category: "𝑎𝑑𝑚𝑖𝑛",
        guide: {
            en: "{p}notification [𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
        },
        countDown: 5,
        dependencies: {
            "axios": "",
            "fs-extra": "",
            "canvas": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            // Dependency check
            try {
                require("axios");
                require("fs-extra");
                require("canvas");
                require("path");
            } catch (e) {
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠, 𝑓𝑠-𝑒𝑥𝑡𝑟𝑎, 𝑐𝑎𝑛𝑣𝑎𝑠, 𝑎𝑛𝑑 𝑝𝑎𝑡ℎ.");
            }

            if (!args[0]) {
                return message.reply("🔔 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑡ℎ𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑦𝑜𝑢 𝑤𝑎𝑛𝑡 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑡𝑜 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠");
            }

            // Generate notification card
            let cardPath;
            try {
                cardPath = await generateNotificationCard(args.join(" "));
            } catch (e) {
                console.error("𝐶𝑎𝑟𝑑 𝑔𝑒𝑛𝑒𝑟𝑎𝑡𝑖𝑜𝑛 𝑒𝑟𝑟𝑜𝑟:", e);
            }

            const notificationMessage = `📢 𝐴𝐷𝑀𝐼𝑁 𝑁𝑂𝑇𝐼𝐹𝐼𝐶𝐴𝑇𝐼𝑂𝑁\n━━━━━━━━━━━━━━\n${args.join(" ")}\n\n🚫 | 𝑃𝑙𝑒𝑎𝑠𝑒 𝑑𝑜 𝑛𝑜𝑡 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑡ℎ𝑖𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒`;

            const formSend = {
                body: notificationMessage,
                attachment: [
                    ...(cardPath ? [fs.createReadStream(cardPath)] : []),
                    ...await getStreamsFromAttachment(
                        [
                            ...event.attachments,
                            ...(event.messageReply?.attachments || [])
                        ].filter(item =>
                            ["photo", "png", "animated_image", "video", "audio"].includes(item.type)
                        )
                    )
                ]
            };

            // Get all active groups
            const allThreads = await threadsData.getAll();
            const botID = global.utils.getBotID();
            const allThreadID = allThreads
                .filter(t => t.isGroup && t.threadID !== event.threadID)
                .map(t => t.threadID);

            await message.reply(`⏳ | 𝑆𝑡𝑎𝑟𝑡𝑖𝑛𝑔 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑏𝑙𝑎𝑠𝑡 𝑡𝑜 ${allThreadID.length} 𝑔𝑟𝑜𝑢𝑝𝑠...`);

            let sendSuccess = 0;
            const sendError = [];
            const delayPerGroup = 250;

            // Send with rate limiting
            for (const threadID of allThreadID) {
                try {
                    await message.send(formSend, threadID);
                    sendSuccess++;
                    await new Promise(resolve => setTimeout(resolve, delayPerGroup));
                } catch (e) {
                    sendError.push({ threadID, error: e.message });
                }
            }

            // Cleanup generated image
            if (cardPath && fs.existsSync(cardPath)) {
                fs.unlinkSync(cardPath);
            }

            // Prepare report
            let report = `✅ | 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑛𝑜𝑡𝑖𝑓𝑖𝑒𝑑 ${sendSuccess} 𝑔𝑟𝑜𝑢𝑝𝑠!`;

            if (sendError.length > 0) {
                const errorDetails = sendError.slice(0, 3).map(e =>
                    `• [${e.threadID}]: ${e.error}`
                ).join("\n");
                report += `\n❌ | 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑒𝑛𝑑 𝑡𝑜 ${sendError.length} 𝑔𝑟𝑜𝑢𝑝𝑠:`;
                report += `\n${errorDetails}${sendError.length > 3 ? "\n• ...𝑎𝑛𝑑 " + (sendError.length - 3) + " 𝑚𝑜𝑟𝑒" : ""}`;
            }

            // Add celebration GIF
            try {
                const gifResponse = await axios.get("https://api.otakugifs.xyz/gif?reaction=happy", {
                    responseType: "stream"
                });
                await message.reply({
                    body: report,
                    attachment: gifResponse.data
                });
            } catch (gifError) {
                await message.reply(report);
            }

        } catch (error) {
            console.error("❌ 𝑁𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
        }
    }
};

// =====================
// Notification Card Gen
// =====================
async function generateNotificationCard(text) {
    const width = 800;
    const height = 450;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#2c3e50");
    gradient.addColorStop(1, "#4ca1af");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative circles
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 50; i++) {
        const size = Math.random() * 30 + 10;
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Title box
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    roundRect(ctx, 50, 50, width - 100, 80, 20);
    ctx.fill();

    // Title text
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#f39c12";
    ctx.textAlign = "center";
    ctx.fillText("🔔 𝐴𝐷𝑀𝐼𝑁 𝑁𝑂𝑇𝐼𝐹𝐼𝐶𝐴𝑇𝐼𝑂𝑁", width / 2, 100);

    // Content box
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    roundRect(ctx, 50, 150, width - 100, height - 230, 20);
    ctx.fill();

    // Message text
    ctx.fillStyle = "#2c3e50";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";

    const maxWidth = width - 180;
    const lines = [];
    let line = "";

    for (const word of text.split(" ")) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line.length > 0) {
            lines.push(line);
            line = word + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    const lineHeight = 40;
    const startY = 200 + (150 - lines.length * lineHeight) / 2;

    lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + i * lineHeight);
    });

    // Footer
    ctx.font = "italic 24px Arial";
    ctx.fillStyle = "#7f8c8d";
    ctx.fillText("𝑆𝑒𝑛𝑡 𝑣𝑖𝑎 𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚", width / 2, height - 40);

    // Save image
    const tmpDir = path.join(__dirname, "tmp");
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    const filePath = path.join(tmpDir, `notification_${Date.now()}.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);

    return filePath;
}

// Round rectangle helper
function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
}
