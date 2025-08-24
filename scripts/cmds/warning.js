const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports.config = {
    name: "warning",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Userder ke warning deya 🛑",
    category: "system",
    usages: "[ all | reset | reply <reason> ]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, writeFileSync, ensureDirSync } = fs;
    const { resolve } = path;
    const cacheDir = resolve(__dirname, "cache");
    const dataPath = resolve(cacheDir, "listwarning.json");
    try {
        if (!existsSync(cacheDir)) ensureDirSync(cacheDir);
        if (!existsSync(dataPath)) writeFileSync(dataPath, JSON.stringify({}), "utf-8");
    } catch (e) {
        console.error("WARNING MODULE ONLOAD ERROR:", e);
    }
};

module.exports.onStart = async function ({ event, api, args, permssion, Users }) {
    const { readFileSync, writeFileSync } = fs;
    const { resolve } = path;
    const { threadID, messageID, mentions, senderID } = event;
    const mention = mentions ? Object.keys(mentions) : [];
    const dataPath = resolve(__dirname, "cache", "listwarning.json");

    // Load data safely
    let warningData = {};
    try {
        const dataFile = readFileSync(dataPath, "utf-8");
        warningData = JSON.parse(dataFile || "{}");
    } catch {
        warningData = {};
    }

    const sub = args[0] ? args[0].toString().toLowerCase() : "";

    switch (sub) {
        case "all": {
            if (permssion != 2) return api.sendMessage(`❌ Apni ei command use korar jonno authorized na!`, threadID, messageID);

            let listUser = "";
            for (const IDUser in warningData) {
                try {
                    const name = global.data.userName.get(IDUser) || await Users.getNameUser(IDUser);
                    listUser += `👤 ${name} → baki ache ${warningData[IDUser].warningLeft} warning\n`;
                } catch {
                    listUser += `👤 ${IDUser} → baki ache ${warningData[IDUser].warningLeft} warning\n`;
                }
            }
            if (listUser.length == 0) listUser = "✅ Akhon kono user ke warning deya hoyni.";
            return api.sendMessage(listUser, threadID, messageID);
        }

        case "reset": {
            if (permssion != 2) return api.sendMessage(`❌ Apni ei command use korar jonno authorized na!`, threadID, messageID);

            try {
                writeFileSync(dataPath, JSON.stringify({}), "utf-8");
                return api.sendMessage("♻️ Sob warning list reset kora holo!", threadID, messageID);
            } catch (e) {
                console.error(e);
                return api.sendMessage("⚠️ Error: Reset korte problem hoise.", threadID, messageID);
            }
        }

        default: {
            // Non-admin (view own or mentioned user's warning)
            if (permssion != 2) {
                try {
                    const targetID = args[0] || mention[0] || senderID;
                    const data = warningData[targetID];
                    const name = global.data.userName.get(targetID) || await Users.getNameUser(targetID);

                    if (!data) return api.sendMessage(`✅ Ekhon ${name} er kono warning nei.`, threadID, messageID);

                    let reason = "";
                    for (const n of data.warningReason) reason += `• ${n}\n`;
                    return api.sendMessage(
                        `⚠️ ${name} er baki ache ${data.warningLeft} warning:\n\n${reason}`,
                        threadID,
                        messageID
                    );
                } catch (e) {
                    console.error(e);
                    return api.sendMessage("⚠️ Error: User warning dekhate problem hoise.", threadID, messageID);
                }
            }

            // Admin (give warning via reply)
            else {
                try {
                    if (!event.messageReply) return api.sendMessage("❌ Apni warning dewar jonno message reply den nai.", threadID, messageID);
                    if (event.messageReply.senderID == api.getCurrentUserID()) return api.sendMessage("🤖 Bot account ke warning deya jabe na.", threadID, messageID);
                    if (!args.slice(1).join(" ") && args.length === 1) return api.sendMessage("⚠️ Apni warning er karon den nai!", threadID, messageID);

                    const target = event.messageReply.senderID;
                    const entry = warningData[target] || { warningLeft: 3, warningReason: [], banned: false };

                    if (entry.banned) return api.sendMessage("⛔ Ei account already ban kora hoise (3 bar warning deya hoise)!", threadID, messageID);

                    const name = global.data.userName.get(target) || await Users.getNameUser(target);
                    entry.warningLeft -= 1;
                    entry.warningReason.push(args.join(" "));
                    if (entry.warningLeft <= 0) entry.banned = true;

                    warningData[target] = entry;
                    writeFileSync(dataPath, JSON.stringify(warningData, null, 4), "utf-8");

                    if (entry.banned) {
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
                        `⚠️ Warning deya holo ${name} ke!\n📌 Karon: ${args.join(" ")}\n\n` +
                        `${entry.banned ? `⛔ 3 bar warning howar karone account ban kora holo!` : `🟡 Baki ache ${entry.warningLeft} warning.`}`,
                        threadID,
                        messageID
                    );
                } catch (e) {
                    console.error("ERROR:", e);
                    return api.sendMessage("⚠️ Error hoise.", threadID, messageID);
                }
            }
        }
    }
};
