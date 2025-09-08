const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "admin",
    aliases: ["adm", "botadmin"],
    version: "1.0.5",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 2,
    category: "admin",
    shortDescription: {
        en: "𝐵𝑜𝑡 𝑎𝑑𝑚𝑖𝑛 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡"
    },
    longDescription: {
        en: "𝑀𝑎𝑛𝑎𝑔𝑒 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠"
    },
    guide: {
        en: "{p}admin [list/add/remove] [userID]"
    },
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.langs = {
    "en": {
        "listAdmin": "[ 𝐴𝐷𝑀𝐼𝑁 ] 𝐴𝑑𝑚𝑖𝑛 𝑙𝑖𝑠𝑡: \n\n%1",
        "notHavePermssion": "[ 𝐴𝐷𝑀𝐼𝑁 ] 𝑌𝑜𝑢 𝑑𝑜𝑛'𝑡 ℎ𝑎𝑣𝑒 𝑝𝑒𝑟𝑚𝑖𝑠𝑠𝑖𝑜𝑛 𝑡𝑜 𝑢𝑠𝑒 \"%1\" 😿",
        "addedNewAdmin": "[ 𝐴𝐷𝑀𝐼𝑁 ] 𝐴𝑑𝑑𝑒𝑑 %1 𝑎𝑑𝑚𝑖𝑛:\n\n%2",
        "removedAdmin": "[ 𝐴𝐷𝑀𝐼𝑁 ] 𝑅𝑒𝑚𝑜𝑣𝑒𝑑 %1 𝑎𝑑𝑚𝑖𝑛:\n\n%2"
    }
};

