module.exports.config = {
    name: "setjoin",
    version: "1.1.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑵𝒆𝒘 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒋𝒐𝒊𝒏 𝒌𝒉𝒂𝒏𝒆 𝒕𝒆𝒙𝒕/𝒈𝒊𝒇 𝒔𝒆𝒕 𝒌𝒐𝒓𝒖𝒏",
    category: "config",
    usages: "[text/gif] [message or url]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const path = join(__dirname, "..", "events", "cache", "joinGif");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
};

module.exports.languages = {
    "vi": {
        "savedConfig": "Đã lưu tùy chỉnh của bạn thành công! dưới đây là preview:",
        "tagMember": "[Tên thành viên]",
        "tagType": "[Bạn/các bạn]",
        "tagCountMember": "[Số thành viên]",
        "tagNameGroup": "[Tên nhóm]",
        "gifPathNotExist": "Nhóm của bạn chưa từng cài đặt gif join",
        "removeGifSuccess": "Đã gỡ bỏ thành công file gif của nhóm bạn!",
        "invaildURL": "Url bạn nhập không hợp lệ!",
        "internetError": "Không thể tải file vì url không tồn tại hoặc bot gặp vấn đề mạng!",
        "saveGifSuccess": "Đã lưu file gif của nhóm bạn thành công, preview:"
    },
    "en": {
        "savedConfig": "Your settings have been saved! Preview below:",
        "tagMember": "[Member Name]",
        "tagType": "[You/Your]",
        "tagCountMember": "[Member Count]",
        "tagNameGroup": "[Group Name]",
        "gifPathNotExist": "Your group has not set a join GIF yet",
        "removeGifSuccess": "Group GIF removed successfully!",
        "invaildURL": "The URL you entered is invalid!",
        "internetError": "Failed to load the file, URL may not exist or network error!",
        "saveGifSuccess": "GIF saved successfully, preview:"
    }
};

module.exports.run = async function ({ api, event, args, Threads, getText }) {
    try {
        const { existsSync, unlinkSync, createReadStream } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const { threadID } = event;
        const msg = args.slice(1).join(" ");
        const data = (await Threads.getData(threadID)).data;

        if (!args[0]) {
            return api.sendMessage(
                "❌ Usage:\n" +
                "setjoin text [message]\n" +
                "setjoin gif [url]\n" +
                "setjoin gif remove",
                threadID
            );
        }

        switch (args[0].toLowerCase()) {
            case "text": {
                if (!msg) return api.sendMessage("❌ Please provide the text message!", threadID);
                data.customJoin = msg;
                await Threads.setData(threadID, { data });
                global.data.threadData.set(parseInt(threadID), data);

                const preview = msg
                    .replace(/\{name}/g, getText("tagMember"))
                    .replace(/\{type}/g, getText("tagType"))
                    .replace(/\{soThanhVien}/g, getText("tagCountMember"))
                    .replace(/\{threadName}/g, getText("tagNameGroup"));

                return api.sendMessage(`${getText("savedConfig")}\n\n${preview}`, threadID);
            }
            case "gif": {
                const pathGif = join(__dirname, "..", "events", "cache", "joinGif", `${threadID}.gif`);

                if (msg.toLowerCase() === "remove") {
                    if (!existsSync(pathGif)) return api.sendMessage(getText("gifPathNotExist"), threadID);
                    unlinkSync(pathGif);
                    return api.sendMessage(getText("removeGifSuccess"), threadID);
                }

                if (!msg) return api.sendMessage("❌ Please provide GIF URL!", threadID);
                if (!msg.match(/\.gif$/i)) return api.sendMessage(getText("invaildURL"), threadID);

                try {
                    await global.utils.downloadFile(msg, pathGif);
                    return api.sendMessage({
                        body: getText("saveGifSuccess"),
                        attachment: createReadStream(pathGif)
                    }, threadID);
                } catch (e) {
                    console.error(e);
                    return api.sendMessage(getText("internetError"), threadID);
                }
            }
            default: {
                return api.sendMessage("❌ Invalid option! Use 'text' or 'gif'.", threadID);
            }
        }
    } catch (e) {
        console.error(e);
        return api.sendMessage("❌ An error occurred while executing the command.", event.threadID);
    }
};
