module.exports = {
    config: {
        name: "daily",
        aliases: [],
        version: "2.0.0",
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        countDown: 5,
        role: 0,
        category: "economy",
        shortDescription: {
            en: "💰 𝖣𝖠𝖨𝖫𝖸 𝖱𝖤𝖶𝖠𝖱𝖣 𝖲𝖸𝖲𝖳𝖤𝖬 | 𝖦𝖾𝗍 19𝖡+ 𝖢𝗈𝗂𝗇𝗌 𝖤𝗏𝖾𝗋𝗒 12 𝖧𝗈𝗎𝗋𝗌"
        },
        longDescription: {
            en: "𝖢𝗅𝖺𝗂𝗆 𝗒𝗈𝗎𝗋 𝖽𝖺𝗂𝗅𝗒 𝗋𝖾𝗐𝖺𝗋𝖽 𝗈𝖿 19𝖡+ 𝖼𝗈𝗂𝗇𝗌 𝖾𝗏𝖾𝗋𝗒 12 𝗁𝗈𝗎𝗋𝗌"
        },
        guide: {
            en: "{p}daily"
        },
        envConfig: {
            cooldownTime: 43200000, // 12 hours in milliseconds
            rewardCoin: 19011310000
        }
    },

    langs: {
        "en": {
            "cooldown": "🕒 𝖣𝖠𝖨𝖫𝖸 𝖢𝖮𝖮𝖫𝖣𝖮𝖶𝖭\n\n⏳ 𝖱𝖾𝗆𝖺𝗂𝗇𝗂𝗇𝗀 𝖳𝗂𝗆𝖾:\n⇝ %1𝗁 %2𝗆 %3𝗌\n\n📌 𝖭𝗈𝗍𝖾: 𝖸𝗈𝗎 𝖼𝖺𝗇 𝖼𝗅𝖺𝗂𝗆 𝖺𝗀𝖺𝗂𝗇 𝗂𝗇 12 𝗁𝗈𝗎𝗋𝗌",
            "rewarded": "✨ 𝖱𝖤𝖶𝖠𝖱𝖣 𝖢𝖫𝖠𝖨𝖬𝖤𝖣!\n\n💰 𝖠𝗆𝗈𝗎𝗇𝗍 𝖱𝖾𝖼𝖾𝗂𝗏𝖾𝖽:\n⇝ %1 𝖢𝗈𝗂𝗇𝗌\n\n🎯 𝖭𝖾𝗑𝗍 𝖱𝖾𝗐𝖺𝗋𝖽 𝗂𝗇:\n⇝ 12 𝖧𝗈𝗎𝗋𝗌\n\n💡 𝖳𝗂𝗉: 𝖢𝗈𝗆𝖾 𝖻𝖺𝖼𝗄 𝖽𝖺𝗂𝗅𝗒 𝖿𝗈𝗋 𝗆𝗈𝗋𝖾 𝗋𝖾𝗐𝖺𝗋𝖽𝗌!",
            "firstTime": "🎊 𝖥𝖨𝖱𝖲𝖳 𝖳𝖨𝖬𝖤 𝖡𝖮𝖭𝖴𝖲!\n\n✨ 𝖶𝖾𝗅𝖼𝗈𝗆𝖾 𝗍𝗈 𝖣𝖺𝗂𝗅𝗒 𝖱𝖾𝗐𝖺𝗋𝖽𝗌!\n\n💰 𝖠𝗆𝗈𝗎𝗇𝗍 𝖱𝖾𝖼𝖾𝗂𝗏𝖾𝖽:\n⇝ %1 𝖢𝗈𝗂𝗇𝗌\n\n🎯 𝖭𝖾𝗑𝗍 𝖱𝖾𝗐𝖺𝗋𝖽 𝗂𝗇:\n⇝ 12 𝖧𝗈𝗎𝗋𝗌\n\n💡 𝖳𝗂𝗉: 𝖢𝗅𝖺𝗂𝗆 𝖽𝖺𝗂𝗅𝗒 𝗍𝗈 𝖻𝗎𝗂𝗅𝖽 𝗒𝗈𝗎𝗋 𝖿𝗈𝗋𝗍𝗎𝗇𝖾!",
            "error": "❌ 𝖠𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗍𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗅𝖺𝗍𝖾𝗋."
        }
    },

    onStart: async function({ event, message, usersData, getText }) {
        try {
            const { cooldownTime, rewardCoin } = this.config.envConfig;
            const { senderID } = event;

            // Validate user data
            if (!usersData) {
                console.error("❌ 𝖴𝗌𝖾𝗋𝗌𝖣𝖺𝗍𝖺 𝗂𝗌 𝗇𝗈𝗍 𝖺𝗏𝖺𝗂𝗅𝖺𝖻𝗅𝖾");
                return message.reply(getText("error"));
            }

            let userData;
            try {
                userData = await usersData.get(senderID);
            } catch (dataError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗀𝖾𝗍𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", dataError);
                return message.reply(getText("error"));
            }

            // Initialize user data structure if needed
            if (!userData) {
                userData = {};
            }
            if (!userData.data) {
                userData.data = {};
            }

            const data = userData.data;
            
            // Check if user has claimed before
            const isFirstTime = !data.hasClaimedDaily;

            // Check cooldown
            if (data.dailyCoolDown && Date.now() - data.dailyCoolDown < cooldownTime) {
                const remaining = cooldownTime - (Date.now() - data.dailyCoolDown);
                const hours = Math.floor(remaining / 3600000);
                const minutes = Math.floor((remaining % 3600000) / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                
                return message.reply(
                    getText("cooldown", hours, minutes, seconds)
                );
            }

            // Calculate reward with first-time bonus
            const actualReward = isFirstTime ? Math.floor(rewardCoin * 1.5) : rewardCoin;
            
            // Update user data
            try {
                await usersData.increaseMoney(senderID, actualReward);
                
                // Update cooldown and claim status
                data.dailyCoolDown = Date.now();
                data.hasClaimedDaily = true;
                
                // Save updated data
                await usersData.set(senderID, userData);

                // Format the coin amount for display
                const formattedCoin = actualReward.toLocaleString('en-US');
                
                // Send success message
                return message.reply(
                    getText(isFirstTime ? "firstTime" : "rewarded", formattedCoin)
                );

            } catch (updateError) {
                console.error("❌ 𝖤𝗋𝗋𝗈𝗋 𝗎𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗎𝗌𝖾𝗋 𝖽𝖺𝗍𝖺:", updateError);
                return message.reply(getText("error"));
            }

        } catch (error) {
            console.error("💥 𝖣𝖺𝗂𝗅𝗒 𝖱𝖾𝗐𝖺𝗋𝖽 𝖤𝗋𝗋𝗈𝗋:", error);
            return message.reply(getText("error"));
        }
    }
};
