const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "locknick",
    version: "2.3.0",
    hasPermssion: 2,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "🔒 𝐋𝐨𝐜𝐤/𝐮𝐧𝐥𝐨𝐜𝐤 𝐠𝐫𝐨𝐮𝐩 𝐦𝐞𝐦𝐛𝐞𝐫𝐬' 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬",
    category: "𝐆𝐫𝐨𝐮𝐩",
    usages: "locknick [on/off]",
    cooldowns: 5
};

const OWNER_UID = "61571630409265";
const NICKNAME_LOCK_FILE = path.join(__dirname, "../data/locked_nicknames.json");

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;

    // Load locked nicknames data
    const loadData = () => {
        try {
            return fs.existsSync(NICKNAME_LOCK_FILE) 
                ? JSON.parse(fs.readFileSync(NICKNAME_LOCK_FILE, "utf8")) 
                : {};
        } catch (error) {
            console.error("🔴 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫:", error);
            return {};
        }
    };

    // Save locked nicknames data
    const saveData = (data) => {
        try {
            fs.ensureFileSync(NICKNAME_LOCK_FILE);
            fs.writeFileSync(NICKNAME_LOCK_FILE, JSON.stringify(data, null, 4));
            return true;
        } catch (error) {
            console.error("🔴 𝐒𝐚𝐯𝐢𝐧𝐠 𝐞𝐫𝐫𝐨𝐫:", error);
            return false;
        }
    };

    // Permission check
    if (senderID !== OWNER_UID) {
        return api.sendMessage("⛔️ 𝐎𝐧𝐥𝐲 𝐛𝐨𝐭 𝐨𝐰𝐧𝐞𝐫 𝐜𝐚𝐧 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝!", threadID);
    }

    const action = args[0]?.toLowerCase();
    const lockedData = loadData();

    switch (action) {
        case "on":
            if (lockedData[threadID]) {
                return api.sendMessage("🔐 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐥𝐨𝐜𝐤𝐞𝐝 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩!", threadID);
            }

            try {
                const threadInfo = await api.getThreadInfo(threadID);
                const nicknamesMap = {};
                
                threadInfo.userInfo.forEach(user => {
                    if (user.id !== api.getCurrentUserID()) {
                        nicknamesMap[user.id] = user.nickname || "";
                    }
                });

                lockedData[threadID] = nicknamesMap;
                if (saveData(lockedData)) {
                    api.sendMessage("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐥𝐨𝐜𝐤𝐞𝐝 𝐚𝐥𝐥 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬!", threadID);
                } else {
                    api.sendMessage("🔴 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐚𝐯𝐞 𝐥𝐨𝐜𝐤 𝐝𝐚𝐭𝐚!", threadID);
                }
            } catch (error) {
                console.error(error);
                api.sendMessage("🔴 𝐄𝐫𝐫𝐨𝐫 𝐟𝐞𝐭𝐜𝐡𝐢𝐧𝐠 𝐠𝐫𝐨𝐮𝐩 𝐢𝐧𝐟𝐨!", threadID);
            }
            break;

        case "off":
            if (!lockedData[threadID]) {
                return api.sendMessage("🔓 𝐍𝐨 𝐥𝐨𝐜𝐤𝐞𝐝 𝐝𝐚𝐭𝐚 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩!", threadID);
            }

            delete lockedData[threadID];
            if (saveData(lockedData)) {
                api.sendMessage("✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐮𝐧𝐥𝐨𝐜𝐤𝐞𝐝 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬!", threadID);
            } else {
                api.sendMessage("🔴 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐬𝐚𝐯𝐞 𝐮𝐧𝐥𝐨𝐜𝐤 𝐝𝐚𝐭𝐚!", threadID);
            }
            break;

        default:
            api.sendMessage("🔧 𝐔𝐬𝐚𝐠𝐞: locknick [on/off]\n✦ 𝐨𝐧: 𝐋𝐨𝐜𝐤 𝐜𝐮𝐫𝐫𝐞𝐧𝐭 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬\n✦ 𝐨𝐟𝐟: 𝐔𝐧𝐥𝐨𝐜𝐤 𝐧𝐢𝐜𝐤𝐧𝐚𝐦𝐞𝐬", threadID);
    }
};
