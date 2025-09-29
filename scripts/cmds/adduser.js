const axios = require("axios");

module.exports = {
    config: {
        name: "adduser",
        aliases: ["addmember", "invite"],
        version: "2.4.3",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "𝑔𝑟𝑜𝑢𝑝",
        shortDescription: {
            en: "𝐴𝑑𝑑 𝑢𝑠𝑒𝑟 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝 𝑏𝑦 𝑙𝑖𝑛𝑘 𝑜𝑟 𝑖𝑑"
        },
        longDescription: {
            en: "𝐴𝑑𝑑 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑦𝑜𝑢𝑟 𝑔𝑟𝑜𝑢𝑝 𝑢𝑠𝑖𝑛𝑔 𝑡ℎ𝑒𝑖𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘"
        },
        guide: {
            en: "{p}adduser [𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑈𝑅𝐿]"
        },
        dependencies: {
            "axios": ""
        }
    },

    onStart: async function({ message, event, args, api, usersData }) {
        try {
            // 🛡️ Dependency check
            let axiosAvailable = true;
            try {
                require("axios");
            } catch (e) {
                axiosAvailable = false;
                return message.reply("❌ 𝑀𝑖𝑠𝑠𝑖𝑛𝑔 𝑑𝑒𝑝𝑒𝑛𝑑𝑒𝑛𝑐𝑖𝑒𝑠. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑖𝑛𝑠𝑡𝑎𝑙𝑙 𝑎𝑥𝑖𝑜𝑠.");
            }

            // 🛡️ Validate arguments
            if (!args[0] || args[0].trim() === "") {
                return message.reply("📝 𝑃𝑙𝑒𝑎𝑠𝑒 𝑒𝑛𝑡𝑒𝑟 𝑎 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘\n\n📌 𝐸𝑥𝑎𝑚𝑝𝑙𝑒𝑠:\n• /adduser 100123456789\n• /adduser https://facebook.com/profile.php?id=100123456789\n• /adduser https://fb.com/username");
            }

            const input = args[0].trim();
            
            // 🎯 Get thread information with error handling
            let threadInfo;
            try {
                threadInfo = await api.getThreadInfo(event.threadID);
                if (!threadInfo) {
                    throw new Error("Failed to get thread information");
                }
            } catch (threadError) {
                console.error("𝑇ℎ𝑟𝑒𝑎𝑑 𝑖𝑛𝑓𝑜 𝑒𝑟𝑟𝑜𝑟:", threadError);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼'𝑚 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑖𝑠 𝑣𝑎𝑙𝑖𝑑.");
            }

            // 🛡️ Validate thread info structure
            if (!threadInfo.participantIDs || !Array.isArray(threadInfo.participantIDs)) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑔𝑟𝑜𝑢𝑝 𝑑𝑎𝑡𝑎 𝑟𝑒𝑐𝑒𝑖𝑣𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.");
            }

            const participantIDs = threadInfo.participantIDs.map(id => id.toString());
            const adminIDs = threadInfo.adminIDs ? threadInfo.adminIDs.map(admin => admin.id.toString()) : [];

            // 🎯 Check if bot is admin
            let botID;
            try {
                botID = api.getCurrentUserID();
                if (!botID || isNaN(botID)) {
                    throw new Error("Invalid bot ID");
                }
            } catch (botError) {
                console.error("𝐵𝑜𝑡 𝐼𝐷 𝑒𝑟𝑟𝑜𝑟:", botError);
                return message.reply("❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑏𝑜𝑡 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛.");
            }

            if (adminIDs.length > 0 && !adminIDs.includes(botID)) {
                return message.reply("❌ 𝐼 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑏𝑒 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑡𝑜𝑟 𝑡𝑜 𝑎𝑑𝑑 𝑢𝑠𝑒𝑟𝑠 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.");
            }

            let targetID;
            let userName = "𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑢𝑠𝑒𝑟";

            // 🎯 Extract user ID from different input formats
            if (!isNaN(input) && input.length >= 9 && input.length <= 16) {
                // Numeric ID
                targetID = input.toString();
                console.log(`🔍 𝐸𝑥𝑡𝑟𝑎𝑐𝑡𝑒𝑑 𝑛𝑢𝑚𝑒𝑟𝑖𝑐 𝐼𝐷: ${targetID}`);
            } else if (input.includes("facebook.com") || input.includes("fb.com") || input.includes("fb.me")) {
                // Profile URL
                try {
                    console.log(`🔍 𝑃𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑈𝑅𝐿: ${input}`);
                    
                    // Remove any query parameters and fragments
                    const cleanUrl = input.split('?')[0].split('#')[0];
                    
                    // Extract ID using multiple patterns
                    const patterns = [
                        /(?:facebook\.com|fb\.com)\/(?:profile\.php\?id=)?(\d+)/,
                        /(?:facebook\.com|fb\.com)\/(?:people\/)?([^\/?]+)/,
                        /id=(\d+)/,
                        /\/?(\d{9,16})\/?/
                    ];
                    
                    for (const pattern of patterns) {
                        const match = cleanUrl.match(pattern);
                        if (match && match[1]) {
                            if (!isNaN(match[1]) && match[1].length >= 9) {
                                targetID = match[1];
                                console.log(`✅ 𝐸𝑥𝑡𝑟𝑎𝑐𝑡𝑒𝑑 𝐼𝐷 𝑓𝑟𝑜𝑚 𝑈𝑅𝐿: ${targetID}`);
                                break;
                            }
                        }
                    }
                    
                    if (!targetID) {
                        return message.reply("❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑒𝑥𝑡𝑟𝑎𝑐𝑡 𝑣𝑎𝑙𝑖𝑑 𝐼𝐷 𝑓𝑟𝑜𝑚 𝑡ℎ𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑢𝑠𝑒 𝑎 𝑛𝑢𝑚𝑒𝑟𝑖𝑐 𝐼𝐷 𝑜𝑟 𝑓𝑢𝑙𝑙 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑈𝑅𝐿.");
                    }
                } catch (urlError) {
                    console.error("𝑈𝑅𝐿 𝑝𝑎𝑟𝑠𝑖𝑛𝑔 𝑒𝑟𝑟𝑜𝑟:", urlError);
                    return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘 𝑓𝑜𝑟𝑚𝑎𝑡.");
                }
            } else {
                return message.reply("❌ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑎 𝑣𝑎𝑙𝑖𝑑 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 (9-16 𝑑𝑖𝑔𝑖𝑡𝑠) 𝑜𝑟 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑙𝑖𝑛𝑘.");
            }

            // 🛡️ Validate target ID format
            if (!targetID || isNaN(targetID) || targetID.length < 9 || targetID.length > 16) {
                return message.reply("❌ 𝐼𝑛𝑣𝑎𝑙𝑖𝑑 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑓𝑜𝑟𝑚𝑎𝑡. 𝐼𝐷 𝑚𝑢𝑠𝑡 𝑏𝑒 9-16 𝑑𝑖𝑔𝑖𝑡𝑠.");
            }

            // 🎯 Get user information
            try {
                const userInfo = await api.getUserInfo(targetID);
                if (userInfo && userInfo[targetID]) {
                    userName = userInfo[targetID].name || userName;
                    console.log(`👤 𝐹𝑜𝑢𝑛𝑑 𝑢𝑠𝑒𝑟: ${userName}`);
                } else {
                    console.log(`⚠️ 𝑈𝑠𝑒𝑟 𝑖𝑛𝑓𝑜 𝑛𝑜𝑡 𝑓𝑜𝑢𝑛𝑑 𝑓𝑜𝑟 𝐼𝐷: ${targetID}`);
                }
            } catch (userInfoError) {
                console.warn("𝑈𝑠𝑒𝑟 𝑖𝑛𝑓𝑜 𝑓𝑒𝑡𝑐ℎ 𝑤𝑎𝑟𝑛𝑖𝑛𝑔:", userInfoError.message);
                // Continue even if user info fails
            }

            // 🎯 Check if user is already in the group
            if (participantIDs.includes(targetID)) {
                return message.reply(`✅ ${userName} 𝑖𝑠 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝`);
            }

            // 🎯 Check if trying to add bot itself
            if (targetID === botID) {
                return message.reply("❌ 𝐼 𝑐𝑎𝑛'𝑡 𝑎𝑑𝑑 𝑚𝑦𝑠𝑒𝑙𝑓 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!");
            }

            // 🎯 Check if trying to add the command user
            if (targetID === event.senderID) {
                return message.reply("❌ 𝑌𝑜𝑢 𝑎𝑟𝑒 𝑎𝑙𝑟𝑒𝑎𝑑𝑦 𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝!");
            }

            // 🎯 Try to add the user to the group
            try {
                const addingMsg = await message.reply(`🔄 𝐴𝑡𝑡𝑒𝑚𝑝𝑡𝑖𝑛𝑔 𝑡𝑜 𝑎𝑑𝑑 ${userName} (${targetID}) 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝...`);
                
                // Add user to group
                await api.addUserToGroup(targetID, event.threadID);
                
                // Success message
                return message.reply(`✅ 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦 𝑎𝑑𝑑𝑒𝑑 ${userName} 𝑡𝑜 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝! 🎉\n\n👤 𝑈𝑠𝑒𝑟: ${userName}\n🆔 𝐼𝐷: ${targetID}\n👥 𝐺𝑟𝑜𝑢𝑝: ${threadInfo.name || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"}`);
                
            } catch (error) {
                console.error("𝐴𝑑𝑑 𝑢𝑠𝑒𝑟 𝑒𝑟𝑟𝑜𝑟:", error);
                
                let errorMessage = `❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑎𝑑𝑑 ${userName}: `;
                
                if (error.message.includes("approval") || error.message.includes("invite") || error.message.includes("request")) {
                    errorMessage = `📝 ${userName} ℎ𝑎𝑠 𝑏𝑒𝑒𝑛 𝑎𝑑𝑑𝑒𝑑 𝑡𝑜 𝑡ℎ𝑒 𝑎𝑝𝑝𝑟𝑜𝑣𝑎𝑙 𝑙𝑖𝑠𝑡. 𝑇ℎ𝑒𝑦 𝑛𝑒𝑒𝑑 𝑡𝑜 𝑎𝑐𝑐𝑒𝑝𝑡 𝑡ℎ𝑒 𝑖𝑛𝑣𝑖𝑡𝑎𝑡𝑖𝑜𝑛 𝑡𝑜 𝑗𝑜𝑖𝑛 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝.`;
                } else if (error.message.includes("friend") || error.message.includes("not friend")) {
                    errorMessage = `❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑎𝑑𝑑 ${userName}. 𝑇ℎ𝑒 𝑏𝑜𝑡 𝑚𝑢𝑠𝑡 𝑏𝑒 𝑓𝑟𝑖𝑒𝑛𝑑𝑠 𝑤𝑖𝑡ℎ 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑓𝑖𝑟𝑠𝑡.`;
                } else if (error.message.includes("privacy") || error.message.includes("setting")) {
                    errorMessage = `🔒 ${userName}'𝑠 𝑝𝑟𝑖𝑣𝑎𝑐𝑦 𝑠𝑒𝑡𝑡𝑖𝑛𝑔𝑠 𝑝𝑟𝑒𝑣𝑒𝑛𝑡 𝑎𝑑𝑑𝑖𝑛𝑔 𝑡𝑜 𝑔𝑟𝑜𝑢𝑝𝑠.`;
                } else if (error.message.includes("block") || error.message.includes("blocked")) {
                    errorMessage = `🚫 ${userName} ℎ𝑎𝑠 𝑏𝑙𝑜𝑐𝑘𝑒𝑑 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑜𝑟 𝑡ℎ𝑒 𝑏𝑜𝑡 𝑖𝑠 𝑏𝑙𝑜𝑐𝑘𝑒𝑑 𝑏𝑦 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟.`;
                } else if (error.message.includes("limit") || error.message.includes("full")) {
                    errorMessage = `📊 𝐺𝑟𝑜𝑢𝑝 𝑚𝑒𝑚𝑏𝑒𝑟 𝑙𝑖𝑚𝑖𝑡 𝑟𝑒𝑎𝑐ℎ𝑒𝑑 𝑜𝑟 𝑑𝑎𝑖𝑙𝑦 𝑎𝑑𝑑 𝑙𝑖𝑚𝑖𝑡 𝑒𝑥𝑐𝑒𝑒𝑑𝑒𝑑.`;
                } else if (error.message.includes("cannot add") || error.message.includes("invalid")) {
                    errorMessage = `❌ 𝐶𝑎𝑛𝑛𝑜𝑡 𝑎𝑑𝑑 ${userName}. 𝑇ℎ𝑒 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑚𝑎𝑦 𝑏𝑒 𝑖𝑛𝑣𝑎𝑙𝑖𝑑 𝑜𝑟 𝑡ℎ𝑒 𝑢𝑠𝑒𝑟 𝑑𝑜𝑒𝑠𝑛'𝑡 𝑒𝑥𝑖𝑠𝑡.`;
                } else {
                    errorMessage = `❌ 𝐶𝑜𝑢𝑙𝑑 𝑛𝑜𝑡 𝑎𝑑𝑑 ${userName}: ${error.message || "𝑈𝑛𝑘𝑛𝑜𝑤𝑛 𝑒𝑟𝑟𝑜𝑟"}`;
                }
                
                return message.reply(errorMessage);
            }

        } catch (error) {
            console.error("💥 𝐴𝑑𝑑𝑈𝑠𝑒𝑟 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
            
            let errorMessage = "❌ 𝐴𝑛 𝑢𝑛𝑒𝑥𝑝𝑒𝑐𝑡𝑒𝑑 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛 𝑙𝑎𝑡𝑒𝑟.";
            
            if (error.message.includes("threadInfo") || error.message.includes("thread")) {
                errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑎𝑐𝑐𝑒𝑠𝑠 𝑔𝑟𝑜𝑢𝑝 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑀𝑎𝑘𝑒 𝑠𝑢𝑟𝑒 𝐼'𝑚 𝑎𝑛 𝑎𝑑𝑚𝑖𝑛 𝑎𝑛𝑑 𝑡ℎ𝑒 𝑔𝑟𝑜𝑢𝑝 𝑖𝑠 𝑣𝑎𝑙𝑖𝑑.";
            } else if (error.message.includes("getUserInfo") || error.message.includes("user")) {
                errorMessage = "❌ 𝐹𝑎𝑖𝑙𝑒𝑑 𝑡𝑜 𝑔𝑒𝑡 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛. 𝑇ℎ𝑒 𝑢𝑠𝑒𝑟 𝐼𝐷 𝑚𝑎𝑦 𝑏𝑒 𝑖𝑛𝑣𝑎𝑙𝑖𝑑.";
            } else if (error.message.includes("network") || error.message.includes("ECONN")) {
                errorMessage = "🌐 𝑁𝑒𝑡𝑤𝑜𝑟𝑘 𝑒𝑟𝑟𝑜𝑟. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑐ℎ𝑒𝑐𝑘 𝑦𝑜𝑢𝑟 𝑖𝑛𝑡𝑒𝑟𝑛𝑒𝑡 𝑐𝑜𝑛𝑛𝑒𝑐𝑡𝑖𝑜𝑛.";
            } else if (error.message.includes("timeout") || error.message.includes("TIMEDOUT")) {
                errorMessage = "⏰ 𝑅𝑒𝑞𝑢𝑒𝑠𝑡 𝑡𝑖𝑚𝑒𝑑 𝑜𝑢𝑡. 𝑃𝑙𝑒𝑎𝑠𝑒 𝑡𝑟𝑦 𝑎𝑔𝑎𝑖𝑛.";
            }
            
            return message.reply(errorMessage);
        }
    }
};
