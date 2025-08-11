module.exports.config = {
    name: "setjoin",
    version: "1.1.0",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑵𝒆𝒘 𝒎𝒆𝒎𝒃𝒆𝒓𝒔 𝒋𝒐𝒊𝒏 𝒌𝒉𝒂𝒏𝒆 𝒕𝒆𝒙𝒕/𝒂𝒏𝒊𝒎𝒂𝒕𝒆𝒅 𝒊𝒎𝒂𝒈𝒆 𝒔𝒆𝒕 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝒄𝒐𝒏𝒇𝒊𝒈",
    usages: "[𝒈𝒊𝒇/𝒕𝒆𝒙𝒕] [𝒕𝒆𝒙𝒕 𝒏𝒂 𝒈𝒊𝒇 𝒊𝒎𝒂𝒈𝒆𝒓 𝒖𝒓𝒍]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const path = join(__dirname, "..", "events", "cache", "joinGif");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

module.exports.languages = {
    "vi": {
        "savedConfig": "Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:",
        "tagMember": "[Tên thành viên]",
        "tagType": "[Bạn/các bạn]",
        "tagCountMember": "[Số thành viên]",
        "tagNameGroup": "[Tên nhóm]",
        "gifPathNotExist": "Nhóm của bạn chưa từng cài đặt gif join",
        "removeGifSuccess": "Đã gỡ bỏ thành công file gif của nhóm bạn!",
        "invaildURL": "Url bạn nhập không phù hợp!",
        "internetError": "Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!",
        "saveGifSuccess": "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:"
    },
    "en": {
        "savedConfig": "𝑨𝒑𝒏𝒂𝒓 𝒔𝒆𝒕𝒕𝒊𝒏𝒈𝒔 𝒔𝒂𝒗𝒆 𝒉𝒐𝒍𝒐, 𝒑𝒓𝒆𝒗𝒊𝒆𝒘:",
        "tagMember": "[𝑺𝒂𝒅𝒂𝒔𝒚𝒆𝒓 𝒏𝒂𝒎]",
        "tagType": "[𝑨𝒑𝒏𝒊/𝑻𝒂𝒓𝒂]",
        "tagCountMember": "[𝑺𝒂𝒅𝒂𝒔𝒚𝒂 𝒔𝒂𝒏𝒌𝒉𝒚𝒂]",
        "tagNameGroup": "[𝑮𝒓𝒖𝒑𝒆𝒓 𝒏𝒂𝒎]",
        "gifPathNotExist": "𝑨𝒑𝒏𝒂𝒓 𝒈𝒓𝒖𝒑 𝒌𝒐𝒏𝒐𝒅𝒊𝒏𝒐 𝒋𝒐𝒊𝒏 𝑮𝑰𝑭 𝒔𝒆𝒕 𝒌𝒂𝒓𝒂 𝒏𝒊",
        "removeGifSuccess": "𝑮𝒓𝒖𝒑𝒆𝒓 𝑮𝑰𝑭 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒂𝒓𝒂 𝒉𝒐𝒍𝒐!",
        "invaildURL": "𝑨𝒓 𝒖𝒓𝒍𝒕𝒊 𝒗𝒂𝒍𝒊𝒅 𝒏𝒂!",
        "internetError": "𝑭𝒂𝒊𝒍 𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒆 𝒏𝒂, 𝑼𝑹𝑳 𝒕𝒉𝒊𝒌 𝒏𝒂𝒊 𝒂𝒃𝒂𝒓 𝒊𝒏𝒕𝒆𝒓𝒏𝒆𝒕 𝒆𝒓 𝒑𝒓𝒐𝒃𝒍𝒆𝒎 𝒂𝒄𝒉𝒆!",
        "saveGifSuccess": "𝑮𝑰𝑭 𝒇𝒂𝒊𝒍 𝒔𝒂𝒗𝒆 𝒉𝒐𝒍𝒐, 𝒑𝒓𝒆𝒗𝒊𝒆𝒘:"
    }
}

module.exports.run = async function ({ args, event, api, Threads, getText }) {
    try {
        const { existsSync, unlinkSync, createReadStream } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const { threadID, messageID } = event;
        const msg = args.slice(1, args.length).join(" ");
        const data = (await Threads.getData(threadID)).data;

        if (!args[0]) {
            return api.sendMessage("❌ 𝑨𝒎𝒂𝒓 𝒌𝒂𝒋𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒃𝒐𝒋𝒉𝒂𝒓𝒕𝒆 𝒉𝒐𝒍𝒃𝒆:\n" +
                "𝒔𝒆𝒕𝒋𝒐𝒊𝒏 𝒕𝒆𝒙𝒕 [𝒎𝒆𝒔𝒔𝒂𝒈𝒆]\n" +
                "𝒔𝒆𝒕𝒋𝒐𝒊𝒏 𝒈𝒊𝒇 [𝒖𝒓𝒍]\n" +
                "𝒔𝒆𝒕𝒋𝒐𝒊𝒏 𝒈𝒊𝒇 𝒓𝒆𝒎𝒐𝒗𝒆", threadID);
        }

        switch (args[0].toLowerCase()) {
            case "text": {
                if (!msg) return api.sendMessage("❌ 𝑻𝒆𝒙𝒕 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒅𝒊𝒚𝒆 𝒅𝒊𝒏", threadID);
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
                
                if (!msg) return api.sendMessage("❌ 𝑮𝑰𝑭 𝒖𝒓𝒍 𝒅𝒊𝒚𝒆 𝒅𝒊𝒏", threadID);
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
                return api.sendMessage("❌ 𝑨𝒎𝒂𝒓 𝒌𝒂𝒋𝒆𝒓 𝒋𝒐𝒏𝒏𝒐 𝒃𝒐𝒋𝒉𝒂𝒓𝒕𝒆 𝒉𝒐𝒍𝒃𝒆: 𝒕𝒆𝒙𝒕 𝒏𝒂 𝒈𝒊𝒇", threadID);
            }
        }
    } catch (e) {
        console.error(e);
        return api.sendMessage("❌ 𝑨𝒎𝒂𝒓 𝒌𝒂𝒋𝒆𝒓 𝒆𝒓𝒓𝒐𝒓 𝒉𝒐𝒍𝒆𝒄𝒉𝒆, 𝒅𝒆𝒌𝒉𝒖𝒏 𝒂𝒃𝒂𝒓 𝒌𝒐𝒓𝒖𝒏", threadID);
    }
};
