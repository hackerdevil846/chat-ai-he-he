const moment = require("moment-timezone");

module.exports.config = {
    name: "otherbots",
    aliases: ["botdetect", "antibot"],
    version: "1.1.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑠𝑦𝑠𝑡𝑒𝑚",
    shortDescription: {
        en: "🛡️ 𝑂𝑡ℎ𝑒𝑟 𝐵𝑜𝑡𝑠 𝐷𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛 & 𝐴𝑢𝑡𝑜-𝐵𝑎𝑛 𝑆𝑦𝑠𝑡𝑒𝑚"
    },
    longDescription: {
        en: "🛡️ 𝑂𝑡ℎ𝑒𝑟 𝐵𝑜𝑡𝑠 𝐷𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛 & 𝐴𝑢𝑡𝑜-𝐵𝑎𝑛 𝑆𝑦𝑠𝑡𝑒𝑚"
    },
    guide: {
        en: "{p}otherbots [info|status]"
    },
    dependencies: {
        "moment-timezone": ""
    },
    envConfig: {
        autoBan: true,
        notifyAdmins: true,
        logBans: true
    }
};

module.exports.languages = {
    "en": {
        "banMessage": "🛡️ 𝐵𝑜𝑡 𝐷𝑒𝑡𝑒𝑐𝑡𝑒𝑑!\n\n%1, 𝑌𝑜𝑢 ℎ𝑎𝑣𝑒 𝑏𝑒𝑒𝑛 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑎𝑠 𝑎𝑛𝑜𝑡ℎ𝑒𝑟 𝑏𝑜𝑡! 𝑌𝑜𝑢𝑟 𝑎𝑐𝑐𝑜𝑢𝑛𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑏𝑎𝑛𝑛𝑒𝑑 𝑡𝑜 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑠𝑝𝑎𝑚𝑚𝑖𝑛𝑔. 😔",
        "adminAlert": "⚠️ 𝑁𝑒𝑤 𝐵𝑜𝑡 𝐵𝑎𝑛𝑛𝑒𝑑 ⚠️\n\n👤 𝑁𝑎𝑚𝑒: %1\n🆔 𝐵𝑜𝑡 𝑈𝐼𝐷: %2\n📅 𝐷𝑎𝑡𝑒: %3\n\n𝑇ℎ𝑖𝑠 𝑢𝑠𝑒𝑟 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑎𝑠 𝑎𝑛 𝑜𝑡ℎ𝑒𝑟 𝑏𝑜𝑡 𝑎𝑛𝑑 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑏𝑎𝑛𝑛𝑒𝑑! 🔒",
        "infoMessage": "ℹ️ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐼𝑛𝑓𝑜:\n\n𝑇ℎ𝑖𝑠 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑎𝑢𝑡𝑜𝑚𝑎𝑡𝑖𝑐𝑎𝑙𝑙𝑦 𝑑𝑒𝑡𝑒𝑐𝑡𝑠 𝑎𝑛𝑑 𝑏𝑎𝑛𝑠 𝑜𝑡ℎ𝑒𝑟 𝑏𝑜𝑡𝑠 𝑡𝑜 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑠𝑝𝑎𝑚𝑚𝑖𝑛𝑔. 𝑁𝑜 𝑎𝑑𝑑𝑖𝑡𝑖𝑜𝑛𝑎𝑙 𝑎𝑐𝑡𝑖𝑜𝑛 𝑖𝑠 𝑟𝑒𝑞𝑢𝑖𝑟𝑒𝑑. 🔍\n\n📊 𝑆𝑡𝑎𝑡𝑢𝑠: %1",
        "statusActive": "✅ 𝐴𝑐𝑡𝑖𝑣𝑒",
        "statusInactive": "❌ 𝐼𝑛𝑎𝑐𝑡𝑖𝑣𝑒",
        "errorMessage": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑: %1"
    }
};

module.exports.onLoad = function() {
    console.log('🛡️ 𝑂𝑡ℎ𝑒𝑟𝐵𝑜𝑡𝑠 𝐷𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑆𝑦𝑠𝑡𝑒𝑚 𝐿𝑜𝑎𝑑𝑒𝑑 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦!');
};

module.exports.onChat = async function({ event, api, Users }) {
    try {
        const { threadID, messageID, senderID, body } = event;
        
        if (senderID === api.getCurrentUserID()) return;
        
        if (!this.config.envConfig.autoBan) return;

        const botTriggers = [
            "your keyboard level has reached level",
            "Command not found",
            "The command you used",
            "Uy may lumipad",
            "Unsend this message",
            "You are unable to use bot",
            "»» NOTICE «« Update user nicknames",
            "just removed 1 Attachments",
            "message removedcontent",
            "The current preset is",
            "Here Is My Prefix",
            "just removed 1 attachment.",
            "Unable to re-add members",
            "removed 1 message content:",
            "Here's your music, enjoy!🥰",
            "Ye Raha Aapka Music, enjoy!🥰",
            "your keyboard Power level Up",
            "bot ki mc",
            "your keyboard hero level has reached level"
        ];

        if (botTriggers.some(trigger => body && body.includes(trigger))) {
            const userName = await Users.getNameUser(senderID);
            const time = moment.tz("Asia/Dhaka").format("HH:MM:ss DD/MM/YYYY");

            const userData = await Users.getData(senderID);
            userData.banned = 1;
            userData.reason = "𝑂𝑡ℎ𝑒𝑟 𝐵𝑜𝑡 𝐷𝑒𝑡𝑒𝑐𝑡𝑒𝑑";
            userData.dateAdded = time;
            await Users.setData(senderID, userData);

            if (!global.data.userBanned) global.data.userBanned = new Map();
            global.data.userBanned.set(senderID, {
                reason: userData.reason,
                dateAdded: userData.dateAdded
            });

            api.sendMessage({
                body: this.languages.en.banMessage.replace("%1", userName)
            }, threadID, messageID);

            if (this.config.envConfig.notifyAdmins && global.config.ADMINBOT) {
                global.config.ADMINBOT.forEach(adminID => {
                    api.sendMessage(
                        this.languages.en.adminAlert
                            .replace("%1", userName)
                            .replace("%2", senderID)
                            .replace("%3", time),
                        adminID
                    );
                });
            }

            if (this.config.envConfig.logBans) {
                console.log(`[🛡️ 𝐵𝑂𝑇 𝐵𝐴𝑁𝑁𝐸𝐷] ${userName} (${senderID}) at ${time}`);
            }
        }
    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝐶ℎ𝑎𝑡:", error);
    }
};

module.exports.onStart = async function({ api, event, args }) {
    try {
        const status = this.config.envConfig.autoBan ? 
            this.languages.en.statusActive : 
            this.languages.en.statusInactive;
            
        return api.sendMessage(
            this.languages.en.infoMessage.replace("%1", status),
            event.threadID,
            event.messageID
        );
    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝑆𝑡𝑎𝑟𝑡:", error);
        api.sendMessage(
            this.languages.en.errorMessage.replace("%1", error.message),
            event.threadID,
            event.messageID
        );
    }
};
