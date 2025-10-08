module.exports = {
    config: {
        name: "antiout",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 5,
        role: 1,
        shortDescription: {
            en: "𝖤𝗇𝖺𝖻𝗅𝖾 𝗈𝗋 𝖽𝗂𝗌𝖺𝖻𝗅𝖾 𝖺𝗇𝗍𝗂𝗈𝗎𝗍"
        },
        longDescription: {
            en: "𝖯𝗋𝖾𝗏𝖾𝗇𝗍𝗌 𝗎𝗌𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 𝗅𝖾𝖺𝗏𝗂𝗇𝗀 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒"
        },
        category: "group",
        guide: {
            en: "{p}antiout [𝗈𝗇 | 𝗈𝖿𝖿]"
        },
        dependencies: {
            "fs-extra": ""
        }
    },

    onStart: async function({ message, event, args, threadsData, api }) {
        try {
            // Dependency check
            let fsAvailable = true;
            try {
                require("fs-extra");
            } catch (e) {
                fsAvailable = false;
            }

            if (!fsAvailable) {
                return message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌-𝖾𝗑𝗍𝗋𝖺.");
            }

            const { threadID, senderID } = event;

            // Check if user provided argument
            if (!args[0]) {
                return message.reply(
                    "𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿':\n\n" +
                    "• {p}antiout 𝗈𝗇 - 𝖤𝗇𝖺𝖻𝗅𝖾 𝖺𝗇𝗍𝗂-𝗅𝖾𝖺𝗏𝖾\n" +
                    "• {p}antiout 𝗈𝖿𝖿 - 𝖣𝗂𝗌𝖺𝖻𝗅𝖾 𝖺𝗇𝗍𝗂-𝗅𝖾𝖺𝗏𝖾"
                );
            }

            const action = args[0].toLowerCase().trim();
            
            if (action !== 'on' && action !== 'off') {
                return message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗈𝗉𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗎𝗌𝖾 '𝗈𝗇' 𝗈𝗋 '𝗈𝖿𝖿'");
            }

            try {
                // Get thread info to check admin status
                const threadInfo = await api.getThreadInfo(threadID);
                const botID = api.getCurrentUserID();
                
                // Check if bot is admin
                const isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
                if (!isBotAdmin) {
                    return message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝗆𝖺𝗇𝖺𝗀𝖾 𝖺𝗇𝗍𝗂𝗈𝗎𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌");
                }

                // Check if user is admin
                const isUserAdmin = threadInfo.adminIDs?.some(admin => admin.id === senderID);
                if (!isUserAdmin) {
                    return message.reply("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                }

                const isEnabled = action === 'on';
                
                // Save the setting with error handling
                try {
                    await threadsData.set(threadID, isEnabled, "settings.antiout");
                    console.log(`✅ 𝖠𝗇𝗍𝗂𝗈𝗎𝗍 ${action} 𝖿𝗈𝗋 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                } catch (saveError) {
                    console.error("𝖤𝗋𝗋𝗈𝗋 𝗌𝖺𝗏𝗂𝗇𝗀 𝖺𝗇𝗍𝗂𝗈𝗎𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀:", saveError);
                    return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗌𝖾𝗍𝗍𝗂𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇.");
                }

                const statusMessage = `𝖠𝗇𝗍𝗂𝗈𝗎𝗍 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 ${isEnabled ? '✅ 𝖾𝗇𝖺𝖻𝗅𝖾𝖽' : '❌ 𝖽𝗂𝗌𝖺𝖻𝗅𝖾𝖽'} 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗀𝗋𝗈𝗎𝗉.`;

                return message.reply(statusMessage);
                
            } catch (apiError) {
                console.error("𝖠𝖯𝖨 𝖤𝗋𝗋𝗈𝗋:", apiError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖠𝗇𝗍𝗂𝗈𝗎𝗍 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗋𝗋𝗈𝗋:", error);
            
            let errorMessage = "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('threadsData')) {
                errorMessage = "❌ 𝖣𝖺𝗍𝖺𝗌𝗍𝗈𝗋𝖾 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝖻𝗈𝗍'𝗌 𝖼𝗈𝗇𝖿𝗂𝗀𝗎𝗋𝖺𝗍𝗂𝗈𝗇.";
            } else if (error.message.includes('permission')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗁𝖾𝖼𝗄 𝖻𝗈𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌.";
            }
            
            await message.reply(errorMessage);
        }
    },

    onEvent: async function({ api, event, threadsData }) {
        try {
            // Only process unsubscribe events
            if (event.logMessageType !== "log:unsubscribe") {
                return;
            }

            const { threadID, logMessageData } = event;

            // Check if antiout is enabled for this thread
            let antioutEnabled = false;
            try {
                antioutEnabled = await threadsData.get(threadID, "settings.antiout");
            } catch (dataError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝖺𝗇𝗍𝗂𝗈𝗎𝗍 𝗌𝖾𝗍𝗍𝗂𝗇𝗀:", dataError);
                return;
            }

            if (!antioutEnabled || !logMessageData || !logMessageData.leftParticipantFbId) {
                return;
            }

            const userId = logMessageData.leftParticipantFbId;
            const botID = api.getCurrentUserID();

            // Don't process if bot is the one who left
            if (userId === botID) {
                return;
            }

            console.log(`🚫 𝖴𝗌𝖾𝗋 ${userId} 𝗅𝖾𝖿𝗍 𝗀𝗋𝗈𝗎𝗉 ${threadID}, 𝖺𝗍𝗍𝖾𝗆𝗉𝗍𝗂𝗇𝗀 𝗍𝗈 𝖺𝖽𝖽 𝖻𝖺𝖼𝗄...`);

            try {
                // Check if bot is still admin
                const threadInfo = await api.getThreadInfo(threadID);
                const isBotAdmin = threadInfo.adminIDs?.some(admin => admin.id === botID);
                
                if (!isBotAdmin) {
                    console.log("❌ 𝖡𝗈𝗍 𝗂𝗌 𝗇𝗈 𝗅𝗈𝗇𝗀𝖾𝗋 𝖺𝖽𝗆𝗂𝗇, 𝖼𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋 𝖻𝖺𝖼𝗄");
                    return;
                }

                // Add a small delay to ensure clean state
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Try to add the user back
                await api.addUserToGroup(userId, threadID);
                console.log(`✅ 𝖴𝗌𝖾𝗋 ${userId} 𝗐𝖺𝗌 𝖺𝖽𝖽𝖾𝖽 𝖻𝖺𝖼𝗄 𝗍𝗈 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉`);
                
                // Send a notification message
                try {
                    await api.sendMessage(
                        `⚠️ 𝖴𝗌𝖾𝗋 𝗍𝗋𝗂𝖾𝖽 𝗍𝗈 𝗅𝖾𝖺𝗏𝖾 𝖻𝗎𝗍 𝗐𝖺𝗌 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖺𝖽𝖽𝖾𝖽 𝖻𝖺𝖼𝗄!\n🔒 𝖠𝗇𝗍𝗂𝗈𝗎𝗍 𝖲𝗒𝗌𝗍𝖾𝗆: 𝖠𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽`,
                        threadID
                    );
                } catch (messageError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝗇𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", messageError);
                }
                
            } catch (addError) {
                console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋 ${userId} 𝖻𝖺𝖼𝗄:`, addError.message);
                
                // Check specific error types
                if (addError.message.includes('not friends') || addError.message.includes('friend')) {
                    console.log(`❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋 ${userId} - 𝗇𝗈𝗍 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗐𝗂𝗍𝗁 𝖻𝗈𝗍`);
                } else if (addError.message.includes('block') || addError.message.includes('restrict')) {
                    console.log(`❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋 ${userId} - 𝗎𝗌𝖾𝗋 𝗁𝖺𝗌 𝖻𝗅𝗈𝖼𝗄𝖾𝖽 𝖻𝗈𝗍`);
                } else if (addError.message.includes('admin') || addError.message.includes('permission')) {
                    console.log(`❌ 𝖢𝖺𝗇𝗇𝗈𝗍 𝖺𝖽𝖽 𝗎𝗌𝖾𝗋 ${userId} - 𝗂𝗇𝗌𝗎𝖿𝖿𝗂𝖼𝗂𝖾𝗇𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌`);
                }
            }
        } catch (error) {
            console.error("💥 𝖠𝗇𝗍𝗂𝗈𝗎𝗍 𝖾𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
