const fs = require("fs-extra");
const path = require("path");

const OWNER_UID = "61571630409265"; // Your UID

const NICKNAME_LOCK_FILE = path.join(__dirname, "../data/locked_nicknames.json");

function loadLockedNicknames() {
    try {
        if (fs.existsSync(NICKNAME_LOCK_FILE)) {
            return JSON.parse(fs.readFileSync(NICKNAME_LOCK_FILE, "utf8"));
        }
    } catch (error) {
        console.error("𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓:", error);
    }
    return {};
}

function saveLockedNicknames(data) {
    try {
        fs.ensureFileSync(NICKNAME_LOCK_FILE);
        fs.writeFileSync(NICKNAME_LOCK_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒔𝒂𝒗𝒆 𝒆𝒓𝒓𝒐𝒓:", error);
    }
}

module.exports.config = {
    name: "locknick",
    version: "2.3.0",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅",
    description: "𝑮𝒓𝒐𝒖𝒑 𝒆𝒓 𝒔𝒐𝒃𝒂𝒊𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒂𝒕𝒉𝒂𝒃𝒂 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒖𝒏",
    commandCategory: "𝑮𝒓𝒐𝒖𝒑",
    usages: "𝒍𝒐𝒄𝒌𝒏𝒊𝒄𝒌 [𝒐𝒏/𝒐𝒇𝒇]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, senderID } = event;
    const subcmd = args[0] ? args[0].toLowerCase() : "";
    
    let lockedNicknames = loadLockedNicknames();

    // Owner permission check
    if (senderID !== OWNER_UID) {
        return api.sendMessage("⛔ 𝑺𝒊𝒓𝒇 𝒎𝒂𝒍𝒊𝒌 𝒆𝒊 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒖𝒔𝒆 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒃𝒆!", threadID);
    }

    switch (subcmd) {
        case "on": {
            if (lockedNicknames[threadID]) {
                return api.sendMessage("🔒 𝑨𝒊 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒂𝒈𝒆𝒓 𝒆𝒊 𝒍𝒐𝒄𝒌 𝒂𝒄𝒉𝒆!", threadID);
            }

            try {
                const threadInfo = await api.getThreadInfo(threadID);
                if (!threadInfo || !threadInfo.userInfo) {
                    return api.sendMessage("𝑮𝒓𝒐𝒖𝒑 𝒊𝒏𝒇𝒐 𝒑𝒂𝒘𝒂 𝒋𝒂𝒄𝒄𝒉𝒆 𝒏𝒂 😢", threadID);
                }

                const currentNicks = {};
                for (const user of threadInfo.userInfo) {
                    if (user.id !== api.getCurrentUserID()) {
                        currentNicks[user.id] = user.nickname || "";
                    }
                }

                lockedNicknames[threadID] = currentNicks;
                saveLockedNicknames(lockedNicknames);

                return api.sendMessage("🔒 𝑨𝒊 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒔𝒐𝒃𝒂𝒊𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐 ✅", threadID);

            } catch (error) {
                console.error("𝑳𝒐𝒄𝒌𝒏𝒊𝒄𝒌 𝒆𝒓𝒓𝒐𝒓:", error);
                return api.sendMessage("𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊 😢", threadID);
            }
        }

        case "off": {
            if (!lockedNicknames[threadID]) {
                return api.sendMessage("⚠️ 𝑨𝒊 𝒈𝒓𝒐𝒖𝒑 𝒆𝒓 𝒏𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒏𝒆𝒊!", threadID);
            }

            try {
                delete lockedNicknames[threadID];
                saveLockedNicknames(lockedNicknames);
                return api.sendMessage("✅ 𝑵𝒊𝒄𝒌𝒏𝒂𝒎𝒆 𝒍𝒐𝒄𝒌 𝒖𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒂 𝒉𝒐𝒍𝒐", threadID);
            } catch (error) {
                console.error("𝑼𝒏𝒍𝒐𝒄𝒌𝒏𝒊𝒄𝒌 𝒆𝒓𝒓𝒐𝒓:", error);
                return api.sendMessage("𝑼𝒏𝒍𝒐𝒄𝒌 𝒌𝒐𝒓𝒕𝒆 𝒑𝒂𝒓𝒄𝒉𝒊𝒏𝒊 😢", threadID);
            }
        }

        default:
            return api.sendMessage("❌ 𝑽𝒖𝒍 𝒍𝒆𝒌𝒉𝒆𝒏: 𝒍𝒐𝒄𝒌𝒏𝒊𝒄𝒌 𝒐𝒏/𝒐𝒇𝒇", threadID);
    }
};
