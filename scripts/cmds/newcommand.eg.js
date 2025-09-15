module.exports = {
    config: {
        name: "greet",
        aliases: ["hello", "hi"],
        version: "1.1",
        role: 0,
        author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
        shortDescription: {
            en: "👋 𝐺𝑟𝑒𝑒𝑡𝑖𝑛𝑔 𝑐𝑜𝑚𝑚𝑎𝑛𝑑 𝑤𝑖𝑡ℎ 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑟𝑒𝑠𝑝𝑜𝑛𝑠𝑒𝑠"
        },
        longDescription: {
            en: "𝑆𝑒𝑛𝑑𝑠 𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑙𝑖𝑧𝑒𝑑 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑤𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑖𝑛𝑓𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛"
        },
        category: "𝑢𝑡𝑖𝑙𝑖𝑡𝑦",
        guide: {
            en: "{p}greet [𝑛𝑎𝑚𝑒]"
        },
        countDown: 5,
        dependencies: {}
    },

    languages: {
        "en": {
            "hello": "👋 𝐻𝑒𝑙𝑙𝑜 𝑤𝑜𝑟𝑙𝑑!",
            "helloWithName": "🌟 𝐻𝑒𝑙𝑙𝑜! 𝑌𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑖𝑠: %1"
        },
        "vi": {
            "hello": "👋 𝑋𝑖𝑛 𝑐ℎà𝑜 𝑡ℎế 𝑔𝑖ớ𝑖!",
            "helloWithName": "🌟 𝑋𝑖𝑛 𝑐ℎà𝑜! 𝐼𝐷 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝑐ủ𝑎 𝑏ạ𝑛 𝑙à: %1"
        },
        "bn": {
            "hello": "👋 𝐻𝑒𝑙𝑙𝑜 𝑤𝑜𝑟𝑙𝑑!",
            "helloWithName": "🌟 𝐻𝑒𝑙𝑙𝑜! 𝑌𝑜𝑢𝑟 𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐼𝐷 𝑖𝑠: %1"
        }
    },

    onStart: async function({ message, event, args, threadsData }) {
        try {
            const { threadID, messageID, senderID } = event;
            
            // Get thread language preference
            const threadData = await threadsData.get(threadID);
            const langCode = threadData.data?.language || "en";
            const langData = this.languages[langCode] || this.languages["en"];
            
            // Language helper function
            const getLang = (key, ...values) => {
                let text = langData[key] || key;
                values.forEach((value, i) => {
                    text = text.replace(new RegExp(`%${i+1}`, 'g'), value);
                });
                return text;
            };

            // Send beautiful formatted response
            if (args.length > 0) {
                const name = args.join(" ");
                await message.reply(`💫 ${getLang("helloWithName", senderID)}\n📝 𝑁𝑎𝑚𝑒: ${name}`);
            } else {
                await message.reply(`🌍 ${getLang("hello")}\n✨ 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝑏𝑦 𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑`);
            }
            
        } catch (error) {
            console.error("❌ 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑒𝑟𝑟𝑜𝑟:", error);
            await message.reply("⚠️ 𝐴𝑛 𝑒𝑟𝑟𝑜𝑟 𝑜𝑐𝑐𝑢𝑟𝑟𝑒𝑑 𝑤ℎ𝑖𝑙𝑒 𝑝𝑟𝑜𝑐𝑒𝑠𝑠𝑖𝑛𝑔 𝑦𝑜𝑢𝑟 𝑟𝑒𝑞𝑢𝑒𝑠𝑡");
        }
    }
};
