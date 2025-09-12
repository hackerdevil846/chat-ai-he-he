const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");
const path = require("path");
const FormData = require("form-data");

module.exports.config = {
    name: "callad",
    aliases: ["report", "admin"],
    version: "2.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
    shortDescription: {
        en: "𝑅𝑒𝑝𝑜𝑟𝑡 𝑏𝑢𝑔𝑠 𝑜𝑟 𝑐𝑜𝑛𝑡𝑎𝑐𝑡 𝑎𝑑𝑚𝑖𝑛𝑠"
    },
    longDescription: {
        en: "𝑆𝑒𝑛𝑑 𝑟𝑒𝑝𝑜𝑟𝑡𝑠 𝑜𝑟 𝑚𝑒𝑠𝑠𝑎𝑔𝑒𝑠 𝑡𝑜 𝑏𝑜𝑡 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟𝑠"
    },
    guide: {
        en: "{p}callad [𝑚𝑒𝑠𝑠𝑎𝑔𝑒]"
    },
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "moment-timezone": "",
        "form-data": ""
    },
    envConfig: {
        maxFileSize: 50
    }
};

module.exports.languages = {
    "en": {
        "missingMessage": "📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑜 𝑟𝑒𝑝𝑜𝑟𝑡",
        "reportSent": "✅ 𝑌𝑜𝑢𝑟 𝑟𝑒𝑝𝑜𝑟𝑡 ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑠𝑒𝑛𝑡 𝑡𝑜 %1 𝑎𝑑𝑚𝑖𝑛(𝑠)",
        "errorOccurred": "❌ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡",
        "adminNotification": "📢 𝑁𝐸𝑊 𝑅𝐸𝑃𝑂𝑅𝑇",
        "userFeedback": "📩 𝐹𝑒𝑒𝑑𝑏𝑎𝑐𝑘 𝑓𝑟𝑜𝑚 %1",
        "adminResponse": "📌 𝐴𝑑𝑚𝑖𝑛 %1'𝑠 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒"
    }
};

module.exports.onLoad = function() {
    console.log('🔄 𝐶𝑎𝑙𝑙𝐴𝑑 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑙𝑜𝑎𝑑𝑒𝑑 𝑠𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦');
};

module.exports.onReply = async function({ api, event, handleReply, Users }) {
    try {
        const name = (await Users.getData(event.senderID)).name || "𝑈𝑠𝑒𝑟";
        const attachments = [];
        const tempFiles = [];

        if (event.attachments && event.attachments.length > 0) {
            for (const attachment of event.attachments) {
                const randomString = Math.random().toString(36).substring(2, 15);
                let extension = "txt";
                
                switch (attachment.type) {
                    case 'photo': extension = 'jpg'; break;
                    case 'video': extension = 'mp4'; break;
                    case 'audio': extension = 'mp3'; break;
                    case 'animated_image': extension = 'gif'; break;
                }

                const filePath = path.join(__dirname, 'cache', `${randomString}.${extension}`);
                const fileData = (await axios.get(encodeURI(attachment.url), { 
                    responseType: "arraybuffer" 
                })).data;
                
                await fs.writeFile(filePath, Buffer.from(fileData, "utf-8"));
                tempFiles.push(filePath);
                attachments.push(fs.createReadStream(filePath));
            }
        }

        switch (handleReply.type) {
            case "reply": {
                const adminIDs = global.config.ADMINBOT;
                const messageContent = event.body || "𝑁𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑";
                
                for (const adminID of adminIDs) {
                    const messageData = {
                        body: `📩 ${this.languages.en.userFeedback.replace('%1', name)}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 💬 𝐶𝑜𝑛𝑡𝑒𝑛𝑡: ${messageContent}\n┗━━━━━━━━━━━━━━━━━━`,
                        mentions: [{ id: event.senderID, tag: name }],
                        attachment: attachments.length > 0 ? attachments : undefined
                    };

                    await api.sendMessage(messageData, adminID);
                }
                break;
            }

            case "calladmin": {
                const messageContent = event.body || "𝑁𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑";
                const messageData = {
                    body: `📌 ${this.languages.en.adminResponse.replace('%1', name)}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 💬 𝐶𝑜𝑛𝑡𝑒𝑛𝑡: ${messageContent}\n┗━━━━━━━━━━━━━━━━━━\n\n🔁 𝑅𝑒𝑝𝑙𝑦 𝑡𝑜 𝑐𝑜𝑛𝑡𝑖𝑛𝑢𝑒 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑡𝑖𝑜𝑛`,
                    mentions: [{ tag: name, id: event.senderID }],
                    attachment: attachments.length > 0 ? attachments : undefined
                };

                await api.sendMessage(messageData, handleReply.id);
                break;
            }
        }

        for (const file of tempFiles) {
            try {
                await fs.unlink(file);
            } catch (e) {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑒:", e);
            }
        }

    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝑅𝑒𝑝𝑙𝑦:", error);
    }
};

