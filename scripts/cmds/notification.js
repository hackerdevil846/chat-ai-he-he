const { getStreamsFromAttachment } = global.utils;
const axios = require("axios");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    config: {
        name: "notification",
        aliases: ["notify", "noti"],
        version: "2.0",
        author: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Changed credits
        countDown: 5,
        role: 2,
        description: {
            en: "📢 Send admin notification to all groups"
        },
        category: "admin",
        guide: {
            en: "{pn} <message>"
        },
        envConfig: {
            delayPerGroup: 250
        }
    },

    langs: {
        en: {
            missingMessage: "🔔 | Please enter the message you want to send to all groups",
            notificationTitle: "📢 𝗔𝗗𝗠𝗜𝗡 𝗡𝗢𝗧𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡",
            doNotReply: "🚫 | Please do not reply to this message",
            sendingNotification: "⏳ | Starting notification blast to %1 groups...",
            sentNotification: "✅ | Successfully notified %1 groups!",
            errorSendingNotification: "❌ | Failed to send to %1 groups:\n%2",
            generatedImage: "🖼️ | Generated notification card!"
        }
    },

    onStart: async function ({ message, api, event, args, getLang, envCommands }) {
        const { delayPerGroup } = envCommands[this.config.name];
        
        if (!args[0]) {
            return message.reply(getLang("missingMessage"));
        }

        // Generate notification card
        let cardPath;
        try {
            cardPath = await this.generateNotificationCard(args.join(" "));
        } catch (e) {
            console.error("Card generation error:", e);
        }

        const notificationMessage = `${getLang("notificationTitle")}\n━━━━━━━━━━━━━━\n${args.join(" ")}\n\n${getLang("doNotReply")}`;

        const formSend = {
            body: notificationMessage,
            attachment: [
                ...(cardPath ? [fs.createReadStream(cardPath)] : []),
                ...await getStreamsFromAttachment([
                    ...event.attachments,
                    ...(event.messageReply?.attachments || [])
                ].filter(item => 
                    ["photo", "png", "animated_image", "video", "audio"].includes(item.type)
                )
            ]
        };

        // Get all active groups
        const allThreads = await api.getThreadList(100, null, ["INBOX"]);
        const botID = api.getCurrentUserID();
        const allThreadID = allThreads.filter(
            t => t.isGroup && t.threadID !== event.threadID && t.participants.some(p => p.userID === botID)
        ).map(t => t.threadID);

        message.reply(getLang("sendingNotification", allThreadID.length));

        let sendSuccess = 0;
        const sendError = [];
        const waitingSend = [];

        // Send with rate limiting
        for (const threadID of allThreadID) {
            try {
                waitingSend.push({
                    threadID,
                    pending: api.sendMessage(formSend, threadID)
                });
                await new Promise(resolve => setTimeout(resolve, delayPerGroup));
            } catch (e) {
                sendError.push({ threadID, error: e.message });
            }
        }

        // Process results
        for (const { threadID, pending } of waitingSend) {
            try {
                await pending;
                sendSuccess++;
            } catch (e) {
                sendError.push({ threadID, error: e.message });
            }
        }

        // Cleanup generated image
        if (cardPath) {
            fs.unlinkSync(cardPath);
        }

        // Prepare report
        let report = getLang("sentNotification", sendSuccess);
        
        if (sendError.length > 0) {
            const errorDetails = sendError.slice(0, 3).map(e => 
                `• [${e.threadID}]: ${e.error}`
            ).join("\n");
            report += `\n${getLang("errorSendingNotification", sendError.length)}`;
            report += `\n${errorDetails}${sendError.length > 3 ? "\n• ...and " + (sendError.length - 3) + " more" : ""}`;
        }

        // Add celebration GIF
        try {
            const gifResponse = await axios.get("https://api.otakugifs.xyz/gif?reaction=happy", {
                responseType: "stream"
            });
            message.reply({
                body: report,
                attachment: gifResponse.data
            });
        } catch (gifError) {
            message.reply(report);
        }
    },

    generateNotificationCard: async function (text) {
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

        // Decorative elements
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
        ctx.roundRect(50, 50, width - 100, 80, 20);
        ctx.fill();

        // Title text
        ctx.font = "bold 36px Arial";
        ctx.fillStyle = "#f39c12";
        ctx.textAlign = "center";
        ctx.fillText("🔔 ADMIN NOTIFICATION", width / 2, 100);

        // Content box
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.roundRect(50, 150, width - 100, height - 230, 20);
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
        ctx.fillText("Sent via GoatBot System", width / 2, height - 40);

        // Save image
        const path = `${__dirname}/tmp/notification_${Date.now()}.png`;
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(path, buffer);
        
        return path;
    }
};

// Add rounded rectangle function to Canvas
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};
