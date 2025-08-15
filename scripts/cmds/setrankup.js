const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "setrankup",
    version: "1.0.5",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "User level up hoye notun data set kora",
    commandCategory: "system",
    usages: "[text/gif] [Text or URL to GIF]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const dirPath = path.join(__dirname, "cache", "rankup");
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

module.exports.languages = {
    "vi": {
        "savedConfig": "Đã lưu tùy chỉnh của bạn thành công! Dưới đây là preview:",
        "tagMember": "[Tên thành viên]",
        "tagLevel": "[Level của thành viên]",
        "gifPathNotExist": "Nhóm của bạn chưa từng cài đặt gif rankup",
        "removeGifSuccess": "Đã gỡ bỏ thành công file gif của nhóm bạn!",
        "invaildURL": "Url bạn nhập không phù hợp!",
        "internetError": "Không thể tải file vì url không tồn tại hoặc bot gặp vấn đề mạng!",
        "saveGifSuccess": "Đã lưu file gif của nhóm bạn thành công, dưới đây là preview:"
    },
    "en": {
        "savedConfig": "Apnar config save hoyeche, niche preview dekhun:",
        "tagMember": "[Member er nam]",
        "tagLevel": "[Member er level]",
        "gifPathNotExist": "Apnar thread e GIF rankup set kora hoy ni",
        "removeGifSuccess": "Thread er GIF remove kora hoyeche!",
        "invaildURL": "URL ti sothik noy!",
        "internetError": "Fail load kora jacche na, URL exist kore na ba internet problem!",
        "saveGifSuccess": "GIF file save kora hoyeche, niche preview dekhun:"
    }
};

module.exports.run = async function ({ api, event, args, Threads, getText }) {
    try {
        const { threadID, messageID } = event;
        const msg = args.slice(1).join(" ");
        const data = (await Threads.getData(threadID)).data;
        const cachePath = path.join(__dirname, "cache", "rankup");
        const pathGif = path.join(cachePath, `${threadID}.gif`);

        switch (args[0]) {
            case "text": {
                data.customRankup = msg;
                global.data.threadData.set(parseInt(threadID), data);
                await Threads.setData(threadID, { data });
                const body = msg
                    .replace(/\{name}/g, getText("tagMember"))
                    .replace(/\{level}/g, getText("tagLevel"));
                await api.sendMessage(getText("savedConfig"), threadID);
                return api.sendMessage(body, threadID);
            }

            case "gif": {
                if (msg.toLowerCase() === "remove") {
                    if (!fs.existsSync(pathGif)) return api.sendMessage(getText("gifPathNotExist"), threadID, messageID);
                    fs.unlinkSync(pathGif);
                    return api.sendMessage(getText("removeGifSuccess"), threadID, messageID);
                } else {
                    if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) 
                        return api.sendMessage(getText("invaildURL"), threadID, messageID);

                    try {
                        await global.utils.downloadFile(msg, pathGif);
                        return api.sendMessage({
                            body: getText("saveGifSuccess"),
                            attachment: fs.createReadStream(pathGif)
                        }, threadID, messageID);
                    } catch {
                        return api.sendMessage(getText("internetError"), threadID, messageID);
                    }
                }
            }

            default:
                return global.utils.throwError(this.config.name, threadID, messageID);
        }
    } catch (e) {
        console.error(e);
    }
};
