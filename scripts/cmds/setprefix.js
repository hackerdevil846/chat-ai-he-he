module.exports.config = {
    name: "setprefix",
    version: "1.1.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Reset group prefix or change it",
    commandCategory: "group",
    usages: "[prefix/reset]",
    cooldowns: 5
};

module.exports.languages = {
    "vi": {
        "successChange": "Đã chuyển đổi prefix của nhóm thành: %1",
        "missingInput": "Phần prefix cần đặt không được để trống",
        "resetPrefix": "Đã reset prefix về mặc định: %1",
        "confirmChange": "Bạn có chắc bạn muốn đổi prefix của nhóm thành: %1"
    },
    "en": {
        "successChange": "✅ Prefix successfully changed to: %1",
        "missingInput": "❌ Prefix cannot be empty!",
        "resetPrefix": "✅ Prefix reset to default: %1",
        "confirmChange": "❓ Are you sure you want to change the group prefix to: %1?\n\nReact to this message to confirm!"
    }
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
    try {
        if (event.userID !== handleReaction.author) return;

        const { threadID } = event;
        const newPrefix = handleReaction.PREFIX;

        const threadData = await Threads.getData(threadID);
        threadData.data = threadData.data || {};
        threadData.data.PREFIX = newPrefix;

        await Threads.setData(threadID, threadData);
        await global.data.threadData.set(threadID.toString(), threadData.data);

        api.unsendMessage(handleReaction.messageID);
        return api.sendMessage(getText("successChange", newPrefix), threadID);
    } catch (error) {
        console.error("Prefix Error:", error);
    }
};

module.exports.run = async function({ api, event, args, Threads, getText }) {
    const { threadID, messageID, senderID } = event;

    if (!args[0]) {
        return api.sendMessage(getText("missingInput"), threadID, messageID);
    }

    const prefix = args[0].trim();

    if (!prefix) {
        return api.sendMessage(getText("missingInput"), threadID, messageID);
    }

    if (prefix.toLowerCase() === "reset") {
        const defaultPrefix = global.config.PREFIX;
        const threadData = await Threads.getData(threadID);
        threadData.data = threadData.data || {};
        threadData.data.PREFIX = defaultPrefix;

        await Threads.setData(threadID, threadData);
        await global.data.threadData.set(threadID.toString(), threadData.data);

        return api.sendMessage(getText("resetPrefix", defaultPrefix), threadID, messageID);
    }

    api.sendMessage(
        getText("confirmChange", prefix),
        threadID,
        (error, info) => {
            if (error) return console.error("Confirmation Error:", error);

            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                PREFIX: prefix
            });
        },
        messageID
    );
};
