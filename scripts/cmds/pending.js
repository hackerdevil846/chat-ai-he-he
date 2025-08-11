module.exports.config = {
	name: "pending",
	version: "1.0.5",
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	hasPermssion: 2,
	description: "𝑩𝒐𝒕 𝒆𝒓 𝒑𝒆𝒏𝒅𝒊𝒏𝒈 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒎𝒂𝒏𝒂𝒈𝒆 𝒌𝒐𝒓𝒂",
	commandCategory: "system",
	cooldowns: 5
};

module.exports.languages = {
    "vi": {
        "invaildNumber": "%1 không phải là một con số hợp lệ",
        "cancelSuccess": "Đã từ chối thành công %1 nhóm!",
        "notiBox": "Box của bạn đã được admin phê duyệt để có thể sử dụng bot",
        "approveSuccess": "Đã phê duyệt thành công %1 nhóm!",

        "cantGetPendingList": "Không thể lấy danh sách các nhóm đang chờ!",
        "returnListPending": "「PENDING」❮ Tổng số nhóm cần duyệt: %1 nhóm ❯\n\n%2",
        "returnListClean": "「PENDING」Hiện tại không có nhóm nào trong hàng chờ"
    },
    "en": {
        "invaildNumber": "%1 𝒆𝒌𝒕𝒂 𝒔𝒂𝒕𝒉𝒊𝒌 𝒏𝒂𝒎𝒃𝒂𝒓 𝒏𝒂",
        "cancelSuccess": "%1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒓𝒆𝒇𝒖𝒛𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",
        "notiBox": "𝑩𝒐𝑻 𝒔𝒂𝒕𝒉𝒊𝒌𝒃𝒉𝒂𝒃𝒆 𝒄𝒐𝒏𝒏𝒆𝒄𝒕 𝒉𝒐𝒊𝒆𝒄𝒉𝒆!\n𝑨𝒓𝒐 𝒊𝒏𝒇𝒐𝒓𝒎𝒂𝒔𝒉𝒐𝒏 𝒋𝒂𝒏𝒕𝒆 +𝒉𝒆𝒍𝒑2 𝒕𝒂𝒊𝒑 𝒌𝒐𝒓𝒖𝒏 :>",
        "approveSuccess": "%1 𝒕𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒔𝒂𝒑𝒉𝒂𝒍𝒃𝒉𝒂𝒃𝒆 𝒂𝒑𝒑𝒓𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!",

        "cantGetPendingList": "𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂!",
        "returnListPending": "「𝑷𝑬𝑵𝑫𝑰𝑵𝑮」❮ 𝑴𝒐𝒕𝒂𝒎𝒖𝒕𝒊 𝒂𝒑𝒑𝒓𝒐𝒗𝒆𝒓 𝒋𝒐𝒈𝒚𝒐 𝒕𝒉𝒓𝒆𝒂𝒅 𝒔𝒂𝒏𝒌𝒉𝒚𝒂: %1 𝒕𝒊 ❯\n\n%2",
        "returnListClean": "「𝑷𝑬𝑵𝑫𝑰𝑵𝑮」𝑷𝒆𝒏𝒅𝒊𝒏𝒈 𝒍𝒊𝒔𝒕𝒆 𝒌𝒐𝒏𝒐 𝒕𝒉𝒓𝒆𝒂𝒅 𝒏𝒆𝒊"
    }
}

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;

    if (isNaN(body) && body.indexOf("c") == 0 || body.indexOf("cancel") == 0) {
        const index = (body.slice(1, body.length)).split(/\s+/);
        for (const singleIndex of index) {
            console.log(singleIndex);
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
            api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
    }
    else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
            api.sendMessage(getText("notiBox"), handleReply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
    }
}

module.exports.run = async function({ api, event, getText }) {
	const { threadID, messageID } = event;
    const commandName = this.config.name;
    var msg = "", index = 1;

    try {
		var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
		var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
	} catch (e) { return api.sendMessage(getText("cantGetPendingList"), threadID, messageID) }

	const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

    if (list.length != 0) return api.sendMessage(getText("returnListPending", list.length, msg), threadID, (error, info) => {
		global.client.handleReply.push({
            name: commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
        })
	}, messageID);
    else return api.sendMessage(getText("returnListClean"), threadID, messageID);
}
