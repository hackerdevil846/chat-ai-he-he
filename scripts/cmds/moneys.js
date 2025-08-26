const fs = require('fs');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const moment = require('moment-timezone');

module.exports.config = {
    name: "moneys",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💰 Stylish balance checker with visual cards",
    category: "economy",
    usages: "[@mention]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "moment-timezone": ""
    },
    envConfig: {
        timezone: "Asia/Dhaka"
    }
};

module.exports.onLoad = async function () {
    console.log("✅ Moneys command loaded successfully!");
};

module.exports.languages = {
    "en": {},
    "bn": {}
};

async function generateBalanceCard(userInfo, balance, timezone) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2c3e50');
    gradient.addColorStop(1, '#4ca1af');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 30 + 10,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // User avatar
    try {
        const response = await axios.get(userInfo.avatar, { responseType: 'arraybuffer' });
        const avatar = await loadImage(Buffer.from(response.data, 'binary'));

        ctx.save();
        ctx.beginPath();
        ctx.arc(150, 200, 80, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 70, 120, 160, 160);
        ctx.restore();
    } catch (e) {
        console.error("Avatar error:", e);
    }

    // User name
    ctx.font = 'bold 38px "Segoe UI"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(userInfo.name, 400, 120);

    // Balance information
    ctx.font = 'bold 60px "Segoe UI"';
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(`$${balance}`, 400, 220);

    // Decorative balance icon
    ctx.font = 'bold 80px "Segoe UI"';
    ctx.fillText('💰', 650, 220);

    // Footer with date
    ctx.font = 'italic 20px "Segoe UI"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(
        `Checked on ${moment().tz(timezone).format('YYYY-MM-DD hh:mm:ss A')}`,
        400,
        350
    );

    return canvas.toBuffer('image/png');
}

module.exports.onStart = async function({ api, event, args, Users, Currencies, config }) {
    const { threadID, messageID, senderID, mentions } = event;

    try {
        let targetID, targetName;
        const isSelf = !args[0] || Object.keys(mentions).length === 0;

        if (isSelf) {
            targetID = senderID;
            const userData = await Users.getData(targetID);
            targetName = userData.name || "User";
        } else if (Object.keys(mentions).length === 1) {
            targetID = Object.keys(mentions)[0];
            targetName = mentions[targetID];
        } else {
            return api.sendMessage(
                "⚠️ Please tag only one user or leave blank to check your own balance.",
                threadID,
                messageID
            );
        }

        const moneyData = await Currencies.getData(targetID);
        const balance = moneyData.money || 0;

        try {
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const card = await generateBalanceCard({
                name: targetName,
                avatar: avatarUrl
            }, balance, config.envConfig.timezone);

            return api.sendMessage({
                body: `💳 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗖𝗮𝗿𝗱\n\n👤 User: ${targetName}\n💰 Balance: $${balance}`,
                attachment: card
            }, threadID, messageID);

        } catch (cardError) {
            console.error("Card generation error:", cardError);
            return api.sendMessage(
                `💳 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗜𝗻𝗳𝗼\n\n👤 User: ${targetName}\n💰 Balance: $${balance}\n\n✨ Checked at: ${moment().tz(config.envConfig.timezone).format('hh:mm:ss A')}`,
                threadID,
                messageID
            );
        }

    } catch (error) {
        console.error('Moneys command error:', error);
        return api.sendMessage(
            "❌ An error occurred while processing your request. Please try again later.",
            threadID,
            messageID
        );
    }
};
