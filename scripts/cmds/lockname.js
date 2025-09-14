const OWNER_UID = "61571630409265";

module.exports.config = {
    name: "lockname",
    aliases: ["lockgroup", "grouplock"],
    version: "1.0.1",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 3,
    role: 2,
    category: "group",
    shortDescription: {
        en: "🔒 𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒 𝐿𝑜𝑐𝑘 𝑆𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "𝐿𝑜𝑐𝑘 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑢𝑛𝑎𝑢𝑡ℎ𝑜𝑟𝑖𝑧𝑒𝑑 𝑐ℎ𝑎𝑛𝑔𝑒𝑠"
    },
    guide: {
        en: "{p}lockname [lock/unlock/reset] [name]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

const lockedGroups = new Map();

module.exports.onLoad = function() {
    console.log('🔒 𝐿𝑜𝑐𝑘𝑛𝑎𝑚𝑒 𝑀𝑜𝑑𝑢𝑙𝑒 𝐿𝑜𝑎𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦');
}

module.exports.handleEvent = async function({ event, api }) {
    try {
        if (event.type === "event" && event.logMessageType === "log:thread-name") {
            const { threadID, logMessageData } = event;
            if (lockedGroups.has(threadID)) {
                const lockedName = lockedGroups.get(threadID);
                if (logMessageData.name !== lockedName) {
                    await api.setTitle(lockedName, threadID);
                    api.sendMessage(
                        `⚠️ 𝑁𝑎𝑚𝑒 𝐴𝑢𝑡𝑜-𝑅𝑒𝑠𝑒𝑡!\n𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜: ${lockedName}`,
                        threadID
                    );
                }
            }
        }
    } catch (error) {
        console.error("𝐸𝑣𝑒𝑛𝑡 𝐻𝑎𝑛𝑑𝑙𝑒𝑟 𝐸𝑟𝑟𝑜𝑟:", error);
    }
}

module.exports.onStart = async function({ api, event, args }) {
    try {
        const { threadID, senderID } = event;
        
        if (senderID !== OWNER_UID) {
            return api.sendMessage("⛔ 𝐴𝑐𝑐𝑒𝑠𝑠 𝐷𝑒𝑛𝑖𝑒𝑑!\n𝑂𝑛𝑙𝑦 𝑏𝑜𝑡 𝑜𝑤𝑛𝑒𝑟 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑!", threadID, event.messageID);
        }

        const action = args[0]?.toLowerCase();
        const name = args.slice(1).join(" ");

        if (!action) {
            return api.sendMessage(
                "🔧 𝑈𝑠𝑎𝑔𝑒 𝐺𝑢𝑖𝑑𝑒:\n" +
                "• lockname lock [name]\n" +
                "• lockname unlock\n" +
                "• lockname reset",
                threadID, event.messageID
            );
        }

        switch (action) {
            case "lock":
                if (!name) return api.sendMessage("📛 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑡𝑜 𝑙𝑜𝑐𝑘!", threadID, event.messageID);
                
                lockedGroups.set(threadID, name);
                await api.setTitle(name, threadID);
                api.sendMessage(
                    `✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝐿𝑜𝑐𝑘𝑒𝑑\n𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑙𝑜𝑐𝑘𝑒𝑑 𝑎𝑠: ${name}`,
                    threadID, event.messageID
                );
                break;

            case "unlock":
                if (!lockedGroups.has(threadID)) {
                    return api.sendMessage("🔓 𝐴𝑙𝑟𝑒𝑎𝑑𝑦 𝑈𝑛𝑙𝑜𝑐𝑘𝑒𝑑!\n𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑖𝑠 𝑛𝑜𝑡 𝑙𝑜𝑐𝑘𝑒𝑑.", threadID, event.messageID);
                }
                
                lockedGroups.delete(threadID);
                api.sendMessage(
                    "✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑈𝑛𝑙𝑜𝑐𝑘𝑒𝑑\n𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑙𝑜𝑐𝑘 𝑟𝑒𝑚𝑜𝑣𝑒𝑑.",
                    threadID, event.messageID
                );
                break;

            case "reset":
                if (!lockedGroups.has(threadID)) {
                    return api.sendMessage("⚠️ 𝑁𝑜 𝐿𝑜𝑐𝑘 𝐹𝑜𝑢𝑛𝑑!\n𝑁𝑜 𝑙𝑜𝑐𝑘𝑒𝑑 𝑛𝑎𝑚𝑒 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝑡ℎ𝑖𝑠 𝑔𝑟𝑜𝑢𝑝.", threadID, event.messageID);
                }
                
                const lockedName = lockedGroups.get(threadID);
                await api.setTitle(lockedName, threadID);
                api.sendMessage(
                    `🔁 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑅𝑒𝑠𝑒𝑡\n𝐺𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒 𝑟𝑒𝑠𝑒𝑡 𝑡𝑜: ${lockedName}`,
                    threadID, event.messageID
                );
                break;

            default:
                api.sendMessage(
                    "❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝐴𝑐𝑡𝑖𝑜𝑛!\n𝑈𝑠𝑒: lockname [lock/unlock/reset]",
                    threadID, event.messageID
                );
        }
    } catch (error) {
        console.error("𝐿𝑜𝑐𝑘𝑛𝑎𝑚𝑒 𝐸𝑟𝑟𝑜𝑟:", error);
        api.sendMessage("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑝𝑟𝑜𝑐𝑒𝑠𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.", event.threadID, event.messageID);
    }
};
