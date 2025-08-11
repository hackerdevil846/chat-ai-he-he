module.exports.config = {
	name: "shortcut",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒂𝒅𝒅, 𝒓𝒆𝒎𝒐𝒗𝒆 𝒂𝒏𝒅 𝒍𝒊𝒔𝒕 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐",
	commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "[all/delete/empty]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
        "path": ""
	}
}

module.exports.languages = {
    "en": {
        "misingKeyword": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑲𝒆𝒚𝒘𝒐𝒓𝒅 𝒌𝒉𝒂𝒍𝒊 𝒓𝒂𝒌𝒉𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂!",
        "shortcutExist": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒊𝒏𝒑𝒖𝒕 𝒂𝒈𝒆 𝒕𝒉𝒆𝒌𝒆𝒊 𝒂𝒄𝒉𝒆!",
        "requestResponse": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒚𝒆 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒆𝒓 𝒋𝒂𝒘𝒂𝒂𝒃 𝒅𝒂𝒐",
        "addSuccess": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑵𝒐𝒕𝒖𝒏 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒂𝒅𝒅 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝒓𝒆𝒔𝒖𝒍𝒕:\n- 𝑰𝑫:%1\n- 𝑰𝒏𝒑𝒖𝒕: %2\n- 𝑶𝒖𝒕𝒑𝒖𝒕: %3",
        "listShortcutNull": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑨𝒑𝒏𝒂𝒓 𝒕𝒉𝒓𝒆𝒂𝒅 𝒆 𝒌𝒐𝒏𝒐 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒏𝒂𝒊!",
        "removeSuccess": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒓𝒆𝒎𝒐𝒗𝒆 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!",
        "returnListShortcut": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒕𝒉𝒓𝒆𝒂𝒅 𝒆𝒓 𝒔𝒐𝒃 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕:\n[𝒔𝒕𝒕]/ [𝑰𝒏𝒑𝒖𝒕] => [𝑶𝒖𝒕𝒑𝒖𝒕]\n\n%1",
        "requestKeyword": "「𝑺𝒉𝒐𝒓𝒕𝒄𝒖𝒕」𝑬𝒊 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒊𝒚𝒆 𝒔𝒉𝒐𝒓𝒕𝒄𝒖𝒕 𝒆𝒓 𝒌𝒆𝒚𝒘𝒐𝒓𝒅 𝒅𝒂𝒐"
    }
}

module.exports.onLoad = function () {
    try {
        const { existsSync, writeFileSync, readFileSync } = global.nodemodule["fs-extra"];
        const { resolve } = global.nodemodule["path"];
        const path = resolve(__dirname, "cache", "shortcutdata.json");
        if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
        if (!existsSync(path)) writeFileSync(path, JSON.stringify([]), "utf-8");
        const data = JSON.parse(readFileSync(path, "utf-8"));
        if (typeof global.moduleData.shortcut == "undefined") global.moduleData.shortcut = new Map();
        for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
    } catch (e) { console.log(e) }
    return;
}

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, messageID, body } = event;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;
    const data = global.moduleData.shortcut.get(threadID);

    if (data.some(item => item.input == body)) {
        const dataThread = data.find(item => item.input == body);
        return api.sendMessage(dataThread.output, threadID, messageID);
    }
}

module.exports.handleReply = async function ({ event, api, handleReply, getText }) {
    if (handleReply.author != event.senderID) return;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const { threadID, messageID, senderID, body } = event;
    const name = this.config.name;

    const path = resolve(__dirname, "cache", "shortcutdata.json");

    switch (handleReply.type) {
        case "requireInput": {
            if (body.length == 0) return api.sendMessage(getText("misingKeyword"), threadID, messageID);
            const data = global.moduleData.shortcut.get(threadID) || [];
            if (data.some(item => item.input == body)) return api.sendMessage(getText("shortcutExist"), threadID, messageID);
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(getText("requestResponse"), threadID, function (error, info) {
                return global.client.handleReply.push({
                    type: "final",
                    name,
                    author: senderID,
                    messageID: info.messageID,
                    input: body
                });
            }, messageID);
        }
        case "final": {
            const id = global.utils.randomString(10);
            const readData = readFileSync(path, "utf-8");
            var data = JSON.parse(readData);
            var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
            var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
            const object = { id, input: handleReply.input, output: body || "empty" };

            dataThread.shortcuts.push(object);
            dataGlobal.push(object);

            if (!data.some(item => item.threadID == threadID)) data.push(dataThread);
            else {
                const index = data.indexOf(data.find(item => item.threadID == threadID));
                data[index] = dataThread;
            }

            global.moduleData.shortcut.set(threadID, dataGlobal);
            writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

            return api.sendMessage(getText("addSuccess", id, handleReply.input, body||"empty"), threadID, messageID);
        }
    }
}

module.exports.run = function ({ event, api, args, getText }) {
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const { threadID, messageID, senderID } = event;
    const name = this.config.name;

    const path = resolve(__dirname, "cache", "shortcutdata.json");

    switch (args[0]) {
        case "remove":
        case "delete":
        case "del":
        case "-d": {
            const readData = readFileSync(path, "utf-8");
            var data = JSON.parse(readData);
            const indexData = data.findIndex(item => item.threadID == threadID);
            if (indexData == -1) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);
            var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
            var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
            var indexNeedRemove;

            if (dataThread.shortcuts.length == 0) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);

            if (isNaN(args[1])) indexNeedRemove = args[1];
            else indexNeedRemove = dataThread.shortcuts.findIndex(item => item.input == (args.slice(1, args.length)).join(" ") || item.id == (args.slice(1, args.length)).join(" "));
            
            dataThread.shortcuts.splice(indexNeedRemove, 1);
            dataGlobal.splice(indexNeedRemove, 1);

            global.moduleData.shortcut.set(threadID, dataGlobal);
            data[indexData] = dataThread;
            writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

            return api.sendMessage(getText("removeSuccess"), threadID, messageID);
        }

        case "list":
        case "all":
        case "-a": {
            const data = global.moduleData.shortcut.get(threadID) || [];
            var array = [];
            if (data.length == 0) return api.sendMessage(getText("listShortcutNull"), threadID, messageID);
            else {
                var n = 1;
                for (const single of data) array.push(`${n++}/ ${single.input} => ${single.output}`);
                return api.sendMessage(getText("returnListShortcut", array.join("\n")), threadID, messageID);
            }
        }

        default: {
            return api.sendMessage(getText("requestKeyword"), threadID, function (error, info) {
                return global.client.handleReply.push({
                    type: "requireInput",
                    name,
                    author: senderID,
                    messageID: info.messageID
                });
            }, messageID);
        }
    }
}