module.exports.onStart = async function({ api, event, args, Threads, Users }) {
    try {
        if (args.length === 0 && !event.messageReply) {
            return api.sendMessage(this.languages.en.missingMessage, event.threadID, event.messageID);
        }

        const attachments = [];
        const tempFiles = [];

        if (event.messageReply && event.messageReply.attachments) {
            for (const attachment of event.messageReply.attachments) {
                const randomString = Math.random().toString(36).substring(2, 15);
                let extension = "txt";
                
                switch (attachment.type) {
                    case 'photo': extension = 'jpg'; break;
                    case 'video': extension = 'mp4'; break;
                    case 'audio': extension = 'mp3'; break;
                    case 'animated_image': extension = 'gif'; break;
                }

                const filePath = path.join(__dirname, 'cache', `${randomString}.${extension}`);
                const fileData = (await axios.get(encodeURI(attachment.url), { 
                    responseType: "arraybuffer" 
                })).data;
                
                await fs.writeFile(filePath, Buffer.from(fileData, "utf-8"));
                tempFiles.push(filePath);
                attachments.push(fs.createReadStream(filePath));
            }
        }

        const name = (await Users.getData(event.senderID)).name || "𝑈𝑠𝑒𝑟";
        const threadData = await Threads.getData(event.threadID);
        const threadName = threadData.threadInfo ? threadData.threadInfo.threadName : "𝑃𝑟𝑖𝑣𝑎𝑡𝑡𝑒 𝐶ℎ𝑎𝑡";
        const userID = event.senderID;
        const threadID = event.threadID;
        const timestamp = moment.tz("𝐴𝑠𝑖𝑎/𝐷ℎ𝑎𝑘𝑎").format("𝐻𝐻:𝑚𝑚:𝑠𝑠 𝐷𝐷/𝑀𝑀/𝑌𝑌𝑌𝑌");
        const adminCount = global.config.ADMINBOT ? global.config.ADMINBOT.length : 0;

        await api.sendMessage(
            `✅ ${this.languages.en.reportSent.replace('%1', adminCount)}\n⏰ 𝑇𝑖𝑚𝑒: ${timestamp}`, 
            event.threadID, 
            event.messageID
        );

        const messageContent = args.join(" ") || (attachments.length > 0 ? 
            "📎 𝐴𝑡𝑡𝑎𝑐ℎ𝑚𝑒𝑛𝑡 𝑤𝑖𝑡ℎ𝑜𝑢𝑡 𝑡𝑒𝑥𝑡" : "🌸 𝑁𝑜 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒𝑑");

        if (global.config.ADMINBOT && global.config.ADMINBOT.length > 0) {
            for (const adminID of global.config.ADMINBOT) {
                const messageData = {
                    body: `📢 ${this.languages.en.adminNotification}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 👤 𝑈𝑠𝑒𝑟: ${name}\n┣➤ 🆔 𝑈𝐼𝐷: ${userID}\n┣➤ 💬 𝐵𝑜𝑥: ${threadName}\n┣➤ 🆔 𝐵𝑜𝑥 𝐼𝐷: ${threadID}\n┣➤ 📝 𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${messageContent}\n┣➤ ⏰ 𝑇𝑖𝑚𝑒: ${timestamp}\n┗━━━━━━━━━━━━━━━━━━`,
                    mentions: [{ id: event.senderID, tag: name }],
                    attachment: attachments.length > 0 ? attachments : undefined
                };

                await api.sendMessage(messageData, adminID);
            }
        }

        for (const file of tempFiles) {
            try {
                await fs.unlink(file);
            } catch (e) {
                console.error("𝐸𝑟𝑟𝑜𝑟 𝑑𝑒𝑙𝑒𝑡𝑖𝑛𝑔 𝑓𝑖𝑙𝑒:", e);
            }
        }

    } catch (error) {
        console.error("❌ 𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑜𝑛𝑆𝑡𝑎𝑟𝑡:", error);
        await api.sendMessage(
            this.languages.en.errorOccurred, 
            event.threadID, 
            event.messageID
        );
    }
};
