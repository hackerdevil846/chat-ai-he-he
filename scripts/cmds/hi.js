const moment = require("moment-timezone");

module.exports.config = {
    name: "hi",
    aliases: ["salam", "islamicgreet"],
    version: "12.0.0",
    author: "𝐴𝑠𝑖𝑓 𝑀𝑎ℎ𝑚𝑢𝑑",
    countDown: 5,
    role: 0,
    category: "𝑖𝑠𝑙𝑎𝑚𝑖𝑐",
    shortDescription: {
        en: "𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐺𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠 𝑤𝑖𝑡ℎ 𝐷𝑦𝑛𝑎𝑚𝑖𝑐 𝐵𝑜𝑟𝑑𝑒𝑟𝑠 𝑎𝑛𝑑 𝑆𝑡𝑖𝑐𝑘𝑒𝑟𝑠"
    },
    longDescription: {
        en: "𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠 𝑤𝑖𝑡ℎ 𝑑𝑦𝑛𝑎𝑚𝑖𝑐 𝑏𝑜𝑟𝑑𝑒𝑟𝑠 𝑎𝑛𝑑 𝑠𝑡𝑖𝑐𝑘𝑒𝑟𝑠"
    },
    guide: {
        en: "{p}hi [on/off]"
    },
    dependencies: {
        "moment-timezone": ""
    }
};

module.exports.languages = {
    "en": {
        "on": "🕌 𝑆𝑎𝑙𝑎𝑚 𝑚𝑜𝑑𝑢𝑙𝑒 𝑎𝑐𝑡𝑖𝑣𝑎𝑡𝑒𝑑!\n✦━━━━━━━━━━━━✦\n✅ 𝑁𝑜𝑤 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑛𝑔 𝑡𝑜 𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠",
        "off": "☪️ 𝑆𝑎𝑙𝑎𝑚 𝑚𝑜𝑑𝑢𝑙𝑒 𝑑𝑒𝑎𝑐𝑡𝑖𝑣𝑎𝑡𝑒𝑑\n✦━━━━━━━━━━━━✦\n❌ 𝑁𝑜 𝑙𝑜𝑛𝑔𝑒𝑟 𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑛𝑔 𝑡𝑜 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔𝑠"
    }
};

