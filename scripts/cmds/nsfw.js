module.exports.config = {
	name: "nsfw",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝒏𝒔𝒇𝒘 𝒌𝒐𝒎𝒂𝒏𝒅 𝒐𝒏/𝒐𝒇𝒇 𝒌𝒐𝒓𝒂",
	commandCategory: "𝒔𝒚𝒔𝒕𝒆𝒎",
	cooldowns: 5
};

module.exports.languages = {
    "en": {
        "returnSuccessEnable": "✅ 𝒏𝒔𝒇𝒘 𝒌𝒐𝒎𝒂𝒏𝒅 𝒐𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 𝒆𝒊 𝒈𝒓𝒖𝒑𝒆𝒓 𝒋𝒐𝒏𝒏𝒐",
        "returnSuccessDisable": "⛔ 𝒏𝒔𝒇𝒘 𝒌𝒐𝒎𝒂𝒏𝒅 𝒐𝒇𝒇 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 𝒆𝒊 𝒈𝒓𝒖𝒑𝒆𝒓 𝒋𝒐𝒏𝒏𝒐",
        "error": "❌ 𝒆𝒓𝒓𝒐𝒓! 𝒑𝒖𝒏𝒐𝒓𝒃𝒂𝒓 𝒄𝒉𝒆𝒔𝒕𝒂 𝒌𝒐𝒓𝒖𝒏!"
    }
}

module.exports.run = async function ({ event, api, Threads, getText }) {
    const { threadID, messageID } = event;
    const { getData, setData } = Threads;
    let type;

    try {
        let data = (await getData(threadID)).data || {};
        if (typeof data == "undefined" || data.NSFW == false) {
            data.NSFW = true;
            global.data.threadAllowNSFW.push(parseInt(threadID));
            type = "on";
        }
        else {
            data.NSFW = false;
            global.data.threadAllowNSFW = global.data.threadAllowNSFW.filter(item => item != threadID);
            type = "off";
        }
        await setData(threadID, { data });
        return api.sendMessage(
            type === "on" ? getText("returnSuccessEnable") : getText("returnSuccessDisable"),
            threadID,
            messageID
        );
    } catch (e) { 
        console.error(e);
        return api.sendMessage(getText("error"), threadID, messageID);
    }
}
