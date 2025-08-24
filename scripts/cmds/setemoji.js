module.exports.config = {
    name: "setemoji",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Change group emoji",
    category: "group",
    usages: "[emoji]",
    cooldowns: 3
};

module.exports.languages = {
    "vi": {
        "noEmoji": "❌ Vui lòng nhập emoji để cài đặt!",
        "success": "✅ Cài đặt emoji nhóm thành công: %emoji%",
        "noPerm": "❌ Tôi không có quyền thay đổi emoji. Vui lòng cấp quyền quản trị cho tôi!",
        "invalid": "❌ Emoji không hợp lệ! Vui lòng sử dụng emoji hợp lệ.",
        "error": "❌ Đã xảy ra lỗi khi thay đổi emoji. Hãy thử lại sau."
    },
    "en": {
        "noEmoji": "❌ Please enter an emoji to set!",
        "success": "✅ Successfully set group emoji to: %emoji%",
        "noPerm": "❌ I don't have permission to change emoji. Please make me admin!",
        "invalid": "❌ Invalid emoji! Please use a valid emoji.",
        "error": "❌ An error occurred while changing emoji. Please try again later."
    }
};

module.exports.run = async function ({ api, event, args, getText }) {
    const { threadID, messageID } = event;

    // Check if emoji is provided
    if (!args[0]) {
        return api.sendMessage(getText("noEmoji"), threadID, messageID);
    }

    const emoji = args.join(" ");

    try {
        // Attempt to change group emoji
        await api.changeThreadEmoji(emoji, threadID);

        // Send success message
        return api.sendMessage(getText("success").replace("%emoji%", emoji), threadID, messageID);
    } catch (error) {
        console.error("❌ Error changing emoji:", error);

        // Send error messages based on common issues
        if (error.message?.includes("permission")) {
            return api.sendMessage(getText("noPerm"), threadID, messageID);
        } else if (error.message?.includes("invalid")) {
            return api.sendMessage(getText("invalid"), threadID, messageID);
        } else {
            return api.sendMessage(getText("error"), threadID, messageID);
        }
    }
};