module.exports.onStart = async function({ message, event, args, usersData, getLang }) {
    try {
        const configPath = path.join(__dirname, '..', '..', 'config.json');
        
        // Load config safely
        let config = {};
        try {
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }
        } catch (e) {
            console.error("𝐶𝑜𝑛𝑓𝑖𝑔 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟:", e);
            return message.reply("❌ 𝐶𝑜𝑛𝑓𝑖𝑔 𝑓𝑖𝑙𝑒 𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟");
        }

        // Ensure ADMINBOT array exists
        if (!config.ADMINBOT) config.ADMINBOT = [];
        if (!global.config.ADMINBOT) global.config.ADMINBOT = [];

        const { mentions } = event;
        const mention = Object.keys(mentions);

        switch (args[0]) {
            case "list":
            case "all":
            case "-a": {
                const listAdmin = config.ADMINBOT || [];
                const msg = [];

                for (const idAdmin of listAdmin) {
                    if (idAdmin) {
                        try {
                            const userInfo = await usersData.get(idAdmin);
                            const name = userInfo.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                            msg.push(`- ${name} (${idAdmin})`);
                        } catch (error) {
                            msg.push(`- 𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟 (${idAdmin})`);
                        }
                    }
                }

                return message.reply(getLang("listAdmin", msg.join("\n") || "𝑁𝑜 𝑎𝑑𝑚𝑖𝑛𝑠 𝑓𝑜𝑢𝑛𝑑"));
            }

            case "add": {
                // Check if user is bot admin
                if (!config.ADMINBOT.includes(event.senderID.toString())) {
                    return message.reply(getLang("notHavePermssion", "𝑎𝑑𝑑"));
                }

                if (mention.length > 0) {
                    const listAdd = [];

                    for (const id of mention) {
                        if (!config.ADMINBOT.includes(id)) {
                            config.ADMINBOT.push(id);
                            global.config.ADMINBOT.push(id);
                            const userName = mentions[id] || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                            listAdd.push(`[ ${id} ] » ${userName}`);
                        }
                    }

                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return message.reply(getLang("addedNewAdmin", mention.length, listAdd.join("\n")));
                }
                else if (args[1] && !isNaN(args[1])) {
                    const targetID = args[1];
                    if (!config.ADMINBOT.includes(targetID)) {
                        config.ADMINBOT.push(targetID);
                        global.config.ADMINBOT.push(targetID);
                        
                        try {
                            const userInfo = await usersData.get(targetID);
                            const name = userInfo.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                            return message.reply(getLang("addedNewAdmin", 1, `[ ${targetID} ] » ${name}`));
                        } catch (error) {
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                            return message.reply(getLang("addedNewAdmin", 1, `[ ${targetID} ] » 𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟`));
                        }
                    } else {
                        return message.reply("❌ 𝑈𝑠𝑒𝑟 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛");
                    }
                }
                else {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒. 𝑈𝑠𝑒: 𝑎𝑑𝑚𝑖𝑛 𝑎𝑑𝑑 [𝑢𝑠𝑒𝑟𝐼𝐷/@𝑡𝑎𝑔]");
                }
            }

            case "remove":
            case "rm":
            case "delete": {
                // Check if user is bot admin
                if (!config.ADMINBOT.includes(event.senderID.toString())) {
                    return message.reply(getLang("notHavePermssion", "𝑑𝑒𝑙𝑒𝑡𝑒"));
                }
                
                if (mention.length > 0) {
                    const listRemove = [];

                    for (const id of mention) {
                        const index = config.ADMINBOT.indexOf(id);
                        if (index !== -1) {
                            config.ADMINBOT.splice(index, 1);
                            global.config.ADMINBOT.splice(index, 1);
                            const userName = mentions[id] || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                            listRemove.push(`[ ${id} ] » ${userName}`);
                        }
                    }

                    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return message.reply(getLang("removedAdmin", mention.length, listRemove.join("\n")));
                }
                else if (args[1] && !isNaN(args[1])) {
                    const targetID = args[1];
                    const index = config.ADMINBOT.indexOf(targetID);
                    if (index !== -1) {
                        config.ADMINBOT.splice(index, 1);
                        global.config.ADMINBOT.splice(index, 1);
                        
                        try {
                            const userInfo = await usersData.get(targetID);
                            const name = userInfo.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟";
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                            return message.reply(getLang("removedAdmin", 1, `[ ${targetID} ] » ${name}`));
                        } catch (error) {
                            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                            return message.reply(getLang("removedAdmin", 1, `[ ${targetID} ] » 𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑈𝑠𝑒𝑟`));
                        }
                    } else {
                        return message.reply("❌ 𝑈𝑠𝑒𝑟 𝑖𝑠 𝑛𝑜𝑡 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛");
                    }
                }
                else {
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑎𝑔𝑒. 𝑈𝑠𝑒: 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 [𝑢𝑠𝑒𝑟𝐼𝐷/@𝑡𝑎𝑔]");
                }
            }

            default: {
                const helpMessage = `🤖 𝐴𝑑𝑚𝑖𝑛 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐻𝑒𝑙𝑝:
━━━━━━━━━━━━━━━━
📋 𝑎𝑑𝑚𝑖𝑛 𝑙𝑖𝑠𝑡 - 𝑆ℎ𝑜𝑤 𝑎𝑙𝑙 𝑎𝑑𝑚𝑖𝑛𝑠
👥 𝑎𝑑𝑚𝑖𝑛 𝑎𝑑𝑑 [@𝑡𝑎𝑔/𝐼𝐷] - 𝐴𝑑𝑑 𝑛𝑒𝑤 𝑎𝑑𝑚𝑖𝑛
🗑️ 𝑎𝑑𝑚𝑖𝑛 𝑟𝑒𝑚𝑜𝑣𝑒 [@𝑡𝑎𝑔/𝐼𝐷] - 𝑅𝑒𝑚𝑜𝑣𝑒 𝑎𝑑𝑚𝑖𝑛`;
                    
                return message.reply(helpMessage);
            }
        }

    } catch (error) {
        console.error("𝐴𝑑𝑚𝑖𝑛 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
        return message.reply("❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.");
    }
};
