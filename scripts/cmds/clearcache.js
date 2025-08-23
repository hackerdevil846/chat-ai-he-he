module.exports.config = {
    name: "clearcache",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🗑️ Delete cache file(s) from the bot safely",
    category: "system",
    usages: "[file extension]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "latest"
    }
};

module.exports.languages = {
    "en": {
        noPermission: "❌ You are not allowed to use this command.",
        noExtension: "⚠️ You didn't specify the file extension to delete!",
        confirmDelete: "🗑️ The following files will be deleted:\n%s\n\nReply with `Y` to confirm.",
        deleteSuccess: "✅ Successfully deleted %d file(s) with .%s extension.",
        deleteCancel: "❌ Operation cancelled."
    }
};

module.exports.run = async function({ api, event, args }) {
    const { readdirSync } = require("fs-extra");
    const path = __dirname + "/cache";
    const allowedUIDs = ["61571630409265"]; // Only allowed UID

    if (!allowedUIDs.includes(event.senderID)) {
        return api.sendMessage(module.exports.languages.en.noPermission, event.threadID, event.messageID);
    }

    if (!args[0]) {
        return api.sendMessage(module.exports.languages.en.noExtension, event.threadID, event.messageID);
    }

    const extension = args[0];
    const listFile = readdirSync(path).filter(file => file.endsWith("." + extension));
    if (listFile.length === 0) {
        return api.sendMessage(`ℹ️ No files found with .${extension} extension.`, event.threadID, event.messageID);
    }

    let fileListText = listFile.join("\n");
    return api.sendMessage(
        module.exports.languages.en.confirmDelete.replace("%s", fileListText),
        event.threadID,
        (err, info) => {
            if (err) console.error(err);
            global.client.handleReply.push({
                step: 0,
                name: module.exports.config.name,
                extension: extension,
                messageID: info.messageID,
                author: event.senderID
            });
        },
        event.messageID
    );
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    if (event.senderID !== handleReply.author) return;

    const { readdirSync, unlinkSync } = require("fs-extra");
    const path = __dirname + "/cache";

    if (event.body.toLowerCase() === "y") {
        const listFile = readdirSync(path).filter(file => file.endsWith("." + handleReply.extension));
        for (const file of listFile) {
            unlinkSync(`${path}/${file}`);
        }
        return api.sendMessage(
            module.exports.languages.en.deleteSuccess
                .replace("%d", listFile.length)
                .replace("%s", handleReply.extension),
            event.threadID
        );
    } else {
        return api.sendMessage(module.exports.languages.en.deleteCancel, event.threadID);
    }
};
