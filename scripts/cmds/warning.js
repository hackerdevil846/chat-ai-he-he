module.exports.config = {
    name: "warning",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑼𝒔𝒆𝒓𝒅𝒆𝒓 𝒌𝒆 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂",
    commandCategory: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "[ do/all]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, "cache", "listwarning.json");
    if (!existsSync(path)) writeFileSync(path, JSON.stringify({}), 'utf-8');
    return;
}

module.exports.run = async function ({ event, api, args, permssion, Users }) {
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const { threadID, messageID, mentions, senderID } = event;
    const mention = Object.keys(mentions);
    const path = resolve(__dirname, "cache", "listwarning.json");
    const dataFile = readFileSync(path, "utf-8");
    var warningData = JSON.parse(dataFile);

    switch (args[0]) {
        case "all": {
            if (permssion != 2) return api.sendMessage(`𝑨𝒑𝑵𝑰 𝑬𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒏𝒂!`, threadID, messageID);
            var listUser = "";
            for (const IDUser in warningData) {
                const name = global.data.userName.get(IDUser) || await Users.getNameUser(IDUser);
                listUser += `- ${name}: 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${warningData[IDUser].warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈\n`;
            }
            if (listUser.length == 0) listUser = "𝑨𝒌𝒉𝒐𝒏 𝒌𝒐𝒏𝒐 𝒖𝒔𝒆𝒓𝒌𝒆 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒉𝒐𝒚𝒏𝒊";
            return api.sendMessage(listUser, threadID, messageID);
        }
        case "reset": {
            writeFileSync(path, JSON.stringify({}), 'utf-8');
            return api.sendMessage("𝑺𝒐𝒃 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒍𝒊𝒔𝒕 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!", threadID, messageID);
        }
        default: {
            if (permssion != 2) {
                const data = warningData[args[0] || mention[0] || senderID];
                const name = global.data.userName.get(args[0] || mention[0] || senderID) || await Users.getNameUser(args[0] || mention[0] || senderID);
                if (!data) return api.sendMessage(`𝑬𝒌𝒉𝒐𝒏 ${name} 𝒌𝒐𝒏𝒐 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒏𝒆𝒊!`, threadID, messageID);
                else {
                    var reason = "";
                    for (const n of data.warningReason) reason += `- ${n}\n`;
                    return api.sendMessage(`𝑬𝒌𝒉𝒐𝒏 ${name} 𝒆𝒓 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${data.warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈:\n\n${reason}`, threadID, messageID);
                }
            }
            else {
                try {
                    if (event.type != "message_reply") return api.sendMessage("𝑨𝒑𝒏𝒊 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒘𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒚𝒏𝒊", threadID, messageID);
                    if (event.messageReply.senderID == api.getCurrentUserID()) return api.sendMessage('𝑩𝒐𝒕 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒌𝒆 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂', threadID, messageID);
                    if (args.length == 0) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒆𝒓 𝒌𝒂𝒓𝒐𝒏 𝒅𝒂𝒌𝒉𝒂𝒏𝒏𝒊!", threadID, messageID);
                    
                    var data = warningData[event.messageReply.senderID] || { "warningLeft": 3, "warningReason": [], "banned": false };
                    if (data.banned) return api.sendMessage("𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝒕𝒊 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝟯 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!", threadID, messageID);
                    
                    const name = global.data.userName.get(event.messageReply.senderID) || await Users.getNameUser(event.messageReply.senderID);
                    data.warningLeft -= 1;
                    data.warningReason.push(args.join(" "));
                    if (data.warningLeft == 0) data.banned = true;
                    warningData[event.messageReply.senderID] = data;
                    writeFileSync(path, JSON.stringify(warningData, null, 4), "utf-8");
                    
                    if (data.banned) {
                        const data = (await Users.getData(event.messageReply.senderID)).data || {};
                        data.banned = 1;
                        await Users.setData(event.messageReply.senderID, { data });
                        global.data.userBanned.set(parseInt(event.messageReply.senderID), 1);
                    }
                    
                    return api.sendMessage(
                        `𝑾𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒉𝒐𝒍𝒐 ${name} 𝒌𝒆, 𝒌𝒂𝒓𝒐𝒏: ${args.join(" ")}\n` +
                        `${data.banned ? `𝟯 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂𝒓 𝒌𝒂𝒓𝒐𝒏𝒆 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒕𝒊 𝒃𝒂𝒏 𝒉𝒐𝒍𝒐!` : `𝒆𝒓 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${data.warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈!`}`, 
                        threadID, 
                        messageID
                    );
                } catch (e) { 
                    console.error("𝑬𝑹𝑹𝑶𝑹:", e);
                    return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆", threadID, messageID);
                }
            }
        }
    }
}
