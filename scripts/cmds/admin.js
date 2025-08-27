const fs = require("fs-extra");

module.exports.config = {
    name: "admin",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "𝑨𝒔𝒊𝒇 𝑴𝒂𝒉𝒎𝒖𝒅", // Updated with stylish font
    description: "𝑩𝒐𝒕 𝒌𝒆 𝑨𝒅𝒎𝒊𝒏 𝒎𝒂𝒏𝒂𝒈𝒆 𝒌𝒐𝒓𝒖𝒏", // Banglish description
    category: "config",
    usages: "[list/add/remove] [userID]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "listAdmin": '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑨𝒅𝒎𝒊𝒏 𝒍𝒊𝒔𝒕: \n\n%1',
        "notHavePermssion": '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑨𝒑𝒏𝒂𝒓 "%1" 𝒖𝒔𝒆 𝒌𝒐𝒓𝒂𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒏𝒆𝒊 😿',
        "addedNewAdmin": '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑨𝒅𝒅𝒆𝒅 %1 𝑨𝒅𝒎𝒊𝒏 :\n\n%2',
        "removedAdmin": '[ 𝑨𝒅𝒎𝒊𝒏 ] 𝑹𝒆𝒎𝒐𝒗𝒆𝒅 %1 𝑨𝒅𝒎𝒊𝒏:\n\n%2'
    }
};

