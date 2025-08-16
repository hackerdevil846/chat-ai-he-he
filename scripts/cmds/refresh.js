const Canvas = require('canvas'); // For stylish canvas effects
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "refresh",
    version: "1.2",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "♻️ Refresh information of group chat or user",
    commandCategory: "box chat",
    usages: "[thread | group | user] [ID | @tag]",
    cooldowns: 60,
    dependencies: {
        "canvas": "2.x"
    },
    envConfig: {}
};

module.exports.languages = {
    "vi": {
        refreshMyThreadSuccess: "✅ | Đã làm mới thông tin nhóm chat của bạn thành công!",
        refreshThreadTargetSuccess: "✅ | Đã làm mới thông tin nhóm chat %1 thành công!",
        errorRefreshMyThread: "❌ | Không thể làm mới thông tin nhóm chat của bạn!",
        errorRefreshThreadTarget: "❌ | Không thể làm mới thông tin nhóm chat %1!",
        refreshMyUserSuccess: "✅ | Đã làm mới thông tin người dùng của bạn thành công!",
        refreshUserTargetSuccess: "✅ | Đã làm mới thông tin người dùng %1 thành công!",
        errorRefreshMyUser: "❌ | Không thể làm mới thông tin người dùng của bạn!",
        errorRefreshUserTarget: "❌ | Không thể làm mới thông tin người dùng %1!"
    },
    "en": {
        refreshMyThreadSuccess: "✅ | Refreshed your group chat information successfully!",
        refreshThreadTargetSuccess: "✅ | Refreshed group chat %1 information successfully!",
        errorRefreshMyThread: "❌ | Failed to refresh your group chat information!",
        errorRefreshThreadTarget: "❌ | Failed to refresh group chat %1 information!",
        refreshMyUserSuccess: "✅ | Refreshed your user information successfully!",
        refreshUserTargetSuccess: "✅ | Refreshed user %1 information successfully!",
        errorRefreshMyUser: "❌ | Failed to refresh your user information!",
        errorRefreshUserTarget: "❌ | Failed to refresh user %1 information!"
    }
};

module.exports.run = async function({ api, event, args, Threads, Users, getLang, message }) {

    // Function to generate stylish canvas message
    async function sendCanvasMessage(text) {
        const canvas = Canvas.createCanvas(600, 150);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = "#23272A";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text styling
        ctx.font = '28px Sans-serif';
        ctx.fillStyle = "#00FF7F";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

        // Convert canvas to buffer
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(path.join(__dirname, "refresh_temp.png"), imageBuffer);

        return api.sendMessage({ attachment: fs.createReadStream(path.join(__dirname, "refresh_temp.png")) }, event.threadID, () => {
            fs.unlinkSync(path.join(__dirname, "refresh_temp.png"));
        });
    }

    if (args[0] === "group" || args[0] === "thread") {
        const targetID = args[1] || event.threadID;
        try {
            await Threads.refreshInfo(targetID);
            const successText = targetID == event.threadID ? getLang("refreshMyThreadSuccess") : getLang("refreshThreadTargetSuccess", targetID);
            return sendCanvasMessage(successText);
        } catch (error) {
            const errorText = targetID == event.threadID ? getLang("errorRefreshMyThread") : getLang("errorRefreshThreadTarget", targetID);
            return sendCanvasMessage(errorText);
        }
    } 
    else if (args[0] === "user") {
        let targetID = event.senderID;
        if (args[1]) {
            if (Object.keys(event.mentions).length) targetID = Object.keys(event.mentions)[0];
            else targetID = args[1];
        }
        try {
            await Users.refreshInfo(targetID);
            const successText = targetID == event.senderID ? getLang("refreshMyUserSuccess") : getLang("refreshUserTargetSuccess", targetID);
            return sendCanvasMessage(successText);
        } catch (error) {
            const errorText = targetID == event.senderID ? getLang("errorRefreshMyUser") : getLang("errorRefreshUserTarget", targetID);
            return sendCanvasMessage(errorText);
        }
    } 
    else {
        return message.SyntaxError();
    }
};
