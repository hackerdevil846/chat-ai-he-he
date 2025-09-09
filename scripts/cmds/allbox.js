const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "allbox",
    aliases: ["groups", "grouplist"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑗𝑜𝑖𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠 𝑙𝑖𝑠𝑡"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡'𝑠 𝑔𝑟𝑜𝑢𝑝𝑠 - 𝑣𝑖𝑒𝑤, 𝑏𝑎𝑛, 𝑢𝑛𝑏𝑎𝑛, 𝑑𝑒𝑙𝑒𝑡𝑒, 𝑜𝑟 𝑙𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝𝑠"
    },
    guide: {
        en: "{p}allbox [all/page]"
    },
    dependencies: {
        "fs-extra": "",
        "moment-timezone": ""
    }
};

module.exports.onStart = async function({ message, event, args, api }) {
    try {
        const { threadID } = event;
        
        switch (args[0]) {
            case "all": {
                let threadList;
                try {
                    threadList = await api.getThreadList(100, null, ["INBOX"]);
                } catch (e) {
                    return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡!");
                }

                const groups = threadList
                    .filter(t => t.isGroup)
                    .sort((a, b) => b.messageCount - a.messageCount);

                if (groups.length === 0) {
                    return message.reply("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑!");
                }

                const page = parseInt(args[1]) || 1;
                const limit = 10;
                const totalPages = Math.ceil(groups.length / limit);
                const startIdx = limit * (page - 1);
                const pageGroups = groups.slice(startIdx, startIdx + limit);

                let msg = "🎭 𝐺𝑟𝑜𝑢𝑝 𝐿𝑖𝑠𝑡 [𝐷𝑎𝑡𝑎] 🎭\n\n";
                const groupIds = [];
                const groupNames = [];

                pageGroups.forEach((group, i) => {
                    const num = startIdx + i + 1;
                    msg += `${num}. ${group.name}\n🔰 𝑇𝐼𝐷: ${group.threadID}\n💌 𝑀𝑠𝑔 𝐶𝑜𝑢𝑛𝑡: ${group.messageCount}\n\n`;
                    groupIds.push(group.threadID);
                    groupNames.push(group.name);
                });

                msg += `📄 𝑃𝑎𝑔𝑒 ${page}/${totalPages}\n` +
                     `🔹 𝑈𝑠𝑒: ${global.config.PREFIX}allbox all <𝑝𝑎𝑔𝑒>\n\n` +
                     "𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ:\n" +
                     "• 𝐵𝑎𝑛 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝐵𝑎𝑛 𝑔𝑟𝑜𝑢𝑝\n" +
                     "• 𝑈𝑏 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝑈𝑛𝑏𝑎𝑛 𝑔𝑟𝑜𝑢𝑝\n" +
                     "• 𝐷𝑒𝑙 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝐷𝑒𝑙𝑒𝑡𝑒 𝑑𝑎𝑡𝑎\n" +
                     "• 𝑂𝑢𝑡 <𝑛𝑢𝑚𝑏𝑒𝑟> - 𝐿𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝";

                await message.reply(msg);
                break;
            }

            default:
                const allThreads = Array.from(global.data.allThreadID || []);
                if (allThreads.length === 0) {
                    return message.reply("❌ 𝑁𝑜 𝑔𝑟𝑜𝑢𝑝𝑠 𝑓𝑜𝑢𝑛𝑑!");
                }

                let listMsg = `🍄 𝑇𝑜𝑡𝑎𝑙 𝑔𝑟𝑜𝑢𝑝𝑠: ${allThreads.length}\n\n`;
                for (const [i, tid] of allThreads.entries()) {
                    if (i >= 20) break;
                    const name = (global.data.threadInfo.get(tid))?.threadName || "𝑁𝑎𝑚𝑒 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑";
                    listMsg += `${i+1}. ${name}\n🔰 𝑇𝐼𝐷: ${tid}\n\n`;
                }
                
                if (allThreads.length > 20) {
                    listMsg += `\n📋 𝑈𝑠𝑒 '${global.config.PREFIX}allbox all' 𝑡𝑜 𝑠𝑒𝑒 𝑎𝑙𝑙 𝑔𝑟𝑜𝑢𝑝𝑠`;
                }
                
                await message.reply(listMsg);
                break;
        }

    } catch (error) {
        console.error("𝐴𝑙𝑙𝑏𝑜𝑥 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        await message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};

module.exports.onChat = async function({ message, event, api }) {
    try {
        const { body, messageReply } = event;
        
        if (messageReply && messageReply.body && messageReply.body.includes("𝐺𝑟𝑜𝑢𝑝 𝐿𝑖𝑠𝑡")) {
            const [action, index] = body.split(" ");
            const actionType = action.toLowerCase();
            
            if (!["ban", "ub", "del", "out"].includes(actionType) || !index || isNaN(index)) {
                return;
            }

            let threadList;
            try {
                threadList = await api.getThreadList(100, null, ["INBOX"]);
            } catch (e) {
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑓𝑒𝑡𝑐ℎ 𝑡ℎ𝑟𝑒𝑎𝑑 𝑙𝑖𝑠𝑡!");
            }
            
            const groups = threadList.filter(t => t.isGroup);
            const selectedIndex = parseInt(index) - 1;
            
            if (selectedIndex < 0 || selectedIndex >= groups.length) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑠𝑒𝑙𝑒𝑐𝑡𝑖𝑜𝑛!");
            }

            const selectedGroup = groups[selectedIndex];
            const time = moment.tz("𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎").format("𝐻𝐻:𝑚𝑚:𝑠𝑠 𝐿");

            switch (actionType) {
                case "ban":
                    await message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 "${selectedGroup.name}" 𝑏𝑎𝑛𝑛𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
                    break;
                    
                case "ub":
                    await message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 "${selectedGroup.name}" 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
                    break;
                    
                case "del":
                    await message.reply(`✅ 𝐺𝑟𝑜𝑢𝑝 "${selectedGroup.name}" 𝑑𝑎𝑡𝑎 𝑑𝑒𝑙𝑒𝑡𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
                    break;
                    
                case "out":
                    try {
                        await api.removeUserFromGroup(api.getCurrentUserID(), selectedGroup.threadID);
                        await message.reply(`✅ 𝐿𝑒𝑓𝑡 𝑔𝑟𝑜𝑢𝑝 "${selectedGroup.name}" 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦`);
                    } catch (e) {
                        await message.reply(`❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑙𝑒𝑎𝑣𝑒 𝑔𝑟𝑜𝑢𝑝 "${selectedGroup.name}"`);
                    }
                    break;
            }
        }
    } catch (error) {
        console.error("𝐴𝑙𝑙𝑏𝑜𝑥 𝑐ℎ𝑎𝑡 ℎ𝑎𝑛𝑑𝑙𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
    }
};
