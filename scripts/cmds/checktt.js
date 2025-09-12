const fs = require("fs-extra");

module.exports.config = {
    name: "checktt",
    aliases: ["messagestats", "msgcount"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝐼𝑛𝑡𝑒𝑟𝑎𝑐𝑡𝑖𝑣𝑒 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑢𝑛𝑡𝑒𝑟 & 𝑟𝑎𝑛𝑘 𝑐ℎ𝑒𝑐𝑘𝑒𝑟"
    },
    longDescription: {
        en: "𝑇𝑟𝑎𝑐𝑘𝑠 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑐𝑜𝑢𝑛𝑡𝑠 𝑎𝑛𝑑 𝑟𝑎𝑛𝑘𝑠 𝑓𝑜𝑟 𝑢𝑠𝑒𝑟𝑠 𝑖𝑛 𝑡ℎ𝑒 𝑐ℎ𝑎𝑡"
    },
    guide: {
        en: "{p}checktt [𝑎𝑙𝑙/𝑟𝑎𝑛𝑘/@𝑚𝑒𝑛𝑡𝑖𝑜𝑛]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = () => {
    const path = __dirname + '/count-by-thread/';
    if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
        fs.mkdirSync(path, { recursive: true });
    }
};

module.exports.onChat = async function ({ event, api }) {
    try {
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

    } catch (error) {
        console.error("𝐶ℎ𝑒𝑐𝑘𝑡𝑡 𝐶ℎ𝑎𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

const rankNames = {
    "Copper I": "🟫 𝐶𝑜𝑝𝑝𝑒𝑟 𝐼",
    "Copper II": "🟫 𝐶𝑜𝑝𝑝𝑒𝑟 𝐼𝐼",
    "Copper III": "🟫 𝐶𝑜𝑝𝑝𝑒𝑟 𝐼𝐼𝐼",
    "Silver I": "⚪ 𝑆𝑖𝑙𝑣𝑒𝑟 𝐼",
    "Silver II": "⚪ 𝑆𝑖𝑙𝑣𝑒𝑟 𝐼𝐼",
    "Silver III": "⚪ 𝑆𝑖𝑙𝑣𝑒𝑟 𝐼𝐼𝐼",
    "Gold I": "🟡 𝐺𝑜𝑙𝑑 𝐼",
    "Gold II": "🟡 𝐺𝑜𝑙𝑑 𝐼𝐼",
    "Gold III": "🟡 𝐺𝑜𝑙𝑑 𝐼𝐼𝐼",
    "Gold IV": "🟡 𝐺𝑜𝑙𝑑 𝐼𝑉",
    "Platinum I": "🔵 𝑃𝑙𝑎𝑡𝑖𝑛𝑢𝑚 𝐼",
    "Platinum II": "🔵 𝑃𝑙𝑎𝑡𝑖𝑛𝑢𝑚 𝐼𝐼",
    "Platinum III": "🔵 𝑃𝑙𝑎𝑡𝑖𝑛𝑢𝑚 𝐼𝐼𝐼",
    "Platinum IV": "🔵 𝑃𝑙𝑎𝑡𝑖𝑛𝑢𝑚 𝐼𝑉",
    "Diamond I": "💎 𝐷𝑖𝑎𝑚𝑜𝑛𝑑 𝐼",
    "Diamond II": "💎 𝐷𝑖𝑎𝑚𝑜𝑛𝑑 𝐼𝐼",
    "Diamond III": "💎 𝐷𝑖𝑎𝑚𝑜𝑛𝑑 𝐼𝐼𝐼",
    "Diamond IV": "💎 𝐷𝑖𝑎𝑚𝑜𝑛𝑑 𝐼𝑉",
    "Diamond V": "💎 𝐷𝑖𝑎𝑚𝑜𝑛𝑑 𝑉",
    "Elite I": "🏅 𝐸𝑙𝑖𝑡𝑒 𝐼",
    "Elite II": "🏅 𝐸𝑙𝑖𝑡𝑒 𝐼𝐼",
    "Elite III": "🏅 𝐸𝑙𝑖𝑡𝑒 𝐼𝐼𝐼",
    "Elite IV": "🏅 𝐸𝑙𝑖𝑡𝑒 𝐼𝑉",
    "Elite V": "🏅 𝐸𝑙𝑖𝑡𝑒 𝑉",
    "Master": "🏆 𝑀𝑎𝑠𝑡𝑒𝑟",
    "War Generals": "⚔️ 𝑊𝑎𝑟 𝐺𝑒𝑛𝑒𝑟𝑎𝑙𝑠"
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

module.exports.onStart = async function ({ api, event, args, Users }) {
    try {
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
            try {
                const allThread = await api.getThreadInfo(threadID);
                if (allThread && allThread.participantIDs) {
                    for (const id of allThread.participantIDs) {
                        if (!threadData[id]) threadData[id] = 0;
                    }
                }
            } catch (error) {
                console.error("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑡ℎ𝑟𝑒𝑎𝑑 𝑖𝑛𝑓𝑜:", error);
            }
        }

        const storage = [];
        for (const id in threadData) {
            try {
                const name = await Users.getNameUser(id);
                storage.push({ id, name, count: threadData[id] });
            } catch (error) {
                console.error(`𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑛𝑎𝑚𝑒 𝑓𝑜𝑟 ${id}:`, error);
            }
        }

        storage.sort((a, b) => b.count - a.count || (a.name || "").localeCompare(b.name || ""));

        let msg = "";
        if (query === "all") {
            msg += "📊=== 𝐶𝐻𝐸𝐶𝐾𝑇𝑇 𝐿𝐸𝐴𝐷𝐸𝑅𝐵𝑂𝐴𝑅𝐷 ===📊";
            let rank = 1;
            for (const user of storage) {
                if (rank <= 50) {
                    msg += `\n${rank++}. ${user.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"} - 💌 ${user.count} 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠`;
                }
            }
            if (storage.length > 50) {
                msg += `\n\n...𝑎𝑛𝑑 ${storage.length - 50} 𝑚𝑜𝑟𝑒 𝑢𝑠𝑒𝑟𝑠`;
            }
        } else if (query === "rank") {
            msg += "🏅=== 𝑅𝐴𝑁𝐾 𝐿𝐼𝑆𝑇 ===🏅\n" + Object.values(rankNames).join("\n");
        } else {
            let userID = senderID;
            if (Object.keys(mentions).length > 0) userID = Object.keys(mentions)[0];

            const userIndex = storage.findIndex(e => e.id == userID);
            const user = storage[userIndex] || { id: userID, name: "𝑈𝑛𝑘𝑛𝑜𝑤𝑛", count: 0 };

            msg += `💠 ${userID == senderID ? "𝑌𝑜𝑢𝑟 𝑆𝑡𝑎𝑡𝑠" : (user.name + "'𝑠 𝑆𝑡𝑎𝑡𝑠")}\n`;
            msg += `📌 𝑅𝑎𝑛𝑘: ${userIndex >= 0 ? userIndex + 1 : "𝑁/𝐴"}\n`;
            msg += `💌 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${user.count}\n`;
            msg += `🔰 𝑅𝑎𝑛𝑘 𝑇𝑖𝑡𝑙𝑒: ${getRankName(user.count)}`;
        }

        await api.sendMessage(msg, threadID, messageID);

    } catch (error) {
        console.error("𝐶ℎ𝑒𝑐𝑘𝑡𝑡 𝑂𝑛𝑆𝑡𝑎𝑟𝑡 𝐸𝑟𝑟𝑜𝑟:", error);
        await api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑐ℎ𝑒𝑐𝑘𝑡𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑.", threadID, messageID);
    }
};
