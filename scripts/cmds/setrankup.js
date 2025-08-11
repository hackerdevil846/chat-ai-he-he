module.exports.config = {
    name: "setrankup",
    version: "1.0.5",
    hasPermssion: 1,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝙐𝙨𝙚𝙧 𝙡𝙚𝙫𝙚𝙡 𝙪𝙥 𝙝𝙤𝙮𝙚 𝙣𝙤𝙩𝙪𝙣 𝙙𝙖𝙩𝙖 𝙨𝙚𝙩 𝙠𝙤𝙧𝙖",
    commandCategory: "𝙎𝙮𝙨𝙩𝙚𝙢",
    usages: "[𝙜𝙞𝙛/𝙩𝙚𝙭𝙩] [𝙏𝙚𝙭𝙩 𝙗𝙖 𝙐𝙍𝙇 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙂𝙄𝙁 𝙞𝙢𝙖𝙜𝙚]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "rankup");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    return;
}

module.exports.languages = {
    "vi": {
        "savedConfig": "Đã lưu tùy chỉnh của bạn thành công! dưới đây sẽ là phần preview:",
        "tagMember": "[Tên thành viên]",
        "tagLevel": "[Level của thành viên]",
        "gifPathNotExist": "Nhóm của bạn chưa từng cài đặt gif rankup",
        "removeGifSuccess": "Đã gỡ bỏ thành công file gif của nhóm bạn!",
        "invaildURL": "Url bạn nhập không phù hợp!",
        "internetError": "Không thể tải file vì url không tồn tại hoặc bot đã xảy ra vấn đề về mạng!",
        "saveGifSuccess": "Đã lưu file gif của nhóm bạn thành công, bên dưới đây là preview:"
    },
    "en": {
        "savedConfig": "𝑨𝒑𝒏𝒂𝒓 𝒄𝒐𝒏𝒇𝒊𝒈 𝒔𝒂𝒗𝒆 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒏𝒊𝒄𝒉𝒆 𝒑𝒓𝒆𝒗𝒊𝒆𝒘 𝒅𝒆𝒌𝒉𝒖𝒏:",
        "tagMember": "[𝑴𝒆𝒎𝒃𝒆𝒓 𝒆𝒓 𝒏𝒂𝒎]",
        "tagLevel": "[𝑴𝒆𝒎𝒃𝒆𝒓 𝒆𝒓 𝒍𝒆𝒗𝒆𝒍]",
        "gifPathNotExist": "𝑨𝒑𝒏𝒂𝒓 𝒕𝒉𝒓𝒆𝒂𝒅 𝒆 𝒈𝒊𝒇 𝒓𝒂𝒏𝒌𝒖𝒑 𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚 𝒏𝒊",
        "removeGifSuccess": "𝑻𝒉𝒓𝒆𝒂𝒅 𝒆𝒓 𝒈𝒊𝒇 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!",
        "invaildURL": "𝑼𝑹𝑳 𝒕𝒊 𝒔𝒐𝒕𝒉𝒊𝒌 𝒏𝒐𝒚!",
        "internetError": "𝑭𝒂𝒊𝒍 𝒍𝒐𝒂𝒅 𝒌𝒐𝒓𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 𝒌𝒂𝒓𝒐𝒏 𝑼𝑹𝑳 𝒆𝒙𝒊𝒔𝒕 𝒌𝒐𝒓𝒆 𝒏𝒂 𝒃𝒂 𝒊𝒏𝒕𝒆𝒓𝒏𝒆𝒕 𝒑𝒓𝒐𝒃𝒍𝒆𝒎!",
        "saveGifSuccess": "𝑮𝒊𝒇 𝒇𝒂𝒊𝒍 𝒔𝒂𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒏𝒊𝒄𝒉𝒆 𝒑𝒓𝒆𝒗𝒊𝒆𝒘 𝒅𝒆𝒌𝒉𝒖𝒏:"
    }
}

module.exports.run = async function ({ args, event, api, Threads, getText }) {
    try {
        const { existsSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const { threadID, messageID } = event;
        const msg = args.slice(1, args.length).join(" ");
        var data = (await Threads.getData(threadID)).data;

        switch (args[0]) {
            case "text": {
                data["customRankup"] = msg;
                global.data.threadData.set(parseInt(threadID), data);
                await Threads.setData(threadID, { data });
                return api.sendMessage(getText("savedConfig"), threadID, function () {
                    const body = msg
                    .replace(/\{name}/g, getText("tagMember"))
                    .replace(/\{level}/g, getText("tagLevel"));
                    return api.sendMessage(body, threadID);
                });
            }
            case "gif": {
                const path = join(__dirname, "cache", "rankup");
                const pathGif = join(path, `${threadID}.gif`);
                if (msg == "remove") {
                    if (!existsSync(pathGif)) return api.sendMessage(getText("gifPathNotExist"), threadID, messageID);
                    unlinkSync(pathGif);
                    return api.sendMessage(getText("removeGifSuccess"), threadID, messageID);
                }
                else {
                    if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) return api.sendMessage(getText("invaildURL"), threadID, messageID);
                    try {
                        await global.utils.downloadFile(msg, pathGif);
                    } catch (e) { return api.sendMessage(getText("internetError"), threadID, messageID) }
                    return api.sendMessage({ body: getText("saveGifSuccess"), attachment: createReadStream(pathGif) }, threadID, messageID);
                }
            }
            default: {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }
        }
    } catch (e) { return console.log(e) };
}
