const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "group",
    aliases: ["grp", "box"],
    version: "1.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 1,
    role: 0,
    category: "box",
    shortDescription: {
        en: "𝐺𝑟𝑜𝑢𝑝 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠"
    },
    longDescription: {
        en: "𝐺𝑟𝑜𝑢𝑝 𝑚𝑎𝑛𝑎𝑔𝑒𝑚𝑒𝑛𝑡 𝑐𝑜𝑚𝑚𝑎𝑛𝑑𝑠 𝑓𝑜𝑟 𝑛𝑎𝑚𝑒, 𝑒𝑚𝑜𝑗𝑖, 𝑎𝑑𝑚𝑖𝑛, 𝑖𝑚𝑎𝑔𝑒, 𝑖𝑛𝑓𝑜"
    },
    guide: {
        en: "{p}group [𝑛𝑎𝑚𝑒/𝑒𝑚𝑜𝑗𝑖/𝑎𝑑𝑚𝑖𝑛/𝑖𝑚𝑎𝑔𝑒/𝑖𝑛𝑓𝑜]"
    },
    dependencies: {
        "request": "",
        "fs-extra": ""
    }
};

module.exports.onLoad = async function () {
    const dir = __dirname + "/cache";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports.onStart = async function ({ api, event, args }) {
    try {
        if (!args[0]) {
            const helpMsg =
`╭───• 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗡𝗨 •───╮
│
├─❏ 𝗻𝗮𝗺𝗲 ➺  𝗚𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲 𝗰𝗵𝗮𝗻𝗴𝗲
├─❏ 𝗲𝗺𝗼𝗷𝗶 ➺  𝗚𝗿𝗼𝘂𝗽 𝗲𝗺𝗼𝗷𝗶 𝘂𝗽𝗱𝗮𝘁𝗲
├─❏ 𝗶𝗺𝗮𝗴𝗲 ➺  𝗚𝗿𝗼𝘂𝗽 𝗶𝗺𝗮𝗴𝗲 𝘀𝗲𝘁
├─❏ 𝗮𝗱𝗺𝗶𝗻 ➺  𝗔𝗱𝗺𝗶𝗻 𝗺𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁
├─❏ 𝗶𝗻𝗳𝗼 ➺  𝗚𝗿𝗼𝘂𝗽 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻
│
╰─────────────⧕☬⧕──────────╯`;
            return api.sendMessage(helpMsg, event.threadID);
        }

        if (args[0].toLowerCase() === "name") {
            const newName = args.slice(1).join(" ") || (event.messageReply && event.messageReply.body);
            if (!newName) return api.sendMessage("❌ 𝑁𝑎𝑚𝑒 𝑑𝑖𝑙𝑒 ℎ𝑜𝑏𝑒𝑛", event.threadID);
            return api.setTitle(newName, event.threadID, () => {
                return api.sendMessage(`✅ 𝑆𝑎𝑓𝑎𝑙𝑙𝑦 𝑐ℎ𝑎𝑛𝑔𝑒𝑑 𝑔𝑟𝑜𝑢𝑝 𝑛𝑎𝑚𝑒:\n"${newName}"`, event.threadID);
            });
        }

        else if (args[0].toLowerCase() === "emoji") {
            const emoji = args[1] || (event.messageReply && event.messageReply.body);
            if (!emoji) return api.sendMessage("❌ 𝐸𝑚𝑜𝑗𝑖 𝑑𝑖𝑙𝑒 ℎ𝑜𝑏𝑒𝑛", event.threadID);
            return api.changeThreadEmoji(emoji, event.threadID, () => {
                return api.sendMessage(`✅ 𝐸𝑚𝑜𝑗𝑖 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑜𝑛 ℎ𝑜𝑙𝑜: ${emoji}`, event.threadID);
            });
        }

        else if (args[0].toLowerCase() === "admin") {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const adminIDs = threadInfo.adminIDs || [];
            const botID = api.getCurrentUserID();
            const isBotAdmin = adminIDs.some(ad => ad.id == botID);
            const isUserAdmin = adminIDs.some(ad => ad.id == event.senderID);

            let targetID;
            const mentions = event.mentions || {};
            if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
            else if (event.messageReply) targetID = event.messageReply.senderID;
            else if (args[1]) targetID = args[1];

            if (!targetID) return api.sendMessage("❌ 𝑈𝑠𝑒𝑟 𝑚𝑒𝑛𝑡𝑖𝑜𝑛 𝑜𝑟 𝑟𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑢𝑛", event.threadID);
            if (!isUserAdmin) return api.sendMessage("❌ 𝐴𝑝𝑛𝑖 𝑔𝑟𝑜𝑢𝑝 𝑎𝑑𝑚𝑖𝑛 𝑛𝑎𝑛", event.threadID);
            if (!isBotAdmin) return api.sendMessage("❌ 𝐵𝑜𝑡𝑘𝑒 𝑎𝑑𝑚𝑖𝑛 𝑑𝑖𝑛", event.threadID);

            const isTargetAdmin = adminIDs.some(ad => ad.id == targetID);
            return api.changeAdminStatus(event.threadID, targetID, !isTargetAdmin, async (err) => {
                if (err) {
                    console.error(err);
                    return api.sendMessage("❌ 𝑃𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑜𝑛 𝑘𝑜𝑟𝑡𝑒 𝑏ℎ𝑢𝑙", event.threadID);
                }
                const userInfo = await api.getUserInfo(targetID);
                const name = (userInfo && userInfo[targetID] && userInfo[targetID].name) ? userInfo[targetID].name : "𝑈𝑛𝑘𝑛𝑜𝑚𝑛";
                const actionText = isTargetAdmin ? "𝑅𝑒𝑚𝑜𝑣𝑒𝑑 𝑎𝑑𝑚𝑖𝑛:" : "𝐴𝑑𝑚𝑖𝑛 𝑑𝑖𝑙𝑎𝑎𝑚:";
                return api.sendMessage(`✅ ${actionText}\n╭─• ${name}\n╰─• @${targetID}`, event.threadID);
            });
        }

        else if (args[0].toLowerCase() === "image") {
            if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return api.sendMessage("❌ 𝐼𝑚𝑎𝑔𝑒 𝑟𝑒𝑝𝑙𝑦 𝑘𝑜𝑟𝑢𝑛", event.threadID);
            }

            const imageUrl = event.messageReply.attachments[0].url;
            const cachePath = __dirname + "/cache/grpimg.png";

            const downloadAndChange = () => {
                request(encodeURI(imageUrl))
                    .pipe(fs.createWriteStream(cachePath))
                    .on("close", () => {
                        api.changeGroupImage(fs.createReadStream(cachePath), event.threadID, (err) => {
                            try { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); } catch (e) { }
                            if (err) {
                                console.error(err);
                                return api.sendMessage("❌ 𝐼𝑚𝑎𝑔𝑒 𝑝𝑎𝑟𝑖𝑏𝑎𝑟𝑡𝑜𝑛 ℎ𝑜𝑙𝑜𝑛𝑎", event.threadID);
                            }
                            return api.sendMessage("✅ 𝐺𝑟𝑜𝑢𝑝 𝑖𝑚𝑎𝑔𝑒 𝑢𝑝𝑑𝑎𝑡𝑒 ℎ𝑜𝑙𝑜", event.threadID);
                        });
                    })
                    .on("error", (err) => {
                        console.error(err);
                        return api.sendMessage("❌ 𝐼𝑚𝑎𝑔𝑒 𝑑𝑜𝑤𝑛𝑙𝑜𝑎𝑑 𝑒𝑟𝑟𝑜𝑟", event.threadID);
                    });
            };

            return downloadAndChange();
        }

        else if (args[0].toLowerCase() === "info") {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const threadName = threadInfo.threadName || "𝑁/𝐴";
            const participantIDs = threadInfo.participantIDs || [];
            const adminIDs = threadInfo.adminIDs || [];
            const imageSrc = threadInfo.imageSrc || "";
            const emoji = threadInfo.emoji || "𝑁/𝐴";
            const approvalMode = threadInfo.approvalMode || false;
            const messageCount = threadInfo.messageCount || 0;

            let genderCount = { male: 0, female: 0 };
            if (threadInfo.userInfo) {
                for (const uid in threadInfo.userInfo) {
                    const user = threadInfo.userInfo[uid];
                    if (user && user.gender) {
                        if (user.gender === "MALE") genderCount.male++;
                        else if (user.gender === "FEMALE") genderCount.female++;
                    }
                }
            }

            let adminList = "╭───• 𝐴𝐷𝑀𝐼𝑁𝑆 •───╮\n";
            for (const admin of adminIDs) {
                const name = (threadInfo.userInfo && threadInfo.userInfo[admin.id] && threadInfo.userInfo[admin.id].name) ? threadInfo.userInfo[admin.id].name : "𝑈𝑛𝑘𝑛𝑜𝑤𝑛";
                adminList += `├─• ${name}\n`;
            }
            adminList += "╰────────────────╯";

            const approvalStatus = approvalMode ? "✅ 𝐶ℎ𝑎𝑙𝑢" : "❌ 𝐵𝑎𝑛𝑑ℎ";

            const msg =
`╭───• 𝐺𝑅𝑂𝑈𝑃 𝐼𝑁𝐹𝑂 •───╮
├─• 𝑁𝑎𝑚𝑒: ${threadName}
├─• 𝐼𝐷: ${event.threadID}
├─• 𝐸𝑚𝑜𝑗𝑖: ${emoji}
├─• 𝑀𝑒𝑚𝑏𝑒𝑟𝑠: ${participantIDs.length} 𝐼𝑇
├─• 𝑃𝑢𝑟𝑢𝑠ℎ: ${genderCount.male}
├─• 𝑀𝑜ℎ𝑖𝑙𝑎: ${genderCount.female}
├─• 𝐴𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑀𝑜𝑑𝑒: ${approvalStatus}
├─• 𝑀𝑒𝑠𝑠𝑎𝑔𝑒𝑠: ${messageCount}
${adminList}`;

            const cachePath = __dirname + "/cache/grpinfo.png";
            if (imageSrc) {
                return request(encodeURI(imageSrc))
                    .pipe(fs.createWriteStream(cachePath))
                    .on("close", () => {
                        api.sendMessage({ body: msg, attachment: fs.createReadStream(cachePath) }, event.threadID, () => {
                            try { if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath); } catch (e) { }
                        });
                    })
                    .on("error", () => {
                        return api.sendMessage(msg, event.threadID);
                    });
            } else {
                return api.sendMessage(msg, event.threadID);
            }
        }

        else {
            return api.sendMessage("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑝𝑡𝑖𝑜𝑛. 𝐷𝑜𝑛'𝑡 𝑓𝑜𝑟𝑔𝑒𝑡: 𝑛𝑎𝑚𝑒 | 𝑒𝑚𝑜𝑗𝑖 | 𝑎𝑑𝑚𝑖𝑛 | 𝑖𝑚𝑎𝑔𝑒 | 𝑖𝑛𝑓𝑜", event.threadID);
        }
    } catch (error) {
        console.error("𝐸𝑟𝑟𝑜𝑟 𝑖𝑛 𝑔𝑟𝑜𝑢𝑝 𝑐𝑜𝑚𝑚𝑎𝑛𝑑:", error);
        return api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟: 𝐸𝑏𝑎𝑟 𝑎𝑝𝑛𝑎 𝑐ℎ𝑒𝑘 𝑘𝑜𝑟𝑒 𝑑𝑒𝑘ℎ𝑖𝑛", event.threadID);
    }
};
