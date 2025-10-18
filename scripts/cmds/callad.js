const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");
const path = require("path");
const FormData = require("form-data");

module.exports = {
    config: {
        name: "callad",
        aliases: [],
        version: "2.0.0",
        author: "𝖠𝗌𝗂𝖿 𝖬𝖺𝗁𝗆𝗎𝖽",
        role: 0,
        category: "utility",
        shortDescription: {
            en: "📞 𝖱𝖾𝗉𝗈𝗋𝗍 𝖻𝗎𝗀𝗌 𝗈𝗋 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝖺𝖽𝗆𝗂𝗇𝗌"
        },
        longDescription: {
            en: "𝖲𝖾𝗇𝖽 𝗋𝖾𝗉𝗈𝗋𝗍𝗌 𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾𝗌 𝗍𝗈 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝗍𝗈𝗋𝗌"
        },
        guide: {
            en: "{p}callad [𝗆𝖾𝗌𝗌𝖺𝗀𝖾]"
        },
        countDown: 5,
        dependencies: {
            "fs-extra": "",
            "axios": "",
            "moment-timezone": "",
            "path": "",
            "form-data": ""
        }
    },

    langs: {
        "en": {
            "missingMessage": "❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝗋𝖾𝗉𝗈𝗋𝗍",
            "reportSent": "✅ 𝖸𝗈𝗎𝗋 𝗋𝖾𝗉𝗈𝗋𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗌𝖾𝗇𝗍 𝗍𝗈 %1 𝖺𝖽𝗆𝗂𝗇(𝗌)",
            "errorOccurred": "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍",
            "adminNotification": "📢 𝖭𝖤𝖶 𝖱𝖤𝖯𝖮𝖱𝖳",
            "userFeedback": "📩 𝖥𝖾𝖾𝖽𝖻𝖺𝖼𝗄 𝖿𝗋𝗈𝗆 %1",
            "adminResponse": "📌 𝖠𝖽𝗆𝗂𝗇 %1'𝗌 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾"
        }
    },

    onLoad: function() {
        console.log('🔄 𝖢𝖺𝗅𝗅𝖠𝖽 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗅𝗈𝖺𝖽𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒');
    },

    onReply: async function({ api, event, handleReply, Users, message, getText }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("moment-timezone");
                require("path");
                require("form-data");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return console.error("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌");
            }

            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            let name;
            try {
                const userData = await Users.getData(event.senderID);
                name = userData.name || "𝖴𝗌𝖾𝗋";
            } catch (error) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", error);
                name = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
            }

            const attachments = [];
            const tempFiles = [];

            // Handle attachments
            if (event.attachments && event.attachments.length > 0) {
                for (const attachment of event.attachments) {
                    try {
                        const randomString = Math.random().toString(36).substring(2, 15);
                        let extension = "txt";
                        
                        switch (attachment.type) {
                            case 'photo': extension = 'jpg'; break;
                            case 'video': extension = 'mp4'; break;
                            case 'audio': extension = 'mp3'; break;
                            case 'animated_image': extension = 'gif'; break;
                            default: extension = 'txt'; break;
                        }

                        const filePath = path.join(cacheDir, `${randomString}.${extension}`);
                        const response = await axios.get(encodeURI(attachment.url), { 
                            responseType: "arraybuffer",
                            timeout: 30000
                        });
                        
                        await fs.writeFile(filePath, Buffer.from(response.data, "utf-8"));
                        tempFiles.push(filePath);
                        attachments.push(fs.createReadStream(filePath));
                    } catch (attachmentError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖺𝗍𝗍𝖺𝖼𝗁𝗆𝖾𝗇𝗍:", attachmentError);
                    }
                }
            }

            switch (handleReply.type) {
                case "reply": {
                    const adminIDs = global.config?.ADMINBOT || [];
                    const messageContent = event.body || "𝖭𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽";
                    
                    for (const adminID of adminIDs) {
                        try {
                            const messageData = {
                                body: `📩 ${getText("userFeedback").replace('%1', name)}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 💬 𝖢𝗈𝗇𝗍𝖾𝗇𝗍: ${messageContent}\n┗━━━━━━━━━━━━━━━━━━`,
                                mentions: [{ id: event.senderID, tag: name }],
                                attachment: attachments.length > 0 ? attachments : undefined
                            };

                            await api.sendMessage(messageData, adminID);
                        } catch (sendError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗍𝗈 𝖺𝖽𝗆𝗂𝗇 ${adminID}:`, sendError);
                        }
                    }
                    break;
                }

                case "calladmin": {
                    const messageContent = event.body || "𝖭𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽";
                    try {
                        const messageData = {
                            body: `📌 ${getText("adminResponse").replace('%1', name)}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 💬 𝖢𝗈𝗇𝗍𝖾𝗇𝗍: ${messageContent}\n┗━━━━━━━━━━━━━━━━━━\n\n🔁 𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝗍𝗂𝗈𝗇`,
                            mentions: [{ tag: name, id: event.senderID }],
                            attachment: attachments.length > 0 ? attachments : undefined
                        };

                        await api.sendMessage(messageData, handleReply.id);
                    } catch (sendError) {
                        console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖾:", sendError);
                    }
                    break;
                }
            }

            // Clean up temporary files
            for (const file of tempFiles) {
                try {
                    if (fs.existsSync(file)) {
                        await fs.unlink(file);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝖾𝗅𝖾𝗍𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError);
                }
            }

        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖱𝖾𝗉𝗅𝗒:", error);
        }
    },

    onStart: async function({ api, event, args, Threads, Users, message, getText }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs-extra");
                require("axios");
                require("moment-timezone");
                require("path");
                require("form-data");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖺𝗅𝗅 𝗋𝖾𝗊𝗎𝗂𝗋𝖾𝖽 𝗉𝖺𝖼𝗄𝖺𝗀𝖾𝗌.");
            }

            // Check if message is provided
            if (args.length === 0 && !event.messageReply) {
                return message.reply(getText("missingMessage"));
            }

            // Ensure cache directory exists
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }

            const attachments = [];
            const tempFiles = [];

            // Handle replied message attachments
            if (event.messageReply && event.messageReply.attachments) {
                for (const attachment of event.messageReply.attachments) {
                    try {
                        const randomString = Math.random().toString(36).substring(2, 15);
                        let extension = "txt";
                        
                        switch (attachment.type) {
                            case 'photo': extension = 'jpg'; break;
                            case 'video': extension = 'mp4'; break;
                            case 'audio': extension = 'mp3'; break;
                            case 'animated_image': extension = 'gif'; break;
                            default: extension = 'txt'; break;
                        }

                        const filePath = path.join(cacheDir, `${randomString}.${extension}`);
                        const response = await axios.get(encodeURI(attachment.url), { 
                            responseType: "arraybuffer",
                            timeout: 30000
                        });
                        
                        await fs.writeFile(filePath, Buffer.from(response.data, "utf-8"));
                        tempFiles.push(filePath);
                        attachments.push(fs.createReadStream(filePath));
                    } catch (attachmentError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝖺𝗍𝗍𝖺𝖼𝗁𝗆𝖾𝗇𝗍:", attachmentError);
                    }
                }
            }

            // Get user information
            let name, threadName;
            try {
                const userData = await Users.getData(event.senderID);
                name = userData.name || "𝖴𝗌𝖾𝗋";
            } catch (error) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", error);
                name = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖴𝗌𝖾𝗋";
            }

            try {
                const threadData = await Threads.getData(event.threadID);
                threadName = threadData.threadInfo ? threadData.threadInfo.threadName : "𝖯𝗋𝗂𝗏𝖺𝗍𝖾 𝖢𝗁𝖺𝗍";
            } catch (error) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝖽𝖺𝗍𝖺:", error);
                threadName = "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉";
            }

            const userID = event.senderID;
            const threadID = event.threadID;
            const timestamp = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
            const adminCount = global.config?.ADMINBOT ? global.config.ADMINBOT.length : 0;

            // Send confirmation to user
            await message.reply(
                `✅ ${getText("reportSent").replace('%1', adminCount)}\n⏰ 𝖳𝗂𝗆𝖾: ${timestamp}`
            );

            const messageContent = args.join(" ") || (attachments.length > 0 ? 
                "📎 𝖠𝗍𝗍𝖺𝖼𝗁𝗆𝖾𝗇𝗍 𝗐𝗂𝗍𝗁𝗈𝗎𝗍 𝗍𝖾𝗑𝗍" : "🌸 𝖭𝗈 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾𝖽");

            // Send report to admins
            if (global.config?.ADMINBOT && global.config.ADMINBOT.length > 0) {
                let sentCount = 0;
                
                for (const adminID of global.config.ADMINBOT) {
                    try {
                        const messageData = {
                            body: `📢 ${getText("adminNotification")}\n┏━━━━━━━━━━━━━━━━━━\n┣➤ 👤 𝖴𝗌𝖾𝗋: ${name}\n┣➤ 🆔 𝖴𝖨𝖣: ${userID}\n┣➤ 💬 𝖡𝗈𝗑: ${threadName}\n┣➤ 🆔 𝖡𝗈𝗑 𝖨𝖣: ${threadID}\n┣➤ 📝 𝖬𝖾𝗌𝗌𝖺𝗀𝖾: ${messageContent}\n┣➤ ⏰ 𝖳𝗂𝗆𝖾: ${timestamp}\n┗━━━━━━━━━━━━━━━━━━`,
                            mentions: [{ id: event.senderID, tag: name }],
                            attachment: attachments.length > 0 ? attachments : undefined
                        };

                        await api.sendMessage(messageData, adminID);
                        sentCount++;
                    } catch (sendError) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗇𝖽 𝗍𝗈 𝖺𝖽𝗆𝗂𝗇 ${adminID}:`, sendError);
                    }
                }
                
                console.log(`✅ 𝖱𝖾𝗉𝗈𝗋𝗍 𝗌𝖾𝗇𝗍 𝗍𝗈 ${sentCount}/${adminCount} 𝖺𝖽𝗆𝗂𝗇𝗌`);
            } else {
                console.warn("⚠️ 𝖭𝗈 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖾𝖽 𝗂𝗇 𝗀𝗅𝗈𝖻𝖺𝗅.𝖼𝗈𝗇𝖿𝗂𝗀.𝖠𝖣𝖬𝖨𝖭𝖡𝖮𝖳");
            }

            // Clean up temporary files
            for (const file of tempFiles) {
                try {
                    if (fs.existsSync(file)) {
                        await fs.unlink(file);
                    }
                } catch (cleanupError) {
                    console.warn("❌ 𝖤𝗋𝗋𝗈𝗋 𝖽𝖾𝗅𝖾𝗍𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗈𝗋𝖺𝗋𝗒 𝖿𝗂𝗅𝖾:", cleanupError);
                }
            }

        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗈𝗇𝖲𝗍𝖺𝗋𝗍:", error);
            await message.reply(getText("errorOccurred"));
        }
    }
};