module.exports.onChat = async function({ event, api, Users, Threads, getText }) {
    try {
        const { threadID } = event;
        const threadData = await Threads.getData(threadID);
        
        if (!threadData || !threadData.data || threadData.data.salam !== true) return;

        const triggers = [
            "salam", "assalamualaikum", "allah hu akbar", "subhanallah", 
            "alhamdulillah", "mashallah", "astagfirullah", "inshallah", 
            "bismillah", "ramadan", "eid mubarak"
        ];

        const userMsg = event.body?.toLowerCase();
        if (!triggers.some(trigger => userMsg.includes(trigger))) return;

        const stickerIDs = [
            "789381034156662", "789381067489992", "789381100823322", 
            "789381134156652", "789381167489982", "789381200823315", 
            "789381234156645", "789381267489975", "789381300823305", 
            "789381334156635", "789381367489965", "789381400823295", 
            "789381434156625", "789381467489955", "789381500823285", 
            "789381534156615", "789381567489945", "789381600823275", 
            "789381634156605", "789381667489935"
        ];

        const name = await Users.getNameUser(event.senderID);
        const hours = moment.tz('Asia/Dhaka').format('HHmm');
        
        const session = 
            hours <= 400 ? "🌙 𝑇𝑎ℎ𝑎𝑗𝑗𝑢𝑑 𝑇𝑖𝑚𝑒" :
            hours <= 600 ? "🕋 𝐹𝑎𝑗𝑟 𝑃𝑟𝑎𝑦𝑒𝑟" :
            hours <= 1200 ? "☀️ 𝐷𝑢ℎ𝑎 𝑇𝑖𝑚𝑒" :
            hours <= 1400 ? "🕌 𝐷ℎ𝑢ℎ𝑟 𝑃𝑟𝑎𝑦𝑒𝑟" :
            hours <= 1600 ? "🕯️ 𝐴𝑠𝑟 𝑃𝑟𝑎𝑦𝑒𝑟" :
            hours <= 1900 ? "🌅 𝑀𝑎𝑔ℎ𝑟𝑖𝑏 𝑃𝑟𝑎𝑦𝑒𝑟" :
            "🌌 𝐼𝑠ℎ𝑎 𝑃𝑟𝑎𝑦𝑒𝑟";

        const borders = [
            ["🕋┏━☪️━┓🕋", "🕋┗━☪️━┛🕋"],
            ["🌟━━✥☪️✥━━🌟", "🌟━━✥☪️✥━━🌟"],
            ["🌙〘", "〙🌙"],
            ["☪️【", "】☪️"],
            ["✨➤", "➤✨"],
            ["🙏❖", "❖🙏"],
            ["🌺〓", "〓🌺"],
            ["📿⟦", "⟧📿"],
            ["🕌<<", ">>🕌"],
            ["🌹╭", "╮🌹"]
        ];

        const [topBorder, bottomBorder] = borders[Math.floor(Math.random() * borders.length)];
        const sticker = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];

        const messages = [
            `${topBorder}\n🕌 𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑎𝑙𝑎𝑖𝑘𝑢𝑚 ${name}!\n📿 𝐵𝑎𝑟𝑎𝑘𝑎ℎ-𝑓𝑖𝑙𝑙𝑒𝑑 ${session} 𝑡𝑜 𝑦𝑜𝑢!\n${bottomBorder}`,
            `${topBorder}\n☪️ 𝐴𝑙𝑙𝑎ℎ 𝐻𝑢 𝐴𝑘𝑏𝑎𝑟 ${name}!\n✨ 𝑀𝑎𝑦 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑏𝑙𝑒𝑠𝑠𝑖𝑛𝑔𝑠 𝑏𝑒 𝑢𝑝𝑜𝑛 𝑦𝑜𝑢 𝑡ℎ𝑖𝑠 ${session}\n${bottomBorder}`,
            `${topBorder}\n📖 𝑆𝑢𝑏ℎ𝑎𝑛𝑎𝑙𝑙𝑎ℎ ${name}!\n🌟 𝑌𝑜𝑢𝑟 𝑓𝑎𝑖𝑡ℎ 𝑠ℎ𝑖𝑛𝑒𝑠 𝑏𝑟𝑖𝑔ℎ𝑡 𝑜𝑛 𝑡ℎ𝑖𝑠 ${session}\n${bottomBorder}`,
            `${topBorder}\n🌙 𝐴𝑙ℎ𝑎𝑚𝑑𝑢𝑙𝑖𝑙𝑙𝑎ℎ ${name}!\n🕯️ 𝐺𝑟𝑎𝑡𝑖𝑡𝑢𝑑𝑒 𝑖𝑙𝑙𝑢𝑚𝑖𝑛𝑎𝑡𝑒𝑠 𝑦𝑜𝑢𝑟 ${session}\n${bottomBorder}`,
            `${topBorder}\n🕋 𝑀𝑎𝑠ℎ𝑎𝑙𝑙𝑎ℎ ${name}!\n💫 𝐴𝑙𝑙𝑎ℎ'𝑠 𝑝𝑟𝑜𝑡𝑒𝑐𝑡𝑖𝑜𝑛 𝑢𝑝𝑜𝑛 𝑦𝑜𝑢 𝑎𝑙𝑤𝑎𝑦𝑠\n${bottomBorder}`,
            `${topBorder}\n🌹 𝐵𝑖𝑠𝑚𝑖𝑙𝑙𝑎ℎ ${name}!\n📿 𝐵𝑒𝑔𝑖𝑛 𝑦𝑜𝑢𝑟 ${session} 𝑤𝑖𝑡ℎ 𝐻𝑖𝑠 𝑛𝑎𝑚𝑒\n${bottomBorder}`
        ];

        const response = {
            body: messages[Math.floor(Math.random() * messages.length)],
            mentions: [{ tag: name, id: event.senderID }]
        };

        await api.sendMessage(response, threadID);
        await new Promise(resolve => setTimeout(resolve, 200));
        await api.sendMessage({ sticker }, threadID);

    } catch (error) {
        console.error("𝐼𝑠𝑙𝑎𝑚𝑖𝑐 𝐺𝑟𝑒𝑒𝑡𝑖𝑛𝑔 𝐸𝑟𝑟𝑜𝑟:", error);
    }
};

module.exports.onStart = async function({ api, event, Threads, getText }) {
    try {
        const { threadID, messageID } = event;
        const threadData = await Threads.getData(threadID);
        
        if (!threadData.data) threadData.data = {};
        threadData.data.salam = !threadData.data.salam;
        
        await Threads.setData(threadID, threadData);
        
        await api.sendMessage(
            `✦━━━━━━━━━━━━━━━━✦\n${threadData.data.salam ? getText("on") : getText("off")}\n✦━━━━━━━━━━━━━━━━✦`,
            threadID,
            messageID
        );

    } catch (error) {
        console.error("𝐻𝑖 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝐸𝑟𝑟𝑜𝑟:", error);
        await api.sendMessage("❌ 𝐸𝑟𝑟𝑜𝑟 𝑡𝑜𝑔𝑔𝑙𝑖𝑛𝑔 𝑔𝑟𝑒𝑒𝑡𝑖𝑛𝑔 𝑚𝑜𝑑𝑢𝑙𝑒", event.threadID, event.messageID);
    }
};
