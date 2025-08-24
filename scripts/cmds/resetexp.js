const Canvas = require("canvas");

module.exports.config = {
    name: "resetexp",
    version: "1.0.0",
    hasPermssion: 2, // Only bot admins/owners
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🌟 Sob user er EXP reset kore dai 💫",
    category: "system",
    usages: "[cc], [del], [all]",
    cooldowns: 5,
    dependencies: {
        "canvas": "2.11.0" // Ensure canvas is installed
    }
};

module.exports.languages = {
    "en": {},
    "bn": {}
};

module.exports.onLoad = async function () {
    console.log("✅ resetexp command loaded!");
};

module.exports.run = async function ({ api, event, Currencies }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        let resetCount = 0;

        for (const user of threadInfo.userInfo) {
            const userData = await Currencies.getData(user.id);
            if (userData) {
                await Currencies.setData(user.id, { exp: 0 });
                resetCount++;
            }
        }

        // Create a canvas confirmation message
        const canvas = Canvas.createCanvas(600, 250);
        const ctx = canvas.getContext("2d");

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#ff8c00");
        gradient.addColorStop(1, "#ff0080");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text style
        ctx.font = "bold 36px Sans";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("✅ EXP Reset Complete!", canvas.width / 2, 100);
        ctx.font = "28px Sans";
        ctx.fillText(`🌟 Total Users Reset: ${resetCount} 🌟`, canvas.width / 2, 170);

        // Convert canvas to buffer
        const imageBuffer = canvas.toBuffer();

        return api.sendMessage(
            { attachment: imageBuffer },
            event.threadID
        );

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ EXP reset korte giye ekta error hoyeche.", event.threadID);
    }
};
