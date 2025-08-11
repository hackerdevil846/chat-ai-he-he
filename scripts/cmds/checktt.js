module.exports.config = {
	name: "checktt",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
	description: "interactive check",
	commandCategory: "Utilities",
	usages: "checktt",
	cooldowns: 5,
	dependencies: {
		"fs-extra": ""
	}
}

const path = __dirname + '/count-by-thread/';

module.exports.onLoad = () => {
    const fs = require('fs');
    if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
        fs.mkdirSync(path, { recursive: true });
    }
}

module.exports.handleEvent = function ({ event }) {
    const { messageID, threadID, senderID } = event;
    if (!global.data.allThreadID.some(tid => tid == threadID)) return;
    const fs = global.nodemodule['fs'];
    const threadPath = path + threadID + '.json';
    if (!fs.existsSync(threadPath) || fs.statSync(threadPath).isDirectory()) {
        fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
    }
    const getThreadJSON = JSON.parse(fs.readFileSync(threadPath)) || {};
    if (!getThreadJSON.hasOwnProperty(senderID)) {
        getThreadJSON[senderID] = 0;
    }
    getThreadJSON[senderID]++;
    fs.writeFileSync(threadPath, JSON.stringify(getThreadJSON, null, 4));
}

const rankNames = {
    "Copper I": "𝑪𝒐𝒑𝒑𝒆𝒓 𝑰",
    "Copper II": "𝑪𝒐𝒑𝒑𝒆𝒓 𝑰𝑰",
    "Copper III": "𝑪𝒐𝒑𝒑𝒆𝒓 𝑰𝑰𝑰",
    "Silver I": "𝑺𝒊𝒍𝒗𝒆𝒓 𝑰",
    "Silver II": "𝑺𝒊𝒍𝒗𝒆𝒓 𝑰𝑰",
    "Silver III": "𝑺𝒊𝒍𝒗𝒆𝒓 𝑰𝑰𝑰",
    "Gold I": "𝑮𝒐𝒍𝒅 𝑰",
    "Gold II": "𝑮𝒐𝒍𝒅 𝑰𝑰",
    "Gold III": "𝑮𝒐𝒍𝒅 𝑰𝑰𝑰",
    "Gold IV": "𝑮𝒐𝒍𝒅 𝑰𝑽",
    "Platinum I": "𝑷𝒍𝒂𝒕𝒊𝒏𝒖𝒎 𝑰",
    "Platinum II": "𝑷𝒍𝒂𝒕𝒊𝒏𝒖𝒎 𝑰𝑰",
    "Platinum III": "𝑷𝒍𝒂𝒕𝒊𝒏𝒖𝒎 𝑰𝑰𝑰",
    "Platinum IV": "𝑷𝒍𝒂𝒕𝒊𝒏𝒖𝒎 𝑰𝑽",
    "Diamond I": "𝑫𝒊𝒂𝒎𝒐𝒏𝒅 𝑰",
    "Diamond II": "𝑫𝒊𝒂𝒎𝒐𝒏𝒅 𝑰𝑰",
    "Diamond III": "𝑫𝒊𝒂𝒎𝒐𝒏𝒅 𝑰𝑰𝑰",
    "Diamond IV": "𝑫𝒊𝒂𝒎𝒐𝒏𝒅 𝑰𝑽",
    "Diamond V": "𝑫𝒊𝒂𝒎𝒐𝒏𝒅 𝑽",
    "Elite I": "𝑬𝒍𝒊𝒕𝒆 𝑰",
    "Elite II": "𝑬𝒍𝒊𝒕𝒆 𝑰𝑰",
    "Elite III": "𝑬𝒍𝒊𝒕𝒆 𝑰𝑰𝑰",
    "Elite IV": "𝑬𝒍𝒊𝒕𝒆 𝑰𝑽",
    "Elite V": "𝑬𝒍𝒊𝒕𝒆 𝑽",
    "Master": "𝑴𝒂𝒔𝒕𝒆𝒓",
    "War Generals": "𝑾𝒂𝒓 𝑮𝒆𝒏𝒆𝒓𝒂𝒍𝒔"
}

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
        : rankNames["Copper I"]
}

module.exports.run = async function ({ api, event, args, Users }) {
    const fs = global.nodemodule['fs'];
    const { messageID, threadID, senderID, mentions } = event;
    const threadPath = path + threadID + '.json';
    if (!fs.existsSync(threadPath) || fs.statSync(threadPath).isDirectory()) {
        fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
    }
    const query = args[0] ? args[0].toLowerCase() : '';
    const getThreadJSON = JSON.parse(fs.readFileSync(threadPath)) || {};
    if (!getThreadJSON.hasOwnProperty(senderID)) {
        getThreadJSON[senderID] = 1;
    }
    var storage = [],
        msg = '';
    if (query == 'all') {
        const allThread = await api.getThreadInfo(threadID) || { participantIDs: [] };
        for (id of allThread.participantIDs) {
            if (!getThreadJSON.hasOwnProperty(id)) {
                getThreadJSON[id] = 0;
            }
        }
    }
    for (const id in getThreadJSON) {
        const name = await Users.getNameUser(id);
        storage.push({ id, name, count: getThreadJSON[id] });
    }
    storage.sort((a, b) => {
        if (a.count > b.count) return -1;
        else if (a.count < b.count) return 1;
        else return a.name.localeCompare(b.name);
    });
    if (query == 'all') {
        let count = 1;
        msg += '===CHECKTT===';
        for (const user of storage) {
            msg += `\n${count++}. ${user.name} - ${user.count}`;
        }
    } else if (query == 'rank') {
        msg += Object.values(rankNames).join('\n');
    } else if (!query) {
        let userID = senderID;
        if (Object.keys(mentions).length > 0) {
            userID = Object.keys(mentions)[0];
        }
        const rankUser = storage.findIndex(e => e.id == userID);
        msg += `${userID == senderID ? '💠Friend' : storage[rankUser].name} ranked ${rankUser + 1}\n💌Number of messages: ${storage[rankUser].count}\n🔰Rank ${getRankName(storage[rankUser].count)}`;
    }
    api.sendMessage(msg, threadID, messageID);
    return;
}
