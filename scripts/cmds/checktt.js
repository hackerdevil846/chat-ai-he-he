module.exports.config = {
    name: "checktt",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "Interactive message counter & rank checker",
    commandCategory: "Utilities",
    usages: "[all/rank/@mention]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = () => {
    const fs = require("fs");
    const path = __dirname + '/count-by-thread/';
    if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
        fs.mkdirSync(path, { recursive: true });
    }
};

module.exports.handleEvent = async function ({ event }) {
    const fs = require("fs");
    const path = __dirname + '/count-by-thread/';
    const { threadID, senderID } = event;

    if (!global.data.allThreadID.includes(threadID)) return;

    const threadPath = path + threadID + ".json";
    if (!fs.existsSync(threadPath) || fs.statSync(threadPath).isDirectory()) {
        fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
    }

    const threadData = JSON.parse(fs.readFileSync(threadPath)) || {};
    if (!threadData[senderID]) threadData[senderID] = 0;
    threadData[senderID]++;
    fs.writeFileSync(threadPath, JSON.stringify(threadData, null, 4));
};

const rankNames = {
    "Copper I": "🟫 Copper I",
    "Copper II": "🟫 Copper II",
    "Copper III": "🟫 Copper III",
    "Silver I": "⚪ Silver I",
    "Silver II": "⚪ Silver II",
    "Silver III": "⚪ Silver III",
    "Gold I": "🟡 Gold I",
    "Gold II": "🟡 Gold II",
    "Gold III": "🟡 Gold III",
    "Gold IV": "🟡 Gold IV",
    "Platinum I": "🔵 Platinum I",
    "Platinum II": "🔵 Platinum II",
    "Platinum III": "🔵 Platinum III",
    "Platinum IV": "🔵 Platinum IV",
    "Diamond I": "💎 Diamond I",
    "Diamond II": "💎 Diamond II",
    "Diamond III": "💎 Diamond III",
    "Diamond IV": "💎 Diamond IV",
    "Diamond V": "💎 Diamond V",
    "Elite I": "🏅 Elite I",
    "Elite II": "🏅 Elite II",
    "Elite III": "🏅 Elite III",
    "Elite IV": "🏅 Elite IV",
    "Elite V": "🏅 Elite V",
    "Master": "🏆 Master",
    "War Generals": "⚔️ War Generals"
};

const getRankName = count => {
    return count > 50000 ? rankNames["War Generals"]
        : count > 9000 ? rankNames["Master"]
        : count > 8000 ? rankNames["Elite V"]
        : count > 6100 ? rankNames["Elite IV"]
        : count > 5900 ? rankNames["Elite III"]
        : count > 5700 ? rankNames["Elite II"]
        : count > 5200 ? rankNames["Elite I"]
        : count > 5000 ? rankNames["Diamond V"]
        : count > 4800 ? rankNames["Diamond IV"]
        : count > 4500 ? rankNames["Diamond III"]
        : count > 4000 ? rankNames["Diamond II"]
        : count > 3800 ? rankNames["Diamond I"]
        : count > 3500 ? rankNames["Platinum IV"]
        : count > 3200 ? rankNames["Platinum III"]
        : count > 3000 ? rankNames["Platinum II"]
        : count > 2900 ? rankNames["Platinum I"]
        : count > 2500 ? rankNames["Gold IV"]
        : count > 2300 ? rankNames["Gold III"]
        : count > 2000 ? rankNames["Gold II"]
        : count > 1500 ? rankNames["Gold I"]
        : count > 1200 ? rankNames["Silver III"]
        : count > 1000 ? rankNames["Silver II"]
        : count > 900 ? rankNames["Silver I"]
        : count > 500 ? rankNames["Copper III"]
        : count > 100 ? rankNames["Copper II"]
        : rankNames["Copper I"];
};

module.exports.run = async function ({ api, event, args, Users }) {
    const fs = require("fs");
    const path = __dirname + '/count-by-thread/';
    const { messageID, threadID, senderID, mentions } = event;

    const threadPath = path + threadID + ".json";
    if (!fs.existsSync(threadPath) || fs.statSync(threadPath).isDirectory()) {
        fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
    }

    const query = args[0] ? args[0].toLowerCase() : "";
    const threadData = JSON.parse(fs.readFileSync(threadPath)) || {};

    if (!threadData[senderID]) threadData[senderID] = 1;

    if (query === "all") {
        const allThread = await api.getThreadInfo(threadID) || { participantIDs: [] };
        for (const id of allThread.participantIDs) {
            if (!threadData[id]) threadData[id] = 0;
        }
    }

    const storage = [];
    for (const id in threadData) {
        const name = await Users.getNameUser(id);
        storage.push({ id, name, count: threadData[id] });
    }

    storage.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    let msg = "";
    if (query === "all") {
        msg += "📊=== CHECKTT LEADERBOARD ===📊";
        let rank = 1;
        for (const user of storage) {
            msg += `\n${rank++}. ${user.name} - 💌 ${user.count} messages`;
        }
    } else if (query === "rank") {
        msg += "🏅=== RANK LIST ===🏅\n" + Object.values(rankNames).join("\n");
    } else {
        let userID = senderID;
        if (Object.keys(mentions).length > 0) userID = Object.keys(mentions)[0];

        const userIndex = storage.findIndex(e => e.id == userID);
        const user = storage[userIndex];

        msg += `💠 ${userID == senderID ? "Your Stats" : user.name + "'s Stats"}\n`;
        msg += `📌 Rank: ${userIndex + 1}\n`;
        msg += `💌 Messages: ${user.count}\n`;
        msg += `🔰 Rank Title: ${getRankName(user.count)}`;
    }

    api.sendMessage(msg, threadID, messageID);
};
