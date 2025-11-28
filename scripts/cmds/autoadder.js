const fs = require("fs-extra");

module.exports = {
    config: {
        name: "autoadder",
        aliases: [],
        version: "5.0.0", // ULTIMATE EDITION
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 2,
        role: 0,
        category: "group",
        shortDescription: {
            en: "Ultimate Auto Adder (Bypass Logic)"
        },
        longDescription: {
            en: "Aggressively adds users. If blocked by privacy, it generates a direct entry link to bypass restrictions."
        },
        guide: {
            en: "{p}autoadder on/off"
        }
    },

    // 1. TOGGLE COMMAND
    onStart: async function({ message, event, args, threadsData }) {
        const { threadID } = event;
        try {
            let threadInfo = await threadsData.get(threadID) || {};
            let settings = threadInfo.data || {};

            if (!args[0]) {
                const status = settings.autoadder ? "🟢 ON (God Mode)" : "🔴 OFF";
                return message.reply(`🔥 𝗨𝗹𝘁𝗶𝗺𝗮𝘁𝗲 𝗔𝗱𝗱𝗲𝗿: ${status}\n📝 Use: /autoadder on/off`);
            }

            const cmd = args[0].toLowerCase();
            if (cmd === "on") {
                settings.autoadder = true;
                await threadsData.set(threadID, { ...threadInfo, data: settings });
                return message.reply("🟢 𝗔𝘂𝘁𝗼 𝗔𝗱𝗱𝗲𝗿 𝗔𝗰𝘁𝗶𝘃𝗮𝘁𝗲𝗱.\n⚠️ Mode: Aggressive Bypass.");
            } 
            if (cmd === "off") {
                settings.autoadder = false;
                await threadsData.set(threadID, { ...threadInfo, data: settings });
                return message.reply("🔴 𝗔𝘂𝘁𝗼 𝗔𝗱𝗱𝗲𝗿 𝗗𝗲𝗮𝗰𝘁𝗶𝘃𝗮𝘁𝗲𝗱.");
            }
            return message.reply("❌ Invalid command.");
        } catch (e) { console.error(e); }
    },

    // 2. CHAT LISTENER (THE BYPASS LOGIC)
    onChat: async function({ event, api, message, threadsData }) {
        try {
            const { threadID, body, senderID } = event;
            if (senderID === api.getCurrentUserID() || !body) return;

            // CHECK ENABLED
            const threadInfoData = await threadsData.get(threadID);
            if (!threadInfoData?.data?.autoadder) return;

            // RAW PATTERN MATCHING (Catches Everything)
            const patterns = [
                /(?:facebook\.com|fb\.com|fb\.me)\/(?:profile\.php\?id=)?([a-zA-Z0-9.]+)/gi,
                /(?:^|\s)([0-9]{9,})(?:$|\s)/g
            ];

            let targets = [];
            for (const regex of patterns) {
                const matches = [...body.matchAll(regex)];
                for (const m of matches) targets.push(m[1]);
            }
            
            // Clean & Filter Targets
            targets = [...new Set(targets)].filter(t => t.length > 5 && !['groups','video','watch'].includes(t));

            if (targets.length === 0) return;

            // PROCESS TARGETS (GOD MODE)
            for (const target of targets) {
                let uid = target;
                let added = false;

                // 1. Resolve UID from Username (Reverse Lookup)
                if (isNaN(target)) {
                    try {
                        const uID = await api.getUserID(target);
                        if (uID?.[0]?.userID) uid = uID[0].userID;
                        else continue;
                    } catch (e) { continue; }
                }

                // 2. AGGRESSIVE LOOP (Attack 3 Times)
                for (let attempt = 1; attempt <= 3; attempt++) {
                    try {
                        // Rapid Fire Add
                        await api.addUserToGroup(uid, threadID);
                        
                        // If code reaches here, it worked!
                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                        added = true;
                        console.log(`[AutoAdder] Success: ${uid}`);
                        break; 
                    } catch (err) {
                        const errStr = err.message || "";
                        if (errStr.includes("already")) {
                            added = true; 
                            break;
                        }
                        // Short delay before retry
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }

                // 3. THE "OUT OF THE BOX" BYPASS (If Force Add Failed)
                if (!added) {
                    try {
                        // Fetch Name for better targeting
                        const userInfo = await api.getUserInfo(uid);
                        const name = userInfo[uid]?.name || "User";

                        // GENERATE DIRECT ENTRY LINK
                        // This uses the messenger join link protocol which bypasses standard "Add" restrictions
                        // because the user clicks it themselves.
                        const bypassLink = `https://m.me/j/${threadID}`;
                        
                        const bypassMsg = {
                            body: `⚠️ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐅𝐨𝐫𝐜𝐞-𝐀𝐝𝐝: ${name}\n🔒 𝐒𝐞𝐫𝐯𝐞𝐫 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 𝐀𝐜𝐭𝐢𝐨𝐧.\n\n⚡ 𝐁𝐘𝐏𝐀𝐒𝐒 𝐋𝐈𝐍𝐊 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐄𝐃:\n${bypassLink}\n\n👋 @${name} Click the link above to override privacy settings and join immediately!`,
                            mentions: [{ tag: `@${name}`, id: uid }]
                        };
                        
                        await message.reply(bypassMsg);
                    } catch (e) {
                        console.error("Bypass Logic Error:", e);
                    }
                }
            }
        } catch (error) {
            console.error("AutoAdder Critical Error:", error);
        }
    }
};
