const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "resetmoney",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "💸 Gruper sobaier taka shunyo kore dey! Stylish canvas output 🎨",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "[cc], [del], [all]",
    cooldowns: 5,
    dependencies: {
        "canvas": ""
    }
};

module.exports.run = async ({ api, event, Currencies }) => {
    const { threadID, senderID } = event;
    const data = await api.getThreadInfo(threadID);

    let resetCount = 0;

    for (const user of data.userInfo) {
        const currenciesData = await Currencies.getData(user.id);
        if (currenciesData != false && typeof currenciesData.money !== "undefined") {
            await Currencies.setData(user.id, { money: 0 });
            resetCount++;
        }
    }

    // 🎨 Create Canvas
    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#1E1E2F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gradient text
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#FF5F6D");
    gradient.addColorStop(1, "#FFC371");
    ctx.fillStyle = gradient;

    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("💰 Reset Successful 💰", canvas.width / 2, 80);

    ctx.font = "28px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Total members reset: ${resetCount}`, canvas.width / 2, 150);

    ctx.font = "24px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.fillText("All balances are now 0 🤑", canvas.width / 2, 200);

    // Send Canvas as image
    const imageBuffer = canvas.toBuffer();

    return api.sendMessage({
        body: `✅ Sob memberder taka successfully reset kora hoyeche!`,
        attachment: imageBuffer
    }, threadID);
};
