module.exports = {
    config: {
        name: "autoreact",
        aliases: [],
        version: "1.1.1",
        author: "Asif Mahmud",
        countDown: 0,
        role: 0,
        category: "no-prefix",
        shortDescription: {
            en: "🤖 𝖡𝗈𝗍 𝖺𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇"
        },
        longDescription: {
            en: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝗋𝖾𝖺𝖼𝗍𝗌 𝗍𝗈 𝗌𝗉𝖾𝖼𝗂𝖿𝗂𝖼 𝗄𝖾𝗒𝗐𝗈𝗋𝖽𝗌 𝗂𝗇 𝖼𝗁𝖺𝗍"
        },
        guide: {
            en: ""
        },
        dependencies: {}
    },

    onChat: async function({ api, event }) {
        try {
            // 𝖯𝗋𝖾𝗏𝖾𝗇𝗍 𝖻𝗈𝗍 𝖿𝗋𝗈𝗆 𝗋𝖾𝖺𝖼𝗍𝗂𝗇𝗀 𝗍𝗈 𝗂𝗍𝗌𝖾𝗅𝖿
            if (event.senderID === api.getCurrentUserID()) return;
            
            if (!event.body || typeof event.body !== 'string') return;
            
            let react = event.body.toLowerCase().trim();
            const { threadID, messageID } = event;

            // 𝖲𝗈𝗎𝗅 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            if (react.includes("atma") || react.includes("roh") || react.includes("soul") || react.includes("spirit")) {
                try {
                    await api.setMessageReaction("🖤", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 🖤 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗌𝗈𝗎𝗅 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖫𝗈𝗏𝖾/𝖠𝖿𝖿𝖾𝖼𝗍𝗂𝗈𝗇 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("bhalobasha") || react.includes("prem") || react.includes("maya") || 
                     react.includes("ador") || react.includes("kiss") || react.includes("chumma") || 
                     react.includes("shona") || react.includes("jaan") || react.includes("priyo") ||
                     react.includes("love") || react.includes("affection") || react.includes("darling") ||
                     react.includes("sweetheart") || react.includes("beloved")) {
                try {
                    await api.setMessageReaction("❤️", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 ❤️ 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗅𝗈𝗏𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖲𝖺𝖽𝗇𝖾𝗌𝗌 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("dukkho") || react.includes("kanna") || react.includes("kando") || 
                     react.includes("ashru") || react.includes("mon kharap") || react.includes("bedona") ||
                     react.includes("sad") || react.includes("cry") || react.includes("tears") ||
                     react.includes("unhappy") || react.includes("depressed") || react.includes("pain")) {
                try {
                    await api.setMessageReaction("😢", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 😢 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗌𝖺𝖽 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖡𝖺𝗇𝗀𝗅𝖺𝖽𝖾𝗌𝗁 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("bangladesh") || react.includes("bd") || react.includes("sonar bangla") || 
                     react.includes("desh") || react.includes("dhaka") || react.includes("chattogram") ||
                     react.includes("bangla") || react.includes("bengali") || react.includes("flag")) {
                try {
                    await api.setMessageReaction("🇧🇩", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 🇧🇩 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝖡𝖣 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖦𝗋𝖾𝖾𝗍𝗂𝗇𝗀𝗌/𝖳𝗂𝗆𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("shokal") || react.includes("bikal") || react.includes("sha") || 
                     react.includes("rat") || react.includes("khabar") || react.includes("ghum") ||
                     react.includes("good morning") || react.includes("good afternoon") || react.includes("good night") ||
                     react.includes("hello") || react.includes("hi") || react.includes("hey") ||
                     react.includes("morning") || react.includes("evening") || react.includes("night") ||
                     react.includes("food") || react.includes("eat") || react.includes("sleep")) {
                try {
                    await api.setMessageReaction("❤", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 ❤ 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗀𝗋𝖾𝖾𝗍𝗂𝗇𝗀 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖲𝗎𝗋𝗉𝗋𝗂𝗌𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("wah") || react.includes("oshadharon") || react.includes("roboter") ||
                     react.includes("wow") || react.includes("amazing") || react.includes("awesome") ||
                     react.includes("incredible") || react.includes("fantastic") || react.includes("great") ||
                     react.includes("surprise") || react.includes("unbelievable")) {
                try {
                    await api.setMessageReaction("😮", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 😮 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗌𝗎𝗋𝗉𝗋𝗂𝗌𝖾 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖫𝖺𝗎𝗀𝗁𝗍𝖾𝗋 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("haha") || react.includes("hehe") || react.includes("lol") ||
                     react.includes("funny") || react.includes("joke") || react.includes("comedy") ||
                     react.includes("hasu") || react.includes("hasi")) {
                try {
                    await api.setMessageReaction("😂", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 😂 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗅𝖺𝗎𝗀𝗁 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖠𝗇𝗀𝗋𝗒 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("rag") || react.includes("anger") || react.includes("angry") ||
                     react.includes("frustrated") || react.includes("mad") || react.includes("upset") ||
                     react.includes("krodh") || react.includes("goshol")) {
                try {
                    await api.setMessageReaction("😠", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 😠 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝖺𝗇𝗀𝗋𝗒 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

            // 𝖳𝗁𝗎𝗆𝖻𝗌 𝗎𝗉 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇
            else if (react.includes("thanks") || react.includes("thank you") || react.includes("dhanyabad") ||
                     react.includes("appreciate") || react.includes("grateful") || react.includes("good job") ||
                     react.includes("well done") || react.includes("excellent")) {
                try {
                    await api.setMessageReaction("👍", messageID, () => {}, true);
                    console.log(`✅ 𝖱𝖾𝖺𝖼𝗍𝖾𝖽 𝗐𝗂𝗍𝗁 👍 𝗍𝗈: ${react.substring(0, 50)}`);
                } catch (reactionError) {
                    console.error("❌ 𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗌𝖾𝗍 𝗍𝗁𝖺𝗇𝗄𝗌 𝗋𝖾𝖺𝖼𝗍𝗂𝗈𝗇:", reactionError.message);
                }
            }

        } catch (error) {
            console.error("💥 𝖠𝗎𝗍𝗈𝗋𝖾𝖺𝖼𝗍 𝖤𝗋𝗋𝗈𝗋:", error);
            // 𝖣𝗈𝗇'𝗍 𝗌𝖾𝗇𝖽 𝖾𝗋𝗋𝗈𝗋 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖺𝗏𝗈𝗂𝖽 𝗌𝗉𝖺𝗆
        }
    },

    onStart: async function() {
        // 𝖭𝗈 𝗂𝗇𝗂𝗍𝗂𝖺𝗅 𝖺𝖼𝗍𝗂𝗈𝗇 𝗇𝖾𝖾𝖽𝖾𝖽
        console.log("🤖 𝖠𝗎𝗍𝗈𝗋𝖾𝖺𝖼𝗍 𝗌𝗒𝗌𝗍𝖾𝗆 𝗂𝗌 𝗇𝗈𝗐 𝖺𝖼𝗍𝗂𝗏𝖾!");
    }
};
