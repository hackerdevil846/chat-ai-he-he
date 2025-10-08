const fs = require("fs");
const path = require("path");

const LOCKS_PATH = path.join(__dirname, "../../../includes/database/nameLocks.json");
const OWNER_UID = "61571630409265"; // 🔒 Owner UID

module.exports = {
    config: {
        name: "autosetname",
        aliases: [],
        version: "1.0",
        author: "Asif Mahmud",
        countDown: 3,
        role: 2,
        category: "utility",
        shortDescription: {
            en: "🔒 𝖴𝗌𝖾𝗋 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗀𝗋𝗈𝗎𝗉 𝗅𝗈𝖼𝗄/𝗎𝗇𝗅𝗈𝖼𝗄"
        },
        longDescription: {
            en: "𝖦𝗋𝗈𝗎𝗉 𝗎𝗌𝖾𝗋 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄 𝖺𝗇𝖽 𝗎𝗇𝗅𝗈𝖼𝗄 𝖼𝗈𝗆𝗆𝖺𝗇𝖽"
        },
        guide: {
            en: "{p}autosetname [𝗅𝗈𝖼𝗄/𝗎𝗇𝗅𝗈𝖼𝗄] @𝗆𝖾𝗇𝗍𝗂𝗈𝗇 [𝗇𝖺𝗆𝖾]"
        },
        dependencies: {
            "fs": "",
            "path": ""
        }
    },

    onStart: async function({ message, event, args, api }) {
        try {
            // Dependency check
            let dependenciesAvailable = true;
            try {
                require("fs");
                require("path");
            } catch (e) {
                dependenciesAvailable = false;
            }

            if (!dependenciesAvailable) {
                return await message.reply("❌ 𝖬𝗂𝗌𝗌𝗂𝗇𝗀 𝖽𝖾𝗉𝖾𝗇𝖽𝖾𝗇𝖼𝗂𝖾𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗂𝗇𝗌𝗍𝖺𝗅𝗅 𝖿𝗌 𝖺𝗇𝖽 𝗉𝖺𝗍𝗁.");
            }

            // Check if user is owner
            if (event.senderID !== OWNER_UID) {
                return await message.reply("❌ 𝖮𝗇𝗅𝗒 𝗈𝗐𝗇𝖾𝗋 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽!");
            }

            // Validate arguments
            if (!args[0] || !event.mentions || Object.keys(event.mentions).length === 0) {
                return await message.reply("❌ 𝖴𝗌𝖺𝗀𝖾: 𝗅𝗈𝖼𝗄/𝗎𝗇𝗅𝗈𝖼𝗄 @𝗆𝖾𝗇𝗍𝗂𝗈𝗇 𝖭𝖺𝗆𝖾");
            }

            const action = args[0].toLowerCase();
            
            if (action !== 'lock' && action !== 'unlock') {
                return await message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝖺𝖼𝗍𝗂𝗈𝗇! 𝖴𝗌𝖾: 𝗅𝗈𝖼𝗄 𝗈𝗋 𝗎𝗇𝗅𝗈𝖼𝗄");
            }

            const mentionedID = Object.keys(event.mentions)[0];
            
            // Validate mentioned user ID
            if (!mentionedID || isNaN(mentionedID)) {
                return await message.reply("❌ 𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗎𝗌𝖾𝗋 𝖨𝖣!");
            }

            // Extract name from arguments (remove mention part)
            let nameArgs = args.slice(1).join(" ");
            const mentionRegex = new RegExp(`@${mentionedID}\\s*`, "i");
            nameArgs = nameArgs.replace(mentionRegex, '').trim();

            // Load existing locks with error handling
            let locks = {};
            try {
                if (fs.existsSync(LOCKS_PATH)) {
                    const locksData = fs.readFileSync(LOCKS_PATH, "utf-8");
                    locks = JSON.parse(locksData);
                }
            } catch (readError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝗅𝗈𝖼𝗄𝗌 𝖿𝗂𝗅𝖾:", readError);
                return await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝖺𝖽 𝗅𝗈𝖼𝗄𝗌 𝖽𝖺𝗍𝖺𝖻𝖺𝗌𝖾!");
            }

            const threadID = event.threadID.toString();
            if (!locks[threadID]) {
                locks[threadID] = {};
            }

            // Lock action
            if (action === "lock") {
                if (!nameArgs) {
                    return await message.reply("❌ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗅𝗈𝖼𝗄!");
                }

                // Validate name length
                if (nameArgs.length > 50) {
                    return await message.reply("❌ 𝖭𝖺𝗆𝖾 𝗍𝗈𝗈 𝗅𝗈𝗇𝗀! 𝖬𝖺𝗑𝗂𝗆𝗎𝗆 50 𝖼𝗁𝖺𝗋𝖺𝖼𝗍𝖾𝗋𝗌.");
                }

                // Save lock to database
                locks[threadID][mentionedID] = nameArgs;
                
                try {
                    fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
                    console.log(`✅ 𝖭𝖺𝗆𝖾 𝗅𝗈𝖼𝗄𝖾𝖽: ${mentionedID} -> ${nameArgs} 𝗂𝗇 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                } catch (writeError) {
                    console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗋𝗂𝗍𝗂𝗇𝗀 𝗅𝗈𝖼𝗄𝗌 𝖿𝗂𝗅𝖾:", writeError);
                    return await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄!");
                }
                
                // Change nickname using API
                try {
                    await api.changeNickname(nameArgs, threadID, mentionedID);
                    return await message.reply(`🔒 𝖭𝖺𝗆𝖾 𝗅𝗈𝖼𝗄𝖾𝖽: ${nameArgs}`);
                } catch (nicknameError) {
                    console.error("❌ 𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝖾𝗋𝗋𝗈𝗋:", nicknameError);
                    return await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾. 𝖭𝖺𝗆𝖾 𝗌𝖺𝗏𝖾𝖽 𝖻𝗎𝗍 𝗇𝗈𝗍 𝖺𝗉𝗉𝗅𝗂𝖾𝖽.");
                }
            }

            // Unlock action
            if (action === "unlock") {
                if (locks[threadID] && locks[threadID][mentionedID]) {
                    const oldName = locks[threadID][mentionedID];
                    delete locks[threadID][mentionedID];
                    
                    try {
                        fs.writeFileSync(LOCKS_PATH, JSON.stringify(locks, null, 2));
                        console.log(`🔓 𝖭𝖺𝗆𝖾 𝗎𝗇𝗅𝗈𝖼𝗄𝖾𝖽: ${mentionedID} 𝗂𝗇 𝗍𝗁𝗋𝖾𝖺𝖽 ${threadID}`);
                    } catch (writeError) {
                        console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗐𝗋𝗂𝗍𝗂𝗇𝗀 𝗅𝗈𝖼𝗄𝗌 𝖿𝗂𝗅𝖾:", writeError);
                        return await message.reply("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖺𝗏𝖾 𝗎𝗇𝗅𝗈𝖼𝗄 𝗌𝗍𝖺𝗍𝗎𝗌!");
                    }
                    
                    // Try to reset nickname
                    try {
                        await api.changeNickname("", threadID, mentionedID);
                        return await message.reply(`🔓 𝖭𝖺𝗆𝖾 𝗎𝗇𝗅𝗈𝖼𝗄𝖾𝖽! (${oldName})`);
                    } catch (nicknameError) {
                        console.error("❌ 𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝗋𝖾𝗌𝖾𝗍 𝖾𝗋𝗋𝗈𝗋:", nicknameError);
                        return await message.reply(`🔓 𝖭𝖺𝗆𝖾 𝗎𝗇𝗅𝗈𝖼𝗄𝖾𝖽! (${oldName}) - 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗌𝖾𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾`);
                    }
                } else {
                    return await message.reply("⚠️ 𝖭𝗈 𝗇𝖺𝗆𝖾 𝗅𝗈𝖼𝗄 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗎𝗌𝖾𝗋!");
                }
            }

        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗌𝖾𝗍𝗇𝖺𝗆𝖾 𝖾𝗋𝗋𝗈𝗋:", error);
            await message.reply("❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍");
        }
    },

    // Handle nickname changes automatically
    onEvent: async function({ event, api }) {
        try {
            if (event.logMessageType === 'log:thread-nickname') {
                const { threadID, logMessageData } = event;
                const participantID = logMessageData.participant_id;
                const newNickname = logMessageData.nickname;

                // Load locks
                let locks = {};
                if (fs.existsSync(LOCKS_PATH)) {
                    locks = JSON.parse(fs.readFileSync(LOCKS_PATH, "utf-8"));
                }

                // Check if user has locked nickname
                if (locks[threadID] && locks[threadID][participantID]) {
                    const lockedName = locks[threadID][participantID];
                    
                    // If nickname changed from locked name, revert it
                    if (newNickname !== lockedName) {
                        try {
                            await api.changeNickname(lockedName, threadID, participantID);
                            console.log(`🔄 𝖠𝗎𝗍𝗈-𝗋𝖾𝗏𝖾𝗋𝗍𝖾𝖽 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾 𝖿𝗈𝗋 ${participantID} 𝗍𝗈: ${lockedName}`);
                        } catch (revertError) {
                            console.error(`❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝖺𝗎𝗍𝗈-𝗋𝖾𝗏𝖾𝗋𝗍 𝗇𝗂𝖼𝗄𝗇𝖺𝗆𝖾:`, revertError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗌𝖾𝗍𝗇𝖺𝗆𝖾 𝖾𝗏𝖾𝗇𝗍 𝗁𝖺𝗇𝖽𝗅𝖾𝗋 𝖾𝗋𝗋𝗈𝗋:", error);
        }
    }
};
