const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "locknick",
    aliases: ["lockname", "nicklock"],
    version: "2.3.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "group",
    shortDescription: {
        en: "🔒 𝐿𝑜𝑐𝑘/𝑢𝑛𝑙𝑜𝑐𝑘 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠"
    },
    longDescription: {
        en: "𝐿𝑜𝑐𝑘 𝑜𝑟 𝑢𝑛𝑙𝑜𝑐𝑘 𝑔𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟𝑠' 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠 𝑡𝑜 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑐ℎ𝑎𝑛𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}locknick [𝑜𝑛/𝑜𝑓𝑓]"
    },
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

const OWNER_UID = "61571630409265";
const NICKNAME_LOCK_FILE = path.join(__dirname, "../data/locked_nicknames.json");

module.exports.onStart = async function ({ api, event, args }) {
    try {
        const { threadID, senderID } = event;

        // Load locked nicknames data
        const loadData = () => {
            try {
                return fs.existsSync(NICKNAME_LOCK_FILE) 
                    ? JSON.parse(fs.readFileSync(NICKNAME_LOCK_FILE, "utf8")) 
                    : {};
            } catch (error) {
                console.error("🔴 𝐿𝑜𝑎𝑑𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
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
                console.error("🔴 𝑆𝑎𝑣𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", error);
                return false;
            }
        };

        // Permission check
        if (senderID !== OWNER_UID) {
            return api.sendMessage("⛔️ 𝑂𝑛𝑙𝑦 𝑏𝑜𝑡 𝑜𝑤𝑛𝑒𝑟 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!", threadID);
        }

        const action = args[0]?.toLowerCase();
        const lockedData = loadData();

        switch (action) {
            case "on":
                if (lockedData[threadID]) {
                    return api.sendMessage("🔐 𝐴𝑙𝑟𝑒𝑎𝑑𝑦 𝑙𝑜𝑐𝑘𝑒𝑑 𝑖𝑛 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!", threadID);
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
                        api.sendMessage("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑙𝑜𝑐𝑘𝑒𝑑 𝑎𝑙𝑙 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠!", threadID);
                    } else {
                        api.sendMessage("🔴 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑙𝑜𝑐𝑘 𝑑𝑎𝑡𝑎!", threadID);
                    }
                } catch (error) {
                    console.error(error);
                    api.sendMessage("🔴 𝐸𝑟𝑟𝑜𝑟 𝑓𝑒𝑡𝑐ℎ𝑖𝑛𝑔 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜!", threadID);
                }
                break;

            case "off":
                if (!lockedData[threadID]) {
                    return api.sendMessage("🔓 𝑁𝑜 𝑙𝑜𝑐𝑘𝑒𝑑 𝑑𝑎𝑡𝑎 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝!", threadID);
                }

                delete lockedData[threadID];
                if (saveData(lockedData)) {
                    api.sendMessage("✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑙𝑜𝑐𝑘𝑒𝑑 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠!", threadID);
                } else {
                    api.sendMessage("🔴 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑠𝑎𝑣𝑒 𝑢𝑛𝑙𝑜𝑐𝑘 𝑑𝑎𝑡𝑎!", threadID);
                }
                break;

            default:
                api.sendMessage("🔧 𝑈𝑠𝑎𝑔𝑒: locknick [𝑜𝑛/𝑜𝑓𝑓]\n✦ 𝑜𝑛: 𝐿𝑜𝑐𝑘 𝑐𝑢𝑟𝑟𝑒𝑛𝑡 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠\n✦ 𝑜𝑓𝑓: 𝑈𝑛𝑙𝑜𝑐𝑘 𝑛𝑖𝑐𝑘𝑛𝑎𝑚𝑒𝑠", threadID);
        }

    } catch (error) {
        console.error("𝐿𝑜𝑐𝑘𝑛𝑖𝑐𝑘 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑡ℎ𝑒 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!", event.threadID);
    }
};
