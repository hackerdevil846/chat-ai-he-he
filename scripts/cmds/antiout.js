const fs = require("fs-extra");
const path = require("path");

// Store antiout settings globally
const antioutSettings = new Map();

module.exports = {
    config: {
        name: "antiout",
        aliases: [],
        version: "5.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Auto enable antiout in all groups"
        },
        longDescription: {
            en: "Prevents users from leaving the group by automatically adding them back. Always ON system."
        },
        category: "group",
        guide: {
            en: "{p}antiout [on | off]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    // 🟢 When bot starts, enable antiout in all groups
    onLoad: async function({ threadsData }) {
        try {
            console.log("🔄 Auto-enabling antiout in ALL groups...");
            
            const allThreads = await threadsData.getAll();
            let enabledCount = 0;

            for (const thread of allThreads) {
                try {
                    if (thread && thread.id) {
                        await threadsData.set(thread.id, true, "settings.antiout");
                        antioutSettings.set(thread.id, true);
                        console.log(`✅ Auto-enabled antiout for group: ${thread.id}`);
                        enabledCount++;
                    }
                } catch (error) {
                    console.error(`❌ Failed to auto-enable antiout for thread ${thread?.id}:`, error.message);
                }
            }
            console.log(`✅ Antiout auto-enabled in ${enabledCount} groups`);
        } catch (error) {
            console.error("❌ Error initializing antiout:", error);
        }
    },

    onStart: async function({ message, event, args, threadsData, api }) {
        try {
            const { threadID } = event;

            // Manual control option
            if (args[0]) {
                const action = args[0].toLowerCase().trim();
                
                if (action === 'off') {
                    await threadsData.set(threadID, false, "settings.antiout");
                    antioutSettings.set(threadID, false);
                    return message.reply("❌ Antiout has been disabled for this group.");
                }
                else if (action === 'on') {
                    await threadsData.set(threadID, true, "settings.antiout");
                    antioutSettings.set(threadID, true);
                    return message.reply("✅ Antiout has been enabled for this group.");
                }
            }

            const isEnabled = antioutSettings.get(threadID) || true;
            const status = isEnabled ? "✅ Enabled" : "❌ Disabled";
            
            return message.reply(
                `🔒 Antiout Status: ${status}\n\n` +
                "Usage:\n" +
                "• {p}antiout on - Enable anti-leave\n" +
                "• {p}antiout off - Disable anti-leave\n" +
                "Note: Antiout is automatically enabled in all groups by default."
            );

        } catch (error) {
            console.error("💥 Antiout command error:", error);
            await message.reply("❌ An error occurred. Please try again later.");
        }
    },

    // ⚡ Main event listener - FIXED PERMISSION HANDLING
    onEvent: async function({ api, event, threadsData }) {
        try {
            // Only run when someone leaves group
            if (event.logMessageType !== "log:unsubscribe") return;

            const { threadID, logMessageData } = event;
            if (!logMessageData || !logMessageData.leftParticipantFbId) return;

            const userId = logMessageData.leftParticipantFbId;
            const botID = api.getCurrentUserID();

            // Skip if bot itself left
            if (userId === botID) return;

            // Check if antiout is enabled
            let antioutEnabled = antioutSettings.get(threadID);
            if (antioutEnabled === undefined) {
                antioutEnabled = await threadsData.get(threadID, "settings.antiout");
                antioutSettings.set(threadID, antioutEnabled);
            }
            
            if (!antioutEnabled) return;

            // Get user name
            let userName = "এই আবাল";
            try {
                const userInfo = await api.getUserInfo(userId);
                userName = userInfo[userId]?.name || "এই আবাল";
            } catch (e) {
                console.warn("⚠️ Couldn't fetch user name:", e.message);
            }

            console.log(`🚫 User ${userName} left group ${threadID}, attempting to add back...`);

            // Small delay before processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 🎯 FIXED: ALWAYS TRY TO ADD BACK REGARDLESS OF PERMISSIONS
            try {
                // Try to add user back directly without checking permissions first
                await api.addUserToGroup(userId, threadID);
                console.log(`✅ Successfully added back ${userName} to group ${threadID}`);

                // Send success message
                await api.sendMessage(
                    `শোন, ${userName} এই গ্রুপ হইলো গ্যাং! 🔥\n` +
                    `এখান থেকে যাইতে হইলে এডমিনের ক্লিয়ারেন্স লাগে!\n` +
                    `তুই পারমিশন ছাড়া লিভ নিছোস – তোকে আবার মাফিয়া স্টাইলে এড দিলাম। 🔫`,
                    threadID
                );

            } catch (addError) {
                console.log(`❌ Failed to add ${userName}: ${addError.message}`);
                
                // Get thread info to understand why it failed
                try {
                    const threadInfo = await api.getThreadInfo(threadID);
                    const isBotAdmin = threadInfo.adminIDs?.some(a => a.id === botID);
                    
                    if (isBotAdmin) {
                        // Bot is admin but still failed - send error message
                        await api.sendMessage(
                            `সরি বস ${userName} এই আবালরে এড করতে পারলাম না😞`,
                            threadID
                        );
                    }
                    // If bot is not admin, stay silent (no message)
                    
                } catch (infoError) {
                    console.log("⚠️ Could not get thread info:", infoError.message);
                    // Stay silent if we can't get thread info
                }
            }

        } catch (error) {
            console.error("💥 Antiout event handler error:", error);
        }
    },

    // 🔄 Auto-enable antiout when bot joins new group
    handleBotJoin: async function({ threadID, threadsData }) {
        try {
            await threadsData.set(threadID, true, "settings.antiout");
            antioutSettings.set(threadID, true);
            console.log(`✅ Antiout auto-enabled for new group: ${threadID}`);
        } catch (error) {
            console.error("❌ Error auto-enabling antiout for new group:", error);
        }
    }
};
