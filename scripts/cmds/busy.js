module.exports.config = {
    name: "busy",
    aliases: ["dnd", "donotdisturb"],
    version: "1.6",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝑇𝑢𝑟𝑛 𝑜𝑛/𝑜𝑓𝑓 𝑑𝑜 𝑛𝑜𝑡 𝑑𝑖𝑠𝑡𝑢𝑟𝑏 𝑚𝑜𝑑𝑒"
    },
    longDescription: {
        en: "𝑇𝑢𝑟𝑛 𝑜𝑛/𝑜𝑓𝑓 𝑑𝑜 𝑛𝑜𝑡 𝑑𝑖𝑠𝑡𝑢𝑟𝑏 (𝑏𝑢𝑠𝑦) 𝑚𝑜𝑑𝑒. 𝑊ℎ𝑒𝑛 𝑠𝑜𝑚𝑒𝑜𝑛𝑒 𝑡𝑎𝑔𝑠 𝑦𝑜𝑢, 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑤𝑖𝑙𝑙 𝑖𝑛𝑓𝑜𝑟𝑚 𝑡ℎ𝑒𝑚 𝑦𝑜𝑢'𝑟𝑒 𝑏𝑢𝑠𝑦."
    },
    guide: {
        en: "{p}busy\n{p}busy [𝑟𝑒𝑎𝑠𝑜𝑛]\n{p}busy 𝑜𝑓𝑓"
    },
    dependencies: {}
};

module.exports.languages = {
    "en": {
        "turnedOff": "✅ | 𝐷𝑜 𝑛𝑜𝑡 𝑑𝑖𝑠𝑡𝑢𝑟𝑏 𝑚𝑜𝑑𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑜𝑓𝑓.",
        "turnedOn": "✅ | 𝐷𝑜 𝑛𝑜𝑡 𝑑𝑖𝑠𝑡𝑢𝑟𝑏 𝑚𝑜𝑑𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑜𝑛.",
        "turnedOnWithReason": "✅ | 𝐷𝑜 𝑛𝑜𝑡 𝑑𝑖𝑠𝑡𝑢𝑟𝑏 𝑚𝑜𝑑𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑜𝑛 𝑤𝑖𝑡ℎ 𝑟𝑒𝑎𝑠𝑜𝑛: %1",
        "turnedOnWithoutReason": "✅ | 𝐷𝑜 𝑛𝑜𝑡 𝑑𝑖𝑠𝑡𝑢𝑟𝑏 𝑚𝑜𝑑𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑡𝑢𝑟𝑛𝑒𝑑 𝑜𝑛.",
        "alreadyOn": "⚠️ | 𝑈𝑠𝑒𝑟 %1 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑏𝑢𝑠𝑦.",
        "alreadyOnWithReason": "⚠️ | 𝑈𝑠𝑒𝑟 %1 𝑖𝑠 𝑐𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑏𝑢𝑠𝑦. 𝑅𝑒𝑎𝑠𝑜𝑛: %2"
    }
};

async function _getUserRecord(userID, usersData) {
    try {
        if (usersData && typeof usersData.get === 'function') {
            const u = await usersData.get(userID);
            if (u && typeof u === 'object') return u;
        }
    } catch (e) { }

    try {
        if (global.db && Array.isArray(global.db.allUserData)) {
            return global.db.allUserData.find(item => item.userID == userID) || null;
        }
    } catch (e) { }

    return null;
}

async function _setUserBusy(userID, busyVal, usersData) {
    try {
        if (usersData && typeof usersData.set === 'function') {
            const current = await usersData.get(userID) || {};
            const data = current.data || {};
            if (busyVal) data.busy = busyVal;
            else delete data.busy;
            
            await usersData.set(userID, { ...current, data });
            return true;
        }
    } catch (e) { }

    try {
        if (global.db && Array.isArray(global.db.allUserData)) {
            const rec = global.db.allUserData.find(item => item.userID == userID);
            if (rec) {
                if (busyVal) {
                    rec.data = rec.data || {};
                    rec.data.busy = busyVal;
                } else if (rec.data) {
                    delete rec.data.busy;
                }
                return true;
            } else {
                const newRec = { userID: userID, data: busyVal ? { busy: busyVal } : {} };
                global.db.allUserData.push(newRec);
                return true;
            }
        }
    } catch (e) { }

    return false;
}

async function _getUserBusyReason(userID, usersData) {
    try {
        const rec = await _getUserRecord(userID, usersData);
        if (!rec) return false;
        if (rec.data && typeof rec.data.busy !== 'undefined') {
            return rec.data.busy || false;
        }
        if (typeof rec.busy !== 'undefined') return rec.busy || false;
        return false;
    } catch (e) {
        return false;
    }
}

module.exports.onStart = async function({ api, event, args, usersData }) {
    const { senderID, threadID, messageID } = event;

    const getLang = (key, ...params) => {
        const lang = module.exports.languages.en;
        let text = lang[key] || key;
        params.forEach((param, index) => {
            text = text.replace(`%${index + 1}`, param);
        });
        return text;
    };

    if (args.length && args[0].toLowerCase() === "off") {
        await _setUserBusy(senderID, null, usersData);
        return api.sendMessage(getLang("turnedOff"), threadID, messageID);
    }

    const reason = args.length ? args.join(" ").trim() : "";
    await _setUserBusy(senderID, reason, usersData);
    
    const message = reason ? getLang("turnedOnWithReason", reason) : getLang("turnedOnWithoutReason");
    return api.sendMessage(message, threadID, messageID);
};

module.exports.onChat = async function({ event, api, usersData }) {
    try {
        const { threadID, messageID, senderID } = event;

        const mentions = event.mentions || (event.message && event.message.mentions) || null;
        if (!mentions || Object.keys(mentions).length === 0) return;

        for (const userID of Object.keys(mentions)) {
            const reasonBusy = await _getUserBusyReason(userID, usersData);
            if (reasonBusy !== false) {
                const userName = await getUserName(api, userID);
                const displayName = userName || "User";
                
                const message = reasonBusy 
                    ? module.exports.languages.en.alreadyOnWithReason.replace("%1", displayName).replace("%2", reasonBusy)
                    : module.exports.languages.en.alreadyOn.replace("%1", displayName);

                return api.sendMessage(message, threadID, messageID);
            }
        }
    } catch (err) {
        console.error("Busy mode error:", err);
    }
};

async function getUserName(api, userID) {
    try {
        const userInfo = await api.getUserInfo(userID);
        return userInfo[userID]?.name || "User";
    } catch {
        return "User";
    }
}