module.exports.run = async function ({ api, event, args, usersData, getText }) {
    const content = args.slice(1, args.length);
    const { threadID, messageID, mentions } = event;
    const configPath = `${__dirname}/../../config.json`; // Fixed path
    const { ADMINBOT } = global.config;
    const { writeFileSync } = require("fs-extra");
    const mention = Object.keys(mentions);
    
    // Load config safely
    let config = {};
    try {
        config = require(configPath);
    } catch (e) {
        console.error("Config load error:", e);
        return api.sendMessage("❌ 𝑪𝒐𝒏𝒇𝒊𝒈 𝒇𝒊𝒍𝒆 𝒍𝒐𝒂𝒅 𝒆𝒓𝒓𝒐𝒓", threadID, messageID);
    }

    // Ensure ADMINBOT array exists
    if (!config.ADMINBOT) config.ADMINBOT = [];
    if (!global.config.ADMINBOT) global.config.ADMINBOT = [];

    switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
            const listAdmin = ADMINBOT || config.ADMINBOT || [];
            var msg = [];

            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = await usersData.getName(idAdmin);
                    msg.push(`- ${name} (https://facebook.com/${idAdmin})`);
                }
            }

            return api.sendMessage(getText("listAdmin", msg.join("\n")), threadID, messageID);
        }

        case "add": {
            // Check if user is bot admin
            if (!config.ADMINBOT.includes(event.senderID.toString())) {
                return api.sendMessage(getText("notHavePermssion", "𝒂𝒅𝒅"), threadID, messageID);
            }

            if (mention.length !== 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    if (!config.ADMINBOT.includes(id)) {
                        config.ADMINBOT.push(id);
                        global.config.ADMINBOT.push(id);
                        listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
                    }
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length !== 0 && !isNaN(content[0])) {
                if (!config.ADMINBOT.includes(content[0])) {
                    config.ADMINBOT.push(content[0]);
                    global.config.ADMINBOT.push(content[0]);
                    const name = await usersData.getName(content[0]);
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(getText("addedNewAdmin", 1, `[ ${content[0]} ] » ${name}`), threadID, messageID);
                } else {
                    return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏", threadID, messageID);
                }
            }
            else {
                return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆. 𝑼𝒔𝒆: 𝒂𝒅𝒎𝒊𝒏 𝒂𝒅𝒅 [𝒖𝒔𝒆𝒓𝑰𝑫/@𝒕𝒂𝒈]", threadID, messageID);
            }
        }

        case "god": {
            const god = ["61571630409265"]; // Keep original god IDs
            if (!god.includes(event.senderID.toString())) {
                return api.sendMessage(getText("notHavePermssion", "𝒂𝒅𝒅"), threadID, messageID);
            }

            if (mention.length !== 0 && isNaN(content[0])) {
                var listGod = [];

                for (const id of mention) {
                    if (!config.ADMINBOT.includes(id)) {
                        config.ADMINBOT.push(id);
                        global.config.ADMINBOT.push(id);
                        listGod.push(`[ ${id} ] » ${event.mentions[id]}`);
                    }
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listGod.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length !== 0 && !isNaN(content[0])) {
                if (!config.ADMINBOT.includes(content[0])) {
                    config.ADMINBOT.push(content[0]);
                    global.config.ADMINBOT.push(content[0]);
                    const name = await usersData.getName(content[0]);
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(getText("addedNewAdmin", 1, `[ ${content[0]} ] » ${name}`), threadID, messageID);
                } else {
                    return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝒂𝒍𝒓𝒆𝒂𝒅𝒚 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏", threadID, messageID);
                }
            }
            else {
                return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆. 𝑼𝒔𝒆: 𝒂𝒅𝒎𝒊𝒏 𝒈𝒐𝒅 [𝒖𝒔𝒆𝒓𝑰𝑫/@𝒕𝒂𝒈]", threadID, messageID);
            }
        }

        case "remove":
        case "rm":
        case "delete": {
            // Check if user is bot admin
            if (!config.ADMINBOT.includes(event.senderID.toString())) {
                return api.sendMessage(getText("notHavePermssion", "𝒅𝒆𝒍𝒆𝒕𝒆"), threadID, messageID);
            }
            
            if (mention.length !== 0 && isNaN(content[0])) {
                var listRemove = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item === id);
                    if (index !== -1) {
                        config.ADMINBOT.splice(index, 1);
                        global.config.ADMINBOT.splice(index, 1);
                        listRemove.push(`[ ${id} ] » ${event.mentions[id]}`);
                    }
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listRemove.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length !== 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() === content[0]);
                if (index !== -1) {
                    config.ADMINBOT.splice(index, 1);
                    global.config.ADMINBOT.splice(index, 1);
                    const name = await usersData.getName(content[0]);
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(getText("removedAdmin", 1, `[ ${content[0]} ] » ${name}`), threadID, messageID);
                } else {
                    return api.sendMessage("❌ 𝑼𝒔𝒆𝒓 𝒊𝒔 𝒏𝒐𝒕 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏", threadID, messageID);
                }
            }
            else {
                return api.sendMessage("❌ 𝑰𝒏𝒗𝒂𝒍𝒊𝒅 𝒖𝒔𝒂𝒈𝒆. 𝑼𝒔𝒆: 𝒂𝒅𝒎𝒊𝒏 𝒓𝒆𝒎𝒐𝒗𝒆 [𝒖𝒔𝒆𝒓𝑰𝑫/@𝒕𝒂𝒈]", threadID, messageID);
            }
        }

        default: {
            const helpMessage = `🤖 𝑨𝒅𝒎𝒊𝒏 𝑪𝒐𝒎𝒎𝒂𝒏𝒅 𝑯𝒆𝒍𝒑:
━━━━━━━━━━━━━━━━
📋 𝒂𝒅𝒎𝒊𝒏 𝒍𝒊𝒔𝒕 - 𝑺𝒉𝒐𝒘 𝒂𝒍𝒍 𝒂𝒅𝒎𝒊𝒏𝒔
👥 𝒂𝒅𝒎𝒊𝒏 𝒂𝒅𝒅 [@𝒕𝒂𝒈/𝑰𝑫] - 𝑨𝒅𝒅 𝒏𝒆𝒘 𝒂𝒅𝒎𝒊𝒏
🗑️ 𝒂𝒅𝒎𝒊𝒏 𝒓𝒆𝒎𝒐𝒗𝒆 [@𝒕𝒂𝒈/𝑰𝑫] - 𝑹𝒆𝒎𝒐𝒗𝒆 𝒂𝒅𝒎𝒊𝒏
⚡ 𝒂𝒅𝒎𝒊𝒏 𝒈𝒐𝒅 [@𝒕𝒂𝒈/𝑰𝑫] - 𝑮𝒐𝒅 𝒎𝒐𝒅𝒆 (𝒐𝒏𝒍𝒚 𝒇𝒐𝒓 𝒅𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓)`;
            
            return api.sendMessage(helpMessage, threadID, messageID);
        }
    }
};
