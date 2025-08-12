module.exports.config = {
    name: "warning",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑼𝒔𝒆𝒓𝒅𝒆𝒓 𝒌𝒆 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂",
    category: "𝑺𝒚𝒔𝒕𝒆𝒎",
    usages: "[ do/all | reset | reply <reason> ]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, writeFileSync, ensureDirSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const cacheDir = resolve(__dirname, "cache");
    const path = resolve(cacheDir, "listwarning.json");
    try {
        if (!existsSync(cacheDir)) ensureDirSync(cacheDir);
        if (!existsSync(path)) writeFileSync(path, JSON.stringify({}), "utf-8");
    } catch (e) {
        console.error("WARNING MODULE ONLOAD ERROR:", e);
    }
    return;
};

module.exports.run = async function ({ event, api, args, permssion, Users }) {
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const { threadID, messageID, mentions, senderID } = event;
    const mention = mentions ? Object.keys(mentions) : [];
    const path = resolve(__dirname, "cache", "listwarning.json");

    // load data file safely
    let warningData = {};
    try {
        const dataFile = readFileSync(path, "utf-8");
        warningData = JSON.parse(dataFile || "{}");
    } catch (e) {
        warningData = {};
    }

    const sub = args[0] ? args[0].toString().toLowerCase() : "";

    switch (sub) {
        case "all": {
            if (permssion != 2) return api.sendMessage(`𝑨𝒑𝑵𝑰 𝑬𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒏𝒂!`, threadID, messageID);
            let listUser = "";
            for (const IDUser in warningData) {
                try {
                    const name = global.data.userName.get(IDUser) || await Users.getNameUser(IDUser);
                    listUser += `- ${name}: 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${warningData[IDUser].warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈\n`;
                } catch (e) {
                    listUser += `- ${IDUser}: 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${warningData[IDUser].warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈\n`;
                }
            }
            if (listUser.length == 0) listUser = "𝑨𝒌𝒉𝒐𝒏 𝒌𝒐𝒏𝒐 𝒖𝒔𝒆𝒓𝒌𝒆 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒉𝒐𝒚𝒏𝒊";
            return api.sendMessage(listUser, threadID, messageID);
        }
        case "reset": {
            if (permssion != 2) return api.sendMessage(`𝑨𝒑𝑵𝑰 𝑬𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒃𝒂𝒃𝒐𝒉𝒂𝒓 𝒌𝒐𝒓𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒂𝒖𝒕𝒉𝒐𝒓𝒊𝒛𝒆𝒅 𝒏𝒂!`, threadID, messageID);
            try {
                writeFileSync(path, JSON.stringify({}), "utf-8");
                return api.sendMessage("𝑺𝒐𝒃 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒍𝒊𝒔𝒕 𝒓𝒆𝒔𝒆𝒕 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐!", threadID, messageID);
            } catch (e) {
                console.error(e);
                return api.sendMessage("𝑬𝒓𝒓𝒐𝒓: Reset korte problem hoise.", threadID, messageID);
            }
        }
        default: {
            // Non-admin (view user's warnings) flow
            if (permssion != 2) {
                try {
                    const targetID = args[0] || mention[0] || senderID;
                    const data = warningData[targetID];
                    const name = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
                    if (!data) return api.sendMessage(`𝑬𝒌𝒉𝒐𝒏 ${name} 𝒌𝒐𝒏𝒐 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒏𝒆𝒊!`, threadID, messageID);
                    let reason = "";
                    for (const n of data.warningReason) reason += `- ${n}\n`;
                    return api.sendMessage(`𝑬𝒌𝒉𝒐𝒏 ${name} 𝒆𝒓 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${data.warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈:\n\n${reason}`, threadID, messageID);
                } catch (e) {
                    console.error(e);
                    return api.sendMessage("𝑬𝒓𝒓𝒐𝒓: User warning dekhate problem hoise.", threadID, messageID);
                }
            }
            // Admin (give warning via reply) flow
            else {
                try {
                    if (event.type != "message_reply" && !event.messageReply) return api.sendMessage("𝑨𝒑𝒏𝒊 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒘𝒂𝒓 𝒋𝒐𝒏𝒏𝒐 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒆𝒓 𝒓𝒆𝒑𝒍𝒚 𝒅𝒆𝒚𝒏𝒊", threadID, messageID);
                    if (event.messageReply.senderID == api.getCurrentUserID()) return api.sendMessage('𝑩𝒐𝒕 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒌𝒆 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒋𝒂𝒃𝒆 𝒏𝒂', threadID, messageID);
                    if (!args.slice(1).join(" ") && args.length === 1) {
                        // if args[0] exists but no reason provided (admin may send "warning" only)
                        // But original required some reason; keep same message:
                        return api.sendMessage("𝑨𝒑𝒏𝒊 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒆𝒓 𝒌𝒂𝒓𝒐𝒏 𝒅𝒂𝒌𝒉𝒂𝒏𝒏𝒊!", threadID, messageID);
                    }
                    if (args.length == 0 || args.join(" ").trim() === "") return api.sendMessage("𝑨𝒑𝒏𝒊 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒆𝒓 𝒌𝒂𝒓𝒐𝒏 𝒅𝒂𝒌𝒉𝒂𝒏𝒏𝒊!", threadID, messageID);

                    // get or create warning entry
                    const target = event.messageReply.senderID;
                    const entry = warningData[target] || { warningLeft: 3, warningReason: [], banned: false };

                    if (entry.banned) return api.sendMessage("𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝒕𝒊 𝒃𝒂𝒏 𝒌𝒐𝒓𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆, 𝟯 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒉𝒐𝒚𝒆𝒄𝒉𝒆!", threadID, messageID);

                    const name = global.data.userName.get(target) || await Users.getNameUser(target);
                    entry.warningLeft -= 1;
                    entry.warningReason.push(args.join(" "));
                    if (entry.warningLeft <= 0) entry.banned = true;

                    warningData[target] = entry;
                    writeFileSync(path, JSON.stringify(warningData, null, 4), "utf-8");

                    if (entry.banned) {
                        // update Users data banned flag
                        try {
                            const userDataObj = (await Users.getData(target)).data || {};
                            userDataObj.banned = 1;
                            await Users.setData(target, { data: userDataObj });
                            global.data.userBanned.set(parseInt(target), 1);
                        } catch (e) {
                            console.error("Error setting user banned data:", e);
                        }
                    }

                    return api.sendMessage(
                        `𝑾𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂 𝒉𝒐𝒍𝒐 ${name} 𝒌𝒆, 𝒌𝒂𝒓𝒐𝒏: ${args.join(" ")}\n` +
                        `${entry.banned ? `𝟯 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈 𝒅𝒆𝒚𝒂𝒓 𝒌𝒂𝒓𝒐𝒏𝒆 𝒂𝒄𝒄𝒐𝒖𝒏𝒕 𝒕𝒊 𝒃𝒂𝒏 𝒉𝒐𝒍𝒐!` : `𝒆𝒓 𝒃𝒂𝒌𝒊 𝒂𝒄𝒉𝒆 ${entry.warningLeft} 𝒃𝒂𝒓 𝒘𝒂𝒓𝒏𝒊𝒏𝒈!`}`,
                        threadID,
                        messageID
                    );
                } catch (e) {
                    console.error("ERROR:", e);
                    return api.sendMessage("𝑬𝒓𝒓𝒐𝒓 𝒉𝒐𝒚𝒆𝒄𝒉𝒆", threadID, messageID);
                }
            }
        }
    }
};
