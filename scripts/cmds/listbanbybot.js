module.exports.config = {
    name: "listban",
    aliases: ["banlist", "banned"],
    version: "1.0.3",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐵𝑎𝑛/𝑈𝑛𝑏𝑎𝑛 𝑚𝑜𝑑𝑢𝑙𝑒 𝑓𝑜𝑟 𝑎𝑑𝑚𝑖𝑛𝑠"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟𝑠 𝑎𝑛𝑑 𝑔𝑟𝑜𝑢𝑝𝑠"
    },
    guide: {
        en: "{p}listban [𝑡ℎ𝑟𝑒𝑎𝑑/𝑢𝑠𝑒𝑟]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.languages = {
    "en": {
        "no_banned_groups": "𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑡ℎ𝑒𝑟𝑒 𝑎𝑟𝑒 𝑛𝑜 𝑏𝑎𝑛𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠! ✅",
        "no_banned_users": "𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 𝑡ℎ𝑒𝑟𝑒 𝑎𝑟𝑒 𝑛𝑜 𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟𝑠! ✅",
        "invalid_order": "𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑟𝑑𝑒𝑟 𝑛𝑢𝑚𝑏𝑒𝑟! ⚠️",
        "only_initiator": "𝑂𝑛𝑙𝑦 𝑡ℎ𝑒 𝑖𝑛𝑖𝑡𝑖𝑎𝑡𝑜𝑟 𝑐𝑎𝑛 𝑢𝑠𝑒 𝑡ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑! ⚠️",
        "error_processing": "𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔! ⚠️"
    }
};

module.exports.onLoad = function () {
    if (!global.client) global.client = {};
    if (!global.client.handleReply) global.client.handleReply = [];
};

module.exports.onStart = async function ({ message, event, args, Users, Threads }) {
    const { threadID, messageID } = event;
    let listBanned = [];
    let i = 1;

    try {
        switch ((args[0] || "").toLowerCase()) {
            case "thread":
            case "t":
            case "-t": {
                const threadBanned = Array.from(global.data.threadBanned.keys());

                for (const singleThread of threadBanned) {
                    const dataThread = (await Threads.getData(singleThread)) || {};
                    const threadInfo = dataThread.threadInfo || {};
                    const nameT = threadInfo.threadName || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐺𝑟𝑜𝑢𝑝";

                    listBanned.push(`${i++}. ${nameT}\n🍂 𝑇𝐼𝐷: ${singleThread}\n𝐼𝐷: ${singleThread}`);
                }

                if (listBanned.length === 0) {
                    return message.reply(this.languages.en.no_banned_groups);
                }

                return message.reply({
                    body: `📋 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 ${listBanned.length} 𝑏𝑎𝑛𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠:\n\n${listBanned.join("\n")}\n\n📝 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑜𝑟𝑑𝑒𝑟 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛`,
                    attachment: null
                }, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "unbanthread",
                        listBanned
                    });
                });
            }

            case "user":
            case "u":
            case "-u": {
                const userBanned = Array.from(global.data.userBanned.keys());

                for (const singleUser of userBanned) {
                    const name = global.data.userName.get(singleUser) || await Users.getNameUser(singleUser) || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                    listBanned.push(`${i++}. ${name}\n🍁 𝐼𝐷: ${singleUser}\n𝐼𝐷: ${singleUser}`);
                }

                if (listBanned.length === 0) {
                    return message.reply(this.languages.en.no_banned_users);
                }

                return message.reply({
                    body: `📋 𝐶𝑢𝑟𝑟𝑒𝑛𝑡𝑙𝑦 ${listBanned.length} 𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟𝑠:\n\n${listBanned.join("\n")}\n\n📝 𝑅𝑒𝑝𝑙𝑦 𝑤𝑖𝑡ℎ 𝑜𝑟𝑑𝑒𝑟 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛`,
                    attachment: null
                }, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "unbanuser",
                        listBanned
                    });
                });
            }

            default: {
                const helpMessage = `» 𝐵𝑎𝑛 𝑀𝑜𝑑𝑢𝑙𝑒 «\n━━━━━━━━━━━━━━━━━━\n🔹 𝑈𝑠𝑎𝑔𝑒: ${global.config.PREFIX || "!"}listban [option]\n\n🔸 𝑂𝑝𝑡𝑖𝑜𝑛𝑠:\n  • 𝑡ℎ𝑟𝑒𝑎𝑑 / 𝑡 - 𝑆ℎ𝑜𝑤 𝑏𝑎𝑛𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝𝑠\n  • 𝑢𝑠𝑒𝑟 / 𝑢   - 𝑆ℎ𝑜𝑤 𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟𝑠\n\n📝 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎 𝑙𝑖𝑠𝑡𝑒𝑑 𝑖𝑡𝑒𝑚 𝑤𝑖𝑡ℎ 𝑖𝑡𝑠 𝑜𝑟𝑑𝑒𝑟 𝑛𝑢𝑚𝑏𝑒𝑟 𝑡𝑜 𝑢𝑛𝑏𝑎𝑛`;
                return message.reply(helpMessage);
            }
        }
    } catch (error) {
        console.error(error);
        return message.reply(this.languages.en.error_processing);
    }
};

