module.exports = {
    config: {
        name: "kickall",
        aliases: [],
        version: "1.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 3,
        role: 2,
        category: "group",
        shortDescription: {
            en: "𝖪𝗂𝖼𝗄 𝗈𝗎𝗍 𝖺𝗅𝗅 𝗇𝗈𝗇-𝖺𝖽𝗆𝗂𝗇 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗂𝗇𝗌𝗂𝖽𝖾 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉 🚫👥"
        },
        longDescription: {
            en: "𝖱𝖾𝗆𝗈𝗏𝖾𝗌 𝖺𝗅𝗅 𝗇𝗈𝗇-𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝗍𝗈𝗋 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 𝗍𝗁𝖾 𝖼𝗎𝗋𝗋𝖾𝗇𝗍 𝗀𝗋𝗈𝗎𝗉"
        },
        guide: {
            en: "{p}kickall"
        },
        dependencies: {}
    },

    langs: {
        "en": {
            "groupOnly": "❌ 𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖼𝖺𝗇 𝗈𝗇𝗅𝗒 𝖻𝖾 𝗎𝗌𝖾𝖽 𝗂𝗇 𝗀𝗋𝗈𝗎𝗉 𝖼𝗁𝖺𝗍𝗌!",
            "noMembersToKick": "⚠️ 𝖠𝗅𝗅 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖺𝗋𝖾 𝖾𝗂𝗍𝗁𝖾𝗋 𝖺𝖽𝗆𝗂𝗇𝗌 𝗈𝗋 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗂𝗍𝗌𝖾𝗅𝖿, 𝗇𝗈𝗍𝗁𝗂𝗇𝗀 𝗍𝗈 𝗄𝗂𝖼𝗄!",
            "preparingKick": "⏳ 𝖯𝗋𝖾𝗉𝖺𝗋𝗂𝗇𝗀 𝗍𝗈 𝗄𝗂𝖼𝗄 %1 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝖿𝗋𝗈𝗆 \"%2\". 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...",
            "kickCompleted": "✅ 𝖪𝗂𝖼𝗄𝖺𝗅𝗅 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾𝖽. %1 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗐𝖾𝗋𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽 𝗌𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒!",
            "kickFailed": "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗄𝗂𝖼𝗄 𝗎𝗌𝖾𝗋 %1. 𝖢𝗈𝗇𝗍𝗂𝗇𝗎𝗂𝗇𝗀 𝗐𝗂𝗍𝗁 𝗍𝗁𝖾 𝗇𝖾𝗑𝗍 𝗎𝗌𝖾𝗋..."
        }
    },

    onStart: async function({ message, event, api, getText }) {
        try {
            // Check if command is used in a group
            if (!event.isGroup) {
                return message.reply(getText("groupOnly"));
            }

            const { threadID, senderID } = event;

            try {
                // Fetch thread info with error handling
                const threadInfo = await api.getThreadInfo(threadID);
                const participantIDs = threadInfo.participantIDs || [];
                const adminIDs = (threadInfo.adminIDs || []).map(admin => admin.id);

                // Get bot ID
                const botID = api.getCurrentUserID();

                // Check if bot is admin
                const isBotAdmin = adminIDs.includes(botID);
                if (!isBotAdmin) {
                    return message.reply("❌ 𝖡𝗈𝗍 𝗇𝖾𝖾𝖽𝗌 𝖺𝖽𝗆𝗂𝗇 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                }

                // Check if user is admin
                const isUserAdmin = adminIDs.includes(senderID);
                if (!isUserAdmin) {
                    return message.reply("❌ 𝖮𝗇𝗅𝗒 𝖺𝖽𝗆𝗂𝗇𝗌 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽");
                }

                // Filter users to kick (exclude bot, command sender, and admins)
                const usersToKick = participantIDs.filter(userId => {
                    return userId !== botID &&
                           userId !== senderID &&
                           !adminIDs.includes(userId);
                });

                if (usersToKick.length === 0) {
                    return message.reply(getText("noMembersToKick"));
                }

                // Send preparation message
                const confirmationMsg = await message.reply(
                    getText("preparingKick", usersToKick.length, threadInfo.threadName || "𝖴𝗇𝗄𝗇𝗈𝗐𝗇 𝖦𝗋𝗈𝗎𝗉")
                );

                // Helper delay function
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

                let successCount = 0;
                let failCount = 0;
                const failedUsers = [];

                // Kick users one by one with enhanced error handling
                for (let i = 0; i < usersToKick.length; i++) {
                    const userId = usersToKick[i];

                    try {
                        // Add progressive delay to avoid rate limiting
                        await delay(3000 + (i * 500)); // 3-8 second delay range
                        
                        await api.removeUserFromGroup(userId, threadID);
                        console.log(`✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅𝗅𝗒 𝗄𝗂𝖼𝗄𝖾𝖽: ${userId}`);
                        successCount++;
                        
                        // Update progress every 5 users
                        if ((i + 1) % 5 === 0) {
                            try {
                                await message.reply(`📊 𝖯𝗋𝗈𝗀𝗋𝖾𝗌𝗌: ${i + 1}/${usersToKick.length} 𝗎𝗌𝖾𝗋𝗌 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝖾𝖽...`);
                            } catch (progressError) {
                                console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗌𝖾𝗇𝖽 𝗉𝗋𝗈𝗀𝗋𝖾𝗌𝗌 𝗎𝗉𝖽𝖺𝗍𝖾:", progressError.message);
                            }
                        }
                        
                    } catch (error) {
                        console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗄𝗂𝖼𝗄 ${userId}:`, error.message);
                        failCount++;
                        failedUsers.push(userId);
                        
                        // Check specific error types
                        if (error.message.includes('not admin') || error.message.includes('permission')) {
                            console.log(`❌ 𝖨𝗇𝗌𝗎𝖿𝖿𝗂𝖼𝗂𝖾𝗇𝗍 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇𝗌 𝖿𝗈𝗋 ${userId}`);
                        } else if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
                            console.log(`⚠️ 𝖱𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍 𝗁𝗂𝗍, 𝖺𝖽𝖽𝗂𝗇𝗀 𝖾𝗑𝗍𝗋𝖺 𝖽𝖾𝗅𝖺𝗒`);
                            await delay(10000); // Extra 10 second delay for rate limits
                        }
                        
                        await delay(2000); // Short delay if an error occurs
                    }
                }

                // Unsend the preparation message
                try {
                    if (confirmationMsg && confirmationMsg.messageID) {
                        await api.unsendMessage(confirmationMsg.messageID);
                    }
                } catch (unsendError) {
                    console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝗎𝗇𝗌𝖾𝗇𝖽 𝗉𝗋𝖾𝗉𝖺𝗋𝖺𝗍𝗂𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", unsendError.message);
                }

                // Completion message
                let completionMessage = `✅ 𝖪𝗂𝖼𝗄𝖺𝗅𝗅 𝗉𝗋𝗈𝖼𝖾𝗌𝗌 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝖾𝖽!\n\n` +
                                      `📊 𝖱𝖾𝗌𝗎𝗅𝗍𝗌:\n` +
                                      `• ✅ 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅: ${successCount}\n` +
                                      `• ❌ 𝖥𝖺𝗂𝗅𝖾𝖽: ${failCount}\n` +
                                      `• 📝 𝖳𝗈𝗍𝖺𝗅: ${usersToKick.length}`;

                if (failedUsers.length > 0) {
                    completionMessage += `\n\n⚠️ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 ${failedUsers.length} 𝗎𝗌𝖾𝗋(𝗌). 𝖳𝗁𝖾𝗒 𝗆𝖺𝗒 𝖻𝖾 𝖿𝗋𝗂𝖾𝗇𝖽𝗌 𝗈𝖿 𝖺𝖽𝗆𝗂𝗇𝗌 𝗈𝗋 𝗁𝖺𝗏𝖾 𝗋𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝗂𝗈𝗇𝗌.`;
                }

                const finalMessage = await message.reply(completionMessage);

                // Auto-delete completion message after 30 seconds
                setTimeout(async () => {
                    try {
                        if (finalMessage && finalMessage.messageID) {
                            await api.unsendMessage(finalMessage.messageID);
                        }
                    } catch (deleteError) {
                        console.warn("𝖢𝗈𝗎𝗅𝖽 𝗇𝗈𝗍 𝖺𝗎𝗍𝗈-𝖽𝖾𝗅𝖾𝗍𝖾 𝖼𝗈𝗆𝗉𝗅𝖾𝗍𝗂𝗈𝗇 𝗆𝖾𝗌𝗌𝖺𝗀𝖾:", deleteError.message);
                    }
                }, 30000);

            } catch (threadError) {
                console.error("𝖤𝗋𝗋𝗈𝗋 𝖿𝖾𝗍𝖼𝗁𝗂𝗇𝗀 𝗍𝗁𝗋𝖾𝖺𝖽 𝗂𝗇𝖿𝗈:", threadError);
                return message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝖼𝖼𝖾𝗌𝗌 𝗀𝗋𝗈𝗎𝗉 𝗂𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.");
            }

        } catch (error) {
            console.error("💥 𝖤𝗋𝗋𝗈𝗋 𝗂𝗇 𝗄𝗂𝖼𝗄𝖺𝗅𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖾𝗑𝖾𝖼𝗎𝗍𝗂𝗈𝗇:", error);
            
            let errorMessage = "❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖾𝗑𝖾𝖼𝗎𝗍𝖾 𝗄𝗂𝖼𝗄𝖺𝗅𝗅 𝖼𝗈𝗆𝗆𝖺𝗇𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋.";
            
            if (error.message.includes('permission') || error.message.includes('admin')) {
                errorMessage = "❌ 𝖯𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖾𝗋𝗋𝗈𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗌𝗎𝗋𝖾 𝖻𝗈𝗍 𝖺𝗇𝖽 𝗎𝗌𝖾𝗋 𝖺𝗋𝖾 𝖺𝖽𝗆𝗂𝗇𝗌.";
            } else if (error.message.includes('rate limit')) {
                errorMessage = "❌ 𝖱𝖺𝗍𝖾 𝗅𝗂𝗆𝗂𝗍 𝖾𝗑𝖼𝖾𝖾𝖽𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍 𝖺 𝖿𝖾𝗐 𝗆𝗂𝗇𝗎𝗍𝖾𝗌 𝖻𝖾𝖿𝗈𝗋𝖾 𝗍𝗋𝗒𝗂𝗇𝗀 𝖺𝗀𝖺𝗂𝗇.";
            }
            
            await message.reply(errorMessage);
        }
    }
};