module.exports.onReply = async function ({ event, message, handleReply, Users, Threads }) {
    const { threadID, messageID, senderID, body } = event;

    try {
        if (parseInt(senderID) !== parseInt(handleReply.author)) {
            return message.reply(this.languages.en.only_initiator);
        }

        const orderNumber = parseInt(body.trim());
        if (isNaN(orderNumber) || orderNumber < 1 || orderNumber > handleReply.listBanned.length) {
            return message.reply(this.languages.en.invalid_order);
        }

        const selectedItem = handleReply.listBanned[orderNumber - 1];
        const idMatch = selectedItem.match(/(\d{4,})/);
        if (!idMatch) {
            return message.reply("𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑒𝑥𝑡𝑟𝑎𝑐𝑡 𝐼𝐷! ⚠️");
        }

        const targetID = idMatch[1];
        const userName = await Users.getNameUser(senderID);
        let targetName = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";

        switch (handleReply.type) {
            case "unbanthread": {
                const threadInfo = await Threads.getInfo(targetID);
                targetName = (threadInfo && threadInfo.threadName) ? threadInfo.threadName : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝐺𝑟𝑜𝑢𝑝";

                const threadDataObj = (await Threads.getData(targetID)) || {};
                const threadData = threadDataObj.data || {};
                threadData.banned = false;
                threadData.reason = null;
                threadData.dateAdded = null;

                await Threads.setData(targetID, { data: threadData });
                if (global.data && global.data.threadBanned) global.data.threadBanned.delete(targetID);

                message.reply({
                    body: `» 𝑁𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑡ℎ𝑖𝑠 𝑏𝑜𝑡 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝\n\n- 𝑇ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 '${targetName}' ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑`,
                    attachment: null
                }, targetID);

                return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠\n━━━━━━━━━━━━━━━━━━\n${userName} 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑔𝑟𝑜𝑢𝑝:\n→ ${targetName}`);
            }

            case "unbanuser": {
                targetName = await Users.getNameUser(targetID) || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";

                const userDataObj = (await Users.getData(targetID)) || {};
                const userData = userDataObj.data || {};
                userData.banned = false;
                userData.reason = null;
                userData.dateAdded = null;

                await Users.setData(targetID, { data: userData });
                if (global.data && global.data.userBanned) global.data.userBanned.delete(targetID);

                message.reply({
                    body: `» 𝑁𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑡𝑖𝑜𝑛 «\n━━━━━━━━━━━━━━━━━━\n${userName} 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑦𝑜𝑢 𝑓𝑟𝑜𝑚 𝑎𝑑𝑚𝑖𝑛\n\n- 𝑌𝑜𝑢'𝑣𝑒 𝑏𝑒𝑒𝑛 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑏𝑜𝑡`,
                    attachment: null
                }, targetID);

                return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠\n━━━━━━━━━━━━━━━━━━\n${userName} 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑢𝑛𝑏𝑎𝑛𝑛𝑒𝑑 𝑢𝑠𝑒𝑟:\n→ ${targetName}`);
            }

            default:
                return message.reply(this.languages.en.error_processing);
        }
    } catch (error) {
        console.error(error);
        return message.reply(this.languages.en.error_processing);
    }
};
